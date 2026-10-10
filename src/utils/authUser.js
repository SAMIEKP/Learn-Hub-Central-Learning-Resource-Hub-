export function toAppUser(user, profile = {}) {
  const email = user?.primaryEmailAddress?.emailAddress
    || user?.emailAddresses?.[0]?.emailAddress
    || user?.email
    || '';
  const role = profile.role === 'teacher' || profile.role === 'admin'
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : 'Student';

  return {
    id: user.id || user.userId,
    name: profile.full_name || user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || email.split('@')[0] || 'LearnHub Student',
    email,
    role,
    school: profile.school || 'Not specified',
    form: profile.form || '',
    department: profile.department || '',
    registrationNumber: profile.registration_number || '',
    phone: profile.phone || '',
    subjects: Array.isArray(profile.subjects) ? profile.subjects.join(', ') : '',
    image: user.imageUrl || null,
  };
}
