import React, { useState } from 'react';
import type { User, Todo } from '../../types';
import { AvatarSelect } from './AvatarSelect';
import { X, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface ProfileEditModalProps {
  user: User;
  todos: Todo[];
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onClearAllTodos: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  user,
  todos,
  onClose,
  onUpdateUser,
  onClearAllTodos,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [avatar, setAvatar] = useState(user.avatar);
  const [showDangerZone, setShowDangerZone] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    // Update session user
    const updated: User = {
      ...user,
      displayName: displayName.trim(),
      avatar,
    };
    
    onUpdateUser(updated);

    // Sync back to users database
    try {
      const stored = localStorage.getItem('users_db');
      if (stored) {
        const usersDb = JSON.parse(stored);
        const updatedDb = usersDb.map((u: any) =>
          u.username === user.username
            ? { ...u, displayName: updated.displayName, avatar: updated.avatar }
            : u
        );
        localStorage.setItem('users_db', JSON.stringify(updatedDb));
      }
    } catch (err) {
      console.error('Failed to sync updated profile to users database:', err);
    }

    onClose();
  };

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;

  return (
    <div style={styles.backdrop}>
      <div className="glass-panel fade-in" style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={styles.title}>Account Settings</h2>
          </div>
          <button className="btn-icon" style={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} style={styles.form}>
          {/* Info Card */}
          <div className="glass-card" style={styles.infoCard}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Username</span>
              <span style={styles.infoValue}>@{user.username}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Account Created</span>
              <span style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>All-Time Tasks</span>
              <span style={styles.infoValue}>{total} created ({completed} completed)</span>
            </div>
          </div>

          {/* Name input */}
          <div style={styles.inputGroup}>
            <label className="input-label">Display Name</label>
            <div style={styles.inputWrapper}>
              <UserCheck size={18} style={styles.icon} />
              <input
                type="text"
                placeholder="Alex Smith"
                className="custom-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          {/* Avatar selector */}
          <AvatarSelect selectedAvatar={avatar} onSelect={setAvatar} />

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Save Changes
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div style={styles.dangerZone}>
          <button
            type="button"
            onClick={() => setShowDangerZone(!showDangerZone)}
            style={styles.dangerToggleBtn}
          >
            <ShieldAlert size={14} /> {showDangerZone ? 'Hide Danger Zone' : 'Show Danger Zone'}
          </button>

          {showDangerZone && (
            <div className="fade-in" style={styles.dangerContent}>
              <p style={styles.dangerWarning}>
                This will delete all current tasks in your account database. This action is irreversible.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete all tasks? This cannot be undone.')) {
                    onClearAllTodos();
                    setShowDangerZone(false);
                  }
                }}
                className="btn-primary"
                style={styles.dangerDeleteBtn}
              >
                Clear All Task Records
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '100',
    padding: '20px',
  },
  modal: {
    width: '480px',
    maxWidth: '100%',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.82rem',
  },
  infoLabel: {
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  infoValue: {
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '6px',
  },
  dangerZone: {
    borderTop: '1px dashed var(--border-color)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dangerToggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    outline: 'none',
    width: 'fit-content',
  },
  dangerContent: {
    backgroundColor: 'rgba(244, 63, 94, 0.04)',
    border: '1px solid rgba(244, 63, 94, 0.15)',
    padding: '14px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dangerWarning: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.3',
  },
  dangerDeleteBtn: {
    backgroundColor: 'var(--accent-rose)',
    boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.3)',
    fontSize: '0.8rem',
    padding: '10px',
    width: '100%',
  },
};
