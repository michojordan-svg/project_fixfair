import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge } from '@/components/Card';

type DiagnoseMode = 'video' | 'chat';

const categories = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water', color: theme.accentBlue },
  { id: 'hvac', label: 'HVAC', icon: 'snow', color: theme.accentWarm },
  { id: 'electrical', label: 'Electrical', icon: 'flash', color: theme.warning },
  { id: 'appliance', label: 'Appliance', icon: 'settings', color: theme.accentPurple },
  { id: 'roofing', label: 'Roofing', icon: 'home', color: theme.success },
  { id: 'general', label: 'General', icon: 'hammer', color: theme.accent },
];

type ChatMessage = { role: 'ai' | 'user'; text: string };

const chatSuggestions = [
  "Why is my fridge making noise?",
  "Washing machine won't start",
  "Dripping faucet fix?",
  "AC not cooling properly",
  "Circuit breaker keeps tripping",
];

const CHAT_RESPONSES: Record<string, string> = {
  default: "I understand your concern! Based on what you've described, this could be a few things. Can you tell me: How long has this been happening? And have you noticed any other symptoms like unusual sounds, smells, or performance changes?",
  noise: "A noisy fridge usually points to one of these: 🔧 **Condenser fan** — rattling when compressor runs. ❄️ **Evaporator fan** — squealing or humming. 🧊 **Ice maker** — clicking/knocking sounds. Most are DIY fixable! Estimated repair: $40–$120. Want me to find a technician nearby?",
  wash: "A washing machine that won't start is often caused by: 🔌 Power/door latch issue (check the door is fully closed). ⚡ Blown thermal fuse (common after overheating). 🔧 Faulty lid switch on top-loaders. Repair estimate: $85–$200. Recommend replacing fuse before calling a tech — it's a $10 part!",
  faucet: "A dripping faucet is almost always a worn **O-ring or washer**. Fix steps: 1. Turn off water supply valve under sink. 2. Remove handle (usually one screw under cap). 3. Replace the rubber washer or cartridge. Parts cost: $5–$25. Labor if you hire: $85–$120. A DIY fix saves you ~$100!",
  ac: "AC not cooling? Common causes: 🌡️ **Dirty air filter** (check & replace — $10 fix). 🧊 **Frozen evaporator coil** (turn off, let thaw 2–3 hrs). 📉 **Low refrigerant** (needs a licensed HVAC tech). First try replacing the filter. If no improvement in 24hrs, book an HVAC specialist.",
  breaker: "A tripping circuit breaker means: ⚡ **Overloaded circuit** — too many devices on one circuit. 🔥 **Short circuit** — damaged wire touching neutral. ⚠️ **Ground fault** — common in wet areas. Solution: unplug devices, reset breaker. If it trips again immediately, call an electrician — this is a safety issue!",
};

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('noise') || lower.includes('sound') || lower.includes('fridge') || lower.includes('refrigerator')) return CHAT_RESPONSES.noise;
  if (lower.includes('wash') || lower.includes('washing')) return CHAT_RESPONSES.wash;
  if (lower.includes('faucet') || lower.includes('drip') || lower.includes('leak')) return CHAT_RESPONSES.faucet;
  if (lower.includes('ac') || lower.includes('air') || lower.includes('cool')) return CHAT_RESPONSES.ac;
  if (lower.includes('breaker') || lower.includes('circuit') || lower.includes('electric')) return CHAT_RESPONSES.breaker;
  return CHAT_RESPONSES.default;
}

export default function DiagnoseScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<DiagnoseMode>('video');
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'video' | 'voice'>('video');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "👋 Hi! I'm your Virtual Appliance Doctor. Describe any home problem and I'll diagnose it, estimate costs, and recommend whether to repair or replace. What's going wrong?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleAnalyze = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2500);
  };

  const sendChat = (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: getAIResponse(msg) }]);
      setChatLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Mode Toggle */}
        <View style={styles.modeBar}>
          <TouchableOpacity style={[styles.modeBtn, mode === 'video' && styles.modeBtnActive]} onPress={() => setMode('video')}>
            <Ionicons name="videocam" size={14} color={mode === 'video' ? theme.bg : theme.textMuted} />
            <Text style={[styles.modeBtnText, mode === 'video' && { color: theme.bg }]}>AI Video Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, mode === 'chat' && styles.modeBtnActive]} onPress={() => setMode('chat')}>
            <Ionicons name="chatbubble-ellipses" size={14} color={mode === 'chat' ? theme.bg : theme.textMuted} />
            <Text style={[styles.modeBtnText, mode === 'chat' && { color: theme.bg }]}>Virtual Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* ── VIDEO MODE ── */}
        {mode === 'video' && (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.title}>AI Diagnosis</Text>

              {step === 0 && (
                <>
                  <View style={styles.aiBubble}>
                    <Text style={styles.aiBubbleText}>
                      ⚡ Select a category, choose your input method, then record a 30–60 sec video or use a voice description. I'll detect the fault, estimate costs, and recommend repair vs replace.
                    </Text>
                  </View>

                  {/* Input Mode Toggle */}
                  <View style={styles.inputModeRow}>
                    <TouchableOpacity style={[styles.inputModeBtn, inputMode === 'video' && styles.inputModeBtnActive]} onPress={() => setInputMode('video')}>
                      <Ionicons name="videocam" size={16} color={inputMode === 'video' ? theme.accent : theme.textMuted} />
                      <Text style={[styles.inputModeBtnText, inputMode === 'video' && { color: theme.accent }]}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.inputModeBtn, inputMode === 'voice' && styles.inputModeBtnActive]} onPress={() => setInputMode('voice')}>
                      <Ionicons name="mic" size={16} color={inputMode === 'voice' ? theme.accentPurple : theme.textMuted} />
                      <Text style={[styles.inputModeBtnText, inputMode === 'voice' && { color: theme.accentPurple }]}>Voice Note</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.sectionLabel}>Select issue category:</Text>
                  <View style={styles.categoryGrid}>
                    {categories.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        style={[styles.categoryItem, selectedCategory === cat.id && { borderColor: cat.color + '88', backgroundColor: cat.color + '15' }]}
                      >
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                          <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                        </View>
                        <Text style={[styles.categoryLabel, selectedCategory === cat.id && { color: theme.text }]}>{cat.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, !selectedCategory && { opacity: 0.5 }]}
                    onPress={() => selectedCategory && setStep(1)}
                    disabled={!selectedCategory}
                  >
                    <Ionicons name={inputMode === 'video' ? 'videocam' : 'mic'} size={20} color={theme.bg} />
                    <Text style={styles.primaryButtonText}>{inputMode === 'video' ? 'Start Recording' : 'Start Voice Note'}</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 1 && (
                <>
                  {inputMode === 'video' ? (
                    <View style={styles.recordingArea}>
                      <View style={styles.recordButton}>
                        <View style={styles.recordButtonInner} />
                      </View>
                      <Text style={styles.recordingText}>Recording... 0:08</Text>
                      <View style={styles.recBadge}><Text style={styles.recBadgeText}>● REC</Text></View>
                    </View>
                  ) : (
                    <View style={[styles.recordingArea, { backgroundColor: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.3)' }]}>
                      <View style={[styles.recordButton, { borderColor: theme.accentPurple }]}>
                        <Ionicons name="mic" size={32} color={theme.accentPurple} />
                      </View>
                      <Text style={styles.recordingText}>Listening... 0:05</Text>
                      <View style={[styles.recBadge, { backgroundColor: 'rgba(139,92,246,0.85)' }]}>
                        <Text style={styles.recBadgeText}>● VOICE</Text>
                      </View>
                    </View>
                  )}
                  <TouchableOpacity style={styles.primaryButton} onPress={handleAnalyze}>
                    <Text style={styles.primaryButtonText}>Stop & Analyze</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(0)}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 2 && (
                <View style={styles.analyzingContainer}>
                  <View style={styles.analyzingSpinner}>
                    <ActivityIndicator size="large" color={theme.accent} />
                  </View>
                  <Text style={styles.analyzingTitle}>AI Analyzing...</Text>
                  <Text style={styles.analyzingSubtitle}>Computer vision detecting fault patterns</Text>
                  <Card style={{ width: '100%' }}>
                    {['Frame extraction', 'Object detection (YOLO)', 'Issue classification', 'Parts lookup & pricing'].map((label, i) => (
                      <View key={i} style={styles.analysisStep}>
                        {i < 2 ? <Ionicons name="checkmark-circle" size={18} color={theme.success} /> : <ActivityIndicator size="small" color={theme.accent} />}
                        <Text style={[styles.analysisStepText, { color: i < 2 ? theme.text : theme.textMuted }]}>{label}</Text>
                      </View>
                    ))}
                  </Card>
                </View>
              )}

              {step === 3 && (
                <>
                  <View style={styles.resultHeader}>
                    <Ionicons name="checkmark-circle" size={44} color={theme.success} />
                    <Text style={styles.resultTitle}>Fault Identified</Text>
                    <Text style={styles.resultConfidence}>94% Confidence</Text>
                  </View>

                  {/* Appliance Health Score */}
                  <Card style={{ borderColor: 'rgba(0,212,170,0.2)' }}>
                    <View style={styles.row}>
                      <View>
                        <Text style={styles.labelSm}>Detected Issue</Text>
                        <Text style={styles.issueName}>Leaking P-Trap Joint</Text>
                        <Text style={styles.issueDesc}>Worn gasket or loose compression fitting</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: theme.warning }}>62</Text>
                        <Text style={{ fontSize: 10, color: theme.textMuted }}>Health Score</Text>
                      </View>
                    </View>
                  </Card>

                  {/* Cost Estimate */}
                  <Card>
                    <Text style={styles.labelSm}>💰 Fixed Price Breakdown</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      <View style={styles.costBox}>
                        <Text style={styles.costLabel}>Labor</Text>
                        <Text style={styles.costValue}>$120</Text>
                      </View>
                      <View style={styles.costBox}>
                        <Text style={styles.costLabel}>Parts</Text>
                        <Text style={styles.costValue}>$28</Text>
                      </View>
                      <View style={styles.costBox}>
                        <Text style={styles.costLabel}>Fee (15%)</Text>
                        <Text style={styles.costValue}>$22</Text>
                      </View>
                      <View style={[styles.costBox, { borderColor: theme.accent + '44', backgroundColor: 'rgba(0,212,170,0.06)' }]}>
                        <Text style={styles.costLabel}>Fixed</Text>
                        <Text style={[styles.costValue, { color: theme.accent }]}>$170</Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
                      <Text style={{ fontSize: 11, color: theme.textMuted, lineHeight: 16 }}>
                        🔒 Price locked — what you see is what you pay. No surprises.
                      </Text>
                    </View>
                  </Card>

                  {/* Repair vs Replace */}
                  <Card style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
                    <Text style={styles.labelSm}>🔄 Repair vs Replace</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                      <View style={[styles.rvrBox, styles.rvrRepair]}>
                        <Ionicons name="build" size={20} color={theme.success} />
                        <Text style={[styles.rvrLabel, { color: theme.success }]}>✅ Repair</Text>
                        <Text style={styles.rvrCost}>$85–120</Text>
                        <Text style={styles.rvrDesc}>Recommended. Part is still available, appliance is 4 yrs old.</Text>
                      </View>
                      <View style={styles.rvrBox}>
                        <Ionicons name="cart" size={20} color={theme.textMuted} />
                        <Text style={[styles.rvrLabel, { color: theme.textMuted }]}>Replace</Text>
                        <Text style={styles.rvrCost}>$400–800</Text>
                        <Text style={styles.rvrDesc}>Not economical. Appliance has 6+ yrs of life left.</Text>
                      </View>
                    </View>
                  </Card>

                  {/* Eco Impact */}
                  <Card style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
                    <View style={styles.row}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="leaf" size={20} color={theme.success} />
                        <View>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.success }}>Eco-Saving by Repairing</Text>
                          <Text style={{ fontSize: 11, color: theme.textMuted }}>Avoiding landfill & manufacturing waste</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.success }}>$315 saved</Text>
                        <Text style={{ fontSize: 10, color: theme.textMuted }}>12 kg CO₂ reduced</Text>
                      </View>
                    </View>
                  </Card>

                  <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/technicians')}>
                    <Ionicons name="construct" size={20} color={theme.bg} />
                    <Text style={styles.primaryButtonText}>Book a Technician</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(0)}>
                    <Text style={styles.secondaryButtonText}>Diagnose Another Issue</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        )}

        {/* ── CHAT / VIRTUAL DOCTOR MODE ── */}
        {mode === 'chat' && (
          <View style={{ flex: 1 }}>
            <View style={styles.chatHeader}>
              <View style={styles.chatAvatarWrap}>
                <Ionicons name="medical" size={18} color={theme.accentPurple} />
              </View>
              <View>
                <Text style={styles.chatTitle}>Virtual Appliance Doctor</Text>
                <Text style={styles.chatSubtitle}>AI-powered troubleshooting assistant</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <ScrollView ref={scrollRef} style={styles.chatScroll} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
              {chatMessages.map((msg, i) => (
                <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={[styles.bubbleText, msg.role === 'user' && { color: theme.bg }]}>{msg.text}</Text>
                </View>
              ))}
              {chatLoading && (
                <View style={[styles.bubble, styles.bubbleAI]}>
                  <ActivityIndicator size="small" color={theme.accent} />
                </View>
              )}

              {/* Suggestions */}
              {chatMessages.length === 1 && (
                <View style={{ marginTop: spacing.md }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>Try asking:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {chatSuggestions.map(s => (
                      <TouchableOpacity key={s} onPress={() => sendChat(s)} style={styles.suggestion}>
                        <Text style={styles.suggestionText}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask about any appliance issue..."
                placeholderTextColor={theme.textDim}
                value={chatInput}
                onChangeText={setChatInput}
                multiline
                onSubmitEditing={() => sendChat()}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={() => sendChat()} disabled={!chatInput.trim()}>
                <Ionicons name="send" size={18} color={chatInput.trim() ? theme.bg : theme.textDim} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  modeBar: {
    flexDirection: 'row',
    backgroundColor: theme.bgCard,
    margin: spacing.lg,
    marginBottom: 0,
    borderRadius: borderRadius.lg,
    padding: 4,
    gap: 4,
    marginTop: Platform.OS === 'web' ? 67 : spacing.lg,
  },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: borderRadius.md },
  modeBtnActive: { backgroundColor: theme.accent },
  modeBtnText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.lg },
  title: { fontSize: 26, fontWeight: '800', color: theme.text, marginBottom: spacing.lg },
  aiBubble: { backgroundColor: 'rgba(0,212,170,0.08)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.25)', borderRadius: borderRadius.lg, padding: 12, marginBottom: spacing.lg, borderBottomRightRadius: 4 },
  aiBubbleText: { fontSize: 13, color: '#B8D0E8', lineHeight: 20 },
  inputModeRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  inputModeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: borderRadius.md, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  inputModeBtnActive: { borderColor: 'rgba(0,212,170,0.3)', backgroundColor: 'rgba(0,212,170,0.05)' },
  inputModeBtnText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  sectionLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.xl },
  categoryItem: { flex: 1, minWidth: '45%', backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, padding: 14, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  categoryLabel: { fontSize: 13, color: theme.textMuted, fontWeight: '600' },
  primaryButton: { backgroundColor: theme.accent, paddingVertical: 16, borderRadius: borderRadius.xl, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12 },
  primaryButtonText: { color: theme.bg, fontSize: 15, fontWeight: '700' },
  secondaryButton: { backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, borderRadius: borderRadius.xl, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  secondaryButtonText: { color: theme.text, fontSize: 14, fontWeight: '500' },
  recordingArea: { height: 340, backgroundColor: '#050a14', borderRadius: borderRadius.xl, borderWidth: 2, borderColor: 'rgba(0,212,170,0.3)', marginBottom: spacing.xl, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  recordButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  recordButtonInner: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EF4444' },
  recordingText: { color: 'rgba(255,255,255,0.8)', marginTop: 12, fontSize: 13 },
  recBadge: { position: 'absolute', top: 16, backgroundColor: 'rgba(239,68,68,0.85)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  recBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  analyzingContainer: { alignItems: 'center', marginVertical: 20 },
  analyzingSpinner: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,212,170,0.1)', borderWidth: 2, borderColor: 'rgba(0,212,170,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  analyzingTitle: { fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: 8 },
  analyzingSubtitle: { fontSize: 13, color: theme.textMuted, marginBottom: spacing.xl },
  analysisStep: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  analysisStepText: { fontSize: 13 },
  resultHeader: { alignItems: 'center', marginBottom: spacing.xl },
  resultTitle: { fontSize: 24, fontWeight: '800', color: theme.text, marginTop: 10 },
  resultConfidence: { fontSize: 13, color: theme.success, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelSm: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
  issueName: { fontSize: 17, fontWeight: '800', color: theme.text },
  issueDesc: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  costBox: { flex: 1, backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  costLabel: { fontSize: 11, color: theme.textMuted },
  costValue: { fontSize: 15, fontWeight: '800', color: theme.text, marginTop: 4 },
  rvrBox: { flex: 1, backgroundColor: theme.bgElevated, borderRadius: borderRadius.md, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  rvrRepair: { borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'rgba(16,185,129,0.06)' },
  rvrLabel: { fontSize: 13, fontWeight: '700' },
  rvrCost: { fontSize: 14, fontWeight: '800', color: theme.text },
  rvrDesc: { fontSize: 10, color: theme.textMuted, textAlign: 'center', lineHeight: 14 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  chatAvatarWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(139,92,246,0.15)', justifyContent: 'center', alignItems: 'center' },
  chatTitle: { fontSize: 14, fontWeight: '700', color: theme.text },
  chatSubtitle: { fontSize: 11, color: theme.textMuted },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.success, marginLeft: 'auto' },
  chatScroll: { flex: 1 },
  chatContent: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  bubble: { maxWidth: '85%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 },
  bubbleAI: { backgroundColor: theme.bgCard, borderBottomLeftRadius: 4, alignSelf: 'flex-start' },
  bubbleUser: { backgroundColor: theme.accent, borderBottomRightRadius: 4, alignSelf: 'flex-end' },
  bubbleText: { fontSize: 14, color: theme.text, lineHeight: 20 },
  suggestion: { backgroundColor: theme.bgElevated, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  suggestionText: { fontSize: 12, color: theme.accent },
  chatInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: spacing.lg, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingBottom: Platform.OS === 'web' ? 34 : 12 },
  chatInput: { flex: 1, backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, paddingHorizontal: 14, paddingVertical: 10, color: theme.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', maxHeight: 100 },
  chatSendBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center' },
});
