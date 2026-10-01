import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  school: z.string().min(1, 'School is required'),
  form: z.string().min(1, 'Form/Class is required'),
  department: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export const teacherRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  school: z.string().min(1, 'School is required'),
  department: z.string().min(1, 'Department is required'),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  staffNumber: z.string().optional(),
});

export const schoolRegistrationSchema = z.object({
  institutionName: z.string().min(2, 'Institution name is required'),
  location: z.string().min(2, 'Location is required'),
  district: z.string().min(2, 'District is required'),
  schoolType: z.string().min(1, 'School type is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  description: z.string().min(10, 'Description is required'),
  registrationNumber: z.string().optional(),
});

export const resourcePublishSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  subject: z.string().min(1, 'Subject is required'),
  department: z.string().min(1, 'Department is required'),
  form: z.string().min(1, 'Form/Class is required'),
  resourceType: z.enum(['book', 'paper', 'notes', 'video', 'pamphlet']),
  year: z.string().optional(),
  language: z.string().default('English'),
  author: z.string().min(2, 'Author is required'),
});

export const questionSchema = z.object({
  content: z.string().min(10, 'Question must be at least 10 characters'),
  subject: z.string().min(1, 'Subject is required'),
  bookId: z.string().optional(),
  chapter: z.string().optional(),
  pageNumber: z.string().optional(),
});

export const answerSchema = z.object({
  content: z.string().min(10, 'Answer must be at least 10 characters'),
});
