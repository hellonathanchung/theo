# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**theo** is a React Native Expo contractions tracking app for pregnancy labor monitoring. Built for local phone storage and iOS/Android app store deployment—free and ad-free.

## Build & Development

```bash
# Install dependencies
npm install

# Start Expo dev server (choose platform when prompted)
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Build for app store (requires EAS account setup)
npm run build-ios
npm run build-android
```

## Project Structure

```
theo/
├── src/
│   ├── App.tsx                 # Main app entry with navigation
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── styles/
│   │   └── theme.ts            # Soothing color theme & spacing
│   ├── services/
│   │   ├── storageService.ts   # AsyncStorage for local persistence
│   │   ├── notificationService.ts # Expo notifications & alerts
│   │   └── analysisService.ts  # Contraction interval analysis
│   └── screens/
│       ├── HomeScreen.tsx      # Track contractions
│       ├── HistoryScreen.tsx   # View all contractions
│       └── SettingsScreen.tsx  # Settings & contact info
├── index.js                    # Entry point
├── package.json                # Dependencies
├── app.json                    # Expo configuration
└── tsconfig.json               # TypeScript config
```

## Features

- ✅ **Track Contractions** - Start/end timing with pulsing visual feedback
- ✅ **Local Storage** - All data stored on phone using AsyncStorage
- ✅ **Real-time Analysis** - Calculates intervals between contractions
- ✅ **Smart Alerts** - Notifications when contractions meet 4-1-1 rule (< 5 min apart)
- ✅ **Soothing UI** - Calm color transitions (lavender → orange → coral) based on urgency
- ✅ **History View** - See all contractions with intervals and delete individual entries
- ✅ **Settings** - Save birthing center, doctor, and partner phone numbers
- ✅ **Intuitive Navigation** - 3-tab bottom navigation (Track, History, Settings)

## Color Theme (Calm & Soothing)

- **Primary**: Soft lavender (#E8D5F2)
- **Secondary**: Warm cream (#F5E6D3)
- **Accent**: Muted purple (#D4A5D4)
- **Success**: Soft green (#A8D8A8)
- **Warning**: Soft orange (#F4B183) - contractions quickening
- **Danger**: Soft coral (#E89B9B) - time to go
- **Background**: Off-white (#FEFDFB)

## Contraction Alerts

- **Calm** - No urgent contractions
- **Monitor** - Contractions < 15 min apart
- **Quickening** - Contractions < 10 min apart (⚡ alert)
- **Go** - Contractions < 5 min apart (🚗 alert to head to birthing center)

## Tech Stack

- React Native 0.73.0
- Expo SDK 50.0
- TypeScript 5.3
- AsyncStorage for local persistence
- Expo Notifications for push alerts
- React Native with Animated for smooth UI transitions

## App Store Deployment

### Setup EAS Account
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build & Submit
```bash
# Build for iOS App Store
eas build --platform ios --auto-submit

# Build for Google Play Store
eas build --platform android --auto-submit
```

## Notes

- App is designed for portrait mode only (pregnancy labor monitoring)
- Contractions are stored permanently on device until manually cleared
- Alert threshold configurable in Settings (default 5 minutes)
- Free and ad-free by design
