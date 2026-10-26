import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Play, Terminal, Clock, CheckCircle, AlertOctagon, RefreshCw, X, ShieldAlert } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const Pipelines = () => {
  const { user } = useAuth();
  const [pipelines, setPipelines] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null); // Selected for log modal
  const [runningJobId, setRunningJobId] = useState(null);
  const [notification, setNotification] = useState(null);
  const pollIntervalRef = useRef(null);

  const isAuthorizedToRun = user?.role === 'bioinformatician' || user?.role === 'admin';

  const fetchData = async () => {
    try {
      const [pipRes, jobsRes] = await Promise.all([
        api.get('/pipelines'),
        api.get('/jobs')
      ]);

      if (pipRes.data?.pipelines) setPipelines(pipRes.data.pipelines);
      if (jobsRes.data?.jobs) setJobs(jobsRes.data.jobs);

      // If active job is being viewed, update its logs in real time
      if (activeJob) {
        const updated = jobsRes.data?.jobs?.find(j => j._id === activeJob._id);
        if (updated) setActiveJob(updated);
      }
    } catch (err) {
      console.error('Failed to fetch pipelines and jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Poll every 2 seconds while any job is 'Queued' or 'Running'
  useEffect(() => {
    const hasActiveJob = jobs.some(j => j.status === 'Queued' || j.status === 'Running');

    if (hasActiveJob) {
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(async () => {
          try {
            const jobsRes = await api.get('/jobs');
            if (jobsRes.data?.jobs) {
              setJobs(jobsRes.data.jobs);
              if (activeJob) {
                const refreshedActive = jobsRes.data.jobs.find(j => j._id === activeJob._id);
                if (refreshedActive) setActiveJob(refreshedActive);
              }
            }
          } catch (e) {
            console.error('Polling error:', e);
          }
        }, 2000);
      }
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [jobs, activeJob]);

  const handleRunPipeline = async (pipelineId, pipelineName) => {
    setNotification(null);
    setRunningJobId(pipelineId);

    try {
      const res = await api.post('/pipelines/run', { pipelineId });
      if (res.data?.success) {
        setNotification({
          type: 'success',
          message: `Job initialized for ${pipelineName}. Cluster allocation in progress.`
        });
        await fetchData();
        if (res.data.job) {
          setActiveJob(res.data.job);
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message || 'Failed to trigger pipeline run.';
      setNotification({
        type: 'error',
        message: status === 403 ? `[403 Refused] ${errorMsg}` : errorMsg
      });
    } finally {
      setRunningJobId(null);
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Computational Pipelines & Workflows
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Containerized bioinformatic workflows, execution tracking, and live telemetry logs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchData}
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem' }}
          >
            <RefreshCw size={14} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {notification && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: '8px',
          background: notification.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${notification.type === 'error' ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
          color: notification.type === 'error' ? '#fb7185' : '#34d399',
          marginBottom: '20px',
          fontSize: '0.88rem'
        }}>
          {notification.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Section 1: Registered Pipelines */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
          Available Computational Workflows ({pipelines.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {pipelines.map((pipe) => (
            <div key={pipe._id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
                    {pipe.name}
                  </h3>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    color: 'var(--purple-bright)',
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}>
                    {pipe.version}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '20px' }}>
                  {pipe.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Slurm Cluster Ready
                </span>

                {/* Run Button: Clickable for all to verify permissions; Bio/Admin succeeds, Researcher triggers 403 test */}
                <button
                  onClick={() => handleRunPipeline(pipe._id, pipe.name)}
                  disabled={runningJobId === pipe._id}
                  className={`btn ${isAuthorizedToRun ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.82rem',
                    padding: '8px 14px',
                    border: isAuthorizedToRun ? 'none' : '1px solid rgba(244, 63, 94, 0.4)'
                  }}
                  title={isAuthorizedToRun ? 'Trigger pipeline execution' : 'Role: Researcher (Refused with 403)'}
                >
                  <Play size={14} />
                  <span>
                    {runningJobId === pipe._id
                      ? 'Submitting...'
                      : isAuthorizedToRun
                      ? 'Run Pipeline'
                      : 'Run (Test 403)'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Pipeline Execution Jobs & Live Logs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Execution Jobs History & Active Queue
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Status updates automatically poll every 2 seconds during active runs.
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No pipeline jobs currently recorded.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Job ID / Pipeline</th>
                  <th>Status</th>
                  <th>Operator</th>
                  <th>Started Time</th>
                  <th>Finished Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {job.pipeline?.name || 'Pipeline Run'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {job._id}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <div style={{ fontSize: '0.86rem' }}>{job.startedBy?.name || 'User'}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {job.startedBy?.role}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {new Date(job.startedAt).toLocaleTimeString()}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {job.finishedAt ? new Date(job.finishedAt).toLocaleTimeString() : 'Running...'}
                    </td>
                    <td>
                      <button
                        onClick={() => setActiveJob(job)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Terminal size={14} color="var(--cyan-bright)" />
                        <span>View Logs ({job.log?.length || 0})</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Real-time Job Log Viewer Modal */}
      {activeJob && (
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
            maxWidth: '780px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(10, 14, 23, 0.96)',
            boxShadow: '0 0 35px rgba(6, 182, 212, 0.25)',
            border: '1px solid var(--border-glass-bright)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Terminal size={20} color="var(--cyan-bright)" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {activeJob.pipeline?.name || 'Pipeline Log Stream'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      ID: {activeJob._id}
                    </span>
                    <StatusBadge status={activeJob.status} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveJob(null)}
                className="btn btn-secondary"
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Terminal Console Output */}
            <div style={{
              padding: '20px 24px',
              background: '#05070d',
              flex: 1,
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              color: '#38bdf8'
            }}>
              {activeJob.log && activeJob.log.length > 0 ? (
                activeJob.log.map((line, idx) => (
                  <div key={idx} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                    padding: '3px 0'
                  }}>
                    <span style={{ color: 'var(--text-muted)', marginRight: '10px' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>[Cluster] Awaiting scheduler output...</div>
              )}

              {activeJob.status === 'Running' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: 'var(--cyan-bright)' }}>
                  <span className="pulse-indicator" />
                  <span>Job actively executing on cluster node...</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Started: {new Date(activeJob.startedAt).toLocaleString()}
              </span>
              <button
                onClick={() => setActiveJob(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipelines;
