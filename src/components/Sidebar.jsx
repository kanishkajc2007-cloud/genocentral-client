import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Cpu,
  FileText,
  Users2,
  Dna,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/datasets', label: 'Datasets', icon: Database },
    { to: '/pipelines', label: 'Pipelines', icon: Cpu },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/collaboration', label: 'Collaboration', icon: Users2 },
    { to: '/variant-explorer', label: 'Variant Explorer', icon: Dna },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: '1px solid var(--border-glass)',
        background: 'rgba(10, 14, 23, 0.95)',
        zIndex: 50
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
        }}>
          <Dna size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{
            fontSize: '1.08rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            background: 'linear-gradient(to right, #38bdf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            GenoCentral OS
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Genomic Research Hub
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          padding: '0 12px 6px'
        }}>
          Platform Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.18) 0%, rgba(168, 85, 247, 0.08) 100%)'
                  : 'transparent',
                borderLeft: isActive ? '3px solid var(--cyan-bright)' : '3px solid transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Institutional Banner */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Activity size={14} color="#10b981" />
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>System Live</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Academic Prototype v1.0.4<br />
          Not for clinical diagnostics.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
