export function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  testId,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      {...props}
    >
      <span className="button-content">{children}</span>
    </button>
  );
}
