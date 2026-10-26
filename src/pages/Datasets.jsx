import React, { useState, useEffect } from 'react';
import { Database, Search, Plus, AlertCircle, CheckCircle2, FileCode2, ExternalLink } from 'lucide-react';
import api from '../api';

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    organism: 'Homo sapiens',
    dataType: 'FASTQ',
    version: 'v1.0',
    fileReference: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDatasets = async (query = '') => {
    try {
      setLoading(true);
      setError('');
      const url = query ? `/datasets?q=${encodeURIComponent(query)}` : '/datasets';
      const res = await api.get(url);
      if (res.data && res.data.datasets) {
        setDatasets(res.data.datasets);
      }
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError('Failed to load dataset library records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDataset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/datasets', formData);
      if (res.data && res.data.success) {
        setSuccessMsg(`Dataset "${formData.name}" registered successfully.`);
        setShowAddModal(false);
        setFormData({
          name: '',
          organism: 'Homo sapiens',
          dataType: 'FASTQ',
          version: 'v1.0',
          fileReference: '',
          description: ''
        });
        fetchDatasets(searchQuery);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register new dataset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-body">
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Genomic Dataset Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Catalogued sequencing raw reads, alignments, and annotated variants.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box calling ?q= */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets (name, type)..."
              className="form-input"
              style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.86rem' }}
          >
            <Plus size={16} />
            <span>Add Dataset</span>
          </button>
        </div>
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
          <CheckCircle2 size={18} />
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

      {/* Datasets Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cyan-bright)' }}>
            <div className="pulse-indicator" style={{ marginRight: '8px' }} />
            <span>Querying repository datasets...</span>
          </div>
        ) : datasets.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No genomic datasets match your query "{searchQuery}".
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Dataset Name</th>
                  <th>Organism</th>
                  <th>Data Type</th>
                  <th>Version</th>
                  <th>File Reference</th>
                  <th>Project</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((ds) => (
                  <tr key={ds._id} className="dataset-row" data-testid="dataset-row">
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ds.name}</div>
                      {ds.description && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                          {ds.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        {ds.organism}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--cyan-bright)',
                        border: '1px solid rgba(56, 189, 248, 0.25)'
                      }}>
                        {ds.dataType}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--purple-bright)' }}>
                      {ds.version}
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={ds.fileReference}>
                        <FileCode2 size={14} color="var(--cyan-bright)" style={{ flexShrink: 0 }} />
                        <span>{ds.fileReference}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {ds.project?.name || 'General Archive'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(ds.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Dataset Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'rgba(15, 23, 42, 0.95)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Register Genomic Dataset
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
              Add a new genomic file reference to the central research metadata catalog.
            </p>

            <form onSubmit={handleAddDataset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Dataset Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. PCWGA-Tumor-WGS-CohortC"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Organism *
                  </label>
                  <input
                    type="text"
                    name="organism"
                    required
                    placeholder="Homo sapiens"
                    value={formData.organism}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Data Type *
                  </label>
                  <select
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="FASTQ">FASTQ (Raw Reads)</option>
                    <option value="BAM">BAM (Aligned Reads)</option>
                    <option value="VCF">VCF (Variant Calls)</option>
                    <option value="RNA-Seq">RNA-Seq (Expression)</option>
                    <option value="CRAM">CRAM (Compressed Alignment)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Version
                  </label>
                  <input
                    type="text"
                    name="version"
                    placeholder="v1.0"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Storage / S3 URI Reference *
                  </label>
                  <input
                    type="text"
                    name="fileReference"
                    required
                    placeholder="s3://genocentral-vault/..."
                    value={formData.fileReference}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Description & Methodology
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Cohort parameters, library preparation method, depth..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Registering...' : 'Save Dataset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datasets;
