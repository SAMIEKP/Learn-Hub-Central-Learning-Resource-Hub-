import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBook, IconUser, IconSchool, IconPhone, IconBuilding, IconArrowRight, IconX } from '@tabler/icons-react';
import { useAppStore } from '../store/useAppStore';
import { updateProfile } from '../api/profiles';
import { listVerifiedSchools, requestSchoolMembership } from '../api/schools';
import { supabase } from '../lib/supabaseClient';
import { writeStoredValue } from '../utils/storage';
import './Auth.css';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, showAction, updateUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [schools, setSchools] = useState([]);
  const [schoolsLoaded, setSchoolsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    form: '',
    department: '',
    registrationNumber: '',
    phone: '',
    subjects: [],
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    let isActive = true;
    if (!supabase) {
      setSchoolsLoaded(true);
      return undefined;
    }
    listVerifiedSchools()
      .then((items) => {
        if (isActive) setSchools(items);
      })
      .catch(() => {
        if (isActive) setFeedback('Verified schools are temporarily unavailable. You can save the rest of your profile and choose one later.');
      })
      .finally(() => {
        if (isActive) setSchoolsLoaded(true);
      });
    return () => {
      isActive = false;
    };
  }, []);

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
    setFeedback('');

    const selectedSchool = schools.find((school) => school.name === formData.school.trim());
    if (supabase && !schoolsLoaded && formData.school.trim()) {
      setFeedback('Verified schools are still loading. Please try again in a moment.');
      setIsLoading(false);
      return;
    }
    if (supabase && schoolsLoaded && formData.school.trim() && !selectedSchool) {
      setFeedback('Choose a verified school from the suggestions.');
      setIsLoading(false);
      return;
    }

    const updatedProfile = {
      ...user,
      school: formData.school || 'Not specified',
      form: formData.form || 'Not specified',
      department: formData.department || 'Not specified',
      registrationNumber: formData.registrationNumber || '',
      phone: formData.phone || '',
      subjects: selectedSubjects.join(', ') || 'Not specified',
    };

    try {
      if (selectedSchool && user?.id) {
        await requestSchoolMembership({ userId: user.id, schoolId: selectedSchool.id });
      }
      if (user?.id) {
        await updateProfile(user.id, {
          name: user.name,
          school: formData.school.trim(),
          form: formData.form,
          department: formData.department.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          phone: formData.phone.trim(),
          subjects: selectedSubjects,
          bio: '',
          avatarPath: null,
        });
      }

      writeStoredValue('learnhub-profile-details', updatedProfile);
      updateUser(updatedProfile);
      showAction(selectedSchool ? 'Profile saved. Your school membership is awaiting approval.' : 'Profile completed successfully!');
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Unable to save the LearnHub profile:', error);
      setFeedback('Unable to save your profile right now. Please try again.');
      setIsLoading(false);
    }
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
    <div className="auth-page auth-profile-page">
      <div className="auth-container profile-container">
        <div className="auth-header">
          <div className="auth-logo">
            <IconUser size={32} />
          </div>
          <h1>Complete your profile</h1>
          <p>Add some details to personalize your experience (optional)</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {feedback && <p className="auth-feedback" role="alert">{feedback}</p>}
          <div className="form-group">
            <label htmlFor="school">School</label>
            <div className="input-wrapper">
              <IconSchool size={18} className="input-icon" />
              <input
                id="school"
                name="school"
                type="text"
                list={schools.length ? 'verified-schools' : undefined}
                placeholder="Blantyre Secondary School"
                value={formData.school}
                onChange={handleChange}
              />
              {schools.length > 0 && <datalist id="verified-schools">{schools.map((school) => <option key={school.id} value={school.name}>{school.district || ''}</option>)}</datalist>}
            </div>
            {supabase && schoolsLoaded && <small className="form-help-text">Choose a verified school to submit a membership request.</small>}
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
