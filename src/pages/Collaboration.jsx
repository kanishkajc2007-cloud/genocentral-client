import React, { useState, useEffect } from 'react';
import { Users2, FolderPlus, ShieldCheck, UserCheck, Database, FileText, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const Collaboration = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const projRes = await api.get('/projects');
      if (projRes.data?.projects) setProjects(projRes.data.projects);

      if (isAdmin) {
        const usersRes = await api.get('/users');
        if (usersRes.data?.users) setUsersList(usersRes.data.users);
      }
    } catch (err) {
      console.error('Failed to load collaboration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      const res = await api.post('/projects', {
        name: projectName,
        description: projectDesc,
        members: [user.id]
      });

      if (res.data?.success) {
        setNotification({ type: 'success', message: `Project "${projectName}" initialized successfully.` });
        setShowCreateProject(false);
        setProjectName('');
        setProjectDesc('');
        await fetchData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to create project.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        setNotification({ type: 'success', message: res.data.message });
        await fetchData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to update user role.' });
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Research Collaboration & Cohorts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Multi-investigator project workspaces, team member access, and resource governance.
          </p>
        </div>

        <button
          onClick={() => setShowCreateProject(true)}
          className="btn btn-primary"
          style={{ fontSize: '0.86rem' }}
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: notification.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${notification.type === 'error' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          color: notification.type === 'error' ? '#fb7185' : '#34d399',
          marginBottom: '20px',
          fontSize: '0.88rem'
        }}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Section 1: Active Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cyan-bright)' }}>
            <div className="pulse-indicator" style={{ marginRight: '8px' }} />
            <span>Loading collaborative workspaces...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No research projects currently registered.
          </div>
        ) : (
          projects.map((proj) => (
            <div key={proj._id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {proj.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '850px', lineHeight: 1.5 }}>
                    {proj.description || 'No description provided.'}
                  </p>
                </div>
                <span className="badge badge-queued" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cyan-bright)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {proj.status || 'Active'}
                </span>
              </div>

              {/* Owner and Team Members */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '14px 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                margin: '14px 0',
                fontSize: '0.84rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Principal Investigator:</span>
                  <span style={{ fontWeight: 600, color: 'var(--cyan-bright)' }}>
                    {proj.owner?.name || 'Lead Researcher'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Members ({proj.members?.length || 0}):</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {proj.members?.map((m) => (
                      <span key={m._id} style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        color: 'var(--text-primary)'
                      }}>
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attached Datasets and Reports */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
                {/* Datasets */}
                <div style={{ background: 'rgba(10, 14, 23, 0.5)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--cyan-bright)', fontSize: '0.82rem', fontWeight: 600 }}>
                    <Database size={14} />
                    <span>Attached Datasets ({proj.datasets?.length || 0})</span>
                  </div>
                  {proj.datasets && proj.datasets.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
                      {proj.datasets.map((d) => (
                        <li key={d._id} style={{ color: 'var(--text-secondary)' }}>
                          • {d.name} <span style={{ color: 'var(--text-muted)' }}>({d.dataType})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>No datasets attached</span>
                  )}
                </div>

                {/* Reports */}
                <div style={{ background: 'rgba(10, 14, 23, 0.5)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--purple-bright)', fontSize: '0.82rem', fontWeight: 600 }}>
                    <FileText size={14} />
                    <span>Analysis Reports ({proj.reports?.length || 0})</span>
                  </div>
                  {proj.reports && proj.reports.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
                      {proj.reports.map((r) => (
                        <li key={r._id} style={{ color: 'var(--text-secondary)' }}>
                          • {r.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>No reports published yet</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Section 2: Admin Users and Roles Management */}
      {isAdmin && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-purple)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ShieldCheck size={22} color="var(--purple-bright)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                System User Administration & Role Management
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Administrator authority to govern researcher permissions and compute allocation roles.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Researcher Name</th>
                  <th>Institutional Email</th>
                  <th>Current Role</th>
                  <th>Modify Access Role</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {u.email}
                    </td>
                    <td>
                      <StatusBadge status={u.role} type="role" />
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '4px 10px', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="researcher">Researcher</option>
                        <option value="bioinformatician">Bioinformatician</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showCreateProject && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'rgba(15, 23, 42, 0.96)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Initialize Research Project
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
              Create an institutional cohort to bundle sequencing datasets and pipeline runs.
            </p>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Immunogenomics Neoantigen Trial"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Project Hypothesis & Overview
                </label>
                <textarea
                  rows={4}
                  placeholder="Scope, sequencing targets, and investigative aims..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration;
