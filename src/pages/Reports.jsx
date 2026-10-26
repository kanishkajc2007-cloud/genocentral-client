import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, FolderGit2, Plus, X, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    summary: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const canCreateReport = user?.role === 'bioinformatician' || user?.role === 'admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, projRes] = await Promise.all([
        api.get('/reports'),
        api.get('/projects')
      ]);
      if (reportsRes.data?.reports) setReports(reportsRes.data.reports);
      if (projRes.data?.projects) {
        setProjects(projRes.data.projects);
        if (projRes.data.projects.length > 0) {
          setFormData(prev => ({ ...prev, project: projRes.data.projects[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Failed to load research analysis reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/reports', formData);
      if (res.data?.success) {
        setSuccessMsg(`Analysis report "${formData.title}" published successfully.`);
        setShowCreateModal(false);
        setFormData({
          title: '',
          project: projects[0]?._id || '',
          summary: ''
        });
        await fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit analysis report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Genomic Analysis Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Curated bioinformatic interpretations, variant impact summaries, and cohort analyses.
          </p>
        </div>

        {canCreateReport && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.86rem' }}
          >
            <Plus size={16} />
            <span>Publish Report</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          marginBottom: '20px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fb7185',
          marginBottom: '20px',
          fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Reports Grid */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cyan-bright)' }}>
          <div className="pulse-indicator" style={{ marginRight: '8px' }} />
          <span>Loading analysis reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No published analysis reports found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {reports.map((rep) => (
            <div
              key={rep._id}
              className="glass-panel report-card"
              data-testid="report-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedReport(rep)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: 'var(--purple-bright)',
                    background: 'rgba(168, 85, 247, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(168, 85, 247, 0.25)'
                  }}>
                    {rep.project?.name || 'Genomics Project'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {rep.title}
                </h3>

                <p style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '20px'
                }}>
                  {rep.summary}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} color="var(--cyan-bright)" />
                  <span>{rep.author?.name || 'Bioinformatician'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    <span>{new Date(rep.date).toLocaleDateString()}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary view-report-btn"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('CLICKED REPORT BUTTON:', rep.title);
                      setSelectedReport(rep);
                    }}
                  >
                    <Eye size={13} color="var(--cyan-bright)" />
                    <span>View Detail</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '680px',
            background: 'rgba(15, 23, 42, 0.98)',
            padding: '32px',
            border: '1px solid var(--border-glass-bright)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'var(--cyan-bright)',
                  letterSpacing: '0.04em'
                }}>
                  {selectedReport.project?.name || 'Cohort Project'}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedReport.title}
                </h2>
              </div>
              <button onClick={() => setSelectedReport(null)} className="btn btn-secondary" style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '16px',
              marginBottom: '20px',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Author: </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedReport.author?.name} ({selectedReport.author?.role})</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{new Date(selectedReport.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Executive Findings Summary
              </h4>
              <p style={{
                fontSize: '0.94rem',
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                background: 'rgba(10, 14, 23, 0.6)',
                padding: '18px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {selectedReport.summary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedReport(null)} className="btn btn-secondary">
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Report Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '28px', background: 'rgba(15, 23, 42, 0.96)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Publish Analysis Report
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
              Compile validated pipeline metrics and variant interpretations for collaborative review.
            </p>

            <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Somatic Mutation Landscape - Cohort D"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Associated Project *
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="form-select"
                >
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Analysis Summary & Clinical Interpretation *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Synthesize computational findings, variant calls, quality flags, and actionable conclusions..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Publishing...' : 'Publish Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
