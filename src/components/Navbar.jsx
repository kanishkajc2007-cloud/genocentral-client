import React from 'react';
import { LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="glass-panel"
      style={{
        height: '68px',
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--border-glass)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10, 14, 23, 0.75)',
        zIndex: 40
      }}
    >
      {/* Context Breadcrumb / Notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56, 189, 248, 0.08)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <span className="pulse-indicator" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-bright)', fontWeight: 500 }}>
            Genomics High-Performance Cluster Node #01
          </span>
        </div>
      </div>

      {/* User Info & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-bright)'
          }}>
            <UserIcon size={18} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name || 'Researcher'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </span>
              <StatusBadge status={user?.role} type="role" />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="btn btn-secondary"
          title="Sign out of GenoCentral"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
