export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  testId,
  required,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label>{label}{required && ' *'}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={testId}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
