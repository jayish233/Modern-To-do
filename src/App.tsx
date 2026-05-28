import { useState, useEffect } from 'react';
import type { User, Todo, Category } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthCard } from './components/Auth/AuthCard';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProfileEditModal } from './components/UI/ProfileEditModal';
import confetti from 'canvas-confetti';

const PREDEFINED_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', icon: 'Briefcase', color: 'accent-blue' },
  { id: '2', name: 'Personal', icon: 'User', color: 'accent-green' },
  { id: '3', name: 'Health', icon: 'Dumbbell', color: 'accent-rose' },
  { id: '4', name: 'Finance', icon: 'Wallet', color: 'accent-amber' },
  { id: '5', name: 'Shopping', icon: 'ShoppingBag', color: 'primary' },
];

export default function App() {
  const [user, setUser] = useLocalStorage<User | null>('active_user_session', null);
  const [todosDb, setTodosDb] = useLocalStorage<Todo[]>('todos_db', []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('app_theme', 'dark');

  // Sync index theme on mount & change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Audio synthesize trigger for checking a task (Double-tone Chime)
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      // High-pitched friendly double chime (E5 -> A5)
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08); // A5
      
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (err) {
      // AudioContext might be blocked by browser policy prior to first click
    }
  };

  // Add a Todo Task
  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setTodosDb((prev) => [newTodo, ...prev]);
  };

  // Toggle Todo Completed
  const handleToggleTodo = (id: string) => {
    if (!user) return;

    const todoToToggle = todosDb.find(t => t.id === id);
    const wasCompleted = todoToToggle?.completed;

    const updated = todosDb.map((t) => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    setTodosDb(updated);

    // If task was toggled to COMPLETED (not uncompleted)
    if (!wasCompleted) {
      playChime();

      // Check if all remaining user tasks for the current user are done (minimum 1 task)
      const userTasks = updated.filter(t => t.userId === user.id);
      const isAllDone = userTasks.length > 0 && userTasks.every(t => t.completed);

      if (isAllDone) {
        // Grand celebration: multiple bursts
        const duration = 1.5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#8b5cf6', '#3b82f6', '#10b981'],
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8b5cf6', '#f43f5e', '#f59e0b'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      } else {
        // Individual task complete confetti burst
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#8b5cf6', '#d946ef', '#00f2fe'],
        });
      }
    }
  };

  // Delete a Todo
  const handleDeleteTodo = (id: string) => {
    setTodosDb((prev) => prev.filter(t => t.id !== id));
  };

  // Update a Todo (text edits, descriptions, subtask checking, adding subtasks)
  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    setTodosDb((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  // Clear all User Todos (Danger Zone trigger)
  const handleClearAllTodos = () => {
    if (!user) return;
    setTodosDb((prev) => prev.filter(t => t.userId !== user.id));
  };

  // Sign out user
  const handleLogout = () => {
    setUser(null);
    setSelectedCategory(null);
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Retrieve current user tasks
  const userTodos = user ? todosDb.filter(t => t.userId === user.id) : [];

  return (
    <>
      {/* Floating Animated Mesh BG (Fixed behind views) */}
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {user ? (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <Dashboard
            user={user}
            todos={userTodos}
            categories={PREDEFINED_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onUpdateTodo={handleUpdateTodo}
            onLogout={handleLogout}
            onOpenProfile={() => setIsProfileOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />

          {isProfileOpen && (
            <ProfileEditModal
              user={user}
              todos={userTodos}
              onClose={() => setIsProfileOpen(false)}
              onUpdateUser={setUser}
              onClearAllTodos={handleClearAllTodos}
            />
          )}
        </div>
      ) : (
        <div className="glass-container">
          <AuthCard onAuthSuccess={setUser} />
        </div>
      )}
    </>
  );
}
