# Streak Visualization Frontend

A React application for visualizing daily activity streaks with a clean, modern interface.

## Features

- **Dynamic Streak Display**: Shows current streak count based on consecutive completed days
- **Weekly View**: Displays the last 7 days with visual indicators for completed/incomplete activities
- **Real-time Data**: Fetches streak data from API with loading and error states
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Data Format

The application expects streak data in the following format:

```json
{
  "activitiesToday": 1,
  "total": 1,
  "days": [
    {
      "date": "2024-02-26",
      "activities": 1,
      "state": "COMPLETED"
    },
    {
      "date": "2024-02-27",
      "activities": 0,
      "state": "INCOMPLETE"
    }
  ]
}
```

### API Integration

#### Development Mode

The application uses a mock API service for development. The mock service generates realistic data with current dates.

#### Production Mode

To connect to your actual API:

1. Open `src/hooks/useStreaks.ts`
2. Replace the mock service call with your actual API endpoint:

```typescript
// Replace this line:
const data = await mockApiService.getStreaks();

// With your actual API call:
const response = await fetch('/api/streaks');
if (!response.ok) {
  throw new Error(`Failed to fetch streaks: ${response.statusText}`);
}
const data: StreakData = await response.json();
```

### Components

#### StreakCard

The main component that displays the 7-day streak visualization:

- Shows each day with a circle indicator
- Completed days have filled circles with checkmarks
- Current day is highlighted with a different color
- Incomplete days show empty circles

#### useStreaks Hook

Custom React hook that manages streak data:

- Fetches data from API
- Handles loading and error states
- Provides refetch functionality
- TypeScript support with proper interfaces

### Customization

#### Colors

The application uses Tailwind CSS classes. To customize colors:

- Primary color: `indigo-600`, `indigo-400`
- Background: `[#F7F5F0]`
- Text: `[#1F2937]`

#### Styling

All styles are defined using Tailwind CSS classes. You can modify the appearance by updating the className props in the components.

## File Structure

```
src/
├── components/
│   └── StreakCard.tsx          # Main streak visualization component
├── hooks/
│   └── useStreaks.ts           # Custom hook for data fetching
├── services/
│   └── mockApi.ts              # Mock API service for development
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mock Data

The mock API service generates data with:
- Current dates (last 7 days)
- Random completion patterns
- Realistic activity counts
- Proper TypeScript interfaces

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Update the API endpoint in `useStreaks.ts` to point to your production API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
