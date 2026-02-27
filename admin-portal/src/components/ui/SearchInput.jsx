import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <div className={`flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 focus-within:border-[#002b5c] focus-within:bg-white transition-all ${className}`}>
      <Search size={16} className="text-slate-400" />
      <input 
        className="bg-transparent border-none focus:outline-none text-sm font-medium text-[#002b5c] w-full placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
