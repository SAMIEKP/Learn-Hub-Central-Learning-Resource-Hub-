import { updateProfile } from './api/profiles';
import { supabase } from './lib/supabaseClient';

jest.mock('./lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}));

let mockSingle;
let mockLookupEq;
let mockLookupSelect;
let mockMaybeSingle;
let mockWriteEq;
let mockWriteSelect;
let mockUpdate;
let mockInsert;

beforeEach(() => {
  jest.clearAllMocks();
  mockSingle = jest.fn();
  mockMaybeSingle = jest.fn().mockResolvedValue({
    data: { id: 'profile-user' },
    error: null,
  });
  mockLookupEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  mockLookupSelect = jest.fn(() => ({ eq: mockLookupEq }));
  mockWriteSelect = jest.fn(() => ({ single: mockSingle }));
  mockWriteEq = jest.fn(() => ({ select: mockWriteSelect }));
  mockUpdate = jest.fn(() => ({ eq: mockWriteEq }));
  mockInsert = jest.fn(() => ({ select: mockWriteSelect }));
  supabase.from.mockReturnValue({
    select: mockLookupSelect,
    update: mockUpdate,
    insert: mockInsert,
  });
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
  expect(mockWriteEq).toHaveBeenCalledWith('id', 'profile-user');
  expect(mockWriteSelect).toHaveBeenCalled();
});

test('creates a profile when the authenticated user has no profile row', async () => {
  mockMaybeSingle.mockResolvedValue({ data: null, error: null });

  await updateProfile('profile-user', {
    name: 'Learner M Banda',
    school: 'Central School',
    form: 'Form 3',
    department: '',
    subjects: ['Mathematics'],
    phone: '',
    registrationNumber: '',
    bio: '',
  });

  expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
    id: 'profile-user',
    full_name: 'Learner M Banda',
    school: 'Central School',
  }));
  expect(mockUpdate).not.toHaveBeenCalled();
});
