import React, { useState, useEffect } from 'react';

function Step1({ formData, setFormData, nextStep }) {
  const [photo, setPhoto] = useState(formData.photo || null);
  const [photoPreview, setPhotoPreview] = useState(formData.photoPreview || null);
  const [username, setUsername] = useState(formData.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [touched, setTouched] = useState({});

  // Local username validation only
  const validateUsername = (value) => {
    if (!value) return 'Username is required';
    if (value.length < 4 || value.length > 20) return 'Username must be 4-20 characters';
    if (/\s/.test(value)) return 'No spaces allowed';
    return '';
  };

  // Validate photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhoto(null);
      setPhotoPreview(null);
      alert('Only JPG/PNG allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhoto(null);
      setPhotoPreview(null);
      alert('File must be <= 2MB');
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Validate new password
  const validateNewPassword = (value) => {
    if (!value) return '';
    let error = '';
    if (value.length < 8) error = 'At least 8 characters';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) error = 'At least 1 special character';
    else if (!/\d/.test(value)) error = 'At least 1 number';
    setNewPasswordError(error);
    // Strength meter
    let strength = '';
    if (value.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(value) && /\d/.test(value)) {
      strength = 'Strong';
    } else if (value.length >= 8) {
      strength = 'Medium';
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
    return error;
  };

  // On next
  const handleNext = (e) => {
    e.preventDefault();
    let valid = true;
    // Username
    const usernameErr = validateUsername(username);
    setUsernameError(usernameErr);
    if (usernameErr) valid = false;
    // New password
    const newPassErr = validateNewPassword(newPassword);
    if (newPassword && !currentPassword) valid = false;
    if (newPassErr) valid = false;
    setTouched({ username: true, currentPassword: true, newPassword: true });
    if (!valid) return;
    setFormData({
      ...formData,
      photo,
      photoPreview,
      username,
      currentPassword,
      newPassword,
    });
    nextStep();
  };

  return (
    <form onSubmit={handleNext}>
      <h2>Step 1: Personal Info</h2>
      <div>
        <label>Profile Photo (JPG/PNG, ≤2MB):</label><br />
        <input type="file" accept="image/jpeg,image/png" onChange={handlePhotoChange} />
        {photoPreview && <div><img src={photoPreview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }} /></div>}
      </div>
      <div>
        <label>Username:</label><br />
        <input
          type="text"
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            setUsernameError('');
          }}
          onBlur={() => {
            setTouched(t => ({ ...t, username: true }));
            setUsernameError(validateUsername(username));
          }}
        />
        {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}
      </div>
      <div>
        <label>Current Password:</label><br />
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, currentPassword: true }))}
        />
        {newPassword && !currentPassword && touched.currentPassword && (
          <div style={{ color: 'red' }}>Current password required to change password</div>
        )}
      </div>
      <div>
        <label>New Password:</label><br />
        <input
          type="password"
          value={newPassword}
          onChange={e => {
            setNewPassword(e.target.value);
            validateNewPassword(e.target.value);
          }}
          onBlur={() => setTouched(t => ({ ...t, newPassword: true }))}
        />
        {newPassword && (
          <div>
            <span>Password strength: {passwordStrength}</span>
          </div>
        )}
        {newPasswordError && touched.newPassword && (
          <div style={{ color: 'red' }}>{newPasswordError}</div>
        )}
      </div>
      <button type="submit">Next</button>
    </form>
  );
}

function Step2({ formData, setFormData, nextStep, prevStep }) {
  const [profession, setProfession] = useState(formData.profession || '');
  const [companyName, setCompanyName] = useState(formData.companyName || '');
  const [address1, setAddress1] = useState(formData.address1 || '');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!profession) errs.profession = 'Profession is required';
    if (profession === 'Entrepreneur' && !companyName) errs.companyName = 'Company Name is required';
    if (!address1) errs.address1 = 'Address Line 1 is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setTouched({ profession: true, companyName: true, address1: true });
    if (!validate()) return;
    setFormData({
      ...formData,
      profession,
      companyName: profession === 'Entrepreneur' ? companyName : '',
      address1,
    });
    nextStep();
  };

  return (
    <form onSubmit={handleNext}>
      <h2>Step 2: Professional Details</h2>
      <div>
        <label>Profession:</label><br />
        <select
          value={profession}
          onChange={e => {
            setProfession(e.target.value);
            setTouched(t => ({ ...t, profession: true }));
            if (e.target.value !== 'Entrepreneur') setCompanyName('');
          }}
          onBlur={() => setTouched(t => ({ ...t, profession: true }))}
        >
          <option value="">Select...</option>
          <option value="Student">Student</option>
          <option value="Developer">Developer</option>
          <option value="Entrepreneur">Entrepreneur</option>
        </select>
        {touched.profession && errors.profession && <div style={{ color: 'red' }}>{errors.profession}</div>}
      </div>
      {profession === 'Entrepreneur' && (
        <div>
          <label>Company Name:</label><br />
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, companyName: true }))}
          />
          {touched.companyName && errors.companyName && <div style={{ color: 'red' }}>{errors.companyName}</div>}
        </div>
      )}
      <div>
        <label>Address Line 1:</label><br />
        <input
          type="text"
          value={address1}
          onChange={e => setAddress1(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, address1: true }))}
        />
        {touched.address1 && errors.address1 && <div style={{ color: 'red' }}>{errors.address1}</div>}
      </div>
      <button type="button" onClick={prevStep}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}

function Step3({ formData, setFormData, nextStep, prevStep }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [plan, setPlan] = useState(formData.plan || 'Basic');
  const [newsletter, setNewsletter] = useState(formData.newsletter !== undefined ? formData.newsletter : true);

  const API_KEY = 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==';
  const API_BASE = 'https://api.countrystatecity.in/v1';
  const headers = { 'X-CSCAPI-KEY': API_KEY };

  // Fetch countries on mount
  useEffect(() => {
    fetch(`${API_BASE}/countries`, { headers })
      .then(res => res.json())
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setCities([]);
      return;
    }
    fetch(`${API_BASE}/countries/${formData.country}/states`, { headers })
      .then(res => res.json())
      .then(setStates)
      .catch(() => setStates([]));
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      return;
    }
    fetch(`${API_BASE}/countries/${formData.country}/states/${formData.state}/cities`, { headers })
      .then(res => res.json())
      .then(setCities)
      .catch(() => setCities([]));
  }, [formData.country, formData.state]);

  const validate = () => {
    const errs = {};
    if (!formData.country) errs.country = 'Country is required';
    if (!formData.state) errs.state = 'State is required';
    if (!formData.city) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setTouched({ country: true, state: true, city: true });
    if (!validate()) return;
    setFormData({
      ...formData,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      plan,
      newsletter,
    });
    nextStep();
  };

  return (
    <form onSubmit={handleNext}>
      <h2>Step 3: Preferences</h2>
      <div>
        <label>Country:</label><br />
        <select
          value={formData.country || ''}
          onChange={e => setFormData({ ...formData, country: e.target.value, state: '', city: '' })}
        >
          <option value="">Select...</option>
          {countries.map(c => (
            <option key={c.iso2} value={c.iso2}>{c.name}</option>
          ))}
        </select>
        {touched.country && errors.country && <div style={{ color: 'red' }}>{errors.country}</div>}
      </div>
      <div>
        <label>State:</label><br />
        <select
          value={formData.state || ''}
          onChange={e => setFormData({ ...formData, state: e.target.value, city: '' })}
          disabled={!states.length}
        >
          <option value="">Select...</option>
          {states.map(s => (
            <option key={s.iso2} value={s.iso2}>{s.name}</option>
          ))}
        </select>
        {touched.state && errors.state && <div style={{ color: 'red' }}>{errors.state}</div>}
      </div>
      <div>
        <label>City:</label><br />
        <select
          value={formData.city || ''}
          onChange={e => setFormData({ ...formData, city: e.target.value })}
          disabled={!cities.length}
        >
          <option value="">Select...</option>
          {cities.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        {touched.city && errors.city && <div style={{ color: 'red' }}>{errors.city}</div>}
      </div>
      <div>
        <label>Subscription Plan:</label><br />
        <label><input type="radio" name="plan" value="Basic" checked={plan === 'Basic'} onChange={() => setPlan('Basic')} /> Basic</label>
        <label><input type="radio" name="plan" value="Pro" checked={plan === 'Pro'} onChange={() => setPlan('Pro')} /> Pro</label>
        <label><input type="radio" name="plan" value="Enterprise" checked={plan === 'Enterprise'} onChange={() => setPlan('Enterprise')} /> Enterprise</label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
          />
          Subscribe to newsletter
        </label>
      </div>
      <button type="button" onClick={prevStep}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}

function ReviewSubmit({ formData, prevStep, handleSubmit }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setSuccess(true); // Show success immediately
    setLoading(true);
    setError('');
    try {
      // Prepare form data for sending (handle file if present)
      let body;
      let headers = {};
      if (formData.photo) {
        body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'photo' && value) body.append('photo', value);
          else if (key !== 'photoPreview') body.append(key, value);
        });
        // No need to set Content-Type for FormData
      } else {
        body = { ...formData };
        delete body.photoPreview;
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
      }
      // Send to backend in background
      fetch('/submit-profile', {
        method: 'POST',
        body,
        headers,
      });
    } catch (err) {
      // Optionally handle errors
    } finally {
      setLoading(false);
    }
  };

  if (success) return <div><h2>Thank you for submitting!</h2></div>;

  return (
    <div>
      <h2>Review & Submit</h2>
      <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
        <h3>Personal Info</h3>
        {formData.photoPreview && <img src={formData.photoPreview} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />}
        <div><b>Username:</b> {formData.username}</div>
        {formData.newPassword && <div><b>Password:</b> (changed)</div>}
        <h3>Professional Details</h3>
        <div><b>Profession:</b> {formData.profession}</div>
        {formData.profession === 'Entrepreneur' && <div><b>Company Name:</b> {formData.companyName}</div>}
        <div><b>Address Line 1:</b> {formData.address1}</div>
        <h3>Preferences</h3>
        <div><b>Country:</b> {formData.country}</div>
        <div><b>State:</b> {formData.state}</div>
        <div><b>City:</b> {formData.city}</div>
        <div><b>Subscription Plan:</b> {formData.plan}</div>
        <div><b>Newsletter:</b> {formData.newsletter ? 'Yes' : 'No'}</div>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={prevStep} disabled={loading}>Back</button>
      <button onClick={onSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you can send formData to the backend
  };

  if (submitted) {
    return <div><h2>Thank you for submitting!</h2></div>;
  }

  switch (step) {
    case 1:
      return <Step1 formData={formData} setFormData={setFormData} nextStep={nextStep} />;
    case 2:
      return <Step2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
    case 3:
      return <Step3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
    case 4:
      return <ReviewSubmit formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />;
    default:
      return null;
  }
}

export default App;
