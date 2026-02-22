<div align="center">
  <h1>🏎️ Season Journal</h1>
  <p>A beautiful, functional, and deeply personalized Formula 1 companion app built with React Native and Expo.</p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<hr />

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [📜 Available Scripts](#-available-scripts)
- [🤝 Contributing](#-contributing)

## 🌟 Features

Season Journal brings the thrill of the grid to your fingertips with a suite of interactive and tracking features:

1. **🎯 Race Predictions Bingo:** An interactive bingo board for making and tracking your race weekend predictions. Includes a rich canvas editor to customize your bingo cards with text and images!
2. **🏆 Championship Tracking:** Keep a close eye on the pulse of the season. Track the standings for both the World Drivers' Championship and the Constructors' Championship.
3. **⭐ Favourites:** Curate your personal F1 experience. Save your favourite drivers and teams to access their stats and information quickly.
4. **✨ Glassy UI Aesthetics:** A premium, modern, and aesthetically pleasing interface matching the high-speed, high-tech nature of the sport, completely styled with NativeWind.

## 🛠️ Tech Stack

This project was developed focusing on **React Native Best Practices**, emphasizing modularity, performance, and type safety.

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [Lucide React Native](https://lucide.dev/icons/)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (Package manager)
- Expo Go app on your physical device, or an iOS/Android simulator.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/redotomi/season-journal.git
   cd season-journal
   ```

2. Install the dependencies using `pnpm`:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm start
   ```

## 📂 Project Structure

```text
season-journal/
├── app/             # Expo Router file-based routing configuration
│   └── (tabs)/      # Bottom tab navigation (Bingo, Tracking, Favourites)
├── components/      # Reusable UI components and complex features
│   ├── bingo/       # Bingo grid and canvas editor modal components
│   ├── screens/     # Screen-level components (Drivers, Constructors)
│   └── ui/          # Generic atomic UI components
├── constants/       # Global constants, like theme colors and fonts
├── assets/          # Static assets (images, fonts)
└── scripts/         # Utility scripts for project management
```

## 📜 Available Scripts

- `pnpm start`: Starts the Expo development server.
- `pnpm run android`: Starts the app directly in the Android Emulator.
- `pnpm run ios`: Starts the app directly in the iOS Simulator.
- `pnpm run web`: Starts the app in the web browser.
- `pnpm run lint`: Runs ESLint to find and fix problems in the code.
- `pnpm run reset-project`: Resets the project to a clean slate (useful for templates).

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request if you have ideas for improvements or find any bugs.
