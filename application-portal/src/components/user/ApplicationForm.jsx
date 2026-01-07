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
    <div className="card" data-testid="application-form">
      <h3>{application ? 'Edit Application' : 'New Application'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div>
            <Input
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={errors.title}
              testId="app-title"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              testId="app-email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              testId="app-password"
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              testId="app-phone"
            />
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={handleChange('website')}
              testId="app-website"
            />
            <Input
              label="Number"
              type="number"
              value={formData.number}
              onChange={handleChange('number')}
              testId="app-number"
            />
            <div className="form-group">
              <label>Range</label>
              <input
                type="range"
                value={formData.range}
                onChange={handleChange('range')}
                data-testid="app-range"
              />
            </div>
          </div>

          <div>
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
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={handleChange('color')}
                data-testid="app-color"
              />
            </div>
            <div className="form-group">
              <label>File</label>
              <input
                type="file"
                onChange={handleFileChange}
                data-testid="app-file"
              />
              {existingFileUrl && !formData.file && (
                <p className="file-info">
                  Current file:{' '}
                  <a href={existingFileUrl} target="_blank" rel="noopener noreferrer">
                    View file
                  </a>
                </p>
              )}
              {formData.file && (
                <p className="file-info">New file: {formData.file.name}</p>
              )}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={handleChange('category')}
                data-testid="app-category"
              >
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange('termsAccepted')}
                  data-testid="app-checkbox"
                />{' '}
                Accept Terms
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            data-testid="app-description"
          />
        </div>

        <div className="btn-group">
          <Button type="submit" variant="primary" testId="app-submit">
            Save
          </Button>
          <Button variant="secondary" onClick={onCancel} testId="app-cancel">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
