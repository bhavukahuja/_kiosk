import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = ({ icon: Icon = Loader2, message = "Loading..." }) => {
  return (
    <div className="ml-72 mt-24 h-[calc(100vh-6rem)] flex flex-col items-center justify-center bg-slate-50/50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-[#002b5c] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={20} className="text-[#002b5c]" />
        </div>
      </div>
      <span className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">
        {message}
      </span>
    </div>
  );
};

export default PageLoader;
