import { updateProfile } from './api/profiles';
import { supabase } from './lib/supabaseClient';

jest.mock('./lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}));

let mockSingle;
let mockSelect;
let mockEq;
let mockUpdate;

beforeEach(() => {
  jest.clearAllMocks();
  mockSingle = jest.fn();
  mockSelect = jest.fn(() => ({ single: mockSingle }));
  mockEq = jest.fn(() => ({ select: mockSelect }));
  mockUpdate = jest.fn(() => ({ eq: mockEq }));
  supabase.from.mockReturnValue({ update: mockUpdate });
  mockSingle.mockResolvedValue({
    data: { id: 'profile-user', full_name: 'Learner M Banda', school: 'Central School', form: 'Form 3' },
    error: null,
  });
});

test('persists profile edits to the authenticated Supabase profile', async () => {
  await expect(updateProfile('profile-user', {
    name: 'Learner M Banda',
    school: 'Central School',
    form: 'Form 3',
    department: '',
    subjects: ['Mathematics'],
    phone: '',
    registrationNumber: '',
    bio: '',
  })).resolves.toMatchObject({
    id: 'profile-user',
    full_name: 'Learner M Banda',
    school: 'Central School',
    form: 'Form 3',
  });

  expect(supabase.from).toHaveBeenCalledWith('profiles');
  expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
    full_name: 'Learner M Banda',
    school: 'Central School',
    form: 'Form 3',
    subjects: ['Mathematics'],
  }));
  expect(mockEq).toHaveBeenCalledWith('id', 'profile-user');
  expect(mockSelect).toHaveBeenCalled();
});
