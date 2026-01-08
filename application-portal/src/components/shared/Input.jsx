export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  testId,
  required,
  icon,
  ...props
}) {
  return (
    <div className="form-group">
      {label && (
        <label>
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      )}
      <div className={`input-wrapper ${icon ? 'has-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          data-testid={testId}
          className={error ? 'input-error' : ''}
          {...props}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
