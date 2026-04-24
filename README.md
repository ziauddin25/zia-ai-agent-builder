AI Agent Profile Builder
A web app where you can visually build and configure your own AI agent by combining different profiles, skills, layers, and providers — all through a simple drag-and-drop interface.
Pick your components, drop them onto the canvas, give your agent a name, and save it. Come back later, load it up, and keep building.

Features

Drag-and-drop canvas — drag components from the sidebar and drop them onto the canvas to compose your agent
Accordion sidebar — components organized into 4 clean categories: Profile, Skills, Layers, Provider
Single & multi-select — Profile and Provider are single-select, Skills and Layers support multiple selections
Auto-populated agent name — selecting a profile automatically fills the agent name, fully editable
Reorder on canvas — drag and reorder your selected skills and layers directly on the canvas
Save agents — saved agents persist to localStorage so they're there when you come back
Saved agents drawer — bottom drawer to view all saved agents, load them back onto the canvas, or delete them
Clear all — wipe all saved agents in one click
Session timer — tracks elapsed time since the app was opened
Reload — re-fetches all configuration data on demand
Toast notifications — non-blocking feedback for all user actions
Fully responsive — drag-and-drop on desktop and tablet, tap-to-add via dropdown on mobile


Tech Stack

React 19 with TypeScript
Tailwind CSS v4
shadcn/ui — Button, Input, Accordion
@dnd-kit — drag-and-drop and sortable interactions
Lucide React — icons
localStorage — agent persistence


Getting Started
bash# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

Project Structure
src/
├── types/index.ts              → All TypeScript interfaces
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── accordion.tsx
│   ├── Toast.tsx
│   ├── Header.tsx
│   ├── SidePanel.tsx
│   ├── Canvas.tsx
│   ├── AgentCard.tsx
│   └── SavedAgents.tsx
└── App.tsx

License
MIT
