# Streak Visualization Frontend

A React application for visualizing streaks

## Features

- **Dynamic Streak Display**: Shows current streak count based on consecutive completed days
- **Weekly View**: Displays the last 7 days with visual indicators for completed/incomplete activities
- **Real-time Data**: Fetches streak data from API with loading and error states
- **Responsive Design**: Works on desktop and mobile devices

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
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

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Update the API endpoint in `useStreaks.ts` to point to your production API


## Dev notes:

The example backend data can be tested with the following urls:

`http://localhost:5173/2024-02-07`

`http://localhost:5173/2024-02-17`

`http://localhost:5173/2024-02-27`
