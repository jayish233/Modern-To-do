import React from 'react';
import type { Category, Todo, User } from '../../types';
import * as Icons from 'lucide-react';

interface SidebarProps {
  user: User;
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  todos: Todo[];
  onLogout: () => void;
  onOpenProfile: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  categories,
  selectedCategory,
  onSelectCategory,
  todos,
  onLogout,
  onOpenProfile,
  theme,
  onToggleTheme,
}) => {
  // Dynamically render Lucide Icon by name
  const renderIcon = (iconName: string, colorClass: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return <Icons.Folder size={18} />;
    
    // Convert colorClass like 'accent-blue' to CSS variable
    const colorVar = `var(--${colorClass})`;
    return <IconComponent size={18} color={colorVar} style={{ filter: `drop-shadow(0 0 4px ${colorVar}40)` }} />;
  };

  // Helper to calculate category progress
  const getCategoryStats = (catName: string | null) => {
    const catTodos = catName
      ? todos.filter(t => t.category.toLowerCase() === catName.toLowerCase())
      : todos;
    
    const total = catTodos.length;
    const completed = catTodos.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  };

  const allStats = getCategoryStats(null);

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <div style={styles.brandLogo}>
          <Icons.Sparkles size={20} color="var(--primary)" />
        </div>
        <span style={styles.brandName}>antigravity_</span>
      </div>

      {/* User Session Profile Card */}
      <div className="glass-card" style={styles.profileCard} onClick={onOpenProfile} title="Edit Profile">
        <div style={styles.avatarWrapper}>
          <span style={styles.avatar}>{user.avatar}</span>
          <div style={styles.avatarStatusRing} />
        </div>
        <div style={styles.profileInfo}>
          <span style={styles.displayName}>{user.displayName}</span>
          <span style={styles.username}>@{user.username}</span>
        </div>
        <Icons.ChevronRight size={16} color="var(--text-muted)" style={styles.profileChevron} />
      </div>

      {/* Navigation Categories */}
      <div style={styles.navContainer}>
        <span style={styles.sectionLabel}>Lists & Categories</span>
        
        {/* 'All Tasks' button */}
        <button
          onClick={() => onSelectCategory(null)}
          style={{
            ...styles.navItem,
            background: selectedCategory === null ? 'var(--bg-card-hover)' : 'transparent',
            borderColor: selectedCategory === null ? 'var(--border-hover)' : 'transparent',
          }}
        >
          <div style={styles.navItemLeft}>
            <Icons.Layers size={18} color={selectedCategory === null ? 'var(--primary)' : 'var(--text-secondary)'} />
            <span style={{
              ...styles.navItemLabel,
              color: selectedCategory === null ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: selectedCategory === null ? '600' : '400',
            }}>All Tasks</span>
          </div>
          <span style={styles.badge}>{allStats.total}</span>
        </button>

        {/* Categories List */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const stats = getCategoryStats(cat.name);
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              style={{
                ...styles.navItem,
                background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                borderColor: isSelected ? 'var(--border-hover)' : 'transparent',
              }}
            >
              <div style={styles.navItemLeft}>
                {renderIcon(cat.icon, cat.color)}
                <div style={styles.navTextStack}>
                  <span style={{
                    ...styles.navItemLabel,
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? '600' : '400',
                  }}>{cat.name}</span>
                  {stats.total > 0 && (
                    <div style={styles.progressBarBg}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${stats.percentage}%`,
                          backgroundColor: `var(--${cat.color})`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <span style={styles.badge}>{stats.total}</span>
            </button>
          );
        })}
      </div>

      {/* Controls & Footer */}
      <div style={styles.footer}>
        <button className="btn-secondary" style={styles.footerBtn} onClick={onToggleTheme}>
          {theme === 'dark' ? (
            <>
              <Icons.Sun size={18} color="var(--accent-amber)" /> Light Mode
            </>
          ) : (
            <>
              <Icons.Moon size={18} color="var(--primary)" /> Dark Mode
            </>
          )}
        </button>

        <button className="btn-secondary" style={{ ...styles.footerBtn, color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.15)' }} onClick={onLogout}>
          <Icons.LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '280px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    borderRight: '1px solid var(--border-color)',
    background: 'rgba(10, 5, 25, 0.25)',
    boxSizing: 'border-box',
    gap: '24px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '6px',
  },
  brandLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'rgba(139, 92, 246, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  brandName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
  },
  profileCard: {
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    borderRadius: '14px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--bg-input)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
  },
  avatar: {
    fontSize: '1.3rem',
  },
  avatarStatusRing: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-green)',
    border: '2px solid var(--bg-panel-solid)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: '1',
  },
  displayName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  username: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileChevron: {
    opacity: '0.6',
  },
  navContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1',
    overflowY: 'auto',
    marginRight: '-10px',
    paddingRight: '10px',
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingLeft: '12px',
    marginBottom: '8px',
  },
  navItem: {
    background: 'transparent',
    border: '1px solid transparent',
    padding: '12px 14px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    outline: 'none',
  },
  navItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: '1',
  },
  navTextStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: '1',
    paddingRight: '10px',
  },
  navItemLabel: {
    fontSize: '0.9rem',
    fontFamily: 'inherit',
  },
  progressBarBg: {
    width: '100%',
    height: '3px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '2px 8px',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  footerBtn: {
    width: '100%',
    justifyContent: 'flex-start',
    padding: '10px 14px',
    fontSize: '0.85rem',
  },
};
