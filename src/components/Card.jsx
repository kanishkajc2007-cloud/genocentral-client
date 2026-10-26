import React from 'react';

const Card = ({ title, value, subtitle, icon: Icon, badge, glow = false, children, style = {} }) => {
  return (
    <div
      className={`glass-panel ${glow ? 'glow-cyan' : ''}`}
      style={{
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {(title || Icon || badge) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: children || value ? '12px' : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {Icon && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                color: 'var(--cyan-bright)',
                display: 'flex'
              }}>
                <Icon size={20} />
              </div>
            )}
            {title && (
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)'
              }}>
                {title}
              </h3>
            )}
          </div>
          {badge}
        </div>
      )}

      {value !== undefined && (
        <div style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>
          {value}
        </div>
      )}

      {subtitle && (
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          {subtitle}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;
