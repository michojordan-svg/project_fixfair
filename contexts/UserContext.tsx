import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { theme } from '@/constants/theme';

export interface UserProfile {
  name: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  memberSince: string;
  initials: string;
}

export interface SystemScore {
  label: string;
  score: number;
  color: string;
  icon: string;
}

export interface Reminder {
  id: number;
  icon: string;
  label: string;
  sub: string;
  color: string;
  dismissed: boolean;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  tech: string;
  techInitials: string;
  techColor: string;
  date: string;
  amount: number;
  status: 'in_progress' | 'scheduled' | 'completed';
  rating: number;
  eta?: string;
  review?: string;
}

export interface Appliance {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  age: string;
  health: number;
  healthLabel: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  purchased: string;
  warrantyExpiry: string;
  warrantyDaysLeft: number;
  faults: number;
  lastService: string;
  repairCost: number;
  replaceCost: number;
  qrCode: string;
}

export interface DiagnosisRecord {
  id: string;
  date: string;
  category: string;
  issue: string;
  confidence: number;
  fixedPrice: number;
  audioUrl?: string;
  videoUrl?: string;
}

interface UserContextType {
  profile: UserProfile;
  systemScores: SystemScore[];
  healthScore: number;
  reminders: Reminder[];
  jobs: Job[];
  appliances: Appliance[];
  diagnoses: DiagnosisRecord[];
  notifications: number;
  ecoStats: { moneySaved: number; co2Reduced: number; repairsCount: number; landfillAvoided: number };
  updateProfile: (data: Partial<UserProfile>) => void;
  dismissReminder: (id: number) => void;
  addDiagnosis: (record: DiagnosisRecord) => void;
  markNotificationsRead: () => void;
}

const DEFAULT_SYSTEM_SCORES: SystemScore[] = [
  { label: 'Plumbing',   score: 85, color: theme.accentBlue,  icon: 'water' },
  { label: 'Electrical', score: 88, color: theme.warning,      icon: 'flash' },
  { label: 'HVAC',       score: 55, color: theme.accentWarm,   icon: 'snow' },
  { label: 'Appliances', score: 91, color: theme.accentPurple, icon: 'settings' },
  { label: 'Roofing',    score: 74, color: theme.success,      icon: 'home' },
];

const DEFAULT_REMINDERS: Reminder[] = [
  { id: 1, icon: 'snow-outline',  label: 'HVAC Filter Due',      sub: 'Replace by Jun 15', color: theme.accentWarm, dismissed: false },
  { id: 2, icon: 'flash-outline', label: 'Electrical Panel',     sub: 'Inspection overdue', color: theme.warning,  dismissed: false },
  { id: 3, icon: 'water-outline', label: 'Water Heater Check',   sub: 'Annual – Jul 1',    color: theme.accentBlue, dismissed: false },
];

const DEFAULT_JOBS: Job[] = [
  { id: 'FX-2847', title: 'Plumbing – Leaky Faucet',    category: 'Plumbing',   tech: 'Marcus Webb',  techInitials: 'MW', techColor: theme.accentBlue,   date: 'Jun 7, 2026',  amount: 170, status: 'in_progress', rating: 0,   eta: '2:30 PM' },
  { id: 'FX-2801', title: 'HVAC – Filter Replacement',  category: 'HVAC',       tech: 'Sarah Chen',   techInitials: 'SC', techColor: theme.accentWarm,   date: 'May 28, 2026', amount: 95,  status: 'completed',   rating: 5,   review: 'Sarah was incredibly professional and quick. Excellent service!' },
  { id: 'FX-2755', title: 'Electrical – Outlet Repair', category: 'Electrical', tech: 'David Park',   techInitials: 'DP', techColor: theme.warning,       date: 'May 12, 2026', amount: 140, status: 'completed',   rating: 4,   review: 'Good work, explained everything clearly. Arrived on time.' },
  { id: 'FX-2710', title: 'Appliance – Dishwasher',     category: 'Appliance',  tech: 'Maria Torres', techInitials: 'MT', techColor: theme.accentPurple,  date: 'Apr 30, 2026', amount: 220, status: 'completed',   rating: 5,   review: 'Maria diagnosed and fixed the issue in under an hour. Amazing!' },
  { id: 'FX-2655', title: 'Plumbing – Drain Cleaning',  category: 'Plumbing',   tech: 'Marcus Webb',  techInitials: 'MW', techColor: theme.accentBlue,   date: 'Mar 15, 2026', amount: 110, status: 'completed',   rating: 5,   review: 'Fast, thorough, and honest pricing. Would book again.' },
];

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'A001', name: 'Kitchen Fridge',   category: 'Appliance', icon: 'cube',           color: theme.accentBlue,   age: '4 yrs', health: 62, healthLabel: 'Fair',      purchased: 'Jun 2021', warrantyExpiry: 'Jun 2026', warrantyDaysLeft: 23,  faults: 2, lastService: 'Mar 2026', repairCost: 95,  replaceCost: 650,  qrCode: 'FX-A001' },
  { id: 'A002', name: 'HVAC System',      category: 'HVAC',      icon: 'snow',           color: theme.accentWarm,   age: '6 yrs', health: 48, healthLabel: 'Poor',      purchased: 'Jan 2019', warrantyExpiry: 'Jan 2024', warrantyDaysLeft: -500, faults: 4, lastService: 'Jan 2026', repairCost: 350, replaceCost: 3200, qrCode: 'FX-A002' },
  { id: 'A003', name: 'Washing Machine',  category: 'Appliance', icon: 'refresh-circle', color: theme.accentPurple, age: '2 yrs', health: 88, healthLabel: 'Good',      purchased: 'May 2023', warrantyExpiry: 'May 2028', warrantyDaysLeft: 720, faults: 0, lastService: 'Never',    repairCost: 0,   replaceCost: 580,  qrCode: 'FX-A003' },
  { id: 'A004', name: 'Water Heater',     category: 'Plumbing',  icon: 'flame',          color: theme.danger,       age: '8 yrs', health: 70, healthLabel: 'Good',      purchased: 'Mar 2017', warrantyExpiry: 'Mar 2027', warrantyDaysLeft: 270, faults: 1, lastService: 'Jun 2025', repairCost: 180, replaceCost: 900,  qrCode: 'FX-A004' },
  { id: 'A005', name: 'Dishwasher',       category: 'Appliance', icon: 'water',          color: theme.success,      age: '3 yrs', health: 91, healthLabel: 'Excellent', purchased: 'Aug 2022', warrantyExpiry: 'Aug 2027', warrantyDaysLeft: 420, faults: 0, lastService: 'Never',    repairCost: 0,   replaceCost: 480,  qrCode: 'FX-A005' },
];

const STORAGE_KEY = 'fixfair_user_data';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    }
  } catch {}
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  firstName: 'Alex',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 012-3456',
  address: '42 Maple Street, Austin TX 78701',
  plan: 'FixFair Pro',
  memberSince: 'March 2024',
  initials: 'AJ',
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage(`${STORAGE_KEY}_profile`, DEFAULT_PROFILE)
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    loadFromStorage(`${STORAGE_KEY}_reminders`, DEFAULT_REMINDERS)
  );
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>(() =>
    loadFromStorage(`${STORAGE_KEY}_diagnoses`, [])
  );
  const [notifications, setNotifications] = useState(3);

  const systemScores = DEFAULT_SYSTEM_SCORES;
  const healthScore = Math.round(systemScores.reduce((s, x) => s + x.score, 0) / systemScores.length);
  const jobs = DEFAULT_JOBS;
  const appliances = DEFAULT_APPLIANCES;
  const ecoStats = { moneySaved: 1240, co2Reduced: 58, repairsCount: 5, landfillAvoided: 3 };

  useEffect(() => { saveToStorage(`${STORAGE_KEY}_profile`, profile); }, [profile]);
  useEffect(() => { saveToStorage(`${STORAGE_KEY}_reminders`, reminders); }, [reminders]);
  useEffect(() => { saveToStorage(`${STORAGE_KEY}_diagnoses`, diagnoses); }, [diagnoses]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  }, []);

  const dismissReminder = useCallback((id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, dismissed: true } : r));
  }, []);

  const addDiagnosis = useCallback((record: DiagnosisRecord) => {
    setDiagnoses(prev => [record, ...prev]);
  }, []);

  const markNotificationsRead = useCallback(() => setNotifications(0), []);

  return (
    <UserContext.Provider value={{
      profile, systemScores, healthScore, reminders, jobs, appliances,
      diagnoses, notifications, ecoStats,
      updateProfile, dismissReminder, addDiagnosis, markNotificationsRead,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
