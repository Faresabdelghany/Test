import { useState, useEffect } from 'react';
import { Input, Button } from '../shared';

export function ApplicationForm({ application, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    email: '',
    password: '',
    phone: '',
    website: '',
    number: 0,
    range: 50,
    date: '',
    time: '',
    datetime: '',
    color: '#000000',
    file: null,
    category: 'A',
    termsAccepted: false,
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [existingFileUrl, setExistingFileUrl] = useState(null);

  useEffect(() => {
    if (application) {
      setFormData({
        title: application.title || '',
        email: application.email || '',
        password: application.password || '',
        phone: application.phone || '',
        website: application.website || '',
        number: application.number_value || application.number || 0,
        range: application.range_value || application.range || 50,
        date: application.date_value || application.date || '',
        time: application.time_value || application.time || '',
        datetime: application.datetime_value
          ? application.datetime_value.slice(0, 16)
          : application.datetime || '',
        color: application.color_value || application.color || '#000000',
        file: null,
        category: application.category || 'A',
        termsAccepted: application.terms_accepted || application.termsAccepted || false,
        description: application.description || '',
      });
      setExistingFileUrl(application.file_url || null);
    } else {
      setFormData({
        title: '',
        email: '',
        password: '',
        phone: '',
        website: '',
        number: 0,
        range: 50,
        date: '',
        time: '',
        datetime: '',
        color: '#000000',
        file: null,
        category: 'A',
        termsAccepted: false,
        description: '',
      });
      setExistingFileUrl(null);
    }
  }, [application]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file: file || null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        file_url: existingFileUrl,
      });
    }
  };

  return (
    <div className="card application-form-card" data-testid="application-form">
      <div className="form-header">
        <h3>{application ? 'Edit Application' : 'New Application'}</h3>
        <p className="form-subtitle">
          {application ? 'Update your application details' : 'Fill in the details below to create a new application'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-grid">
          <div className="form-column">
            <Input
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={errors.title}
              testId="app-title"
              required
              placeholder="Enter application title"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              testId="app-email"
              required
              placeholder="your.email@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              testId="app-password"
              placeholder="Optional password"
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              testId="app-phone"
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={handleChange('website')}
              testId="app-website"
              placeholder="https://example.com"
            />
            <Input
              label="Number"
              type="number"
              value={formData.number}
              onChange={handleChange('number')}
              testId="app-number"
              placeholder="0"
            />
            <div className="form-group range-group">
              <label>
                Range: <span className="range-value">{formData.range}</span>
              </label>
              <div className="range-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.range}
                  onChange={handleChange('range')}
                  data-testid="app-range"
                  className="range-input"
                />
                <div className="range-labels">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-column">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              testId="app-date"
            />
            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={handleChange('time')}
              testId="app-time"
            />
            <Input
              label="Date & Time"
              type="datetime-local"
              value={formData.datetime}
              onChange={handleChange('datetime')}
              testId="app-datetime"
            />
            <div className="form-group color-group">
              <label>Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={formData.color}
                  onChange={handleChange('color')}
                  data-testid="app-color"
                  className="color-input"
                />
                <span className="color-value">{formData.color}</span>
              </div>
            </div>
            <div className="form-group file-group">
              <label>File</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={handleFileChange}
                  data-testid="app-file"
                  className="file-input"
                />
                {existingFileUrl && !formData.file && (
                  <div className="file-info">
                    <span className="file-label">Current file:</span>
                    <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                      View file
                    </a>
                  </div>
                )}
                {formData.file && (
                  <div className="file-info">
                    <span className="file-label">New file:</span>
                    <span className="file-name">{formData.file.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={handleChange('category')}
                data-testid="app-category"
                className="select-input"
              >
                <option value="A">Category A</option>
                <option value="B">Category B</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange('termsAccepted')}
                  data-testid="app-checkbox"
                  className="checkbox-input"
                />
                <span className="checkbox-text">Accept Terms and Conditions</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group description-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            data-testid="app-description"
            placeholder="Enter a detailed description..."
            className="description-textarea"
          />
        </div>

        <div className="btn-group form-actions">
          <Button type="submit" variant="primary" testId="app-submit" className="submit-button">
            {application ? 'Update Application' : 'Create Application'}
          </Button>
          <Button variant="secondary" onClick={onCancel} testId="app-cancel">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
