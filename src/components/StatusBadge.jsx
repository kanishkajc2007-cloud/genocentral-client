import React from 'react';

const StatusBadge = ({ status, type = 'status' }) => {
  if (type === 'role') {
    let roleClass = 'badge-role-res';
    let roleLabel = 'Researcher';

    if (status === 'admin') {
      roleClass = 'badge-role-admin';
      roleLabel = 'Admin';
    } else if (status === 'bioinformatician') {
      roleClass = 'badge-role-bio';
      roleLabel = 'Bioinformatician';
    }

    return (
      <span className={`badge ${roleClass}`}>
        {roleLabel}
      </span>
    );
  }

  // Job Status
  const s = (status || 'Queued').toLowerCase();
  let badgeClass = 'badge-queued';

  if (s === 'running') badgeClass = 'badge-running';
  if (s === 'completed') badgeClass = 'badge-completed';
  if (s === 'failed') badgeClass = 'badge-failed';

  return (
    <span className={`badge ${badgeClass}`}>
      {s === 'running' && <span className="pulse-indicator" style={{ width: 6, height: 6 }} />}
      {status}
    </span>
  );
};

export default StatusBadge;
