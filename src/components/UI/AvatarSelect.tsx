import React from 'react';

interface AvatarSelectProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

const AVAILABLE_AVATARS = [
  { emoji: '🦊', label: 'Fox', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { emoji: '🐱', label: 'Cat', bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { emoji: '🐼', label: 'Panda', bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { emoji: '🦁', label: 'Lion', bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { emoji: '🦄', label: 'Unicorn', bg: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { emoji: '🚀', label: 'Rocket', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { emoji: '💻', label: 'Developer', bg: 'linear-gradient(135deg, #434343 0%, #090909 100%)' },
  { emoji: '🎨', label: 'Artist', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { emoji: '🧠', label: 'Thinker', bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  { emoji: '⚡', label: 'Speed', bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { emoji: '🔮', label: 'Mystic', bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { emoji: '🍀', label: 'Lucky', bg: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
];

export const AvatarSelect: React.FC<AvatarSelectProps> = ({ selectedAvatar, onSelect }) => {
  return (
    <div style={styles.container}>
      <label className="input-label" style={{ marginBottom: '12px' }}>Choose your avatar</label>
      <div style={styles.grid}>
        {AVAILABLE_AVATARS.map((item) => {
          const isSelected = selectedAvatar === item.emoji;
          return (
            <button
              key={item.emoji}
              type="button"
              onClick={() => onSelect(item.emoji)}
              style={{
                ...styles.avatarBtn,
                background: item.bg,
                border: isSelected ? '3px solid var(--primary)' : '2px solid rgba(255, 255, 255, 0.1)',
                transform: isSelected ? 'scale(1.1) translateY(-2px)' : 'none',
                boxShadow: isSelected ? '0 0 15px var(--primary-glow)' : 'none',
              }}
              title={item.label}
            >
              <span style={styles.emoji}>{item.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  avatarBtn: {
    aspectRatio: '1',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '0',
  },
  emoji: {
    fontSize: '1.4rem',
  },
};
