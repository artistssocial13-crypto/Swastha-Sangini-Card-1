import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { rateLimit } from "express-rate-limit";
import { parse } from "json2csv";

// --- Configuration ---
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "swastha-sangini-secret-key-2024";
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// --- Database Setup ---
const db = new Database("swastha_sangini.db");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- 'SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'
    state TEXT,
    district TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY, -- Auto-generated ID like SS-2024-0001
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 18),
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    facebook_link TEXT,
    address TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    block_panchayat TEXT NOT NULL,
    pincode TEXT NOT NULL,
    bpo_name TEXT,
    pco_name TEXT,
    upi_id TEXT,
    education TEXT NOT NULL,
    total_experience TEXT,
    ngo_experience TEXT,
    why_join TEXT,
    photo_path TEXT NOT NULL,
    aadhaar_front_path TEXT NOT NULL,
    aadhaar_back_path TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(admin_id) REFERENCES admins(id)
  );
`);

// Seed initial admin if not exists
const adminExists = db.prepare("SELECT * FROM admins WHERE username = ?").get("admin");
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO admins (username, password, role) VALUES (?, ?, ?)").run("admin", hashedPassword, "SUPER_ADMIN");
}

// Seed default settings
const seedSetting = (key: string, value: string) => {
  const exists = db.prepare("SELECT * FROM settings WHERE key = ?").get(key);
  if (!exists) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(key, value);
  }
};
seedSetting("whatsapp_link", "https://chat.whatsapp.com/example");
seedSetting("facebook_link", "https://facebook.com/swasthasangini");

// --- Middleware ---
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Multer Storage ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// --- Blur Detection Helper ---
const isBlurred = async (buffer: Buffer) => {
  try {
    // Laplacian kernel for edge detection
    const laplacianKernel = {
      width: 3,
      height: 3,
      kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0]
    };

    const stats = await sharp(buffer)
      .greyscale()
      .convolve(laplacianKernel)
      .stats();

    // The standard deviation of the Laplacian-convolved image is a good measure of focus.
    // Lower values indicate more blur. Threshold of 10-15 is usually reasonable for this method.
    const blurValue = stats.channels[0].stdev;
    return blurValue < 12; // Threshold for blur
  } catch (error) {
    console.error("Blur detection error:", error);
    return false; // Default to not blurred if check fails
  }
};

// --- API Routes ---

// Public: Get Settings
app.get("/api/settings", (req, res) => {
  const settings = db.prepare("SELECT * FROM settings").all();
  const settingsMap = (settings as any[]).reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.json(settingsMap);
});

// Public: Submit Application
app.post("/api/applications", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhaarFront", maxCount: 1 },
  { name: "aadhaarBack", maxCount: 1 }
]), async (req: any, res: any) => {
  try {
    const files = req.files as { [fieldname: string]: any[] };
    if (!files || !files.photo || !files.aadhaarFront || !files.aadhaarBack) {
      return res.status(400).json({ error: "Missing required files" });
    }

    const data = req.body;
    
    // Check for blur in Aadhaar and Photo images
    const isFrontBlurred = await isBlurred(files.aadhaarFront[0].buffer);
    const isBackBlurred = await isBlurred(files.aadhaarBack[0].buffer);
    const isPhotoBlurred = await isBlurred(files.photo[0].buffer);

    if (isFrontBlurred || isBackBlurred || isPhotoBlurred) {
      let errorMsg = "One or more of your uploaded images appear to be blurred. Please upload clear, high-quality photos for verification.";
      if (isPhotoBlurred) errorMsg = "Your passport photo appears to be blurred. Please upload a clear, high-quality photo.";
      else if (isFrontBlurred || isBackBlurred) errorMsg = "One or both of your Aadhaar images appear to be blurred. Please upload clear photos.";

      return res.status(400).json({ 
        error: errorMsg,
        code: "IMAGE_BLURRED"
      });
    }

    // Generate Application ID (Format: SS-YYYY-NNNN)
    const currentYear = new Date().getFullYear();
    const lastApp = db.prepare("SELECT id FROM applications WHERE id LIKE ? ORDER BY id DESC LIMIT 1")
      .get(`SS-${currentYear}-%`) as { id: string } | undefined;
    
    let nextNum = 1;
    if (lastApp) {
      const parts = lastApp.id.split('-');
      if (parts.length === 3) {
        nextNum = parseInt(parts[2]) + 1;
      }
    }
    const appId = `SS-${currentYear}-${String(nextNum).padStart(4, '0')}`;

    // Process Photo with Sharp (300x400)
    const photoFilename = `photo_${appId}_${Date.now()}.jpg`;
    await sharp(files.photo[0].buffer)
      .resize(300, 400)
      .jpeg({ quality: 80 })
      .toFile(path.join(UPLOADS_DIR, photoFilename));

    // Process Aadhaar Images
    const aadhaarFrontFilename = `aadhaar_f_${appId}_${Date.now()}.jpg`;
    await sharp(files.aadhaarFront[0].buffer)
      .jpeg({ quality: 80 })
      .toFile(path.join(UPLOADS_DIR, aadhaarFrontFilename));

    const aadhaarBackFilename = `aadhaar_b_${appId}_${Date.now()}.jpg`;
    await sharp(files.aadhaarBack[0].buffer)
      .jpeg({ quality: 80 })
      .toFile(path.join(UPLOADS_DIR, aadhaarBackFilename));

    const stmt = db.prepare(`
      INSERT INTO applications (
        id, role, name, father_name, mother_name, age, email, whatsapp, facebook_link,
        address, state, district, block_panchayat, pincode, bpo_name, pco_name, upi_id,
        education, total_experience, ngo_experience, why_join,
        photo_path, aadhaar_front_path, aadhaar_back_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      appId, data.role, data.name, data.fatherName, data.motherName, parseInt(data.age),
      data.email, data.whatsapp, data.facebookLink, data.address, data.state, data.district,
      data.blockPanchayat, data.pincode, data.bpoName, data.pcoName, data.upiId,
      data.education, data.totalExperience, data.ngoExperience, data.whyJoin,
      photoFilename, aadhaarFrontFilename, aadhaarBackFilename
    );

    res.json({ success: true, applicationId: appId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;

  if (admin && bcrypt.compareSync(password, admin.password)) {
    const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user: { username: admin.username, role: admin.role } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Admin: Get Applications (with filters)
app.get("/api/admin/applications", authenticateToken, (req: any, res) => {
  const { state, district, role, status, search } = req.query;
  let query = "SELECT * FROM applications WHERE 1=1";
  const params: any[] = [];

  if (state) { query += " AND state = ?"; params.push(state); }
  if (district) { query += " AND district = ?"; params.push(district); }
  if (role) { query += " AND role = ?"; params.push(role); }
  if (status) { query += " AND status = ?"; params.push(status); }
  if (search) {
    query += " AND (name LIKE ? OR id LIKE ? OR whatsapp LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY created_at DESC";
  const apps = db.prepare(query).all(...params);
  res.json(apps);
});

// Admin: Update Application Status
app.patch("/api/admin/applications/:id/status", authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);
  
  db.prepare("INSERT INTO audit_logs (admin_id, action, details) VALUES (?, ?, ?)")
    .run(req.user.id, "UPDATE_STATUS", `Updated application ${id} to ${status}`);
    
  res.json({ success: true });
});

// Admin: Dashboard Stats
app.get("/api/admin/stats", authenticateToken, (req, res) => {
  const total = db.prepare("SELECT COUNT(*) as count FROM applications").get() as any;
  const byStatus = db.prepare("SELECT status, COUNT(*) as count FROM applications GROUP BY status").all();
  const byRole = db.prepare("SELECT role, COUNT(*) as count FROM applications GROUP BY role").all();
  const byState = db.prepare("SELECT state, COUNT(*) as count FROM applications GROUP BY state").all();
  
  res.json({
    total: total.count,
    byStatus,
    byRole,
    byState
  });
});

// Admin: Export CSV
app.get("/api/admin/export", authenticateToken, (req, res) => {
  const apps = db.prepare("SELECT * FROM applications").all();
  const csv = parse(apps);
  res.header('Content-Type', 'text/csv');
  res.attachment('applications.csv');
  res.send(csv);
});

// Admin: Update Settings
app.post("/api/admin/settings", authenticateToken, (req, res) => {
  const { whatsapp_link, facebook_link } = req.body;
  if (whatsapp_link) db.prepare("UPDATE settings SET value = ? WHERE key = 'whatsapp_link'").run(whatsapp_link);
  if (facebook_link) db.prepare("UPDATE settings SET value = ? WHERE key = 'facebook_link'").run(facebook_link);
  res.json({ success: true });
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
