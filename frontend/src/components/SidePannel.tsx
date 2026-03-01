import {
  Search,
  Navigation,
  Calendar,
  Users,
  DoorOpen,
  Bell,
  MessageSquare,
  ChevronRight,
  Building,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SidePanel = () => {
  const navItems = [
    { key: 'campus', label: 'Campus Map', icon: Building, color: 'bg-[#8dc63f]', route: '/' },
    { key: 'navigate', label: 'Navigate', icon: Navigation, route: '/navigate' },
    { key: 'schedule', label: 'Schedule', icon: Calendar, route: '/schedule' },
    { key: 'faculty', label: 'Faculty', icon: Users, route: '/faculty' },
    { key: 'Blocks', label: 'Blocks', icon: DoorOpen, route: '/blocks' },
  ];

  const { t } = useTranslation();

  const getNavLinkClass = (isActive: boolean, activeColor?: string) => {
    const baseClasses =
      'flex items-center gap-5 px-8 py-6 rounded-[32px] transition-all active:scale-95 duration-200 border shadow-sm';
    const activeClasses = isActive
      ? `${activeColor ?? 'bg-blue-600'} text-white shadow-lg border-transparent`
      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-100';

    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <div className="w-full h-full bg-white/95 backdrop-blur-xl border-r border-slate-200 p-10 flex flex-col gap-10 select-none rounded-r-[40px] shadow-2xl overflow-y-auto custom-scrollbar">
      <div className="shrink-0">
        <h2 className="text-slate-400 font-black tracking-[0.2em] text-xs mb-5 uppercase">
          {t('sidebar.title', 'Sidebar Panel')}
        </h2>
        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={24}
          />
          <input
            type="text"
            placeholder={t('sidebar.search')}
            className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-5 pl-14 pr-6 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.route}
            className={({ isActive }) => getNavLinkClass(isActive, item.color)}
          >
            {({ isActive }) => (
              <>
                <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xl font-bold tracking-tight">{t(`sidebar.${item.key}`)}</span>
                {isActive && (
                  <ChevronRight
                    size={24}
                    className="ml-auto opacity-60 animate-in slide-in-from-left-2 duration-300"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <NavLink to="/announcements">
          {({ isActive }) => (
            <div className={getNavLinkClass(isActive, 'bg-[#002b5c]')}>
              <Bell size={24} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="text-xl font-bold">{t('sidebar.announcements')}</span>
              {isActive && <ChevronRight size={24} className="ml-auto opacity-60" />}
            </div>
          )}
        </NavLink>
        <p className="text-xs text-slate-400 mt-5 px-4 leading-relaxed text-center font-medium">
          {t('sidebar.maintenance')}
        </p>
      </div>

      <div className="pt-8">
        <h2 className="text-slate-400 font-black tracking-[0.2em] text-xs mb-5 uppercase">
          {t('sidebar.help')}
        </h2>
        <NavLink to="/help">
          {({ isActive }) => (
            <div className={getNavLinkClass(isActive, 'bg-slate-800')}>
              <MessageSquare size={22} className={isActive ? 'text-white' : 'text-blue-500'} />
              <span className="text-xl font-bold">{t('sidebar.contactSupport')}</span>
              {isActive && <ChevronRight size={24} className="ml-auto opacity-60" />}
            </div>
          )}
        </NavLink>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SidePanel;
