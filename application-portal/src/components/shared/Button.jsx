export function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  testId,
  ...props
}) {
  return (
    <button
      type={type}
      className={variant}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      {...props}
    >
      {children}
    </button>
  );
}
