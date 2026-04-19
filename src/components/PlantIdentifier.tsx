import React, { useState, useCallback } from 'react';
import { Camera, Upload, Loader2, Leaf, Sun, Droplets, Thermometer, Wind, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../services/geminiService';
import { PlantIDResult } from '../types';
import { cn } from '../lib/utils';

export function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlantIDResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifyPlant = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await geminiService.identifyPlant(base64Data);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to identify plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-light text-sage-900">Plant <span className="font-semibold">Identification</span></h2>
        <p className="text-sage-600 max-w-lg mx-auto">
          Upload a clear photo of your plant's leaves or flowers for instant care guides and identification.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div 
          className={cn(
            "relative aspect-video rounded-3xl border-2 border-dashed border-sage-300 bg-white flex flex-col items-center justify-center overflow-hidden transition-all",
            !image && "hover:border-sage-400 hover:bg-sage-50 cursor-pointer"
          )}
        >
          {image ? (
            <img 
              src={image} 
              alt="Uploaded plant" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
              <div className="p-4 bg-sage-100 rounded-full mb-4">
                <Camera className="w-8 h-8 text-sage-600" />
              </div>
              <span className="text-sage-900 font-medium font-serif text-xl">Snap or upload a photo</span>
              <span className="text-sage-500 text-sm mt-1">Supports JPG, PNG</span>
            </label>
          )}

          {image && !loading && !result && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center gap-2">
              <button 
                onClick={() => setImage(null)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-all"
              >
                Change Photo
              </button>
              <button 
                onClick={identifyPlant}
                className="px-6 py-2 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-sage-700 shadow-lg transition-all flex items-center gap-2"
              >
                <Leaf className="w-4 h-4" />
                Identify Now
              </button>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-sage-900">
              <Loader2 className="w-12 h-12 animate-spin text-sage-600 mb-4" />
              <p className="font-serif italic text-lg animate-pulse">Analyzing botanical details...</p>
            </div>
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {/* Main Identification Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-sage-100 h-full">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-sage-400 mb-2 block">Identification</span>
                  <h3 className="text-3xl font-serif text-sage-900 leading-tight">
                    {result.careInstructions.commonName}
                  </h3>
                  <p className="text-sage-500 italic font-serif text-lg mt-1">
                    {result.careInstructions.scientificName}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 rounded-full text-sage-700 text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
                    {(result.confidence * 100).toFixed(0)}% Confidence
                  </div>
                </div>
                
                <p className="text-sage-600 text-sm leading-relaxed">
                  {result.careInstructions.description}
                </p>
              </div>
            </div>

            {/* Care Guide Cards */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CareCard 
                icon={<Sun className="w-5 h-5 text-amber-500" />} 
                title="Sunlight" 
                content={result.careInstructions.sunlight} 
              />
              <CareCard 
                icon={<Droplets className="w-5 h-5 text-blue-500" />} 
                title="Watering" 
                content={result.careInstructions.watering} 
              />
              <CareCard 
                icon={<Thermometer className="w-5 h-5 text-orange-500" />} 
                title="Temperature" 
                content={result.careInstructions.temperature} 
              />
              <CareCard 
                icon={<Wind className="w-5 h-5 text-emerald-500" />} 
                title="Soil & Fertilizer" 
                content={`${result.careInstructions.soil}. ${result.careInstructions.fertilizing}`} 
              />
              
              <div className="sm:col-span-2 bg-sage-900 text-white p-6 rounded-3xl shadow-lg border border-sage-800">
                <h4 className="font-serif text-xl mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-clay-400" />
                  Common Issues
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.careInstructions.commonIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-sage-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-clay-400 shrink-0 mt-1.5" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CareCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-sage-100 hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-sage-50 border border-sage-100 rounded-2xl group-hover:bg-white transition-colors">
          {icon}
        </div>
        <h4 className="font-semibold text-sage-900">{title}</h4>
      </div>
      <p className="text-sage-600 text-sm leading-relaxed">{content}</p>
    </div>
  );
}
