import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, Lock, Mail, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'researcher'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.role);
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setIsLogin(true);
    setFormData({
      ...formData,
      email,
      password
    });
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '480px', zIndex: 10 }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.45)',
            marginBottom: '16px'
          }}>
            <Dna size={36} color="#ffffff" />
          </div>
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #38bdf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            GenoCentral OS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Centralized Genomic Research & Computational Pipeline Hub
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* Mode Switch Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--border-glass)'
          }}>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: isLogin ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: isLogin ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: !isLogin ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: !isLogin ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Register Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.86rem',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name & Academic Title
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Alex Mercer"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Institutional Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="researcher@institute.edu"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Role & Access Level
                </label>
                <div style={{ position: 'relative' }}>
                  <Shield size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                    style={{ paddingLeft: '38px' }}
                  >
                    <option value="researcher">Researcher (Browse, Query Datasets & Reports)</option>
                    <option value="bioinformatician">Bioinformatician (Run Pipelines & Generate Reports)</option>
                    <option value="admin">System Administrator (Full Infrastructure Access)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn ${isLogin ? 'btn-primary' : 'btn-purple'}`}
              style={{ marginTop: '10px', padding: '12px', width: '100%', fontSize: '0.95rem' }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Hub' : 'Create Researcher Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '10px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Use seeded demo credentials
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillDemo('admin@geno.com', 'Admin@123')}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '7px 4px', flexDirection: 'column', gap: '2px' }}
              >
                <span style={{ fontWeight: 700, color: '#f472b6' }}>Admin</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Admin@123</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('bio@geno.com', 'Bio@123')}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '7px 4px', flexDirection: 'column', gap: '2px' }}
              >
                <span style={{ fontWeight: 700, color: '#c084fc' }}>Bioinfo</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Bio@123</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('researcher@geno.com', 'Res@123')}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '7px 4px', flexDirection: 'column', gap: '2px' }}
              >
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>Researcher</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Res@123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
