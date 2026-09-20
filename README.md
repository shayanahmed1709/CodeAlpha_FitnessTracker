# CodeAlpha_FitnessTracker

A fitness tracking app for logging daily workouts and monitoring progress, developed as part of the **CodeAlpha App Development Internship** (Task 3).

## 📱 Features

- **Log activities manually** — activity type, duration, calories burned, and steps
- **Today's Summary dashboard** with progress bars tracking steps, calories, and active minutes against daily goals
- **7-day activity chart** showing calories burned per day at a glance
- **Full activity history**, with the ability to delete any past log
- All data saved locally on the device using AsyncStorage — no account or internet connection required
- Clean, simple UI with two screens: Home (log + dashboard) and History (chart + past logs)

## 🛠️ Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **Expo Router** for file-based navigation between Home and History tabs
- **AsyncStorage** (`@react-native-async-storage/async-storage`) for local data persistence

## 📂 Project Structure

```
src/
  app/
    index.tsx     → Home screen (log activity + today's summary with progress bars)
    history.tsx   → History screen (7-day chart + full activity log)
    _layout.tsx   → Root layout and theming
  components/
    app-tabs.tsx  → Bottom tab navigation (Home / History)
```

## ▶️ How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/shayanahmed1709/CodeAlpha_FitnessTracker.git
   cd CodeAlpha_FitnessTracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with the **Expo Go** app (Android/iOS) to run it on your phone, or press `a` for an Android emulator / `i` for an iOS simulator.

## 🎓 About

This project was built as part of the App Development track of the [CodeAlpha](https://www.codealpha.tech) internship program.

---
**Author:** Shayan Ahmed
