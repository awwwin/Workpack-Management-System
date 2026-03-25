import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Palette, 
  RefreshCw, 
  LogOut, 
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Check
} from 'lucide-react';
import { getCurrentUser } from '../lib/mockData';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { theme, setTheme } = useTheme();
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);

  const handleLogout = () => {
    onClose();
    navigate('/');
  };

  const handleThemeSelect = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setTimeout(() => {
      setShowThemeSubmenu(false);
    }, 300);
  };

  const handleProfileClick = () => {
    onClose();
    navigate('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    onClose();
    navigate('/dashboard/settings');
  };

  const handleSwitchAccount = () => {
    onClose();
    navigate('/');
  };

  const menuItems = [
    { 
      icon: User, 
      label: 'Profile', 
      onClick: handleProfileClick,
      className: 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
    },
    { 
      icon: Settings, 
      label: 'Account Settings', 
      onClick: handleSettingsClick,
      className: 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
    },
    { 
      icon: Palette, 
      label: 'Theme', 
      hasSubmenu: true,
      onClick: () => setShowThemeSubmenu(!showThemeSubmenu),
      className: 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
    },
    { 
      icon: RefreshCw, 
      label: 'Switch Account', 
      onClick: handleSwitchAccount,
      className: 'text-slate-700 hover:bg-blue-50 hover:text-blue-600',
      divider: true
    },
    { 
      icon: LogOut, 
      label: 'Log Out', 
      onClick: handleLogout,
      className: 'text-red-600 hover:bg-red-50'
    },
  ];

  const themeOptions = [
    {
      id: 'light' as const,
      icon: Sun,
      label: 'Light Mode',
      description: 'Clean and bright interface',
      preview: (
        <div className="w-full h-16 rounded-lg border-2 border-slate-200 bg-white p-2 space-y-1">
          <div className="h-2 bg-slate-200 rounded w-3/4"></div>
          <div className="h-2 bg-slate-100 rounded w-1/2"></div>
          <div className="flex gap-1 mt-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <div className="h-2 w-2 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      id: 'dark' as const,
      icon: Moon,
      label: 'Dark Mode',
      description: 'Easy on the eyes at night',
      preview: (
        <div className="w-full h-16 rounded-lg border-2 border-slate-700 bg-slate-900 p-2 space-y-1">
          <div className="h-2 bg-slate-700 rounded w-3/4"></div>
          <div className="h-2 bg-slate-800 rounded w-1/2"></div>
          <div className="flex gap-1 mt-2">
            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            <div className="h-2 w-2 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      id: 'system' as const,
      icon: Monitor,
      label: 'System',
      description: 'Match your device settings',
      preview: (
        <div className="w-full h-16 rounded-lg border-2 border-slate-300 bg-gradient-to-r from-white to-slate-900 p-2 flex items-center justify-center">
          <Monitor className="w-6 h-6 text-slate-500" />
        </div>
      )
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      {/* Dropdown Menu */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 w-80"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-white font-semibold text-lg">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </motion.div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{currentUser.name}</h3>
              <p className="text-sm text-slate-600 truncate">{currentUser.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2 relative">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                {item.divider && <div className="my-2 border-t border-slate-200" />}
                <motion.button
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-all group ${item.className}`}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      item.label === 'Log Out' 
                        ? 'bg-red-100 group-hover:bg-red-200' 
                        : 'bg-slate-100 group-hover:bg-blue-100'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <motion.div
                      animate={{ rotate: showThemeSubmenu ? 0 : 0 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Theme Submenu */}
        <AnimatePresence>
          {showThemeSubmenu && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-full top-0 ml-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  Choose Theme
                </h3>
                <p className="text-xs text-slate-600 mt-1">Select your preferred appearance</p>
              </div>

              <div className="p-3 space-y-2">
                {themeOptions.map((themeOption) => {
                  const ThemeIcon = themeOption.icon;
                  const isSelected = theme === themeOption.id;
                  
                  return (
                    <motion.button
                      key={themeOption.id}
                      onClick={() => handleThemeSelect(themeOption.id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Theme Preview */}
                        <div className="flex-1">
                          {themeOption.preview}
                        </div>
                        
                        {/* Theme Info */}
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1.5 rounded-lg ${
                              isSelected ? 'bg-blue-100' : 'bg-slate-100'
                            }`}>
                              <ThemeIcon className={`w-4 h-4 ${
                                isSelected ? 'text-blue-600' : 'text-slate-600'
                              }`} />
                            </div>
                            <span className={`font-semibold text-sm ${
                              isSelected ? 'text-blue-900' : 'text-slate-900'
                            }`}>
                              {themeOption.label}
                            </span>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                              >
                                <Check className="w-4 h-4 text-blue-600" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{themeOption.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowThemeSubmenu(false)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  Apply Theme
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}