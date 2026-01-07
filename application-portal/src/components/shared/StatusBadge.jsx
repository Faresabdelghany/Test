export function StatusBadge({ status, testId }) {
  return (
    <span className={`status ${status}`} data-testid={testId}>
      {status}
    </span>
  );
}
