import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { theme } from '@/constants/theme';
import {
  apiGetProfile, apiUpdateProfile,
  apiGetDiagnoses, apiCreateDiagnosis,
  apiGetBookings,
  UserData, DiagnosisData, JobData,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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
  severity?: string;
  canDIY?: boolean;
  estimatedCost?: { min: number; max: number };
  estimatedTime?: string;
  risks?: string[];
  immediateSteps?: string[];
  maintenanceTips?: string[];
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
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  dismissReminder: (id: number) => void;
  addDiagnosis: (category: string, description: string) => Promise<DiagnosisRecord>;
  refreshJobs: () => Promise<void>;
  markNotificationsRead: () => void;
}

// ── Static/semi-static data ───────────────────────────────────
const DEFAULT_SYSTEM_SCORES: SystemScore[] = [
  { label: 'Plumbing',   score: 85, color: theme.accentBlue,  icon: 'water' },
  { label: 'Electrical', score: 88, color: theme.warning,      icon: 'flash' },
  { label: 'HVAC',       score: 55, color: theme.accentWarm,   icon: 'snow' },
  { label: 'Appliances', score: 91, color: theme.accentPurple, icon: 'settings' },
  { label: 'Roofing',    score: 74, color: theme.success,      icon: 'home' },
];

const DEFAULT_REMINDERS: Reminder[] = [
  { id: 1, icon: 'snow-outline',  label: 'HVAC Filter Due',    sub: 'Replace by Jun 15',  color: theme.accentWarm, dismissed: false },
  { id: 2, icon: 'flash-outline', label: 'Electrical Panel',   sub: 'Inspection overdue', color: theme.warning,    dismissed: false },
  { id: 3, icon: 'water-outline', label: 'Water Heater Check', sub: 'Annual – Jul 1',     color: theme.accentBlue, dismissed: false },
];

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'A001', name: 'Kitchen Fridge',  category: 'Appliance', icon: 'cube',           color: theme.accentBlue,   age: '4 yrs', health: 62, healthLabel: 'Fair',      purchased: 'Jun 2021', warrantyExpiry: 'Jun 2026', warrantyDaysLeft: 23,   faults: 2, lastService: 'Mar 2026', repairCost: 95,  replaceCost: 650,  qrCode: 'FX-A001' },
  { id: 'A002', name: 'HVAC System',     category: 'HVAC',      icon: 'snow',           color: theme.accentWarm,   age: '6 yrs', health: 48, healthLabel: 'Poor',      purchased: 'Jan 2019', warrantyExpiry: 'Jan 2024', warrantyDaysLeft: -500, faults: 4, lastService: 'Jan 2026', repairCost: 350, replaceCost: 3200, qrCode: 'FX-A002' },
  { id: 'A003', name: 'Washing Machine', category: 'Appliance', icon: 'refresh-circle', color: theme.accentPurple, age: '2 yrs', health: 88, healthLabel: 'Good',      purchased: 'May 2023', warrantyExpiry: 'May 2028', warrantyDaysLeft: 720, faults: 0, lastService: 'Never',    repairCost: 0,   replaceCost: 580,  qrCode: 'FX-A003' },
  { id: 'A004', name: 'Water Heater',    category: 'Plumbing',  icon: 'flame',          color: theme.danger,       age: '8 yrs', health: 70, healthLabel: 'Good',      purchased: 'Mar 2017', warrantyExpiry: 'Mar 2027', warrantyDaysLeft: 270, faults: 1, lastService: 'Jun 2025', repairCost: 180, replaceCost: 900,  qrCode: 'FX-A004' },
  { id: 'A005', name: 'Dishwasher',      category: 'Appliance', icon: 'water',          color: theme.success,      age: '3 yrs', health: 91, healthLabel: 'Excellent', purchased: 'Aug 2022', warrantyExpiry: 'Aug 2027', warrantyDaysLeft: 420, faults: 0, lastService: 'Never',    repairCost: 0,   replaceCost: 480,  qrCode: 'FX-A005' },
];

function userDataToProfile(u: UserData): UserProfile {
  return {
    name: u.name,
    firstName: u.firstName,
    email: u.email,
    phone: u.phone,
    address: u.address,
    plan: u.plan,
    memberSince: u.memberSince,
    initials: u.initials,
  };
}

function diagnosisDataToRecord(d: DiagnosisData): DiagnosisRecord {
  return {
    id: d.id,
    date: d.date,
    category: d.category,
    issue: d.issue,
    confidence: d.confidence,
    fixedPrice: d.fixedPrice,
    severity: d.severity,
    canDIY: d.canDIY,
    estimatedCost: d.estimatedCost,
    estimatedTime: d.estimatedTime,
    risks: d.risks,
    immediateSteps: d.immediateSteps,
    maintenanceTips: d.maintenanceTips,
  };
}

// ── Context ───────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    name: authUser?.name || 'Loading…',
    firstName: authUser?.firstName || '',
    email: authUser?.email || '',
    phone: authUser?.phone || '',
    address: authUser?.address || '',
    plan: authUser?.plan || 'FixFair Pro',
    memberSince: authUser?.memberSince || '',
    initials: authUser?.initials || '??',
  });
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile from auth user
  useEffect(() => {
    if (authUser) setProfile(userDataToProfile(authUser));
  }, [authUser]);

  // Load all user data on mount
  useEffect(() => {
    if (!isAuthenticated) { setIsLoading(false); return; }

    setIsLoading(true);
    Promise.all([
      apiGetProfile().then(({ profile: p }) => setProfile(userDataToProfile(p))).catch(() => {}),
      apiGetDiagnoses().then(({ diagnoses: d }) => setDiagnoses(d.map(diagnosisDataToRecord))).catch(() => {}),
      apiGetBookings().then(({ jobs: j }) => setJobs(j)).catch(() => {}),
    ]).finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    try {
      const { profile: updated } = await apiUpdateProfile(data);
      setProfile(userDataToProfile(updated));
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  }, []);

  const dismissReminder = useCallback((id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, dismissed: true } : r));
  }, []);

  const addDiagnosis = useCallback(async (category: string, description: string): Promise<DiagnosisRecord> => {
    const { diagnosis } = await apiCreateDiagnosis(category, description);
    const record = diagnosisDataToRecord(diagnosis);
    setDiagnoses(prev => [record, ...prev]);
    return record;
  }, []);

  const refreshJobs = useCallback(async () => {
    try {
      const { jobs: j } = await apiGetBookings();
      setJobs(j);
    } catch (err) {
      console.error('Failed to refresh jobs:', err);
    }
  }, []);

  const markNotificationsRead = useCallback(() => setNotifications(0), []);

  const systemScores = DEFAULT_SYSTEM_SCORES;
  const healthScore = Math.round(systemScores.reduce((s, x) => s + x.score, 0) / systemScores.length);
  const appliances = DEFAULT_APPLIANCES;
  const ecoStats = {
    moneySaved: jobs.filter(j => j.status === 'completed').reduce((s, j) => s + j.amount * 0.3, 0) | 0,
    co2Reduced: jobs.filter(j => j.status === 'completed').length * 12,
    repairsCount: jobs.filter(j => j.status === 'completed').length,
    landfillAvoided: Math.floor(jobs.filter(j => j.status === 'completed').length * 0.6),
  };

  return (
    <UserContext.Provider value={{
      profile, systemScores, healthScore, reminders, jobs, appliances,
      diagnoses, notifications, ecoStats, isLoading,
      updateProfile, dismissReminder, addDiagnosis, refreshJobs, markNotificationsRead,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
