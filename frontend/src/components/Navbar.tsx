import { useState, useEffect, useRef } from 'react';
import { Globe, GraduationCap, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLoginModal from './AdminLoginModal';

const LANGUAGES = [
  { code: 'en', label: 'ENGLISH', nativeLabel: 'English' },
  { code: 'hi', label: 'हिंदी', nativeLabel: 'Hindi' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', nativeLabel: 'Punjabi' },
];

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { t, i18n } = useTranslation();

  const handleLogoClick = () => {
    setLogoClicks((prev) => prev + 1);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 1500);

    if (logoClicks >= 4) {
      setLogoClicks(0);
      setAdminModalOpen(true);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const rest = date
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .toUpperCase();
    return { day, rest };
  };

  const { day, rest } = formatDate(currentTime);
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <>
      <nav className="w-full h-32 bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#001a33] px-10 flex items-center justify-between text-white shadow-2xl border-b border-white/10 select-none z-50">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-4 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <GraduationCap size={42} className="text-white fill-white/20" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight leading-none">
              {t('navbar.titleBold')}{' '}
              <span className="font-light opacity-90">{t('navbar.titleLight')}</span>
            </h1>
            <p className="text-[10px] tracking-[0.2em] opacity-50 font-bold uppercase mt-1">
              {t('navbar.ecosystem')}
            </p>
          </div>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-10">
          <div className="text-5xl font-medium tracking-tighter tabular-nums">
            {formatTime(currentTime)}
          </div>
          <div className="h-12 w-[1px] bg-white/20" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-[0.1em] opacity-60">{day}</span>
            <span className="text-lg font-medium tracking-wide">{rest.replace(',', '')}</span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-6" ref={dropdownRef}>
          <div className="relative">
            <button
              className="flex items-center gap-3 bg-white text-[#001f3f] px-6 py-3 rounded-full font-bold text-sm shadow-lg active:bg-gray-100 transition-colors touch-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <Globe size={20} strokeWidth={2.5} />
              <span>{currentLang.label}</span>
              <ChevronDown
                size={16}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-[#001f3f] text-white'
                        : 'text-[#001f3f] hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {i18n.language === lang.code && <Check size={16} strokeWidth={2.5} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      <AdminLoginModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
};

export default Navbar;
