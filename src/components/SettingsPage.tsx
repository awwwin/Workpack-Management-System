import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { useToast } from './Toast';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsPage() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'preferences'>('general');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  async function loadSettings() {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) return;

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (error) {
      console.error(error.message);
      return;
    }

    if (data) {
      setSettings({
        language: data.language || 'en',
        timezone: data.timezone || 'Asia/Kuala_Lumpur',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        emailNotifications: data.email_notifications ?? true,
        workpackUpdates: data.workpack_updates ?? true,
        reviewReminders: data.review_reminders ?? true,
        weeklyDigest: data.weekly_digest ?? false,
        compactView: data.compact_view ?? false,
        autoSave: data.auto_save ?? true,
        defaultView: data.default_view || 'dashboard',
      });

      setTheme(data.theme || 'light');
    }
  }

  loadSettings();
}, []);

  const [settings, setSettings] = useState({
    // General
    language: 'en',
    timezone: 'Asia/Kuala_Lumpur',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notifications
    emailNotifications: true,
    workpackUpdates: true,
    reviewReminders: true,
    weeklyDigest: false,
    
    // Preferences
    compactView: false,
    autoSave: true,
    defaultView: 'dashboard',
  });

const handleSave = async () => {
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    showToast('Please log in again', 'error');
    return;
  }

  if (settings.newPassword || settings.confirmPassword) {
    if (settings.newPassword !== settings.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (settings.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: settings.newPassword,
    });

    if (passwordError) {
      showToast(passwordError.message, 'error');
      return;
    }
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: authData.user.id,
        language: settings.language,
        timezone: settings.timezone,
        theme,
        email_notifications: settings.emailNotifications,
        workpack_updates: settings.workpackUpdates,
        review_reminders: settings.reviewReminders,
        weekly_digest: settings.weeklyDigest,
        compact_view: settings.compactView,
        auto_save: settings.autoSave,
        default_view: settings.defaultView,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  setSettings({
    ...settings,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  showToast('Settings saved successfully!', 'success');
};

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your account preferences and security</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="ms">Bahasa Melayu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Timezone
                      </label>
<div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 dark:text-slate-300">
  Malaysia Time (MYT)
</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['light', 'dark'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t as any)}
                            className={`px-4 py-3 rounded-xl border-2 transition-all capitalize ${
                              theme === t
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.currentPassword}
                          onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.newPassword}
                          onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.confirmPassword}
                          onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Add an extra layer of security</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.twoFactorEnabled}
                          onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Email Notifications</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Receive updates via email</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Workpack Updates</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Status changes and comments</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.workpackUpdates}
                        onChange={(e) => setSettings({ ...settings, workpackUpdates: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-amber-600" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Review Reminders</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Pending review notifications</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.reviewReminders}
                        onChange={(e) => setSettings({ ...settings, reviewReminders: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Weekly Digest</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Summary of your activity</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.weeklyDigest}
                        onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Display Preferences</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Compact View</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Show more items on screen</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.compactView}
                        onChange={(e) => setSettings({ ...settings, compactView: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Auto-Save</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Automatically save drafts</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Default View
                      </label>
                      <select
                        value={settings.defaultView}
                        onChange={(e) => setSettings({ ...settings, defaultView: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="dashboard">Dashboard</option>
                        <option value="workpacks">Workpacks List</option>
                        <option value="reports">Reports</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
