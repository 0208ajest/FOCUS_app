import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Users, Clock, Activity, Globe, Heart, Star, Sparkles, Brain, Moon, Leaf, Headphones, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';
import { Language } from './translations';
import { useTranslation } from './translations';

interface DashboardProps {
  onBack: () => void;
  language: Language;
}

export function Dashboard({ onBack, language }: DashboardProps) {
  const t = useTranslation(language);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Mock data for visualization
  const stats = {
    totalUsers: 12847,
    activeNow: 247,
    focusUsers: 89,
    sleepUsers: 72,
    relaxUsers: 86,
    avgSessionTime: '42',
    totalSessions: 15432,
    totalMoments: 89342,
    totalBreaths: 1247892,
    totalPeaceMinutes: 324567,
  };

  const recentActivity = [
    { mode: t.focusModeUsers, users: stats.focusUsers, color: 'bg-blue-500', icon: Brain },
    { mode: t.sleepModeUsers, users: stats.sleepUsers, color: 'bg-slate-600', icon: Moon },
    { mode: t.relaxModeUsers, users: stats.relaxUsers, color: 'bg-emerald-500', icon: Leaf },
  ];

  const hourlyData = [
    { hour: '00:00', users: 45 },
    { hour: '03:00', users: 23 },
    { hour: '06:00', users: 67 },
    { hour: '09:00', users: 89 },
    { hour: '12:00', users: 156 },
    { hour: '15:00', users: 198 },
    { hour: '18:00', users: 247 },
    { hour: '21:00', users: 189 },
  ];

  const globalStats = [
    { label: t.mindfulMoments, value: stats.totalMoments.toLocaleString(), icon: Sparkles, color: 'text-yellow-400' },
    { label: t.totalSessions, value: stats.totalSessions.toLocaleString(), icon: Activity, color: 'text-blue-400' },
    { label: t.breathsTaken, value: stats.totalBreaths.toLocaleString(), icon: Heart, color: 'text-red-400' },
    { label: t.minutesOfPeace, value: stats.totalPeaceMinutes.toLocaleString(), icon: Star, color: 'text-purple-400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % recentActivity.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 4,
          }}
        />
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </Button>
        <h1 className="text-2xl font-light text-white">{t.communityDashboard}</h1>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-6">
        
        {/* Live pulse indicator */}
        <motion.div 
          className="flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center space-x-2 glass-morphism rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm">{t.liveActivity}</span>
          </div>
        </motion.div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                  {t.activeUsers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">{stats.activeNow}</div>
                <p className="text-xs text-white/70">{t.onlineNow}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-400" />
                  {t.avgSession}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">{stats.avgSessionTime} min</div>
                <p className="text-xs text-white/70">{t.duration}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Headphones className="h-4 w-4 mr-2 text-purple-400" />
                  {t.sessionsToday}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">{stats.totalSessions.toLocaleString()}</div>
                <p className="text-xs text-white/70">{t.completed}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-orange-400" />
                  {t.totalUsers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-white/70">{t.registered}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Current Activity - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                {t.currentActivity}
              </CardTitle>
              <CardDescription className="text-white/70">
                {t.realTimeUsage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                const isPulsing = pulseIndex === index;
                return (
                  <motion.div 
                    key={activity.mode} 
                    className="space-y-3"
                    animate={{ 
                      scale: isPulsing ? 1.02 : 1,
                      opacity: isPulsing ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${activity.color} ${isPulsing ? 'animate-pulse' : ''}`} />
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{activity.mode}</span>
                      </div>
                      <span className="text-sm text-white/70">{activity.users} {t.users}</span>
                    </div>
                    <Progress 
                      value={(activity.users / stats.activeNow) * 100} 
                      className="h-3 bg-white/10"
                    />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Global Pulse Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-white/10 to-white/5 glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                {t.globalPulse}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {globalStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="text-center space-y-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                      <div className="text-2xl font-light">{stat.value}</div>
                      <div className="text-xs text-white/70">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t.usageThroughout}</CardTitle>
              <CardDescription className="text-white/70">
                {t.peakHours}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hourlyData.map((data, index) => (
                  <motion.div 
                    key={data.hour} 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="w-12 text-sm text-white/70">{data.hour}</div>
                    <div className="flex-1">
                      <Progress 
                        value={(data.users / 250) * 100} 
                        className="h-3 bg-white/10"
                      />
                    </div>
                    <div className="w-12 text-sm text-white/70 text-right">{data.users}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Message - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-gradient-to-r from-white/15 to-white/5 glass-morphism relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
            <CardContent className="p-8 text-center relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Heart className="h-12 w-12 mx-auto mb-4 text-pink-400" />
              </motion.div>
              <h3 className="text-xl font-medium mb-4">{t.youreNotAlone}</h3>
              <p className="text-white/80 leading-relaxed">
                {stats.activeNow} {t.communityMessage}
              </p>
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div className="flex -space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full border-2 border-white/20"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/60 ml-4">+ {stats.activeNow - 5} more</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
