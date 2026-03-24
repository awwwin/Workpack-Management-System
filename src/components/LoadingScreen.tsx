import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Package, CheckCircle, Users, LayoutDashboard, Settings } from 'lucide-react';
import { getCurrentUser } from '../lib/mockData';

interface LoadingScreenProps {
  userRole?: 'contractor' | 'reviewer' | 'admin';
}

export function LoadingScreen({ userRole }: LoadingScreenProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const role = userRole || currentUser.role;
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, icon: Users, text: 'Creating user profile', duration: 1000 },
    { id: 2, icon: Settings, text: 'Assigning role permissions', duration: 1200 },
    { id: 3, icon: LayoutDashboard, text: 'Preparing dashboard', duration: 1500 },
    { id: 4, icon: CheckCircle, text: 'Finalizing setup', duration: 1000 },
  ];

  useEffect(() => {
    // Simulate loading steps
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step
      let stepElapsed = 0;
      for (let i = 0; i < steps.length; i++) {
        stepElapsed += steps[i].duration;
        if (elapsed < stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigate(`/dashboard/${role}`);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg">
            <Package className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Heading */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-3xl font-semibold text-slate-900 mb-3">
              Setting up your workspace...
            </h1>
            <p className="text-slate-600 text-lg">
              Please wait while we prepare your account and dashboard.
            </p>
          </motion.div>

          {/* Animated Illustration */}
          <div className="flex items-center justify-center mb-12 relative">
            {/* Central Document Animation */}
            <div className="relative w-64 h-64">
              {/* Floating Documents */}
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 1.2],
                    rotate: [0, 0, 0, 15 * (index - 1)],
                    x: [0, 0, 0, 50 * (index - 1)],
                    y: [0, 0, 0, -30],
                  }}
                  transition={{
                    duration: 3,
                    delay: index * 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg border-2 border-white p-4">
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-300 rounded w-full"></div>
                        <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-300 rounded w-full"></div>
                        <div className="h-2 bg-slate-300 rounded w-2/3"></div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Central Gear/Workflow Animation */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Package className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Orbiting Particles */}
              {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                  key={`particle-${index}`}
                  className="absolute w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [
                      0,
                      Math.cos((index * Math.PI * 2) / 5) * 100,
                      Math.cos((index * Math.PI * 2) / 5 + Math.PI) * 100,
                      0,
                    ],
                    y: [
                      0,
                      Math.sin((index * Math.PI * 2) / 5) * 100,
                      Math.sin((index * Math.PI * 2) / 5 + Math.PI) * 100,
                      0,
                    ],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    delay: index * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <motion.div
                  key={step.id}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isActive
                        ? 'bg-blue-600'
                        : 'bg-slate-200'
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </motion.div>
                  <motion.span
                    className={`flex-1 font-medium ${
                      isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                    animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {step.text}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      className="w-4 h-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-full h-full border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    </motion.div>
                  )}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-500"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Overall Progress</span>
              <motion.span
                className="font-semibold text-blue-600"
                key={Math.floor(progress)}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full relative overflow-hidden"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Welcome Message */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 80 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-600 font-medium flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Almost ready! Taking you to your dashboard...
            </p>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={`float-${index}`}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}