import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, User, CheckCircle, X, ArrowRight } from 'lucide-react';

interface CompleteProfileBannerProps {
  profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    department?: string;
    bio?: string;
  };
}

export function CompleteProfileBanner({ profileData }: CompleteProfileBannerProps) {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Check if profile is complete
  const isProfileComplete = () => {
    return !!(
      profileData.fullName &&
      profileData.email &&
      profileData.phone &&
      profileData.location &&
      profileData.department &&
      profileData.bio
    );
  };

  // Calculate profile completion percentage
  const getProfileCompletionPercentage = () => {
    const fields = ['fullName', 'email', 'phone', 'location', 'department', 'bio'];
    const filledFields = fields.filter(field => profileData[field as keyof typeof profileData]).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Check if user is first time
  useEffect(() => {
    const hasSeenProfileBanner = localStorage.getItem('hasSeenProfileBanner');
    if (!hasSeenProfileBanner) {
      setIsFirstTimeUser(true);
      localStorage.setItem('hasSeenProfileBanner', 'true');
    }
    
    // Check if user has dismissed the banner
    const bannerDismissed = localStorage.getItem('profileBannerDismissed');
    if (bannerDismissed === 'true' && isProfileComplete()) {
      setShowBanner(false);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    if (isProfileComplete()) {
      localStorage.setItem('profileBannerDismissed', 'true');
    }
  };

  const handleCompleteProfile = () => {
    navigate('/dashboard/profile');
  };

  const completionPercentage = getProfileCompletionPercentage();
  const profileComplete = isProfileComplete();

  // Don't show if banner is hidden or profile is complete and not first time
  if (!showBanner || (profileComplete && !isFirstTimeUser)) {
    return null;
  }

  return (
    <AnimatePresence>
      {!profileComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className={`relative overflow-hidden rounded-2xl ${
            isFirstTimeUser 
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          } p-6 shadow-xl mb-6`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  {isFirstTimeUser ? (
                    <AlertCircle className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isFirstTimeUser ? '👋 Welcome to PACK-D!' : 'Complete Your Profile'}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {isFirstTimeUser 
                      ? 'Let\'s get your profile set up to unlock all features' 
                      : 'Add missing information to enhance your experience'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-white/90 mb-2">
                  <span>Profile Completion</span>
                  <span className="font-semibold">{completionPercentage}%</span>
                </div>
                <div className="h-3 bg-white/20 dark:bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-white rounded-full shadow-lg"
                  />
                </div>
              </div>

              {/* Missing Fields */}
              <div className="flex flex-wrap gap-2 mb-4">
                {!profileData.phone && (
                  <span className="px-3 py-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30 dark:border-white/10">
                    + Add Phone
                  </span>
                )}
                {!profileData.location && (
                  <span className="px-3 py-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30 dark:border-white/10">
                    + Add Location
                  </span>
                )}
                {!profileData.department && (
                  <span className="px-3 py-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30 dark:border-white/10">
                    + Add Department
                  </span>
                )}
                {!profileData.bio && (
                  <span className="px-3 py-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30 dark:border-white/10">
                    + Add Bio
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCompleteProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-300 font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Complete Profile Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="p-2 bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 rounded-lg backdrop-blur-sm transition-all group"
              title="Dismiss"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Banner - Profile Complete */}
      {profileComplete && isFirstTimeUser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 shadow-xl mb-6"
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-blue-300 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  🎉 Profile Complete!
                </h3>
                <p className="text-white/90 text-sm">
                  Your profile is fully set up. You're ready to go!
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 rounded-lg backdrop-blur-sm transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
