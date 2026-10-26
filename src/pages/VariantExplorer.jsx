import React, { useState, useEffect } from 'react';
import { Dna, Search, Filter, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import api from '../api';

const VariantExplorer = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSig, setFilterSig] = useState('ALL');
  const [error, setError] = useState('');

  const fetchVariants = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/variants');
      if (res.data?.variants) {
        setVariants(res.data.variants);
      }
    } catch (err) {
      console.error('Failed to load variants:', err);
      setError('Unable to fetch clinical variant catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  // Filter variants by search (gene, chromosome) and clinical significance
  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      v.gene.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.chromosome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterSig === 'ALL' || v.clinicalSignificance.toLowerCase() === filterSig.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const renderBase = (base) => {
    const b = (base || '').toUpperCase();
    let baseClass = 'base-A';
    if (b === 'C') baseClass = 'base-C';
    if (b === 'G') baseClass = 'base-G';
    if (b === 'T') baseClass = 'base-T';

    return <span className={`base-pill ${baseClass}`}>{b}</span>;
  };

  const getSigBadgeStyle = (sig) => {
    const s = (sig || '').toLowerCase();
    if (s.includes('pathogenic')) {
      return {
        background: 'rgba(244, 63, 94, 0.15)',
        color: '#fb7185',
        border: '1px solid rgba(244, 63, 94, 0.3)'
      };
    }
    if (s.includes('benign')) {
      return {
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      };
    }
    if (s.includes('risk')) {
      return {
        background: 'rgba(245, 158, 11, 0.15)',
        color: '#fbbf24',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      };
    }
    return {
      background: 'rgba(168, 85, 247, 0.15)',
      color: '#c084fc',
      border: '1px solid rgba(168, 85, 247, 0.3)'
    };
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Clinical Variant Explorer
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            High-confidence single nucleotide variants (SNVs) and ACMG classifications.
          </p>
        </div>

        {/* Legend for Bases */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Nucleotide Map:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="base-pill base-A" style={{ width: 20, height: 20, fontSize: '0.78rem' }}>A</span>
              <span style={{ color: '#10b981', fontSize: '0.74rem' }}>Adenine</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="base-pill base-C" style={{ width: 20, height: 20, fontSize: '0.78rem' }}>C</span>
              <span style={{ color: '#38bdf8', fontSize: '0.74rem' }}>Cytosine</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="base-pill base-G" style={{ width: 20, height: 20, fontSize: '0.78rem' }}>G</span>
              <span style={{ color: '#f59e0b', fontSize: '0.74rem' }}>Guanine</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="base-pill base-T" style={{ width: 20, height: 20, fontSize: '0.78rem' }}>T</span>
              <span style={{ color: '#f43f5e', fontSize: '0.74rem' }}>Thymine</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gene (BRCA1, TP53)..."
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '0.86rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            value={filterSig}
            onChange={(e) => setFilterSig(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.86rem' }}
          >
            <option value="ALL">All Classifications</option>
            <option value="pathogenic">Pathogenic</option>
            <option value="likely pathogenic">Likely Pathogenic</option>
            <option value="uncertain significance">VUS</option>
            <option value="likely benign">Likely Benign</option>
            <option value="risk factor">Risk Factor</option>
          </select>
        </div>

        <button onClick={fetchVariants} className="btn btn-secondary" style={{ fontSize: '0.84rem' }}>
          <RefreshCw size={14} />
          <span>Reload Catalog</span>
        </button>
      </div>

      {/* Variants Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cyan-bright)' }}>
            <div className="pulse-indicator" style={{ marginRight: '8px' }} />
            <span>Retrieving genomic variant records...</span>
          </div>
        ) : filteredVariants.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No clinical variants match the selected filter criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Gene Symbol</th>
                  <th>Chromosome</th>
                  <th>Genomic Position</th>
                  <th>Reference (Ref)</th>
                  <th>Alternative (Alt)</th>
                  <th>Variant Type</th>
                  <th>Clinical Significance</th>
                </tr>
              </thead>
              <tbody>
                {filteredVariants.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div style={{
                        display: 'inline-block',
                        fontWeight: 700,
                        fontSize: '0.98rem',
                        color: 'var(--cyan-bright)',
                        background: 'rgba(6, 182, 212, 0.08)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(6, 182, 212, 0.2)'
                      }}>
                        {v.gene}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {v.chromosome}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {v.position.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {renderBase(v.ref)}
                    </td>
                    <td>
                      {renderBase(v.alt)}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-secondary)'
                      }}>
                        {v.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={getSigBadgeStyle(v.clinicalSignificance)}>
                        {v.clinicalSignificance}
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

export default VariantExplorer;
