# S.E.W.A. 🛡️
### Sewer Environment Worker Assistance — Offline-First Sewer Safety Monitoring System

---

## 📌 Overview
**S.E.W.A.** (Sewer Environment Worker Assistance) is a real-time, offline-first safety tracking and environment monitoring system designed specifically to safeguard sewer workers. Operating inside hazard-prone sewer networks, it captures vital environmental metrics (gases, oxygen levels, temperature) and monitors worker vitals/motion using wearable wristbands.

The system connects IoT sensors (like MQ-135, MQ-4, and IMU sensors via Jetson Nano nodes) to a live control dashboard accessible by administrators and a personal dashboard for on-field employees.

---

## 🚀 Key Features

*   **🌐 Multi-Lingual Support (Localization):** Native support for **English**, **Tamil (தமிழ்)**, and **Hindi (हिन्दी)** to ensure local workers can easily read safety warnings in their preferred language.
*   **🚨 Fall Detection & Emergency Alarms:** Utilizing accelerometer and IMU data from wristbands, the app identifies falls immediately and raises global, critical modals overlaying all active screens.
*   **🛠 Real-Time Sensor Telemetry:** Live tracking of hazardous parameters:
    *   **Oxygen levels** (warns if levels drop below 19%, danger below 16%)
    *   **Toxic gases** (Methane, H2S, Carbon Monoxide via MQ sensors in ppm)
    *   **Temperature & Humidity**
*   **🗺 Sewer Network Graph Topology:** Customized SVG-based graph visualization mapping all underground nodes, their connections, and safety zones (Safe, Warning, Danger, Offline).
*   **👥 Dual-Role Architecture:**
    *   **Admin Dashboard:** Comprehensive control panel tracking total nodes, active alerts, worker safety, IMU metrics, GPS positions, and allowing instant alert acknowledgment.
    *   **Employee Dashboard:** Personalized portal displaying assigned nodes, local gas and oxygen status, wristband connectivity, and personal alert notifications.
*   **🔄 Hybrid & Real-Time Syncing:** Integrates **Supabase PostgreSQL Realtime channels** (`public:nodes` & `public:workers`) for prototype nodes, falling back gracefully to mock-generated simulations when offline.

---

## 🛠 Tech Stack

*   **Core:** React Native, Expo (SDK 54), TypeScript
*   **Navigation:** Expo Router (File-based routing)
*   **State Management:** Zustand (for lightweight, reactive state sharing)
*   **Database & Real-time Sync:** Supabase JS Client (Postgres WebSockets)
*   **Localization:** i18next & react-i18next
*   **Styling:** Custom native stylesheets supporting dark/light modes and dynamic state colors.

---

## 📂 Project Structure

```text
├── .expo/               # Expo cache and configuration
├── app/                 # Application entry and screens (Expo Router)
│   ├── (admin)/         # Admin control center stack
│   │   ├── _layout.tsx  # Admin navigation
│   │   ├── alerts.tsx   # Real-time alert list & acknowledgments
│   │   ├── dashboard.tsx# Control center system stats & metrics
│   │   ├── map.tsx      # SVG network map graph
│   │   ├── nodes.tsx    # Searchable/filterable sensor nodes list
│   │   └── workers.tsx  # Detailed worker vitals tracker
│   ├── (employee)/      # Worker personalized stack
│   │   ├── _layout.tsx  # Employee navigation
│   │   ├── dashboard.tsx# Personal safety statuses & sensor inputs
│   │   ├── map.tsx      # SVG network topology map
│   │   └── nodes.tsx    # Monitor assigned nodes
│   ├── _layout.tsx      # Root stack, styling and global fall alert modal
│   ├── index.tsx        # Splash Screen with fade animation
│   ├── language.tsx     # Language Selection (EN, TA, HI)
│   └── login.tsx        # Unified Admin/Employee sign-in portal
├── assets/              # Icons and images
├── components/          # Reusable UI components
│   ├── AlertItem.tsx    # Interactive alert card
│   ├── FallAlertModal.tsx# Global high-priority emergency overlay
│   ├── NetworkGraph.tsx # SVG representation of the sewer network
│   ├── NodeCard.tsx     # Sensor data status card
│   ├── SafetyBadge.tsx  # Color-coded safety category pill
│   ├── SummaryPanel.tsx # Stats grid for the admin dashboard
│   └── WorkerCard.tsx   # IMU and wristband monitor card
├── constants/           # Style definitions and theme configuration
├── hooks/               # Custom hooks
├── locales/             # Translations
│   ├── en.json          # English resources
│   ├── hi.json          # Hindi resources
│   └── ta.json          # Tamil resources
├── services/            # Services layer
│   ├── mockData.ts      # Offline fallback simulations and classifications
│   └── supabase.ts      # Supabase client instantiation
├── store/               # State management
│   └── useStore.ts      # Zustand store coordinating Supabase channels and local state
├── package.json         # Dependency configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🔑 Database Integration (Supabase)

To enable live synchronization from Jetson Nano prototypes or other IoT devices, S.E.W.A. listens to real-time changes in two primary tables:

### 1. `nodes` Table
Stores environmental sensor telemetry from sewer nodes.
```sql
CREATE TABLE public.nodes (
    id integer PRIMARY KEY,
    name text,
    oxygen double precision,       -- e.g., 20.9
    toxicGas double precision,     -- e.g., 12.5 (ppm)
    temperature double precision,  -- e.g., 28.5 (°C)
    humidity double precision,     -- e.g., 65.0 (%)
    status text,                   -- 'safe', 'warning', 'danger'
    updated_at timestamp with time zone DEFAULT now()
);
```

### 2. `workers` Table
Tracks worker wristband connectivity, IMU readings, and locations.
```sql
CREATE TABLE public.workers (
    id text PRIMARY KEY,            -- e.g., 'WRK-001'
    name text,
    status text,                   -- 'active', 'idle', 'fall'
    latitude double precision,
    longitude double precision,
    imu jsonb,                     -- e.g., {"accelerationX": 0.5, "accelerationY": 0.8, "accelerationZ": 9.81}
    nearestNode integer,
    updated_at timestamp with time zone DEFAULT now()
);
```

---

## ⚡ Installation & Setup

### ⚙️ Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
*   [Expo Go](https://expo.dev/client) app installed on your iOS/Android device (optional, for physical device testing)

### 🛠 Steps to Run

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/VishaleeshwarR/S.E.W.A.git
    cd S.E.W.A
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Supabase Setup (Optional):**
    If you'd like to use a different Supabase project, edit `services/supabase.ts` with your credentials:
    ```typescript
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
    ```

4.  **Start the Expo Packager:**
    ```bash
    npm run start
    ```
    or
    ```bash
    npx expo start
    ```

5.  **Run on Emulators or Devices:**
    *   Press `a` to run on an Android emulator.
    *   Press `i` to run on an iOS simulator.
    *   Scan the QR code printed in the terminal using the Expo Go app on a physical device.

---

## 🛡️ Safety Configurations & Thresholds

S.E.W.A. automatically classifies sensor node safety levels using the following safety matrix:

| Metric | Safe | Warning (Caution) | Danger (Critical) |
| :--- | :--- | :--- | :--- |
| **Oxygen ($O_2$)** | $\ge 19\%$ | $< 19\%$ | $< 16\%$ |
| **Toxic Gas** | $\le 25\text{ ppm}$ | $> 25\text{ ppm}$ | $> 50\text{ ppm}$ |
| **Temperature** | $\le 40^\circ\text{C}$ | $> 40^\circ\text{C}$ | $> 50^\circ\text{C}$ |

---

## 🤝 Contributing
Contributions to improve worker safety systems are always welcome! Feel free to open issues or submit pull requests.

## 📄 License
This project is licensed under the MIT License.
