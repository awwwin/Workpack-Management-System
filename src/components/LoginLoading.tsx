import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, CheckCircle, Loader2 } from 'lucide-react';

interface LoginLoadingProps {
  onComplete: () => void;
}

export function LoginLoading({ onComplete }: LoginLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Verifying credentials...',
    'Loading your workspace...',
    'Almost there...',
  ];

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const interval = 50;
    const increment = (interval / duration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + increment, 100);
        
        // Update step based on progress
        if (newProgress < 33) {
          setCurrentStep(0);
        } else if (newProgress < 66) {
          setCurrentStep(1);
        } else {
          setCurrentStep(2);
        }

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 300);
        }
        
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      {/* Animated Illustration */}
      <div className="relative mb-12">
        {/* Outer Ring Animation */}
        <motion.div
          className="absolute inset-0 -m-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-32 h-32" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </svg>
        </motion.div>

        {/* Middle Ring Animation */}
        <motion.div
          className="absolute inset-0 -m-4"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ddd6fe"
              strokeWidth="2"
              strokeDasharray="5 10"
            />
          </svg>
        </motion.div>

        {/* Central Icon with Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-3xl shadow-2xl">
            <Package className="w-16 h-16 text-white" />
          </div>
          
          {/* Success Check Animation */}
          {progress > 90 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg"
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Orbiting Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              marginLeft: '-6px',
              marginTop: '-6px',
            }}
            animate={{
              x: [
                0,
                Math.cos((i * Math.PI * 2) / 6) * 60,
                Math.cos((i * Math.PI * 2) / 6 + Math.PI) * 60,
                0,
              ],
              y: [
                0,
                Math.sin((i * Math.PI * 2) / 6) * 60,
                Math.sin((i * Math.PI * 2) / 6 + Math.PI) * 60,
                0,
              ],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center mb-20">
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-2xl font-semibold text-slate-900 mb-2 flex items-center justify-center gap-3"
        >
          {steps[currentStep]}
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </motion.h2>
        <p className="text-slate-600">Please wait a moment</p>
      </div>

      {/* Progress Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-8 pb-8">
        <div className="max-w-md mx-auto">
          {/* Progress Text */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Loading</span>
            <motion.span
              key={Math.floor(progress)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-sm font-semibold text-blue-600"
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>

          {/* Progress Bar Container */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full relative overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Milestone Dots */}
          <div className="flex justify-between mt-3">
            {[0, 33, 66, 100].map((milestone, index) => (
              <motion.div
                key={milestone}
                className={`w-2 h-2 rounded-full transition-all ${
                  progress >= milestone ? 'bg-blue-600 scale-125' : 'bg-slate-300'
                }`}
                animate={progress >= milestone ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
