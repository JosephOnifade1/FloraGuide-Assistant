import React from 'react';
import { Sprout, MessageCircle, Camera, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'identify' | 'chat';
  setActiveTab: (tab: 'identify' | 'chat') => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-sage-50">
      <header className="bg-white border-b border-sage-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sage-600 rounded-xl">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-sage-900 hidden sm:block">
              FloraGuide <span className="font-light italic text-sage-600">Assistant</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-sage-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('identify')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                activeTab === 'identify' 
                  ? "bg-white text-sage-900 shadow-sm" 
                  : "text-sage-600 hover:text-sage-900"
              )}
            >
              <Camera className="w-4 h-4" />
              <span>Identify</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                activeTab === 'chat' 
                  ? "bg-white text-sage-900 shadow-sm" 
                  : "text-sage-600 hover:text-sage-900"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Gardening AI</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-sage-400 hover:text-sage-600 transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-sage-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sage-500 text-sm italic font-serif">
            "To plant a garden is to believe in tomorrow."
          </p>
          <p className="text-sage-400 text-xs mt-2 font-sans tracking-widest uppercase">
            &copy; 2026 FloraGuide Assistant
          </p>
        </div>
      </footer>
    </div>
  );
}
