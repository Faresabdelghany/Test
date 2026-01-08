export function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  loading = false,
  testId,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${variant} ${className} ${loading ? 'loading' : ''}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      data-testid={testId}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}
      <span className={`button-content ${loading ? 'loading-hidden' : ''}`}>{children}</span>
    </button>
  );
}
