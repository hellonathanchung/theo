# theo 🤰

**theo** is a free, ad-free contractions tracking app for pregnancy labor monitoring.

## Features

- 📍 **Track Contractions** - Simple start/end timing with visual feedback
- 💾 **Local Storage** - All data stored on your phone (no cloud, no ads)
- ⏱️ **Real-time Analysis** - Automatic interval calculation between contractions
- 🚗 **Smart Alerts** - Notifications when it's time to go to the birthing center (4-1-1 rule)
- 🎨 **Soothing UI** - Calm, intuitive design with color transitions
- 📋 **History** - View all tracked contractions and intervals
- ⚙️ **Settings** - Save birthing center, doctor, and partner contact info

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Clone or download the project
cd theo

# Install dependencies
npm install

# Start the dev server
npm start

# Choose your platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web
```

## Build for App Stores

### iOS App Store

```bash
npm install -g eas-cli
eas login
eas build:configure
npm run build-ios
```

### Android Play Store

```bash
npm install -g eas-cli
eas login
eas build:configure
npm run build-android
```

## How It Works

1. **Track**: Press "Start Contraction" when labor begins, "End Contraction" when it ends
2. **Monitor**: App tracks intervals between contractions in real-time
3. **Alert**: When contractions are < 5 minutes apart for sustained period, you get an alert
4. **Go**: Head to your birthing center based on the alerts

## Color Meanings

- 🟣 **Lavender** - Starting/monitoring contractions
- 🟠 **Orange** - Contractions quickening (< 10 min apart)
- 🔴 **Coral** - Time to go to birthing center (< 5 min apart)

## Technology

- **React Native** - iOS and Android in one codebase
- **Expo** - Easy local testing and deployment
- **TypeScript** - Type-safe development
- **AsyncStorage** - Local phone storage (no internet required)
- **Expo Notifications** - Push notifications for alerts

## Privacy

- ✅ No personal data collected
- ✅ No cloud storage (everything stays on your phone)
- ✅ No ads
- ✅ Free forever

## License

MIT

---

Built with 💙 for expecting parents
