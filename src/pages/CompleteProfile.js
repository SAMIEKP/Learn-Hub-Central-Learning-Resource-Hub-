import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBook, IconUser, IconSchool, IconPhone, IconBuilding, IconArrowRight, IconX } from '@tabler/icons-react';
import { useAppStore } from '../store/useAppStore';
import { writeStoredValue } from '../utils/storage';
import './Auth.css';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, showAction } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    form: '',
    department: '',
    registrationNumber: '',
    phone: '',
    subjects: [],
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const subjects = [
    'Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'English',
    'Chichewa',
    'Geography',
    'History',
    'Agriculture',
    'Computer Studies',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Update user profile with additional information
    const updatedProfile = {
      ...user,
      school: formData.school || 'Not specified',
      form: formData.form || 'Not specified',
      department: formData.department || 'Not specified',
      registrationNumber: formData.registrationNumber || '',
      phone: formData.phone || '',
      subjects: selectedSubjects.join(', ') || 'Not specified',
    };

    // Store in localStorage
    writeStoredValue('learnhub-profile-details', updatedProfile);

    // Update store
    setTimeout(() => {
      showAction('Profile completed successfully!');
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleSkip = () => {
    showAction('You can complete your profile later in Settings.');
    navigate('/');
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container profile-container">
        <div className="auth-header">
          <div className="auth-logo">
            <IconUser size={32} />
          </div>
          <h1>Complete your profile</h1>
          <p>Add some details to personalize your experience (optional)</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="school">School</label>
            <div className="input-wrapper">
              <IconSchool size={18} className="input-icon" />
              <input
                id="school"
                name="school"
                type="text"
                placeholder="Blantyre Secondary School"
                value={formData.school}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="form">Class / Form</label>
            <div className="input-wrapper">
              <IconBook size={18} className="input-icon" />
              <select
                id="form"
                name="form"
                value={formData.form}
                onChange={handleChange}
              >
                <option value="">Select your form</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <div className="input-wrapper">
              <IconBuilding size={18} className="input-icon" />
              <input
                id="department"
                name="department"
                type="text"
                placeholder="Sciences & Technology"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="registrationNumber">Registration number (optional)</label>
            <div className="input-wrapper">
              <IconUser size={18} className="input-icon" />
              <input
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                placeholder="BS-24-0318"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone number (optional)</label>
            <div className="input-wrapper">
              <IconPhone size={18} className="input-icon" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+265 888 204 118"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Subjects of interest (optional)</label>
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className={`subject-chip ${selectedSubjects.includes(subject) ? 'active' : ''}`}
                  onClick={() => toggleSubject(subject)}
                >
                  {subject}
                  {selectedSubjects.includes(subject) && <IconX size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div className="auth-buttons">
            <button
              type="button"
              className="auth-button secondary"
              onClick={handleSkip}
            >
              Skip for now
            </button>
            <button type="submit" className="auth-button primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Complete profile'}
              {!isLoading && <IconArrowRight size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
