# FixFair - Quick Start Guide (15 minutes to first build)

## ⚡ Ultra-Fast Setup

### Step 1: Clone & Install (2 min)
```bash
git clone https://github.com/fixfair/mobile-app.git
cd fixfair
npm install
```

### Step 2: Setup Expo (1 min)
```bash
npm install -g eas-cli expo-cli
eas login  # Create free Expo account at expo.dev
```

### Step 3: Configure Environment (2 min)
```bash
# Copy example config
cp .env.example .env

# Edit with your keys (or skip for development)
nano .env

# Minimum required for development:
# REACT_APP_ENVIRONMENT=development
# REACT_APP_API_BASE_URL=http://localhost:3000
```

### Step 4: Start Development (1 min)
```bash
npm start
# Opens Expo Go dashboard in terminal

# Press:
# a = Android emulator
# i = iOS simulator
# w = Web browser
# j = Debugger
# r = Reload app
# q = Quit
```

### Step 5: First Build (9 min)
```bash
# Create preview build for testing
eas build --platform android --profile preview

# Check build status
eas build:list

# Download and test the APK
# Install on device: adb install -r FixFair.apk
```

## 🎯 Development Commands

```bash
# Start development server
npm start

# Format code
npm run format

# Check for errors
npm run lint

# Type checking
npm run type-check

# Run tests
npm test

# Build for preview
npm run build:preview

# Build for production
npm run build:production
```

## 📱 Testing on Real Device

### Android Device
```bash
# 1. Enable USB Debugging
#    Settings > Developer Options > USB Debugging

# 2. Connect device via USB
adb devices  # Should list your device

# 3. Build and install
eas build --platform android --profile preview --wait
adb install -r path/to/FixFair.apk

# 4. Test on device
# App should appear in your app drawer
```

### Android Emulator
```bash
# Launch emulator first
~/Android/Sdk/emulator/emulator -avd Pixel_4_API_30

# Then build
eas build --platform android --profile preview

# Auto installs when build completes
```

## 🚀 One-Command Build & Submit

```bash
# Full production workflow
npm run deploy

# This runs:
# 1. npm run lint          (check for errors)
# 2. npm run type-check    (verify TypeScript)
# 3. npm test              (run unit tests)
# 4. eas build (production) (build for store)
# 5. eas submit (android)  (auto-submit to Play Store)
```

## ✅ Pre-Launch Checklist (30 min)

```bash
# 1. Code Quality Check (5 min)
npm run lint
npm run type-check
npm test

# 2. Build Test (10 min)
eas build --platform android --profile preview

# 3. Feature Verification (10 min)
# [ ] Video recording works
# [ ] AI analysis shows results
# [ ] Technician list displays
# [ ] Booking flow completes
# [ ] Payment flow works
# [ ] Job tracking screen renders

# 4. Metadata Review (5 min)
# [ ] App icon looks good (icon.png)
# [ ] App name correct in app.json
# [ ] Description matches brand
# [ ] Privacy policy URL valid
# [ ] Screenshots are high quality

# 5. Sign & Submit (5 min - automated)
npm run deploy
```

## 🔑 Getting Your Keys (if needed)

### Firebase Setup
```bash
# 1. Go to https://console.firebase.google.com
# 2. Create new project: "fixfair-prod"
# 3. Add Android app (package: com.fixfair.app)
# 4. Download google-services.json
# 5. Copy to android/app/

# Then add to .env:
REACT_APP_FIREBASE_PROJECT_ID=fixfair-prod
REACT_APP_FIREBASE_API_KEY=...
```

### Stripe Setup
```bash
# 1. Go to https://dashboard.stripe.com
# 2. Get Live Publishable Key: pk_live_...
# 3. Add to .env:
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Google Maps API
```bash
# 1. Go to Google Cloud Console
# 2. Create project
# 3. Enable Maps SDK for Android
# 4. Create Android API key
# 5. Add to .env:
REACT_APP_GOOGLE_MAPS_API_KEY=...
```

## 🐛 Troubleshooting

### Build Fails: "Keystore not found"
```bash
# Generate new keystore
keytool -genkey -v -keystore ~/fixfair-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias fixfair-key

# Configure in EAS
eas credentials
```

### App Won't Install: "App not installed"
```bash
# Clear previous install
adb uninstall com.fixfair.app

# Try fresh install
eas build --platform android --profile preview --clear-cache
```

### Video Upload Too Slow
```bash
# Check network
adb shell ping 8.8.8.8

# Use WiFi instead of mobile data
# Check video size < 20MB

# Enable video compression in settings
```

### Payment Flow Not Working
```bash
# Verify Stripe key in console
# https://dashboard.stripe.com

# Check test mode enabled
# Verify webhook endpoints configured
```

## 📊 Monitoring Post-Launch

### Real-Time Dashboard
```bash
# Firebase Console (Crashes & Errors)
# https://console.firebase.google.com/project/fixfair-prod/crashlytics

# Google Play Console (User Metrics)
# https://play.google.com/console

# Datadog (Performance Monitoring)
# https://app.datadoghq.com/dashboard
```

### Check App Health
```bash
# Crashes (should be < 1%)
firebase:crashlytics:get-status

# Performance (should be < 3s startup)
firebase:performance:list

# User Engagement (track DAU)
firebase:analytics:report
```

## 🎓 Learn More

- **Full Docs**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Architecture**: See [README.md](./README.md)
- **API Docs**: See [docs/API.md](./docs/API.md)
- **Troubleshooting**: See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

## 🚀 From Code to Store: Complete Timeline

```
Day 1: Setup & Development
├─ Clone repo (2 min)
├─ Install dependencies (3 min)
├─ Configure environment (2 min)
└─ Test on emulator (5 min)

Day 2-7: Feature Testing
├─ Verify all screens
├─ Test video recording
├─ Test payment flow
└─ Bug fixes & iterations

Day 8: Production Build
├─ Run full test suite
├─ Create signed APK
└─ Generate AAB for store

Day 9: Store Submission
├─ Create Play Console listing
├─ Add screenshots & graphics
├─ Set privacy policy & ratings
└─ Submit for review

Day 10-12: Under Review
├─ Monitor submission status
├─ Prepare customer support
└─ Create announcement

Day 13: Live!
├─ App goes live on Play Store
├─ Monitor crashes & ratings
├─ Respond to user reviews
└─ Watch download metrics climb 📈
```

## 🎉 Success Criteria

Your launch is successful when:
- ✅ App appears on Play Store search
- ✅ 100+ downloads in first day
- ✅ 4.0+ star rating
- ✅ < 1% crash rate
- ✅ Positive user reviews

## 🆘 Still Need Help?

```
Dev Issues:
→ Check docs/TROUBLESHOOTING.md
→ Email: dev-support@fixfair.com

Build Issues:
→ Check EAS build logs
→ Run: eas build --platform android --profile preview --print-logs

Store Issues:
→ Check Google Play Developer policies
→ Review submission feedback in Play Console
```

---

**Next Steps:**
1. Run `npm start`
2. Test on device
3. Run `eas build --platform android --profile preview`
4. When ready: `npm run deploy`
5. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for store submission

**Good luck! 🚀**
