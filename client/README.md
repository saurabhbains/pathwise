# Pathwise Client

React frontend for the Pathwise AI-powered coaching simulation platform.

## Features

- **Split-Screen Interface**: Chat on the left, Coach Dashboard on the right
- **Real-Time Chat**: Interactive conversation with AI-powered employee agent
- **Coach Dashboard**:
  - Live metrics (Psychological Safety, Legal Risk, Clarity of Feedback)
  - Shadow Channel feed showing hidden agent thoughts and HR flags
- **Responsive Design**: Built with Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# From the client directory
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat UI
│   │   ├── CoachDashboard.tsx     # Dashboard container
│   │   ├── MetricCard.tsx         # Individual metric display
│   │   └── ShadowFeed.tsx         # Shadow channel feed
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Notes

- WebSocket integration is currently pending
- The app currently uses simulated responses for development
- Backend server should be running on `http://localhost:3000` for full functionality
