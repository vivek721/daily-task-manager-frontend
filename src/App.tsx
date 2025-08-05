import { useState, useEffect } from 'react';
import type { TaskFormData } from './types/Task';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { OldTasks } from './components/OldTasks';
import { TaskHistory } from './components/TaskHistory';
import { DeletedTasks } from './components/DeletedTasks';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { addTask, toggleTaskComplete, deleteTask, fetchAllTasks } from './store/taskSlice';
import { selectTodaysTasks, selectOtherTasks } from './store/selectors';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import AuthCallback from './components/AuthCallback';
import UserProfile from './components/UserProfile';
import { Card, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  History, 
  Trash2, 
  Plus,
  Calendar,
  Loader2
} from 'lucide-react';
import { formatDate } from './lib/utils';

type TabType = 'tasks' | 'history' | 'deleted' | 'old';

const TaskManager = () => {
  try {
    const { user, loading: authLoading } = useAuth();
    const dispatch = useAppDispatch();
    const todaysTasks = useAppSelector(selectTodaysTasks);
    const otherTasks = useAppSelector(selectOtherTasks);
    const loading = useAppSelector(state => state.tasks.loading);
    const error = useAppSelector(state => state.tasks.error);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('tasks');
    
    // Fetch tasks when component mounts (must be called before any conditional returns)
    useEffect(() => {
      if (user) {
        dispatch(fetchAllTasks());
      }
    }, [dispatch, user]);
    
    // Debug logging
    console.log('TaskManager render - user:', user, 'authLoading:', authLoading);

    // Handle authentication loading state
    if (authLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-800 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-secondary-600 dark:text-secondary-400">Loading your workspace...</p>
          </motion.div>
        </div>
      );
    }

    // Show login page if not authenticated
    if (!user) {
      return <LoginPage />;
    }


  const handleAddTask = (taskData: TaskFormData) => {
    dispatch(addTask(taskData));
    setShowForm(false);
  };

  const handleToggleTaskComplete = (id: string) => {
    dispatch(toggleTaskComplete(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-800">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-secondary-200 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                    Daily Task Manager
                  </h1>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(new Date())}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserProfile />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card glass className="p-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { id: 'tasks', label: 'Current Tasks', icon: CheckSquare },
                { id: 'old', label: 'Old Tasks', icon: Clock },
                { id: 'history', label: 'History', icon: History },
                { id: 'deleted', label: 'Deleted', icon: Trash2 },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? 'primary' : 'ghost'}
                  onClick={() => setActiveTab(id as TabType)}
                  icon={<Icon className="h-4 w-4" />}
                  className="min-w-[120px]"
                >
                  {label}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="flex items-center gap-3 text-secondary-600 dark:text-secondary-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading tasks...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-red-900 dark:text-red-100">Error loading tasks</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(fetchAllTasks())}
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'tasks' && !loading && (
              <div className="space-y-6">
                {/* Add Task Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    icon={showForm ? undefined : <Plus className="h-4 w-4" />}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {showForm ? 'Cancel' : 'Add New Task'}
                  </Button>
                </motion.div>

                {/* Task Form */}
                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent>
                          <TaskForm 
                            onSubmit={handleAddTask} 
                            onCancel={() => setShowForm(false)} 
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task Lists */}
                <div className="space-y-6">
                  <TaskList
                    tasks={todaysTasks}
                    onToggleComplete={handleToggleTaskComplete}
                    onDelete={handleDeleteTask}
                    title="Today's Tasks"
                  />

                  {otherTasks.length > 0 && (
                    <TaskList
                      tasks={otherTasks}
                      onToggleComplete={handleToggleTaskComplete}
                      onDelete={handleDeleteTask}
                      title="Other Tasks"
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'old' && <OldTasks />}
            {activeTab === 'history' && <TaskHistory />}
            {activeTab === 'deleted' && <DeletedTasks />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
  } catch (error) {
    console.error('TaskManager error:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error in TaskManager</h2>
        <p>Error: {error instanceof Error ? error.message : String(error)}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
};

const App = () => {
  // Check if we're on the auth callback route
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  return (
    <AuthProvider>
      <TaskManager />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AuthProvider>
  );
};

export default App;
