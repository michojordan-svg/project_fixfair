=====================================
FILE: src/screens/TrackingScreen.tsx
=====================================

import React, { useState } from 'react';
import { theme } from '../styles/theme';

interface TrackingScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

const TrackingScreen: React.FC<TrackingScreenProps> = ({ onNavigate, onBack }) => {
  const [isApproved, setIsApproved] = useState(false);

  const timelineEvents = [
    { status: 'Booking confirmed', time: '1:15 PM', done: true },
    { status: 'Technician en route', time: '1:48 PM', done: true },
    { status: 'Technician arrived', time: '~2:00 PM', done: true, current: true },
    { status: 'Work in progress', time: 'Pending', done: false },
    { status: 'Complete - approve', time: 'Pending', done: false }
  ];

  return (
    <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{
            width: '36px',
            height: '36px',
            background: `rgba(255,255,255,0.06)`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            border: 'none',
            color: theme.colors.text,
          }}
        >
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Live Tracking</h2>
          <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: '4px 0 0 0' }}>
            Job #FX-2847
          </p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div
        style={{
          height: '140px',
          background: `linear-gradient(135deg, #0D1F35, #0A1428)`,
          borderRadius: '20px',
          border: `1px solid rgba(59,130,246,0.2)`,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍 Marcus Webb</div>
          <div style={{ color: theme.colors.primary, fontSize: '13px' }}>ETA: ~12 minutes away</div>
        </div>
      </div>

      {/* Technician Info Card */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
          padding: '12px',
          background: theme.colors.backgroundLight,
          borderRadius: '14px',
          border: `1px solid ${theme.colors.border}`,
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${theme.colors.secondary}, #1D4ED8)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '12px',
            flexShrink: 0,
          }}
        >
          MW
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>Marcus Webb</div>
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>Master Plumber, 4.9 ⭐</div>
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '2px' }}>ETA: ~12 min</div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ fontSize: '12px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px' }}>
          Job Timeline
        </h3>

        {timelineEvents.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                color: item.current ? theme.colors.primary : item.done ? '#10B981' : theme.colors.textSecondary,
                fontWeight: 700,
                minWidth: '16px',
              }}
            >
              {item.current ? '●' : item.done ? '✓' : '○'}
            </div>
            <div>
              <strong style={{ display: 'block', color: theme.colors.text }}>
                {item.status}
              </strong>
              <span style={{ color: theme.colors.textSecondary, fontSize: '11px' }}>
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow Card */}
      <div
        style={{
          background: `rgba(13,31,53,0.6)`,
          border: `1px solid rgba(0,212,170,0.2)`,
          borderRadius: '12px',
          padding: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 700 }}>🔒 Escrow Balance</div>
          <span style={{ color: theme.colors.primary, fontWeight: 800, fontSize: '16px' }}>$170</span>
        </div>
        <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: '8px 0 12px 0' }}>
          Released only when you approve
        </p>
        <button
          onClick={() => setIsApproved(true)}
          disabled={isApproved}
          style={{
            width: '100%',
            padding: '12px',
            background: isApproved
              ? `rgba(16, 185, 129, 0.15)`
              : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            color: isApproved ? '#10B981' : theme.colors.background,
            border: 'none',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: isApproved ? 'not-allowed' : 'pointer',
            transition: `all ${theme.transitions.fast}`,
          }}
          onMouseEnter={(e) => !isApproved && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isApproved ? '✓ Payment Approved' : '✓ Approve & Release Payment'}
        </button>
      </div>
    </div>
  );
};

export default TrackingScreen;

=====================================
FILE: src/screens/ProfileScreen.tsx
=====================================

import React from 'react';
import { User } from '../types';
import { theme } from '../styles/theme';
import { useAuthStore } from '../store/authStore';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
  user: User | null;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, onBack, user }) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const menuItems = [
    { icon: '🏠', label: 'My Properties', value: '1 property' },
    { icon: '🛡️', label: 'Warranty Plans', value: '1 active' },
    { icon: '💳', label: 'Payment Methods', value: 'Visa ••••4242' },
    { icon: '🔔', label: 'Notifications', value: 'All on' },
    { icon: '⭐', label: 'Refer & Earn', value: '$25/referral' },
    { icon: '⚙️', label: 'Settings', value: '→' }
  ];

  return (
    <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            width: '36px',
            height: '36px',
            background: `rgba(255,255,255,0.06)`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            border: 'none',
            color: theme.colors.text,
          }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Profile</h2>
      </div>

      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.background,
            fontWeight: 800,
            fontSize: '20px',
          }}
        >
          {user?.avatar || 'AJ'}
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
          {user?.name || 'User'}
        </h2>
        <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: '4px 0 0 0' }}>
          {user?.location || 'San Francisco, CA'}
        </p>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <span
            style={{
              background: `rgba(139,92,246,0.15)`,
              color: theme.colors.accent,
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 600,
            }}
          >
            Trust Score: {user?.trustScore || 847}
          </span>
          <span
            style={{
              background: `rgba(16, 185, 129, 0.15)`,
              color: '#10B981',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 600,
            }}
          >
            Verified
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {[
          { value: user?.totalJobs || 7, label: 'Total Jobs' },
          { value: '$340', label: 'Saved' },
          { value: (user?.avgRating || 4.9) + '★', label: 'Avg Rating' },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: theme.colors.backgroundLight,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: 800, color: theme.colors.text }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.textSecondary, marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Menu Items */}
      <div style={{ fontSize: '12px' }}>
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: `1px solid ${theme.colors.border}`,
              cursor: 'pointer',
              transition: `all ${theme.transitions.fast}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.opacity = '1';
            }}
          >
            <span>
              {item.icon} {item.label}
            </span>
            <span style={{ color: theme.colors.textSecondary }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '14px',
          background: `rgba(239,68,68,0.1)`,
          color: theme.colors.danger,
          border: `1px solid rgba(239,68,68,0.2)`,
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: '12px',
          transition: `all ${theme.transitions.fast}`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfileScreen;

=====================================
FILE: src/screens/index.ts
=====================================

export { default as HomeScreen } from './HomeScreen';
export { default as VideoScreen } from './VideoScreen';
export { default as BookingScreen } from './BookingScreen';
export { default as TrackingScreen } from './TrackingScreen';
export { default as ProfileScreen } from './ProfileScreen';
