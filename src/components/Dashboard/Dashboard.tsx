import React, { useState } from 'react';
import type { User, Todo, Category } from '../../types';
import { Sidebar } from './Sidebar';
import { StatsCard } from './StatsCard';
import { TaskItem } from './TaskItem';
import { Search, Plus, Calendar, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  user: User;
  todos: Todo[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onAddTodo: (todoData: Omit<Todo, 'id' | 'userId' | 'createdAt'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  todos,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  onLogout,
  onOpenProfile,
  theme,
  onToggleTheme,
}) => {
  const [searchText, setSearchText] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDesc, setNewTodoDesc] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState(categories[0]?.name || 'Work');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  
  // Sort State
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'due'>('created');
  
  // Filter state for completed status
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    onAddTodo({
      text: newTodoText.trim(),
      description: newTodoDesc.trim() || undefined,
      completed: false,
      priority: newTodoPriority,
      category: newTodoCategory,
      dueDate: newTodoDueDate || null,
      subtasks: [],
    });

    // Reset inputs
    setNewTodoText('');
    setNewTodoDesc('');
    setNewTodoPriority('low');
    setNewTodoDueDate('');
  };

  // Get dynamic greeting based on system hours
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Dynamic filter lists
  const filteredTodos = todos
    .filter((todo) => {
      // Category filter
      if (selectedCategory && todo.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Status filter
      if (statusFilter === 'active' && todo.completed) return false;
      if (statusFilter === 'completed' && !todo.completed) return false;
      // Search text filter
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchesText = todo.text.toLowerCase().includes(query);
        const matchesDesc = todo.description?.toLowerCase().includes(query) || false;
        if (!matchesText && !matchesDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting strategies
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'due') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Default: 'created' (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div style={styles.appLayout}>
      <Sidebar
        user={user}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        todos={todos}
        onLogout={onLogout}
        onOpenProfile={onOpenProfile}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main style={styles.mainContent}>
        {/* Dynamic Welcoming Header Banner */}
        <header style={styles.header}>
          <div style={styles.headerTitleContainer}>
            <span style={styles.greeting}>{getGreeting()},</span>
            <h1 style={styles.userName}>{user.displayName} {user.avatar}</h1>
          </div>
          <p style={styles.quote}>"Productivity is never an accident. It is always the result of a commitment to excellence."</p>
        </header>

        {/* Dashboard Analytics Section */}
        <section style={styles.analyticsSection}>
          <StatsCard todos={todos} />
        </section>

        {/* Create Task Form */}
        <section className="glass-card fade-in" style={styles.createTaskSection}>
          <h2 style={styles.sectionTitle}>Add New Checklist Item</h2>
          
          <form onSubmit={handleAddSubmit} style={styles.createForm}>
            <div style={styles.formRow1}>
              <input
                type="text"
                placeholder="What needs to be done today?"
                className="custom-input"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                style={styles.todoInput}
                required
              />
              <button type="submit" className="btn-primary" style={styles.addBtn}>
                <Plus size={18} /> Add Task
              </button>
            </div>

            <div style={styles.formRow2}>
              {/* Optional description */}
              <input
                type="text"
                placeholder="Description details (optional)..."
                className="custom-input"
                value={newTodoDesc}
                onChange={(e) => setNewTodoDesc(e.target.value)}
                style={styles.descInput}
              />
            </div>

            <div style={styles.formRow3}>
              {/* Category selector */}
              <div style={styles.metaControl}>
                <label style={styles.metaLabel}>Category</label>
                <select
                  className="custom-input"
                  value={newTodoCategory}
                  onChange={(e) => setNewTodoCategory(e.target.value)}
                  style={styles.selectInput}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority levels */}
              <div style={styles.metaControl}>
                <label style={styles.metaLabel}>Priority</label>
                <div style={styles.priorityBtnGroup}>
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTodoPriority(p)}
                      style={{
                        ...styles.prioritySelectBtn,
                        borderColor: newTodoPriority === p ? `var(--accent-${p === 'high' ? 'rose' : p === 'medium' ? 'amber' : 'green'})` : 'var(--border-color)',
                        backgroundColor: newTodoPriority === p ? `rgba(${p === 'high' ? '244,63,94' : p === 'medium' ? '245,158,11' : '16,185,129'}, 0.08)` : 'transparent',
                        color: newTodoPriority === p ? `var(--accent-${p === 'high' ? 'rose' : p === 'medium' ? 'amber' : 'green'})` : 'var(--text-secondary)',
                        fontWeight: newTodoPriority === p ? '700' : '400',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date picker */}
              <div style={styles.metaControl}>
                <label style={styles.metaLabel}>Due Date</label>
                <div style={styles.datePickerWrapper}>
                  <Calendar size={14} style={styles.dateIcon} />
                  <input
                    type="date"
                    className="custom-input"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                    style={styles.dateInput}
                  />
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Filters and List Controls */}
        <section style={styles.listControlSection}>
          {/* Left search */}
          <div style={styles.searchWrapper}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="custom-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Right filtration & sorts */}
          <div style={styles.controlsRight}>
            {/* Status tabs */}
            <div style={styles.tabGroup}>
              {(['all', 'active', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    ...styles.tabBtn,
                    color: statusFilter === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                    backgroundColor: statusFilter === tab ? 'var(--bg-card-hover)' : 'transparent',
                    border: statusFilter === tab ? '1px solid var(--border-color)' : '1px solid transparent',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sorters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={styles.sortLabel}>Sort:</span>
              <select
                className="custom-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={styles.sortSelect}
              >
                <option value="created">Newest</option>
                <option value="priority">Priority</option>
                <option value="due">Due Date</option>
              </select>
            </div>
          </div>
        </section>

        {/* Actual Todo Task Items loop */}
        <section style={styles.todosListing}>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleTodo}
                onDelete={onDeleteTodo}
                onUpdate={onUpdateTodo}
              />
            ))
          ) : (
            <div className="glass-card" style={styles.noTasksCard}>
              <AlertTriangle size={36} color="var(--text-muted)" style={{ opacity: 0.6 }} />
              <h3 style={styles.noTasksTitle}>No tasks found</h3>
              <p style={styles.noTasksSubtitle}>
                {searchText
                  ? 'Try relaxing your search terms or filters.'
                  : 'Get ahead of your day! Complete everything or build a new task.'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appLayout: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  mainContent: {
    flex: '1',
    height: '100%',
    overflowY: 'auto',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  headerTitleContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  greeting: {
    fontSize: '1.4rem',
    fontWeight: '300',
    color: 'var(--text-secondary)',
  },
  userName: {
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  quote: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
  analyticsSection: {
    width: '100%',
  },
  createTaskSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  createForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  formRow1: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  todoInput: {
    flex: '1',
    fontSize: '1rem',
  },
  addBtn: {
    whiteSpace: 'nowrap',
  },
  formRow2: {
    width: '100%',
  },
  descInput: {
    padding: '10px 14px',
    fontSize: '0.85rem',
  },
  formRow3: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    width: '100%',
  },
  metaControl: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1',
    minWidth: '180px',
  },
  metaLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  selectInput: {
    padding: '10px 14px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  priorityBtnGroup: {
    display: 'flex',
    gap: '8px',
  },
  prioritySelectBtn: {
    flex: '1',
    border: '1px solid var(--border-color)',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textTransform: 'capitalize',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  datePickerWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  dateIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  dateInput: {
    paddingLeft: '36px',
    paddingTop: '9px',
    paddingBottom: '9px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  listControlSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    width: '100%',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '280px',
    maxWidth: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '36px',
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '0.85rem',
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  tabGroup: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '3px',
  },
  tabBtn: {
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '6px 12px',
    textTransform: 'capitalize',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  sortLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  sortSelect: {
    padding: '6px 12px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    width: '110px',
  },
  todosListing: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '40px',
  },
  noTasksCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    gap: '12px',
    textAlign: 'center',
  },
  noTasksTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  noTasksSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    maxWidth: '360px',
    lineHeight: '1.4',
  },
};
