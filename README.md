# Daily Task Manager

A streamlined todo application designed to help users efficiently manage their daily tasks and organize day-to-day work activities with minimal friction and maximum productivity.

## Features

### Core Task Management
- ✅ Quick task creation with title and description
- ✅ Task completion toggle functionality
- ✅ Task deletion with instant feedback
- ✅ Priority levels (High, Medium, Low) with color coding
- ✅ Due date assignment and tracking
- ✅ Category/tag support for organization

### Daily Workflow Features
- ✅ Today's tasks view as the primary interface
- ✅ Current date display in header
- ✅ Smart task sorting by priority and due date
- ✅ Automatic separation of today's tasks vs. other tasks
- ✅ Progress tracking with completion counters

### User Experience
- ✅ Clean, minimalist design with modern styling
- ✅ Responsive design for mobile and desktop
- ✅ Intuitive form interface with proper validation
- ✅ Visual feedback for task states (completed, overdue)
- ✅ Local storage for data persistence
- ✅ Gradient background with glassmorphism effects

## Getting Started

### Prerequisites
- Node.js (version 20.19.0 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd daily-task-manager
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage

### Adding Tasks
1. Click the "+ Add Task" button
2. Fill in the task details:
   - **Title** (required): Brief description of the task
   - **Description** (optional): Additional details about the task
   - **Priority**: Choose High, Medium, or Low priority
   - **Due Date** (optional): Set a deadline for the task
   - **Category** (optional): Organize tasks with custom categories
3. Click "Add Task" to save

### Managing Tasks
- **Complete a task**: Click the checkbox next to the task title
- **Delete a task**: Click the "Delete" button on the task
- **View progress**: Check the completion counter in each task list header

### Task Organization
- **Today's Tasks**: Shows tasks created today or due today
- **Other Tasks**: Shows all remaining tasks
- **Priority Sorting**: Tasks are automatically sorted by completion status, priority, and due date
- **Overdue Indicators**: Tasks past their due date are highlighted in red

## Technical Details

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern design principles
- **Data Storage**: Browser localStorage for persistence
- **State Management**: React hooks (useState, custom useLocalStorage hook)

### Project Structure
```
src/
├── components/          # React components
│   ├── TaskForm.tsx    # Task creation form
│   ├── TaskItem.tsx    # Individual task display
│   └── TaskList.tsx    # Task list container
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── types/              # TypeScript type definitions
│   └── Task.ts
├── App.tsx             # Main application component
├── App.css             # Application styles
└── main.tsx            # Application entry point
```

### Data Model
Tasks include the following properties:
- `id`: Unique identifier (UUID)
- `title`: Task title (required)
- `description`: Optional task description
- `completed`: Boolean completion status
- `priority`: 'high' | 'medium' | 'low'
- `dueDate`: Optional due date
- `createdAt`: Task creation timestamp
- `updatedAt`: Last modification timestamp
- `category`: Optional category/tag

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local Storage API
- CSS backdrop-filter (for glassmorphism effects)

## Future Enhancements

Based on the original PRD, potential future features include:
- Voice-to-text input support
- Bulk task import/export
- Calendar integration
- Time tracking and pomodoro timer
- Subtasks and task dependencies
- Advanced filtering and search
- Dark mode toggle
- Team collaboration features
