import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Avatar, RadioGroup, FormControlLabel, Radio, Checkbox, FormHelperText, CircularProgress, Stepper, Step, StepLabel, Paper } from '@mui/material';

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Step 1: Personal Info</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload Photo
            <input type="file" hidden accept="image/jpeg,image/png" onChange={handlePhotoChange} />
          </Button>
          {photoPreview && <Avatar src={photoPreview} sx={{ width: 100, height: 100, mb: 2 }} />}
        </Box>
        <form onSubmit={handleNext} autoComplete="off">
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => {
              setUsername(e.target.value);
              setUsernameError('');
            }}
            onBlur={() => {
              setTouched(t => ({ ...t, username: true }));
              setUsernameError(validateUsername(username));
            }}
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, currentPassword: true }))}
            error={!!(newPassword && !currentPassword && touched.currentPassword)}
            helperText={newPassword && !currentPassword && touched.currentPassword ? 'Current password required to change password' : ''}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={e => {
              setNewPassword(e.target.value);
              validateNewPassword(e.target.value);
            }}
            onBlur={() => setTouched(t => ({ ...t, newPassword: true }))}
            error={!!newPasswordError && touched.newPassword}
            helperText={newPasswordError && touched.newPassword ? newPasswordError : (newPassword ? `Password strength: ${passwordStrength}` : '')}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">Next</Button>
          </Box>
        </form>
      </Paper>
    </Container>
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Step 2: Professional Details</Typography>
        <form onSubmit={handleNext} autoComplete="off">
          <FormControl fullWidth margin="normal" error={!!(touched.profession && errors.profession)}>
            <InputLabel>Profession</InputLabel>
            <Select
              value={profession}
              label="Profession"
              onChange={e => {
                setProfession(e.target.value);
                setTouched(t => ({ ...t, profession: true }));
                if (e.target.value !== 'Entrepreneur') setCompanyName('');
              }}
              onBlur={() => setTouched(t => ({ ...t, profession: true }))}
            >
              <MenuItem value="">Select...</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Developer">Developer</MenuItem>
              <MenuItem value="Entrepreneur">Entrepreneur</MenuItem>
            </Select>
            {touched.profession && errors.profession && <FormHelperText>{errors.profession}</FormHelperText>}
          </FormControl>
          {profession === 'Entrepreneur' && (
            <TextField
              label="Company Name"
              fullWidth
              margin="normal"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, companyName: true }))}
              error={!!(touched.companyName && errors.companyName)}
              helperText={touched.companyName && errors.companyName ? errors.companyName : ''}
            />
          )}
          <TextField
            label="Address Line 1"
            fullWidth
            margin="normal"
            value={address1}
            onChange={e => setAddress1(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, address1: true }))}
            error={!!(touched.address1 && errors.address1)}
            helperText={touched.address1 && errors.address1 ? errors.address1 : ''}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="primary" onClick={prevStep}>Back</Button>
            <Button variant="contained" color="primary" type="submit">Next</Button>
          </Box>
        </form>
      </Paper>
    </Container>
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
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const API_KEY = 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==';
  const API_BASE = 'https://api.countrystatecity.in/v1';
  const headers = { 'X-CSCAPI-KEY': API_KEY };

  // Fetch countries on mount
  useEffect(() => {
    setLoadingCountries(true);
    fetch(`${API_BASE}/countries`, { headers })
      .then(res => res.json())
      .then(setCountries)
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setCities([]);
      return;
    }
    setLoadingStates(true);
    fetch(`${API_BASE}/countries/${formData.country}/states`, { headers })
      .then(res => res.json())
      .then(setStates)
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetch(`${API_BASE}/countries/${formData.country}/states/${formData.state}/cities`, { headers })
      .then(res => res.json())
      .then(setCities)
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Step 3: Preferences</Typography>
        <form onSubmit={handleNext} autoComplete="off">
          <FormControl fullWidth margin="normal" error={!!(touched.country && errors.country)}>
            <InputLabel>Country</InputLabel>
            <Select
              value={formData.country || ''}
              label="Country"
              onChange={e => setFormData({ ...formData, country: e.target.value, state: '', city: '' })}
            >
              <MenuItem value="">Select...</MenuItem>
              {loadingCountries ? <MenuItem disabled><CircularProgress size={20} /></MenuItem> : countries.map(c => (
                <MenuItem key={c.iso2} value={c.iso2}>{c.name}</MenuItem>
              ))}
            </Select>
            {touched.country && errors.country && <FormHelperText>{errors.country}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal" error={!!(touched.state && errors.state)}>
            <InputLabel>State</InputLabel>
            <Select
              value={formData.state || ''}
              label="State"
              onChange={e => setFormData({ ...formData, state: e.target.value, city: '' })}
              disabled={!states.length}
            >
              <MenuItem value="">Select...</MenuItem>
              {loadingStates ? <MenuItem disabled><CircularProgress size={20} /></MenuItem> : states.map(s => (
                <MenuItem key={s.iso2} value={s.iso2}>{s.name}</MenuItem>
              ))}
            </Select>
            {touched.state && errors.state && <FormHelperText>{errors.state}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal" error={!!(touched.city && errors.city)}>
            <InputLabel>City</InputLabel>
            <Select
              value={formData.city || ''}
              label="City"
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              disabled={!cities.length}
            >
              <MenuItem value="">Select...</MenuItem>
              {loadingCities ? <MenuItem disabled><CircularProgress size={20} /></MenuItem> : cities.map(c => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </Select>
            {touched.city && errors.city && <FormHelperText>{errors.city}</FormHelperText>}
          </FormControl>
          <FormControl component="fieldset" margin="normal">
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Subscription Plan:</Typography>
            <RadioGroup row value={plan} onChange={e => setPlan(e.target.value)}>
              <FormControlLabel value="Basic" control={<Radio />} label="Basic" />
              <FormControlLabel value="Pro" control={<Radio />} label="Pro" />
              <FormControlLabel value="Enterprise" control={<Radio />} label="Enterprise" />
            </RadioGroup>
          </FormControl>
          <FormControlLabel
            control={<Checkbox checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />}
            label="Subscribe to newsletter"
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="primary" onClick={prevStep}>Back</Button>
            <Button variant="contained" color="primary" type="submit">Next</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

function ReviewSubmit({ formData, prevStep, handleSubmit }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      let body;
      let headers = {};
      if (formData.photo) {
        body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'photo' && value) body.append('photo', value);
          else if (key !== 'photoPreview') body.append(key, value);
        });
      } else {
        body = { ...formData };
        delete body.photoPreview;
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
      }
      const response = await fetch(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/submit-profile'
          : '/submit-profile',
        {
          method: 'POST',
          body,
          headers,
        }
      );
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Submission failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 5, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>Thank you for submitting!</Typography>
        <Typography variant="subtitle1">Your details have been received.</Typography>
      </Paper>
    </Container>
  );

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>Review & Submit</Typography>
        <Box sx={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
          <Typography variant="h6" sx={{ mt: 2 }}>Personal Info</Typography>
          {formData.photoPreview && <Avatar src={formData.photoPreview} sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', mb: 2 }} />}
          <Typography><b>Username:</b> {formData.username}</Typography>
          {formData.newPassword && <Typography><b>Password:</b> (changed)</Typography>}
          <Typography variant="h6" sx={{ mt: 2 }}>Professional Details</Typography>
          <Typography><b>Profession:</b> {formData.profession}</Typography>
          {formData.profession === 'Entrepreneur' && <Typography><b>Company Name:</b> {formData.companyName}</Typography>}
          <Typography><b>Address Line 1:</b> {formData.address1}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Preferences</Typography>
          <Typography><b>Country:</b> {formData.country}</Typography>
          <Typography><b>State:</b> {formData.state}</Typography>
          <Typography><b>City:</b> {formData.city}</Typography>
          <Typography><b>Subscription Plan:</b> {formData.plan}</Typography>
          <Typography><b>Newsletter:</b> {formData.newsletter ? 'Yes' : 'No'}</Typography>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" color="primary" onClick={prevStep} disabled={loading}>Back</Button>
          <Button variant="contained" color="primary" onClick={onSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

const steps = ['Personal Info', 'Professional Details', 'Preferences', 'Review & Submit'];

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Stepper activeStep={step - 1} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {submitted ? (
        <Paper elevation={3} sx={{ mt: 8, p: 5, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>Thank you for submitting!</Typography>
          <Typography variant="subtitle1">Your details have been received.</Typography>
        </Paper>
      ) : (
        <>
          {step === 1 && <Step1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
          {step === 2 && <Step2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
          {step === 3 && <Step3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
          {step === 4 && <ReviewSubmit formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />}
        </>
      )}
    </Container>
  );
}

export default App;
