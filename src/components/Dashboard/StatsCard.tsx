import React from 'react';
import type { Todo } from '../../types';
import { Trophy, CheckCircle, Clock, Percent } from 'lucide-react';

interface StatsCardProps {
  todos: Todo[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Circular Gauge configurations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div style={styles.container}>
      {/* Primary Circular Gauge Panel */}
      <div className="glass-card" style={styles.gaugeCard}>
        <div style={styles.gaugeContainer}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Background Track Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--border-color)"
              strokeWidth="8"
            />
            {/* Animated Progress Circle */}
            <circle
              className="progress-ring-circle"
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="url(#purpleGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          {/* Centered Text inside Circle */}
          <div style={styles.gaugeText}>
            <span style={styles.gaugeNumber}>{rate}%</span>
            <span style={styles.gaugeLabel}>Done</span>
          </div>
        </div>

        <div style={styles.gaugeInfo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} color="var(--accent-amber)" />
            <h3 style={styles.statsTitle}>Progress Analytics</h3>
          </div>
          <p style={styles.statsSubtitle}>
            {rate === 100 && total > 0
              ? 'Flawless! All tasks completed.'
              : total === 0
              ? 'No active tasks yet.'
              : `${completed} of ${total} tasks resolved today.`}
          </p>
        </div>
      </div>

      {/* Grid of Mini Stats Cards */}
      <div style={styles.grid}>
        {/* Completed card */}
        <div className="glass-card" style={styles.miniCard}>
          <div style={{ ...styles.iconBadge, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={20} color="var(--accent-green)" />
          </div>
          <div style={styles.miniTextStack}>
            <span style={styles.miniLabel}>Completed</span>
            <span style={styles.miniValue}>{completed}</span>
          </div>
        </div>

        {/* Pending card */}
        <div className="glass-card" style={styles.miniCard}>
          <div style={{ ...styles.iconBadge, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Clock size={20} color="var(--accent-blue)" />
          </div>
          <div style={styles.miniTextStack}>
            <span style={styles.miniLabel}>Pending</span>
            <span style={styles.miniValue}>{pending}</span>
          </div>
        </div>

        {/* Completion Rate card */}
        <div className="glass-card" style={styles.miniCard}>
          <div style={{ ...styles.iconBadge, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
            <Percent size={20} color="var(--primary)" />
          </div>
          <div style={styles.miniTextStack}>
            <span style={styles.miniLabel}>Efficiency</span>
            <span style={styles.miniValue}>{rate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 2fr',
    gap: '20px',
    width: '100%',
  },
  gaugeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '24px',
  },
  gaugeContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
  },
  gaugeText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNumber: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  gaugeLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  gaugeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1',
  },
  statsTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  statsSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  miniCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
  },
  iconBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTextStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  miniLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  miniValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
};
