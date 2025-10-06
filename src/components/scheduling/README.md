# Scheduling Selector Component

## Overview

The `SchedulingSelector` component (formerly `RescheduleSelector`) is a comprehensive React component for selecting appointment time slots with optional preferences for time windows, teams, and technicians. This component has been refactored into smaller, focused subcomponents for better maintainability and reusability.

## Component Architecture

```
src/components/scheduling/
├── SchedulingSelector.tsx        # Main orchestrator component
├── CalendarHeader.tsx            # Week navigation and date picker
├── WeekGrid.tsx                  # Calendar grid with day columns
├── TimeSlotButton.tsx            # Individual time slot button
├── SelectedAppointmentCard.tsx   # Summary card for selected appointment
├── types.ts                      # TypeScript type definitions
├── index.ts                      # Public exports
├── Preferences/
│   ├── TimeWindowSelector.tsx    # Time window dropdown
│   ├── TeamSelector.tsx          # Team selection dropdown
│   └── TechnicianSelector.tsx    # Technician selection dropdown
└── hooks/
    ├── useOutsideClick.ts        # Generic outside-click handler
    └── useTimezoneFormat.ts      # Timezone formatting utilities
```

## Main Exports

The component is exported from `src/components/SchedulingSelector.tsx` which provides both the new name and backward compatibility:

```typescript
import { SchedulingSelector } from '@aspyn/uikit';
// or for backward compatibility
import { RescheduleSelector } from '@aspyn/uikit';
```

## Component Breakdown

### SchedulingSelector (Main Component)

**Location**: `src/components/scheduling/SchedulingSelector.tsx`

The main orchestrator that:
- Manages week navigation state
- Coordinates slot selection
- Handles week data fetching callbacks
- Composes all subcomponents

**Key Responsibilities**:
- Week navigation logic
- Slot selection coordination
- Date jump functionality
- Props distribution to subcomponents

### CalendarHeader

**Location**: `src/components/scheduling/CalendarHeader.tsx`

Handles the top navigation bar of the calendar.

**Features**:
- Previous/Next week buttons
- Week range display
- Date picker (optional)
- Timezone information display (optional)

### WeekGrid

**Location**: `src/components/scheduling/WeekGrid.tsx`

Renders the 7-day calendar grid with time slots.

**Features**:
- Day headers (Sun-Sat)
- Loading skeleton states
- Past date handling
- Availability visualization
- Time slot rendering for each day

### TimeSlotButton

**Location**: `src/components/scheduling/TimeSlotButton.tsx`

A reusable button component for individual time slots.

**States**:
- Available (clickable)
- Selected (highlighted in blue)
- Reserved (locked in green)
- Unavailable (greyed out)

### Preference Selectors

**Location**: `src/components/scheduling/Preferences/`

Three similar dropdown components for selecting preferences:
- **TimeWindowSelector**: Preferred time windows
- **TeamSelector**: Team selection
- **TechnicianSelector**: Technician selection with avatar/rating support

Each uses the `useOutsideClick` hook for dropdown management.

### SelectedAppointmentCard

**Location**: `src/components/scheduling/SelectedAppointmentCard.tsx`

Displays a summary of the selected appointment with:
- Date and time period
- Selected preferences (window, team, technician)
- Reserve button with loading states

## Custom Hooks

### useOutsideClick

**Location**: `src/components/scheduling/hooks/useOutsideClick.ts`

Generic hook for detecting clicks outside a referenced element. Used for closing dropdowns.

```typescript
useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  isActive: boolean = true
)
```

### useTimezoneFormat

**Location**: `src/components/scheduling/hooks/useTimezoneFormat.ts`

Provides timezone-aware date formatting utilities.

```typescript
const { formatDate, getTimezoneDisplay } = useTimezoneFormat(
  timezone?: string,
  timezoneDisplay?: string
);
```

**Returns**:
- `formatDate(date, format)`: Formats a date in the specified timezone
- `getTimezoneDisplay`: Human-readable timezone string (e.g., "EST", "PST")

## Type Definitions

**Location**: `src/components/scheduling/types.ts`

All TypeScript types are centralized:
- `TimePeriod`: "any_time" | "morning" | "afternoon"
- `TimeSlot`: Time slot with start/end times and calendar info
- `DayAvailability`: Availability data for a single day
- `WeekData`: Complete week of availability data
- `SelectedSlot`: User's current slot selection
- `WindowOption`, `TeamOption`, `TechnicianOption`: Preference options
- `Labels`: Custom label overrides

## Usage Example

```tsx
import { useState } from 'react';
import { SchedulingSelector, WeekData, SelectedSlot } from '@aspyn/uikit';

function MySchedulingComponent() {
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedWindow, setSelectedWindow] = useState('');

  const handleWeekChange = async (weekStart: string, weekEnd: string) => {
    setLoading(true);
    const data = await fetchAvailability(weekStart, weekEnd);
    setWeekData(data);
    setLoading(false);
  };

  const handleReserve = async () => {
    await reserveAppointment(selectedSlot);
  };

  return (
    <SchedulingSelector
      weekData={weekData}
      loading={loading}
      onWeekChange={handleWeekChange}
      selectedSlot={selectedSlot}
      onSlotSelect={setSelectedSlot}
      windowOptions={[
        { id: 'w1', label: '8AM - 10AM' },
        { id: 'w2', label: '10AM - 12PM' },
      ]}
      selectedWindow={selectedWindow}
      onWindowChange={setSelectedWindow}
      onReserve={handleReserve}
      timezone="America/New_York"
    />
  );
}
```

## Benefits of Refactoring

### 1. **Separation of Concerns**
Each component has a single, well-defined responsibility:
- CalendarHeader: Navigation only
- WeekGrid: Display logic only
- Preference selectors: Individual dropdown logic

### 2. **Reusability**
Components like `TimeSlotButton` and the preference selectors can be reused in other contexts.

### 3. **Testability**
Smaller components are easier to unit test in isolation.

### 4. **Maintainability**
- Easier to locate and fix bugs
- Changes to one feature don't affect others
- Clearer code organization

### 5. **Developer Experience**
- Reduced mental load when working on specific features
- Easier onboarding for new developers
- Better IDE navigation and file discovery

### 6. **Custom Hooks**
Extracted hooks (`useOutsideClick`, `useTimezoneFormat`) can be used across the entire codebase.

## Backward Compatibility

The old `RescheduleSelector` export is maintained for backward compatibility:

```typescript
// Old code still works
import { RescheduleSelector } from '@aspyn/uikit';

// New code can use the new name
import { SchedulingSelector } from '@aspyn/uikit';
```

Both point to the same refactored implementation.

## Storybook

The component includes comprehensive Storybook stories at:
- `src/stories/SchedulingSelector.stories.tsx` (new)
- `src/stories/RescheduleSelector.stories.tsx` (legacy, still functional)

Run Storybook to see interactive examples:
```bash
npm run storybook
```

## Future Improvements

Potential enhancements:
1. Extract calendar grid layout logic into a separate hook
2. Add virtualization for long dropdown lists
3. Create a `CalendarDay` component to further decompose `WeekGrid`
4. Add keyboard navigation support
5. Create composable wrapper components for common use cases
