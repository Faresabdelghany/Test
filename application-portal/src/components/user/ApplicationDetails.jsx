import { Button, StatusBadge } from '../shared';

export function ApplicationDetails({ application, onClose }) {
  if (!application) return null;

  // Handle both old (localStorage) and new (Supabase) field names
  const number = application.number_value ?? application.number ?? 0;
  const range = application.range_value ?? application.range ?? 50;
  const date = application.date_value ?? application.date ?? '';
  const time = application.time_value ?? application.time ?? '';
  const datetime = application.datetime_value ?? application.datetime ?? '';
  const color = application.color_value ?? application.color ?? '#000000';
  const fileUrl = application.file_url ?? application.file ?? '';
  const termsAccepted = application.terms_accepted ?? application.termsAccepted ?? false;

  return (
    <div className="card application-details-card" data-testid="application-details">
      <div className="details-header">
        <div>
          <h3>{application.title}</h3>
          <StatusBadge status={application.status} testId="details-status" />
        </div>
        <Button variant="secondary" onClick={onClose} testId="details-close" className="close-button">
          Close
        </Button>
      </div>
      
      <div className="details-grid">
        <div className="details-section">
          <h4 className="details-section-title">Basic Information</h4>
          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">Title</span>
              <span className="detail-value" data-testid="details-title">{application.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value" data-testid="details-email">{application.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Password</span>
              <span className="detail-value" data-testid="details-password">
                {application.password ? '••••••••' : <span className="detail-empty">Not provided</span>}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value" data-testid="details-phone">
                {application.phone || <span className="detail-empty">Not provided</span>}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Website</span>
              <span className="detail-value" data-testid="details-website">
                {application.website ? (
                  <a href={application.website} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {application.website}
                  </a>
                ) : (
                  <span className="detail-empty">Not provided</span>
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Number</span>
              <span className="detail-value" data-testid="details-number">{number}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Range</span>
              <span className="detail-value" data-testid="details-range">{range}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4 className="details-section-title">Additional Details</h4>
          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">Date</span>
              <span className="detail-value" data-testid="details-date">
                {date ? new Date(date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : <span className="detail-empty">Not set</span>}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value" data-testid="details-time">
                {time || <span className="detail-empty">Not set</span>}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date & Time</span>
              <span className="detail-value" data-testid="details-datetime">
                {datetime ? new Date(datetime).toLocaleString('en-US') : <span className="detail-empty">Not set</span>}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Color</span>
              <div className="detail-value color-detail" data-testid="details-color">
                <span
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                />
                <span className="color-code">{color}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-label">File</span>
              <span className="detail-value" data-testid="details-file">
                {fileUrl ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                    View file
                  </a>
                ) : (
                  <span className="detail-empty">No file uploaded</span>
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value category-badge" data-testid="details-category">
                {application.category || 'A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Terms Accepted</span>
              <span className="detail-value" data-testid="details-terms">
                {termsAccepted ? (
                  <span className="terms-accepted">✓ Accepted</span>
                ) : (
                  <span className="terms-not-accepted">✗ Not accepted</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {application.description && (
        <div className="details-section description-section">
          <h4 className="details-section-title">Description</h4>
          <p className="detail-description" data-testid="details-description">
            {application.description}
          </p>
        </div>
      )}
    </div>
  );
}
