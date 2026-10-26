import React, { useState, useEffect } from 'react';
import { Database, Cpu, Users2, FileText, RefreshCw, AlertTriangle, PlayCircle } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/stats');
      if (res.data && res.data.success) {
        setStats(res.data.stats);
        setRecentJobs(res.data.recentJobs || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to connect to GenoCentral backend service. Please check your network or ensure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Research Center Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Central institutional repository status and computational workflow activity.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="btn btn-secondary"
          style={{ fontSize: '0.84rem' }}
        >
          <RefreshCw size={14} className={loading ? 'pulse-indicator' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Backend Outage Alert */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderRadius: '10px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fb7185',
          marginBottom: '24px'
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600 }}>Backend Connection Error</div>
            <div style={{ fontSize: '0.86rem', opacity: 0.9 }}>{error}</div>
          </div>
        </div>
      )}

      {/* 4 Summary Metrics Cards */}
      <div className="stats-grid">
        <Card
          title="Genomic Datasets"
          value={stats ? stats.datasets : (loading ? '...' : '0')}
          subtitle="Indexed FASTQ, BAM, VCF archives"
          icon={Database}
          glow
        />
        <Card
          title="Pipelines"
          value={stats ? stats.pipelines : (loading ? '...' : '0')}
          subtitle="Registered computational tools"
          icon={Cpu}
        />
        <Card
          title="Active Projects"
          value={stats ? stats.projects : (loading ? '...' : '0')}
          subtitle="Cross-lab collaborative cohorts"
          icon={Users2}
        />
        <Card
          title="Analysis Reports"
          value={stats ? stats.reports : (loading ? '...' : '0')}
          subtitle="Validated clinical findings"
          icon={FileText}
        />
      </div>

      {/* Recent Pipeline Jobs Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Pipeline Jobs
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Latest asynchronous workflow execution runs across compute clusters
            </p>
          </div>
        </div>

        {recentJobs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {loading ? 'Retrieving job queue records...' : 'No pipeline jobs found in current queue.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Pipeline Name</th>
                  <th>Status</th>
                  <th>Triggered By</th>
                  <th>Started Timestamp</th>
                  <th>Finished Timestamp</th>
                  <th>Log Lines</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--cyan-bright)' }}>
                        {job.pipeline?.name || 'Genomic Pipeline'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {job.pipeline?.version || 'v1.0'}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <div style={{ fontSize: '0.88rem' }}>{job.startedBy?.name || 'System'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {job.startedBy?.role}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {new Date(job.startedAt).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {job.finishedAt ? new Date(job.finishedAt).toLocaleString() : 'In Progress...'}
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {job.log?.length || 0} events
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
