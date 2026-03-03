import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  Facebook, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Search,
  Filter,
  Image as ImageIcon,
  Upload,
  ChevronRight,
  Heart,
  Award,
  Briefcase,
  Mail,
  Bell,
  Zap
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Constants ---
const ROLES = [
  'Swastha Sangini Applicant',
  'District Coordinator',
  'Block Coordinator',
  'Panchayat Coordinator'
];

const STATES = ['Bihar', 'Uttar Pradesh', 'Jharkhand', 'Madhya Pradesh', 'Rajasthan', 'Other'];

// --- Components ---

const Navbar = ({ onNavigate, currentView, isAdmin }: { onNavigate: (v: string) => void, currentView: string, isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">SS</div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Swastha Sangini</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Women Development Group</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className={cn("text-sm font-medium transition-colors", currentView === 'home' ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600")}>Home</button>
            <button onClick={() => onNavigate('apply')} className={cn("text-sm font-medium transition-colors", currentView === 'apply' ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600")}>Apply Now</button>
            {isAdmin ? (
              <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-all">
                <LayoutDashboard size={16} /> Dashboard
              </button>
            ) : (
              <button onClick={() => onNavigate('login')} className="text-sm font-medium text-gray-600 hover:text-emerald-600">Admin Login</button>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left text-gray-600 font-medium">Home</button>
              <button onClick={() => { onNavigate('apply'); setIsOpen(false); }} className="block w-full text-left text-gray-600 font-medium">Apply Now</button>
              {isAdmin ? (
                <button onClick={() => { onNavigate('admin'); setIsOpen(false); }} className="block w-full text-left text-emerald-600 font-medium">Dashboard</button>
              ) : (
                <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="block w-full text-left text-gray-600 font-medium">Admin Login</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onApply }: { onApply: () => void }) => (
  <section className="pt-32 pb-20 px-4">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck size={14} /> Empowering Women Across India
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
          Join the <span className="text-emerald-600">Swastha Sangini</span> Movement
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-lg">
          All India Women Development & Meri Pahal Fast Help Group is recruiting coordinators to lead social change and health awareness in every village.
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={onApply} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200">
            Apply for Coordinator <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            Learn More
          </button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" 
            alt="Women Empowerment" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden sm:block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5,000+</p>
              <p className="text-xs text-gray-500 font-medium uppercase">Active Sanginis</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const items = [
    { icon: <Heart className="text-rose-500" />, title: "Health Awareness", desc: "Spreading vital health information to rural women and families." },
    { icon: <Award className="text-amber-500" />, title: "Social Recognition", desc: "Become a respected leader in your community with official ID cards." },
    { icon: <Briefcase className="text-blue-500" />, title: "Fixed Salary", desc: "Earn a stable monthly income based on your coordinator role." },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Our Mission?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide the platform, training, and support you need to make a real difference while securing your financial future.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApplicationForm = ({ onSuccess }: { onSuccess: (id: string) => void }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const schema = z.object({
    role: z.string().min(1, "Please select a role to continue"),
    name: z.string().min(3, "Name too short"),
    fatherName: z.string().min(3, "Required"),
    motherName: z.string().min(3, "Required"),
    age: z.string()
      .min(1, "Age is required")
      .regex(/^\d+$/, "Age must be a number")
      .refine(v => parseInt(v) >= 18, "You must be at least 18 years old to apply"),
    email: z.string().email("Invalid email"),
    whatsapp: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit phone number"),
    facebookLink: z.string().optional(),
    address: z.string().min(10, "Full address required"),
    state: z.string().min(1, "Select state"),
    district: z.string().min(1, "Required"),
    blockPanchayat: z.string().min(1, "Required"),
    pincode: z.string().length(6, "Must be 6 digits"),
    bpoName: z.string().optional(),
    pcoName: z.string().optional(),
    upiId: z.string().optional(),
    education: z.string().min(1, "Required").refine(v => {
      const lower = v.toLowerCase();
      return lower.includes('10th') || lower.includes('12th') || lower.includes('graduate') || lower.includes('degree') || lower.includes('diploma') || lower.includes('matric');
    }, "Minimum 10th pass required"),
    totalExperience: z.string().optional(),
    ngoExperience: z.string().optional(),
    whyJoin: z.string().optional(),
    declaration: z.boolean().refine(v => v === true, "Must accept declaration")
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema)
  });

  const isBlurred = (imageData: ImageData) => {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    let laplacianSum = 0;
    let count = 0;

    // Simplified Laplacian variance check
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const center = pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114;
        
        const left = pixels[idx - 4] * 0.299 + pixels[idx - 3] * 0.587 + pixels[idx - 2] * 0.114;
        const right = pixels[idx + 4] * 0.299 + pixels[idx + 5] * 0.587 + pixels[idx + 6] * 0.114;
        const top = pixels[(y - 1) * width + x] * 4 * 0.299 + pixels[(y - 1) * width + x + 1] * 0.587 + pixels[(y - 1) * width + x + 2] * 0.114;
        const bottom = pixels[(y + 1) * width + x] * 4 * 0.299 + pixels[(y + 1) * width + x + 1] * 0.587 + pixels[(y + 1) * width + x + 2] * 0.114;

        const laplacian = Math.abs(4 * center - left - right - top - bottom);
        laplacianSum += laplacian;
        count++;
      }
    }
    const variance = laplacianSum / count;
    return variance < 3.5; // Threshold for client-side check
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large (max 2MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Blur check for passport photo and aadhaar
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 100; // Small scale for performance
            canvas.height = (img.height / img.width) * 100;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            if (isBlurred(imageData)) {
              alert(`The uploaded ${name === 'photo' ? 'passport photo' : 'Aadhaar image'} appears to be blurred. Please upload a clearer photo for better verification.`);
            }
          }
        };
        img.src = result;
        
        setPreviews(prev => ({ ...prev, [name]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      
      const photoInput = document.getElementById('photo') as HTMLInputElement;
      const aadhaarFInput = document.getElementById('aadhaarFront') as HTMLInputElement;
      const aadhaarBInput = document.getElementById('aadhaarBack') as HTMLInputElement;

      if (photoInput.files?.[0]) formData.append('photo', photoInput.files[0]);
      if (aadhaarFInput.files?.[0]) formData.append('aadhaarFront', aadhaarFInput.files[0]);
      if (aadhaarBInput.files?.[0]) formData.append('aadhaarBack', aadhaarBInput.files[0]);

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        onSuccess(result.applicationId);
      } else {
        setSubmitError(result.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("An error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {submitError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{submitError}</p>
          </motion.div>
        )}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 px-8 py-10 text-white">
            <h2 className="text-3xl font-bold mb-2">Application Form</h2>
            <p className="opacity-90">Fill in your details accurately to join our network.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-12">
            <div className="space-y-12">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Select Your Role *</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {ROLES.map(role => (
                    <label key={role} className={cn(
                      "relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      watch('role') === role ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-emerald-200"
                    )}>
                      <input type="radio" {...register('role')} value={role} className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                      <span className="font-bold text-gray-900">{role}</span>
                    </label>
                  ))}
                </div>
                {errors.role && <p className="text-red-500 text-xs mt-2 font-medium">{errors.role.message as string}</p>}
              </div>

              {/* Personal Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
                  <input {...register('name')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Enter your name" />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Father's Name *</label>
                  <input {...register('fatherName')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Mother's Name *</label>
                  <input {...register('motherName')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Age (18+) *</label>
                  <input type="number" {...register('age')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Minimum 18" />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age.message as string}</p>}
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Gmail ID *</label>
                  <input type="email" {...register('email')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp Number *</label>
                  <input {...register('whatsapp')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="10-digit number" />
                  {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message as string}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Address *</label>
                  <textarea {...register('address')} rows={3} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">State *</label>
                    <select {...register('state')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all">
                      <option value="">Select</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">District *</label>
                    <input {...register('district')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode *</label>
                    <input {...register('pincode')} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" />
                  </div>
                </div>
              </div>

              {/* Uploads */}
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Passport Photo *</label>
                  <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group">
                    {previews.photo ? (
                      <img src={previews.photo} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Photo</span>
                      </>
                    )}
                    <input type="file" id="photo" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">300x400px recommended. No filters, clear face.</p>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Aadhaar Front *</label>
                  <div className="relative aspect-[3/2] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                    {previews.aadhaarFront ? (
                      <img src={previews.aadhaarFront} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Front</span>
                      </>
                    )}
                    <input type="file" id="aadhaarFront" accept="image/*" onChange={(e) => handleFileChange(e, 'aadhaarFront')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">Must be clear & readable</p>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Aadhaar Back *</label>
                  <div className="relative aspect-[3/2] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                    {previews.aadhaarBack ? (
                      <img src={previews.aadhaarBack} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Back</span>
                      </>
                    )}
                    <input type="file" id="aadhaarBack" accept="image/*" onChange={(e) => handleFileChange(e, 'aadhaarBack')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">Must be clear & readable</p>
                </div>
              </div>

              {/* Declaration */}
              <div className="pt-8 border-t border-gray-100">
                <label className="flex gap-4 cursor-pointer">
                  <input type="checkbox" {...register('declaration')} className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I hereby declare that all the information provided above is true to the best of my knowledge. I understand that any false information may lead to rejection of my application.
                  </span>
                </label>
                {errors.declaration && <p className="text-red-500 text-xs mt-2">{errors.declaration.message as string}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Clock className="animate-spin" /> : <CheckCircle2 />}
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [apps, setApps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState({ whatsapp_link: '', facebook_link: '' });
  const [loading, setLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [filter, setFilter] = useState({ status: '', role: '', search: '', state: '', district: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [appsRes, statsRes, settingsRes] = await Promise.all([
        fetch(`/api/admin/applications?status=${filter.status}&role=${filter.role}&search=${filter.search}&state=${filter.state}&district=${filter.district}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/settings')
      ]);
      const appsData = await appsRes.json();
      const statsData = await statsRes.json();
      const settingsData = await settingsRes.json();
      setApps(appsData);
      setStats(statsData);
      setSettings(settingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert("Settings updated successfully!");
    } catch (err) {
      alert("Failed to update settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const exportCSV = async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/export', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
  };

  if (loading) return <div className="pt-32 text-center">Loading Dashboard...</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500">Manage applications and monitor growth.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
            <Download size={18} /> Export CSV
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Applicants</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
          </div>
          {stats?.byStatus.map((s: any) => (
            <div key={s.status} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{s.status}</p>
              <p className="text-3xl font-bold text-emerald-600">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={20} /> Portal Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp Group Link</label>
              <input 
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                value={settings.whatsapp_link}
                onChange={e => setSettings(prev => ({ ...prev, whatsapp_link: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Facebook Page Link</label>
              <input 
                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                value={settings.facebook_link}
                onChange={e => setSettings(prev => ({ ...prev, facebook_link: e.target.value }))}
              />
            </div>
            <button 
              onClick={saveSettings}
              disabled={isSavingSettings}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {isSavingSettings ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* Future Integrations Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mail size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Mail size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Email Notifications</h3>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider">Coming Soon</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Automated email alerts for applicants when their status changes. Custom templates for approval, rejection, and interview calls.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Zap size={14} className="text-amber-400" /> Planned Integration
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageCircle size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">WhatsApp Alerts</h3>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider">Coming Soon</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Direct WhatsApp messaging for quick communication with coordinators. Automated broadcast for training schedules and group updates.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Zap size={14} className="text-amber-400" /> Planned Integration
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="w-full pl-12 pr-12 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all" 
            placeholder="Search by name, ID or WhatsApp..." 
            value={filter.search}
            onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
          />
          {filter.search && (
            <button 
              onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            value={filter.state}
            onChange={e => setFilter(prev => ({ ...prev, state: e.target.value }))}
          >
            <option value="">All States</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="relative min-w-[150px]">
            <input 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium" 
              placeholder="District..." 
              value={filter.district}
              onChange={e => setFilter(prev => ({ ...prev, district: e.target.value }))}
            />
          </div>
          <select 
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            value={filter.role}
            onChange={e => setFilter(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select 
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            value={filter.status}
            onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No applications found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            {filter.search && (
              <button 
                onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
                className="mt-6 text-emerald-600 font-bold text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-4 text-xs font-bold text-xs font-bold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {apps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                          <img src={`/uploads/${app.photo_path}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{app.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{app.id}</p>
                            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                              <MessageCircle size={10} /> {app.whatsapp}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{app.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p className="font-medium">{app.district}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{app.state}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        app.status === 'PENDING' && "bg-amber-50 text-amber-600",
                        app.status === 'APPROVED' && "bg-emerald-50 text-emerald-600",
                        app.status === 'REJECTED' && "bg-rose-50 text-rose-600",
                        app.status === 'UNDER_REVIEW' && "bg-blue-50 text-blue-600",
                      )}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select 
                          className="text-xs border-gray-200 rounded-lg focus:ring-emerald-500 bg-white"
                          value={app.status}
                          onChange={e => updateStatus(app.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                          <option value="UNDER_REVIEW">Review</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        onLogin(data.token);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">SS</div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500">Secure access for coordinators.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
            <input 
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
            <input 
              type="password"
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const SuccessView = ({ id, onReset }: { id: string, onReset: () => void }) => (
  <div className="min-h-screen flex items-center justify-center px-4 bg-emerald-50">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-lg w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center"
    >
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
      <p className="text-gray-600 mb-8">Your application has been received and is currently under review. Please save your application ID for future reference.</p>
      <div className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Application ID</p>
        <p className="text-3xl font-mono font-bold text-emerald-600">{id}</p>
      </div>
      <button onClick={onReset} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">
        Return to Home
      </button>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('admin_token'));
  const [successId, setSuccessId] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  }, []);

  if (successId) return <SuccessView id={successId} onReset={() => { setSuccessId(null); setView('home'); }} />;
  if (view === 'login') return <Login onLogin={() => { setIsAdmin(true); setView('admin'); }} />;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        onNavigate={setView} 
        currentView={view} 
        isAdmin={isAdmin} 
      />

      <main>
        {view === 'home' && (
          <>
            <Hero onApply={() => setView('apply')} />
            <Features />
            
            {/* Social Links Section */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto bg-emerald-900 rounded-[3rem] p-12 sm:p-20 text-white relative overflow-hidden">
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">Stay Connected with Our Community</h2>
                    <p className="text-emerald-100 text-lg mb-10 opacity-80">Join our WhatsApp group for instant updates or follow our Facebook page to see our impact across India.</p>
                    <div className="flex flex-wrap gap-4">
                      {settings?.whatsapp_link && (
                        <a href={settings.whatsapp_link} target="_blank" className="flex items-center gap-3 px-8 py-4 bg-emerald-500 rounded-2xl font-bold hover:bg-emerald-400 transition-all">
                          <MessageCircle size={20} /> Join WhatsApp Group
                        </a>
                      )}
                      {settings?.facebook_link && (
                        <a href={settings.facebook_link} target="_blank" className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl font-bold hover:bg-white/20 transition-all">
                          <Facebook size={20} /> Follow on Facebook
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="aspect-square rounded-3xl bg-emerald-800/50 border border-emerald-700/50" />
                        <div className="aspect-video rounded-3xl bg-emerald-800/50 border border-emerald-700/50" />
                      </div>
                      <div className="space-y-4 pt-8">
                        <div className="aspect-video rounded-3xl bg-emerald-800/50 border border-emerald-700/50" />
                        <div className="aspect-square rounded-3xl bg-emerald-800/50 border border-emerald-700/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'apply' && <ApplicationForm onSuccess={setSuccessId} />}
        {view === 'admin' && isAdmin && <AdminDashboard onLogout={() => { localStorage.removeItem('admin_token'); setIsAdmin(false); setView('home'); }} />}
      </main>

      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">SS</div>
            <span className="font-bold text-gray-900">Swastha Sangini</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">© 2024 All India Women Development & Meri Pahal Fast Help Group. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
