import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, spacing, borderRadius } from '@/constants/theme';
import { Card, Badge } from '@/components/Card';
import { useUser } from '@/contexts/UserContext';

type DiagnoseMode = 'video' | 'chat';

const categories = [
  { id: 'plumbing',   label: 'Plumbing',   icon: 'water',    color: theme.accentBlue },
  { id: 'hvac',       label: 'HVAC',        icon: 'snow',     color: theme.accentWarm },
  { id: 'electrical', label: 'Electrical',  icon: 'flash',    color: theme.warning },
  { id: 'appliance',  label: 'Appliance',   icon: 'settings', color: theme.accentPurple },
  { id: 'roofing',    label: 'Roofing',     icon: 'home',     color: theme.success },
  { id: 'general',    label: 'General',     icon: 'hammer',   color: theme.accent },
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
  noise: "A noisy fridge usually points to: 🔧 Condenser fan rattling when compressor runs. ❄️ Evaporator fan squealing or humming. 🧊 Ice maker clicking/knocking. Most are DIY fixable! Estimated repair: $40–$120. Want me to find a technician nearby?",
  wash: "A washing machine that won't start is often caused by: 🔌 Power/door latch issue (check the door is fully closed). ⚡ Blown thermal fuse (common after overheating). 🔧 Faulty lid switch on top-loaders. Repair estimate: $85–$200.",
  faucet: "A dripping faucet is almost always a worn O-ring or washer. Fix: 1. Turn off supply valve. 2. Remove handle. 3. Replace rubber washer or cartridge. Parts: $5–$25. Labor if hired: $85–$120. DIY saves ~$100!",
  ac: "AC not cooling? Try: 🌡️ Replace dirty air filter ($10 fix). 🧊 Let a frozen evaporator coil thaw 2–3 hrs. 📉 Low refrigerant needs a licensed HVAC tech. Start with the filter — it fixes 30% of AC issues.",
  breaker: "A tripping breaker means: ⚡ Overloaded circuit — too many devices. 🔥 Short circuit — damaged wire. ⚠️ Ground fault — common in wet areas. Unplug devices, reset breaker. If it trips again immediately, call an electrician — safety issue!",
};

function getAIResponse(text: string): string {
  const l = text.toLowerCase();
  if (l.includes('noise') || l.includes('fridge') || l.includes('refrigerator')) return CHAT_RESPONSES.noise;
  if (l.includes('wash')) return CHAT_RESPONSES.wash;
  if (l.includes('faucet') || l.includes('drip') || l.includes('leak')) return CHAT_RESPONSES.faucet;
  if (l.includes('ac') || l.includes('air') || l.includes('cool')) return CHAT_RESPONSES.ac;
  if (l.includes('breaker') || l.includes('circuit') || l.includes('electric')) return CHAT_RESPONSES.breaker;
  return CHAT_RESPONSES.default;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function DiagnoseScreen() {
  const router = useRouter();
  const { addDiagnosis, appliances } = useUser();

  const [mode, setMode] = useState<DiagnoseMode>('video');
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'video' | 'voice'>('video');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingDone, setRecordingDone] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "👋 Hi! I'm your Virtual Appliance Doctor. Describe any home problem and I'll diagnose it, estimate costs, and recommend whether to repair or replace. What's going wrong?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoContainerRef = useRef<View>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const attachVideoPreview = useCallback((stream: MediaStream) => {
    if (Platform.OS !== 'web') return;
    setTimeout(() => {
      const node = videoContainerRef.current as unknown as HTMLDivElement | null;
      if (!node) return;
      const existing = node.querySelector('video');
      if (existing) return;
      const videoEl = document.createElement('video');
      videoEl.srcObject = stream;
      videoEl.autoplay = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:16px;';
      node.style.position = 'relative';
      node.appendChild(videoEl);
    }, 200);
  }, []);

  const startRecording = async () => {
    setPermissionDenied(false);
    chunksRef.current = [];

    if (Platform.OS !== 'web') {
      setStep(1);
      return;
    }

    try {
      const constraints = inputMode === 'video'
        ? { video: { facingMode: 'environment' }, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (inputMode === 'video') {
        attachVideoPreview(stream);
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm',
      });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current = recorder;
      recorder.start(250);

      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
      setStep(1);
    } catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
      } else {
        setStep(1);
      }
    }
  };

  const stopAndAnalyze = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const type = inputMode === 'video' ? 'video/webm' : 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setRecordingDone(true);
        finalizeDiagnosis(url);
      };
      mediaRecorderRef.current.stop();
    } else {
      finalizeDiagnosis(undefined);
    }
    stopStream();
    setStep(2);
  };

  const finalizeDiagnosis = (mediaUrl?: string) => {
    setTimeout(() => {
      const cat = categories.find(c => c.id === selectedCategory);
      addDiagnosis({
        id: `DX-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: cat?.label ?? 'General',
        issue: 'Leaking P-Trap Joint',
        confidence: 94,
        fixedPrice: 170,
        ...(inputMode === 'audio' ? { audioUrl: mediaUrl } : { videoUrl: mediaUrl }),
      });
      setStep(3);
    }, 2500);
  };

  const cancelRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
    stopStream();
    setRecordingTime(0);
    setStep(0);
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

  const resetToStart = () => {
    setStep(0);
    setSelectedCategory(null);
    setRecordingTime(0);
    setRecordingDone(false);
    setPermissionDenied(false);
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

        {/* ── VIDEO / AUDIO SCAN MODE ── */}
        {mode === 'video' && (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.title}>AI Diagnosis</Text>

              {/* Step 0 — Category + input mode selection */}
              {step === 0 && (
                <>
                  <View style={styles.aiBubble}>
                    <Text style={styles.aiBubbleText}>
                      ⚡ Pick a category and record a 30–60 sec video (or voice note). I'll detect the fault, estimate the fixed cost, and tell you whether to repair or replace.
                    </Text>
                  </View>

                  {permissionDenied && (
                    <View style={styles.permissionBanner}>
                      <Ionicons name="mic-off" size={16} color={theme.danger} />
                      <Text style={styles.permissionText}>
                        Camera/microphone access was denied. Please allow access in your browser settings and try again.
                      </Text>
                    </View>
                  )}

                  <View style={styles.inputModeRow}>
                    <TouchableOpacity
                      style={[styles.inputModeBtn, inputMode === 'video' && styles.inputModeBtnActive]}
                      onPress={() => setInputMode('video')}
                    >
                      <Ionicons name="videocam" size={16} color={inputMode === 'video' ? theme.accent : theme.textMuted} />
                      <Text style={[styles.inputModeBtnText, inputMode === 'video' && { color: theme.accent }]}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.inputModeBtn, inputMode === 'voice' && styles.inputModeBtnActive]}
                      onPress={() => setInputMode('voice')}
                    >
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
                    style={[styles.primaryButton, !selectedCategory && { opacity: 0.45 }]}
                    onPress={startRecording}
                    disabled={!selectedCategory}
                  >
                    <Ionicons name={inputMode === 'video' ? 'videocam' : 'mic'} size={20} color={theme.bg} />
                    <Text style={styles.primaryButtonText}>
                      {inputMode === 'video' ? 'Start Camera & Record' : 'Start Voice Note'}
                    </Text>
                  </TouchableOpacity>

                  {Platform.OS === 'web' && (
                    <Text style={styles.permissionHint}>
                      Your browser will ask for {inputMode === 'video' ? 'camera and microphone' : 'microphone'} access.
                    </Text>
                  )}
                </>
              )}

              {/* Step 1 — Recording */}
              {step === 1 && (
                <>
                  {inputMode === 'video' ? (
                    <View style={styles.recordingArea} ref={videoContainerRef}>
                      <View style={styles.recBadge}>
                        <Text style={styles.recBadgeText}>● REC {formatTime(recordingTime)}</Text>
                      </View>
                      <View style={styles.cameraPlaceholder}>
                        <View style={styles.recordButton}>
                          <View style={styles.recordButtonInner} />
                        </View>
                        <Text style={styles.recordingText}>Recording… {formatTime(recordingTime)}</Text>
                        <Text style={styles.recordingHint}>Point camera at the issue</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.recordingArea, { backgroundColor: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.3)' }]}>
                      <View style={[styles.recBadge, { backgroundColor: 'rgba(139,92,246,0.85)' }]}>
                        <Text style={styles.recBadgeText}>● VOICE {formatTime(recordingTime)}</Text>
                      </View>
                      <View style={styles.cameraPlaceholder}>
                        <View style={[styles.recordButton, { borderColor: theme.accentPurple }]}>
                          <Ionicons name="mic" size={32} color={theme.accentPurple} />
                        </View>
                        <Text style={styles.recordingText}>Listening… {formatTime(recordingTime)}</Text>
                        <Text style={styles.recordingHint}>Describe the problem clearly</Text>
                        {/* Animated waveform dots */}
                        <View style={styles.waveform}>
                          {[3, 6, 9, 5, 8, 4, 7, 3, 9, 6, 4, 8].map((h, i) => (
                            <View key={i} style={[styles.waveBar, { height: h * 3, backgroundColor: theme.accentPurple + 'AA' }]} />
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity style={styles.primaryButton} onPress={stopAndAnalyze}>
                    <Ionicons name="stop-circle" size={20} color={theme.bg} />
                    <Text style={styles.primaryButtonText}>Stop & Analyze</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={cancelRecording}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Step 2 — Analyzing */}
              {step === 2 && (
                <View style={styles.analyzingContainer}>
                  <View style={styles.analyzingSpinner}>
                    <ActivityIndicator size="large" color={theme.accent} />
                  </View>
                  <Text style={styles.analyzingTitle}>AI Analyzing…</Text>
                  <Text style={styles.analyzingSubtitle}>Computer vision detecting fault patterns</Text>
                  <Card style={{ width: '100%' }}>
                    {['Frame extraction', 'Object detection (YOLO)', 'Issue classification', 'Parts lookup & pricing'].map((label, i) => (
                      <View key={i} style={styles.analysisStep}>
                        {i < 2
                          ? <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                          : <ActivityIndicator size="small" color={theme.accent} />}
                        <Text style={[styles.analysisStepText, { color: i < 2 ? theme.text : theme.textMuted }]}>{label}</Text>
                      </View>
                    ))}
                  </Card>
                </View>
              )}

              {/* Step 3 — Result */}
              {step === 3 && (
                <>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultIconWrap}>
                      <Ionicons name="checkmark-circle" size={36} color={theme.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultTitle}>Fault Identified</Text>
                      <Text style={styles.resultConfidence}>94% confidence · {categories.find(c => c.id === selectedCategory)?.label ?? 'General'}</Text>
                    </View>
                    <Badge variant="green">AI Result</Badge>
                  </View>

                  {recordingDone && (
                    <View style={styles.recordingDoneBadge}>
                      <Ionicons name={inputMode === 'video' ? 'videocam' : 'mic'} size={13} color={theme.accent} />
                      <Text style={{ fontSize: 12, color: theme.accent, fontWeight: '600' }}>
                        {inputMode === 'video' ? 'Video' : 'Audio'} recorded · {formatTime(recordingTime)}s
                      </Text>
                    </View>
                  )}

                  <Card style={{ borderColor: 'rgba(0,212,170,0.2)', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={styles.labelSm}>Detected Issue</Text>
                        <Text style={styles.issueName}>Leaking P-Trap Joint</Text>
                        <Text style={styles.issueDesc}>Worn gasket or loose compression fitting</Text>
                      </View>
                      <View style={{ alignItems: 'center', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 10, padding: 8 }}>
                        <Text style={{ fontSize: 26, fontWeight: '800', color: theme.warning, lineHeight: 30 }}>62</Text>
                        <Text style={{ fontSize: 9, color: theme.textMuted }}>Health</Text>
                      </View>
                    </View>
                  </Card>

                  <Card style={{ marginBottom: 10 }}>
                    <Text style={styles.labelSm}>💰 Fixed Price Breakdown</Text>
                    <View style={{ marginTop: 10, gap: 8 }}>
                      {[
                        { label: 'Labour', value: '$120' },
                        { label: 'Parts & materials', value: '$28' },
                        { label: 'Platform fee (15%)', value: '$22' },
                      ].map(row => (
                        <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 13, color: theme.textMuted }}>{row.label}</Text>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>{row.value}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 10 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>Fixed Total</Text>
                      <Text style={{ fontSize: 22, fontWeight: '800', color: theme.accent }}>$170</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 8 }}>
                      🔒 Price locked — what you see is what you pay.
                    </Text>
                  </Card>

                  <Card style={{ borderColor: 'rgba(59,130,246,0.2)', marginBottom: 10 }}>
                    <Text style={[styles.labelSm, { marginBottom: 10 }]}>🔄 Repair vs Replace</Text>
                    <View style={[styles.rvrRow, { borderColor: 'rgba(16,185,129,0.25)', backgroundColor: 'rgba(16,185,129,0.05)' }]}>
                      <Ionicons name="build" size={18} color={theme.success} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.success }}>✅ Repair — Recommended</Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Part available · Appliance is only 4 yrs old</Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: theme.success }}>$85–120</Text>
                    </View>
                    <View style={styles.rvrRow}>
                      <Ionicons name="cart" size={18} color={theme.textDim} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textMuted }}>Replace</Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Not economical · 6+ yrs of life left</Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: theme.textMuted }}>$400–800</Text>
                    </View>
                  </Card>

                  <Card style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name="leaf" size={18} color={theme.success} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.success }}>Eco-Saving by Repairing</Text>
                        <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Avoiding landfill & manufacturing waste</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: theme.success }}>$315</Text>
                        <Text style={{ fontSize: 10, color: theme.textMuted }}>12 kg CO₂</Text>
                      </View>
                    </View>
                  </Card>

                  <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/technicians')}>
                    <Ionicons name="construct" size={20} color={theme.bg} />
                    <Text style={styles.primaryButtonText}>Book a Technician</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={resetToStart}>
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
              <View style={{ flex: 1 }}>
                <Text style={styles.chatTitle}>Virtual Appliance Doctor</Text>
                <Text style={styles.chatSubtitle}>AI-powered troubleshooting assistant</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.chatScroll}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            >
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
                placeholder="Ask about any appliance issue…"
                placeholderTextColor={theme.textDim}
                value={chatInput}
                onChangeText={setChatInput}
                multiline
                onSubmitEditing={() => sendChat()}
              />
              <TouchableOpacity
                style={[styles.chatSendBtn, !chatInput.trim() && { opacity: 0.5 }]}
                onPress={() => sendChat()}
                disabled={!chatInput.trim()}
              >
                <Ionicons name="send" size={18} color={theme.bg} />
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
    marginTop: Platform.OS === 'web' ? 60 : spacing.lg,
  },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: borderRadius.md },
  modeBtnActive: { backgroundColor: theme.accent },
  modeBtnText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: spacing.md },
  aiBubble: { backgroundColor: 'rgba(0,212,170,0.08)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.25)', borderRadius: borderRadius.lg, padding: 12, marginBottom: spacing.md, borderBottomRightRadius: 4 },
  aiBubbleText: { fontSize: 13, color: '#B8D0E8', lineHeight: 20 },
  permissionBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', borderRadius: borderRadius.lg, padding: 12, marginBottom: spacing.md },
  permissionText: { flex: 1, fontSize: 12, color: theme.danger, lineHeight: 17 },
  permissionHint: { fontSize: 11, color: theme.textDim, textAlign: 'center', marginTop: 8 },
  inputModeRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  inputModeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: borderRadius.md, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  inputModeBtnActive: { borderColor: 'rgba(0,212,170,0.3)', backgroundColor: 'rgba(0,212,170,0.05)' },
  inputModeBtnText: { fontSize: 13, fontWeight: '600', color: theme.textMuted },
  sectionLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.xl },
  categoryItem: { flex: 1, minWidth: '30%', backgroundColor: theme.bgCard, borderRadius: borderRadius.lg, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  categoryIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  categoryLabel: { fontSize: 12, color: theme.textMuted, fontWeight: '600' },
  primaryButton: { backgroundColor: theme.accent, paddingVertical: 15, borderRadius: borderRadius.xl, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12 },
  primaryButtonText: { color: theme.bg, fontSize: 15, fontWeight: '700' },
  secondaryButton: { backgroundColor: theme.bgCard, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingVertical: 13, borderRadius: borderRadius.xl, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  secondaryButtonText: { color: theme.text, fontSize: 14, fontWeight: '500' },
  recordingArea: {
    height: 240,
    backgroundColor: '#050a14',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: 'rgba(0,212,170,0.3)',
    marginBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraPlaceholder: { justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  recordButton: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  recordButtonInner: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EF4444' },
  recordingText: { color: 'rgba(255,255,255,0.85)', marginTop: 10, fontSize: 14, fontWeight: '600' },
  recordingHint: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 },
  recBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(239,68,68,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, zIndex: 2 },
  recBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 12 },
  waveBar: { width: 3, borderRadius: 2 },
  analyzingContainer: { alignItems: 'center', marginVertical: 20 },
  analyzingSpinner: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,212,170,0.1)', borderWidth: 2, borderColor: 'rgba(0,212,170,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  analyzingTitle: { fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: 8 },
  analyzingSubtitle: { fontSize: 13, color: theme.textMuted, marginBottom: spacing.xl },
  analysisStep: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  analysisStepText: { fontSize: 13 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, backgroundColor: 'rgba(16,185,129,0.06)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', borderRadius: borderRadius.xl, padding: 14 },
  resultIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(16,185,129,0.15)', justifyContent: 'center', alignItems: 'center' },
  resultTitle: { fontSize: 16, fontWeight: '800', color: theme.text },
  resultConfidence: { fontSize: 11, color: theme.success, marginTop: 2 },
  recordingDoneBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,212,170,0.08)', borderRadius: borderRadius.lg, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 10 },
  labelSm: { fontSize: 11, color: theme.textMuted, marginBottom: 4, letterSpacing: 0.3 },
  issueName: { fontSize: 16, fontWeight: '800', color: theme.text },
  issueDesc: { fontSize: 12, color: theme.textMuted, marginTop: 3 },
  rvrRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 8 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  chatAvatarWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(139,92,246,0.15)', justifyContent: 'center', alignItems: 'center' },
  chatTitle: { fontSize: 14, fontWeight: '700', color: theme.text },
  chatSubtitle: { fontSize: 11, color: theme.textMuted },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.success },
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
