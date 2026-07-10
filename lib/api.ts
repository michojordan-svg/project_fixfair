const TOKEN_KEY = 'fixfair_token';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return '/api';
}

function getToken(): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

function setToken(token: string) {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

function clearToken() {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

type SessionExpiredListener = () => void;
let sessionExpiredListener: SessionExpiredListener | null = null;

export function onSessionExpired(listener: SessionExpiredListener) {
  sessionExpiredListener = listener;
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const token = getToken();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({ error: 'Unexpected server response' }));

  if (res.status === 401 && token && path !== '/auth/login' && path !== '/auth/register') {
    // Session expired or invalid mid-use — force logout so the UI reflects reality
    clearToken();
    sessionExpiredListener?.();
  }

  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────
export async function apiRegister(email: string, password: string, name: string) {
  const data = await request<{ token: string; user: UserData }>('POST', '/auth/register', { email, password, name });
  setToken(data.token);
  return data;
}

export async function apiLogin(email: string, password: string) {
  const data = await request<{ token: string; user: UserData }>('POST', '/auth/login', { email, password });
  setToken(data.token);
  return data;
}

export async function apiGetMe() {
  return request<{ user: UserData }>('GET', '/auth/me');
}

export function apiLogout() {
  clearToken();
}

export async function apiForgotPassword(email: string) {
  return request<{ ok: boolean; message: string }>('POST', '/auth/forgot-password', { email });
}

export function hasToken(): boolean {
  return !!getToken();
}

// ── Profile ───────────────────────────────────────────────────
export async function apiGetProfile() {
  return request<{ profile: UserData }>('GET', '/profile');
}

export async function apiUpdateProfile(data: Partial<UserData>) {
  return request<{ profile: UserData }>('PATCH', '/profile', data);
}

// ── Diagnoses ─────────────────────────────────────────────────
export async function apiGetDiagnoses() {
  return request<{ diagnoses: DiagnosisData[] }>('GET', '/diagnoses');
}

export async function apiCreateDiagnosis(category: string, description: string) {
  return request<{ diagnosis: DiagnosisData }>('POST', '/diagnoses', { category, description });
}

export async function apiCreateDiagnosisWithMedia(
  category: string,
  description: string,
  media: { blob: Blob; filename: string; mimeType: string }
) {
  const url = `${getBaseUrl()}/diagnoses`;
  const token = getToken();

  const form = new FormData();
  form.append('category', category);
  form.append('description', description);
  form.append('media', media.blob, media.filename);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { method: 'POST', headers, body: form });
  const data = await res.json().catch(() => ({ error: 'Unexpected server response' }));

  if (res.status === 401 && token) {
    clearToken();
    sessionExpiredListener?.();
  }

  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Upload failed (${res.status})`);
  }

  return data as { diagnosis: DiagnosisData };
}

// ── Bookings / Jobs ───────────────────────────────────────────
export async function apiGetBookings() {
  return request<{ jobs: JobData[] }>('GET', '/bookings');
}

export async function apiCreateBooking(payload: BookingPayload) {
  return request<{ job: JobData }>('POST', '/bookings', payload);
}

export async function apiCompleteBooking(id: string) {
  return request<{ job: JobData }>('PATCH', `/bookings/${id}/complete`, {});
}

export async function apiReviewBooking(id: string, rating: number, review: string) {
  return request<{ job: JobData }>('PATCH', `/bookings/${id}/review`, { rating, review });
}

// ── Technicians ───────────────────────────────────────────────
export async function apiGetTechnicians() {
  return request<{ technicians: TechnicianData[] }>('GET', '/technicians');
}

// ── Appliances ────────────────────────────────────────────────
export async function apiGetAppliances() {
  return request<{ appliances: ApplianceData[] }>('GET', '/appliances');
}

export async function apiAddAppliance(payload: {
  name: string; category: string; brand?: string; model?: string;
  purchased_date?: string; warranty_expiry?: string; notes?: string; replace_cost?: number;
}) {
  return request<{ appliance: ApplianceData }>('POST', '/appliances', payload);
}

export async function apiDeleteAppliance(dbId: number) {
  return request<{ ok: boolean }>('DELETE', `/appliances/${dbId}`);
}

// ── Types ─────────────────────────────────────────────────────
export interface UserData {
  id: string;
  email: string;
  name: string;
  firstName: string;
  phone: string;
  address: string;
  plan: string;
  memberSince: string;
  initials: string;
}

export interface DiagnosisData {
  id: string;
  date: string;
  category: string;
  issue: string;
  confidence: number;
  fixedPrice: number;
  severity: string;
  canDIY: boolean;
  estimatedCost: { min: number; max: number };
  estimatedTime: string;
  risks: string[];
  immediateSteps: string[];
  maintenanceTips: string[];
  description: string;
  status: string;
  videoUrl?: string | null;
}

export interface JobData {
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

export interface ApplianceData {
  id: string;
  dbId: number;
  name: string;
  category: string;
  brand: string;
  model: string;
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
  notes: string;
  qrCode: string;
}

export interface TechnicianData {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  jobs: number;
  price: number;
  initials: string;
  color: string;
  verified: boolean;
  eta: string;
  distance: string;
  badges: string[];
}

export interface BookingPayload {
  techId?: number;
  techName: string;
  techInitials: string;
  techColor: string;
  scheduledSlot: string;
  address: string;
  instructions?: string;
  amount: number;
  category: string;
  diagnosisId?: string;
}
