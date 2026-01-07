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
    <div className="card" data-testid="application-details">
      <h3>Application Details</h3>
      <div className="grid">
        <div>
          <p>
            <b>Title:</b> <span data-testid="details-title">{application.title}</span>
          </p>
          <p>
            <b>Email:</b> <span data-testid="details-email">{application.email}</span>
          </p>
          <p>
            <b>Password:</b> <span data-testid="details-password">{application.password ? '******' : '-'}</span>
          </p>
          <p>
            <b>Phone:</b> <span data-testid="details-phone">{application.phone || '-'}</span>
          </p>
          <p>
            <b>Website:</b> <span data-testid="details-website">{application.website || '-'}</span>
          </p>
          <p>
            <b>Number:</b> <span data-testid="details-number">{number}</span>
          </p>
          <p>
            <b>Range:</b> <span data-testid="details-range">{range}</span>
          </p>
        </div>
        <div>
          <p>
            <b>Date:</b> <span data-testid="details-date">{date || '-'}</span>
          </p>
          <p>
            <b>Time:</b> <span data-testid="details-time">{time || '-'}</span>
          </p>
          <p>
            <b>Date & Time:</b> <span data-testid="details-datetime">{datetime || '-'}</span>
          </p>
          <p>
            <b>Color:</b>{' '}
            <span
              data-testid="details-color"
              style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                backgroundColor: color,
                borderRadius: '4px',
                verticalAlign: 'middle',
              }}
            />
            <span style={{ marginLeft: '8px' }}>{color}</span>
          </p>
          <p>
            <b>File:</b>{' '}
            <span data-testid="details-file">
              {fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  View file
                </a>
              ) : (
                '-'
              )}
            </span>
          </p>
          <p>
            <b>Category:</b> <span data-testid="details-category">{application.category || 'A'}</span>
          </p>
          <p>
            <b>Terms Accepted:</b>{' '}
            <span data-testid="details-terms">{termsAccepted ? 'Yes' : 'No'}</span>
          </p>
        </div>
      </div>
      <p>
        <b>Description:</b>{' '}
        <span data-testid="details-description">{application.description || '-'}</span>
      </p>
      <p>
        <b>Status:</b>{' '}
        <StatusBadge status={application.status} testId="details-status" />
      </p>
      <Button variant="secondary" onClick={onClose} testId="details-close">
        Close
      </Button>
    </div>
  );
}
