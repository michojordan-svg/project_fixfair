import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Platform,
  ActivityIndicator, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { theme, spacing, borderRadius } from '@/constants/theme';

type Tab = 'login' | 'register';

export default function AuthScreen() {
  const { login, register, isLoading, error, clearError } = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (tab === 'register' && !name.trim()) errs.name = 'Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    clearError();
    try {
      if (tab === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, name.trim());
      }
    } catch {
      // error is set in context
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setFieldErrors({});
    clearError();
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={s.logoWrap}>
            <View style={s.logoIcon}>
              <Ionicons name="construct" size={28} color={theme.bg} />
            </View>
            <Text style={s.logoText}>FixFair</Text>
            <Text style={s.logoSub}>Transparent home repairs, guaranteed.</Text>
          </View>

          {/* Tab switcher */}
          <View style={s.tabs}>
            <TouchableOpacity
              style={[s.tabBtn, tab === 'login' && s.tabBtnActive]}
              onPress={() => switchTab('login')}
            >
              <Text style={[s.tabText, tab === 'login' && s.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tabBtn, tab === 'register' && s.tabBtnActive]}
              onPress={() => switchTab('register')}
            >
              <Text style={[s.tabText, tab === 'register' && s.tabTextActive]}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Global error */}
          {!!error && (
            <View style={s.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text style={s.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={s.form}>
            {tab === 'register' && (
              <View style={s.field}>
                <Text style={s.label}>Full Name</Text>
                <TextInput
                  style={[s.input, fieldErrors.name && s.inputErr]}
                  placeholder="Alex Johnson"
                  placeholderTextColor={theme.textDim}
                  value={name}
                  onChangeText={v => { setName(v); setFieldErrors(e => ({ ...e, name: '' })); }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {!!fieldErrors.name && <Text style={s.fieldErr}>{fieldErrors.name}</Text>}
              </View>
            )}

            <View style={s.field}>
              <Text style={s.label}>Email Address</Text>
              <TextInput
                style={[s.input, fieldErrors.email && s.inputErr]}
                placeholder="you@email.com"
                placeholderTextColor={theme.textDim}
                value={email}
                onChangeText={v => { setEmail(v); setFieldErrors(e => ({ ...e, email: '' })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
              {!!fieldErrors.email && <Text style={s.fieldErr}>{fieldErrors.email}</Text>}
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <View style={s.pwWrap}>
                <TextInput
                  style={[s.input, s.pwInput, fieldErrors.password && s.inputErr]}
                  placeholder={tab === 'register' ? 'At least 6 characters' : 'Your password'}
                  placeholderTextColor={theme.textDim}
                  value={password}
                  onChangeText={v => { setPassword(v); setFieldErrors(e => ({ ...e, password: '' })); }}
                  secureTextEntry={!showPw}
                  autoComplete={tab === 'login' ? 'password' : 'new-password'}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity style={s.pwToggle} onPress={() => setShowPw(!showPw)}>
                  <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              {!!fieldErrors.password && <Text style={s.fieldErr}>{fieldErrors.password}</Text>}
            </View>

            <TouchableOpacity
              style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.bg} size="small" />
              ) : (
                <>
                  <Text style={s.submitText}>
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={theme.bg} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Trust badges */}
          <View style={s.badges}>
            {[
              { icon: 'shield-checkmark', text: 'Secure & encrypted' },
              { icon: 'lock-closed',      text: 'No spam, ever'      },
              { icon: 'star',             text: 'Free to join'        },
            ].map(b => (
              <View key={b.text} style={s.badge}>
                <Ionicons name={b.icon as never} size={13} color={theme.accent} />
                <Text style={s.badgeText}>{b.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  logoIcon: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: theme.accent,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: '900', color: theme.text, letterSpacing: -0.5 },
  logoSub: { fontSize: 14, color: theme.textMuted, marginTop: 6, textAlign: 'center' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.bgCard,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center' },
  tabBtnActive: { backgroundColor: theme.bgElevated },
  tabText: { fontSize: 14, fontWeight: '600', color: theme.textMuted },
  tabTextActive: { color: theme.text },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: borderRadius.md, padding: 12, marginBottom: spacing.md,
  },
  errorBannerText: { color: '#EF4444', fontSize: 13, flex: 1 },
  form: { gap: 4 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: theme.textMuted, marginBottom: 8 },
  input: {
    backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: 14,
    color: theme.text, fontSize: 15,
  },
  inputErr: { borderColor: '#EF4444' },
  fieldErr: { fontSize: 12, color: '#EF4444', marginTop: 6 },
  pwWrap: { position: 'relative' },
  pwInput: { paddingRight: 48 },
  pwToggle: {
    position: 'absolute', right: 14, top: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: theme.accent,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: borderRadius.xl, marginTop: spacing.md,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: theme.bg, fontSize: 16, fontWeight: '700' },
  badges: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: spacing.xl },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  badgeText: { fontSize: 11, color: theme.textDim },
});
