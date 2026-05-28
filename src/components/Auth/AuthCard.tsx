import React, { useState } from 'react';
import type { User } from '../../types';
import { AvatarSelect } from '../UI/AvatarSelect';
import { UserCheck, KeyRound, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';

interface AuthCardProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [error, setError] = useState('');

  const resetFields = () => {
    setUsername('');
    setPassword('');
    setDisplayName('');
    setAvatar('🦊');
    setError('');
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetFields();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !displayName) {
      setError('Please choose a display name.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    // Pull local user database
    let usersDb: any[] = [];
    try {
      const stored = localStorage.getItem('users_db');
      if (stored) usersDb = JSON.parse(stored);
    } catch (err) {
      usersDb = [];
    }

    if (isLogin) {
      // Login flow
      const user = usersDb.find(u => u.username === cleanUsername && u.password === password);
      if (user) {
        const sessionUser: User = {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          createdAt: user.createdAt,
        };
        onAuthSuccess(sessionUser);
      } else {
        setError('Invalid username or password.');
      }
    } else {
      // Signup flow
      const exists = usersDb.some(u => u.username === cleanUsername);
      if (exists) {
        setError('Username is already taken.');
        return;
      }

      const newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        username: cleanUsername,
        password,
        displayName: displayName.trim(),
        avatar,
        createdAt: new Date().toISOString(),
      };

      usersDb.push(newUser);
      localStorage.setItem('users_db', JSON.stringify(usersDb));

      const sessionUser: User = {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      };
      
      onAuthSuccess(sessionUser);
    }
  };

  return (
    <div className="glass-panel slide-up" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <Sparkles size={28} color="var(--primary)" />
        </div>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={styles.subtitle}>
          {isLogin ? 'Manage your daily dashboard with ease.' : 'Get started with our premium, highly styled planner.'}
        </p>
      </div>

      {error && (
        <div className="fade-in" style={styles.errorAlert}>
          <AlertCircle size={18} color="var(--accent-rose)" />
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label className="input-label">Username</label>
          <div style={styles.inputWrapper}>
            <UserCheck size={18} style={styles.icon} />
            <input
              type="text"
              placeholder="alex_smith"
              className="custom-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ paddingLeft: '42px' }}
              required
            />
          </div>
        </div>

        {!isLogin && (
          <div className="fade-in" style={styles.inputGroup}>
            <label className="input-label">Display Name</label>
            <div style={styles.inputWrapper}>
              <UserPlus size={18} style={styles.icon} />
              <input
                type="text"
                placeholder="Alex Smith"
                className="custom-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div style={styles.inputGroup}>
          <label className="input-label">Password</label>
          <div style={styles.inputWrapper}>
            <KeyRound size={18} style={styles.icon} />
            <input
              type="password"
              placeholder="••••••••"
              className="custom-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '42px' }}
              required
            />
          </div>
        </div>

        {!isLogin && (
          <div className="fade-in" style={{ width: '100%', marginBottom: '6px' }}>
            <AvatarSelect selectedAvatar={avatar} onSelect={setAvatar} />
          </div>
        )}

        <button type="submit" className="btn-primary" style={styles.submitBtn}>
          {isLogin ? (
            <>
              <LogIn size={18} /> Sign In
            </>
          ) : (
            <>
              <UserPlus size={18} /> Sign Up
            </>
          )}
        </button>
      </form>

      <div style={styles.footer}>
        <span style={styles.footerText}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
        </span>
        <button onClick={handleToggleMode} style={styles.toggleBtn}>
          {isLogin ? 'Create one now' : 'Sign in instead'}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    width: '440px',
    maxWidth: '100%',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  logoContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'rgba(139, 92, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    padding: '0 10px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
  submitBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '6px',
  },
  errorAlert: {
    width: '100%',
    background: 'rgba(244, 63, 94, 0.08)',
    border: '1px solid rgba(244, 63, 94, 0.25)',
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorText: {
    color: 'var(--accent-rose)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  footer: {
    display: 'flex',
    gap: '6px',
    fontSize: '0.9rem',
    marginTop: '8px',
  },
  footerText: {
    color: 'var(--text-secondary)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    textDecoration: 'underline',
  },
};
