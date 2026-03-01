import React, { useState, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, Menu, X } from 'lucide-react';
import { useContext } from 'react';
import { authContext } from '../context/AuthContext';
import axiosInstance from '../utils/Instance';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const { user, navigate, setuser } = useContext(authContext);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="fixed top-0 left-0 lg:left-64 right-0 h-20 bg-white/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between z-40 border-b border-slate-200 font-sans">
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex flex-col hidden sm:flex">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System Live
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Admin Portal</h2>
        </div>

        <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-64 group focus-within:bg-white focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 transition-all">
          <Search size={16} className="text-slate-400 group-focus-within:text-slate-600" />
          <input
            type="text"
            placeholder="Search (⌘K)"
            className="bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
          {time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
        <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-px h-8 bg-slate-200" />

        <button className="flex items-center gap-3 group active:scale-95 transition-all outline-none hover:bg-slate-50 p-1.5 rounded-xl">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-slate-900 leading-none mb-1 group-hover:text-slate-700 transition-colors">
              {user ? user.role : 'Admin'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none">
              Management
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-slate-300 transition-all overflow-hidden relative">
            <User size={20} className="opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <ChevronDown
            size={14}
            className="text-slate-400 group-hover:text-slate-600 transition-colors"
          />
        </button>
      </div>

      <style>{`
        /* Preventing text selection on interactive navbar elements */
        nav {
          user-select: none;
        }
        /* Tabular nums ensure the clock digits don't shift layout as they change */
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
