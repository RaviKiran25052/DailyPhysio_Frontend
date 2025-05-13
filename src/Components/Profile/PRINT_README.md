# Routine Printing Functionality

This implementation adds printing capabilities to the MyRoutines component, allowing users to:

1. Print all their routines at once (with each routine on a separate page)
2. Print individual routines as needed

## Components Created

### 1. PrintRoutine Component
The main component that handles printing functionality:
- Accepts `routines` and optional `singleRoutine` props
- Uses `react-to-print` library to handle browser printing
- Renders differently based on whether printing all routines or a single routine
- Adds page breaks between routines when printing multiple

### 2. SingleRoutineContent Component
A sub-component that formats the routine for printing, including:
- Exercise details and description
- Exercise images (with support for multiple images)
- Video link (if available)
- Routine details (reps, hold, complete, perform)

## Implementation Features

- **Hidden Print Content**: The content to be printed is hidden from the UI with `display: none`
- **Custom Page Style**: Uses appropriate page margin and print-specific CSS
- **One Routine Per Page**: When printing multiple routines, each starts on a new page
- **Responsive Layout**: Print layout works well on different paper sizes
- **Image Support**: All images related to the exercise are included
- **Consistent Styling**: Maintains a clean, readable layout for printing

## How To Use

The print functionality is accessible via two types of buttons:

1. **Print All Button**: Located next to the "Workout Routines" heading
2. **Individual Print Buttons**: Located with other action buttons for each routine

When clicked, these buttons will:
1. Prepare the content in a hidden div
2. Open the browser's print dialog
3. Allow the user to print or save as PDF

## Testing the Implementation

For testing purposes, you can use the `print-demo.jsx` file which demonstrates the functionality with sample data.

To test with actual data, simply navigate to the MyRoutines page in the app. 