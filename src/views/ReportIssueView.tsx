import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { IssueCategory } from '../types.ts';
import {
  Sparkles,
  MapPin,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText,
  Tag,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface ReportIssueViewProps {
  initialCategory?: IssueCategory;
  onAnalysisStarted: (reportData: any) => void;
  onCancel?: () => void;
}

const BENCHMARK_SCENARIO = {
  title: 'College Pothole Benchmark',
  description: 'There is a large pothole near my college entrance. It is dangerous for two-wheelers and pedestrians.',
  address: '7th Block, Jayanagar Main Road, Near National College',
  area: 'Jayanagar, Ward 153',
  city: 'Bengaluru',
  landmark: 'Near National College Main Gate',
  category: 'ROAD_POTHOLE' as IssueCategory,
  image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
};

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'AUTO', label: '✨ Auto-detect with AI (Recommended)' },
  { value: 'ROAD_POTHOLE', label: 'Roads & Potholes' },
  { value: 'GARBAGE', label: 'Garbage & Waste Disposal' },
  { value: 'STREETLIGHT', label: 'Streetlight & Electrical' },
  { value: 'WATER_LEAKAGE', label: 'Water Leakage & Pipeline' },
  { value: 'DRAINAGE', label: 'Drainage & Sewage' },
  { value: 'TRAFFIC_SAFETY', label: 'Traffic Safety & Signals' },
  { value: 'PUBLIC_PROPERTY', label: 'Public Property & Footpath' },
  { value: 'OTHER', label: 'Other Civic Grievance' },
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  initialCategory,
  onAnalysisStarted,
}) => {
  const { currentUser } = useAuth();

  // Form states
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Ward 153, South Zone');
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [landmark, setLandmark] = useState('');
  const [category, setCategory] = useState<string>(initialCategory || 'AUTO');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  // 1-Click Benchmark Scenario Loader
  const handleLoadBenchmark = () => {
    setDescription(BENCHMARK_SCENARIO.description);
    setAddress(BENCHMARK_SCENARIO.address);
    setArea(BENCHMARK_SCENARIO.area);
    setCity(BENCHMARK_SCENARIO.city);
    setLandmark(BENCHMARK_SCENARIO.landmark);
    setCategory(BENCHMARK_SCENARIO.category);
    setEvidenceImages([BENCHMARK_SCENARIO.image]);
    setImagePreview(BENCHMARK_SCENARIO.image);
    setError('');
  };

  // Drag and drop or manual file selection
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEvidenceImages([base64]);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEvidenceImages([base64]);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEvidenceImages([]);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe the issue so the AI agent can analyze it.');
      return;
    }
    if (description.trim().length < 12) {
      setError('Please provide a slightly more descriptive explanation (at least 12 characters).');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the street address or general area.');
      return;
    }

    setError('');
    const payload = {
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      description: description.trim(),
      address: address.trim(),
      city: city.trim() || 'Bengaluru',
      area: area.trim() || 'South Zone',
      landmark: landmark.trim() || undefined,
      category: category !== 'AUTO' ? category : undefined,
      evidenceImages,
    };

    // Transition directly to Stage 3: AI Assistant
    onAnalysisStarted(payload);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Benchmark Scenario Quick Load Box */}
      <div className="mb-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hackathon Judge Quick Demo</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Try the Benchmark Pothole Scenario
            </h2>
            <p className="text-xs text-slate-300 max-w-xl italic">
              "{BENCHMARK_SCENARIO.description}"
            </p>
          </div>

          <button
            type="button"
            id="load-benchmark-btn"
            onClick={handleLoadBenchmark}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            Load Benchmark Scenario
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Stage 2 of 5: Citizen Intake
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Report a Public Issue
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI will classify, assess severity & identify authority</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Issue Description *
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                Describe the problem in plain English
              </span>
            </label>
            <textarea
              id="issue-description-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. There is a large pothole near my college entrance. It is dangerous for two-wheelers and pedestrians..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden leading-relaxed resize-y"
            />
          </div>

          {/* 2. Location (Address/Area) & Nearby Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Location (Address / Area) *
              </label>
              <input
                type="text"
                id="issue-address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 7th Block, Jayanagar Main Road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Street, avenue, or general junction
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  Nearby Landmark
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                id="issue-landmark-input"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near National College Main Gate"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                If left blank, AI Agent will check and request a landmark
              </span>
            </div>
          </div>

          {/* 3. Optional Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                Category Selection
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>
            <select
              id="issue-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-hidden"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 block mt-1">
              Leave on Auto-detect to let the Issue Classification Agent determine the statutory category.
            </span>
          </div>

          {/* 4. Optional Image Upload (Drag and drop or select) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Evidence Photo
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Evidence Preview"
                  className="w-24 h-24 object-cover rounded-xl border border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-800 block">
                    Photo attached
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Ready for AI visual verification
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById('image-upload-input')?.click()}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Drag and drop a photo here, or <span className="text-emerald-700 underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  JPG, PNG, WebP up to 5MB
                </p>
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Proceeds directly to Stage 3: Autonomous AI Agent</span>
            </div>

            <button
              type="submit"
              id="analyze-with-ai-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Analyze with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
