import React, { useState } from 'react';
import type { Todo, SubTask } from '../../types';
import { Check, Edit2, Trash2, Calendar, ChevronDown, ChevronUp, Plus, CheckSquare, Square } from 'lucide-react';

interface TaskItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim(), description: editDesc.trim() });
      setIsEditing(false);
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = todo.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate(todo.id, { subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;

    const newSubtask: SubTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      text: newSubtaskText.trim(),
      completed: false,
    };

    onUpdate(todo.id, {
      subtasks: [...todo.subtasks, newSubtask],
    });
    setNewSubtaskText('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);
    onUpdate(todo.id, { subtasks: updatedSubtasks });
  };

  // Helper to format due date gracefully
  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (checkDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  const subtasksCompleted = todo.subtasks.filter(st => st.completed).length;
  const subtasksTotal = todo.subtasks.length;

  return (
    <div
      className={`glass-card slide-up ${todo.completed ? 'todo-completed' : ''}`}
      style={{
        ...styles.card,
        borderLeft: `4px solid var(--accent-${todo.priority === 'high' ? 'rose' : todo.priority === 'medium' ? 'amber' : 'green'})`,
      }}
    >
      <div style={styles.topRow}>
        {/* Glowing Checkbox & Label Stack */}
        <div style={styles.leftSection}>
          <button
            onClick={() => onToggleComplete(todo.id)}
            className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
            aria-label="Toggle Complete"
          >
            <Check size={12} strokeWidth={3} />
          </button>

          {isEditing ? (
            <div style={styles.editForm}>
              <input
                type="text"
                className="custom-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.95rem' }}
                autoFocus
              />
              <input
                type="text"
                className="custom-input"
                placeholder="Description (optional)"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              />
            </div>
          ) : (
            <div style={styles.textContainer}>
              <span className="todo-strike" style={{
                ...styles.todoText,
                color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              }}>
                {todo.text}
              </span>
              {todo.description && (
                <p style={{
                  ...styles.todoDesc,
                  color: todo.completed ? 'var(--text-muted)' : 'var(--text-secondary)',
                }}>
                  {todo.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Priority, Due Date & Actions */}
        <div style={styles.rightSection}>
          {!isEditing && (
            <>
              {/* Due Date Indicator */}
              {todo.dueDate && (
                <div style={styles.dueDateBadge}>
                  <Calendar size={12} color="var(--text-muted)" />
                  <span style={styles.dueDateText}>{formatDueDate(todo.dueDate)}</span>
                </div>
              )}

              {/* Priority badge */}
              <span className={`badge-priority ${todo.priority}`}>
                {todo.priority}
              </span>
            </>
          )}

          {/* Action Row */}
          <div style={styles.actionRow}>
            {isEditing ? (
              <button className="btn-primary" onClick={handleSave} style={styles.saveBtn}>
                Save
              </button>
            ) : (
              <button
                className="btn-icon"
                style={styles.actionBtn}
                onClick={() => setIsEditing(true)}
                title="Edit Task"
              >
                <Edit2 size={14} />
              </button>
            )}

            <button
              className="btn-icon"
              style={{ ...styles.actionBtn, color: 'var(--accent-rose)' }}
              onClick={() => onDelete(todo.id)}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Subtasks and Expanded Toggle */}
      <div style={styles.bottomRow}>
        <div style={styles.bottomLeft}>
          {subtasksTotal > 0 && (
            <span style={styles.subtaskProgress}>
              Subtasks: {subtasksCompleted}/{subtasksTotal} ({Math.round((subtasksCompleted / subtasksTotal) * 100)}%)
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.expandBtn}
          title={isExpanded ? 'Collapse' : 'Manage Subtasks'}
        >
          <span style={styles.expandText}>
            {isExpanded ? 'Hide Checklist' : subtasksTotal > 0 ? 'Show Checklist' : 'Add Subtasks'}
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Subtask Checklist Area */}
      {isExpanded && (
        <div className="fade-in" style={styles.subtaskContainer}>
          <div style={styles.divider} />
          
          {/* Subtask Listing */}
          {todo.subtasks.length > 0 ? (
            <div style={styles.subtaskList}>
              {todo.subtasks.map((st) => (
                <div key={st.id} style={styles.subtaskItem}>
                  <button
                    onClick={() => handleToggleSubtask(st.id)}
                    style={styles.subtaskCheckBtn}
                  >
                    {st.completed ? (
                      <CheckSquare size={16} color="var(--primary)" />
                    ) : (
                      <Square size={16} color="var(--text-muted)" />
                    )}
                  </button>
                  <span style={{
                    ...styles.subtaskText,
                    textDecoration: st.completed ? 'line-through' : 'none',
                    color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  }}>
                    {st.text}
                  </span>
                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    style={styles.subtaskDeleteBtn}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noSubtasks}>No subtasks defined yet. Break this task down!</p>
          )}

          {/* Add Subtask Input Form */}
          <form onSubmit={handleAddSubtask} style={styles.subtaskForm}>
            <input
              type="text"
              placeholder="Add sub-task..."
              className="custom-input"
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              style={styles.subtaskInput}
            />
            <button type="submit" className="btn-primary" style={styles.subtaskAddBtn}>
              <Plus size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    flex: '1',
    minWidth: '240px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  todoText: {
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  todoDesc: {
    fontSize: '0.82rem',
    lineHeight: '1.3',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  dueDateBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '4px 8px',
  },
  dueDateText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionBtn: {
    width: '32px',
    height: '32px',
  },
  saveBtn: {
    padding: '6px 12px',
    fontSize: '0.8rem',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '8px',
  },
  bottomLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  subtaskProgress: {
    fontWeight: '500',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    outline: 'none',
  },
  expandText: {
    fontWeight: '500',
  },
  subtaskContainer: {
    marginTop: '4px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '12px',
  },
  subtaskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  subtaskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
  },
  subtaskCheckBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    outline: 'none',
  },
  subtaskText: {
    fontSize: '0.85rem',
    flex: '1',
  },
  subtaskDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    opacity: '0.5',
    transition: 'all 0.2s ease',
  },
  noSubtasks: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: '8px 0 16px',
  },
  subtaskForm: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  subtaskInput: {
    padding: '6px 12px',
    fontSize: '0.8rem',
    flex: '1',
  },
  subtaskAddBtn: {
    padding: '6px',
    borderRadius: '6px',
    aspectRatio: '1',
    width: '32px',
    height: '32px',
    boxShadow: 'none',
  },
};
