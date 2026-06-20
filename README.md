# Maheera Diamonds

> [!CAUTION]
> **STRICTLY CONFIDENTIAL & PROPRIETARY**
> This repository and its contents are the exclusive property of Maheera Diamonds. Unauthorized distribution, copying, or disclosure of this codebase, via any medium, is strictly prohibited. For internal use only.


![Maheera Diamonds](https://maheeradiamonds.com/og-image.jpg)

Maheera Diamonds is a luxury, ultra-premium e-commerce platform designed to offer an immersive, high-end shopping experience for GIA-certified diamond jewelry. Built with a focus on deep aesthetic symmetry, cinematic animations, and cutting-edge 3D product visualization.

## 💎 Features

### Client Experience
- **Cinematic Landing Page:** A Bvlgari/Cartier-inspired aesthetic featuring a dark Obsidian and Antique Gold palette.
- **Bespoke 3D Customizer Engine:** A WebGL-powered interactive ring customizer utilizing React Three Fiber for real-time metal and diamond modifications.
- **The 4C Masterclass:** An interactive educational module explaining Cut, Color, Clarity, and Carat to prospective buyers.
- **Bespoke Timeline:** A visual step-by-step journey of the bespoke jewelry creation process.
- **VIP Client Portal:** Dedicated secure portal for high-net-worth clients to manage consultations, secure vault items, and invoices.
- **Perfect Symmetry Layout:** Structurally aligned to a strict center-focused grid for an editorial luxury magazine feel.

### Executive Admin Dashboard (`/admin`)
- **Modular Ecosystem:** A completely decoupled admin architecture for internal management.
- **Analytics & CRM:** Interactive data visualization for traffic, conversions, and client relations using Recharts.
- **Logistics & Armored Transit:** Real-time tracking interface for secure Brinks/Malca-Amit shipments.
- **Customizer Validation:** Dedicated admin environment for testing and adjusting the 3D Customizer parameters.

## 🛠 Tech Stack

- **Frontend Core:** React 18, TypeScript, Vite
- **Styling & UI:** Tailwind CSS (v4), Framer Motion (Cinematic Animations), Lucide React (Icons)
- **3D Rendering:** Three.js, React Three Fiber, React Three Drei
- **Data Fetching & State:** React Query (@tanstack/react-query)
- **Backend Infrastructure:** Node.js, Express (API Proxy)
- **Tooling:** ESLint, Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/maheera-diamonds.git
   cd maheera-diamonds
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Express API Server:**
   *The backend runs on port 3001 and serves mock data and analytics.*
   ```bash
   npm run server
   ```

4. **Start the Frontend Development Server:**
   *The Vite frontend proxies API requests to `127.0.0.1:3001`.*
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   - **Client Portal:** `http://localhost:3000`
   - **Admin Dashboard:** `http://localhost:3000/admin`

## 🎨 Architecture & Styling

Maheera Diamonds uses a meticulously maintained set of global CSS variables to control its luxury aesthetic. It leverages a strict layout grid, avoiding arbitrary `text-left` modifiers in favor of a **Perfect Symmetry** (Center-Aligned) configuration across all viewports.

**Primary Luxury Palette:**
- `--color-obsidian`: #0E0E0E
- `--color-antique-gold`: #C9A84C
- `--color-warm-ivory`: #FAF7F2

*(The platform also fully supports swapping to alternative palettes such as "The Modern Royal" or "The Minimalist Avant-Garde" via global variable overrides).*

## 📱 Mobile Responsiveness

The application is heavily optimized for mobile commerce. Product grids dynamically shift to full-width, 1-column layouts on smartphones to maximize the visual impact of high-resolution diamond imagery, while drastically reducing vertical padding to prevent infinite scrolling.

## 📄 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited. 
© 2026 Maheera Diamonds. All rights reserved.