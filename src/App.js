import { useState } from 'react';
import {
  IconHome,
  IconVideo,
  IconUserCheck,
  IconSearch,
  IconBell,
  IconCompass,
  IconBook,
  IconUser,
  IconSparkles,
  IconSettings,
} from '@tabler/icons-react';
import './App.css';
import logo from './logo.svg';

const libraryItems = [
  {
    id: 'lib-1',
    title: 'Physical Science Form 4 - Organic Chemistry',
    type: 'book',
    author: 'Mr. P. Gondwe · Head of Physics',
    school: 'Blantyre Secondary School',
    meta: 'Science · Form 4',
    fileSize: '12.4 MB',
    downloadDate: 'Sep 15, 2024',
    progress: 68,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-2',
    title: 'MSCE Mathematics Paper 2 (2023)',
    type: 'paper',
    board: 'MANEB National Exam',
    year: '2023',
    meta: 'Mathematics · Form 4',
    fileSize: '3.2 MB',
    downloadDate: 'Sep 14, 2024',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-3',
    title: 'Chemistry Lab Experiments Video Series',
    type: 'video',
    instructor: 'Dr. F. Nyirenda',
    duration: '2h 45m',
    meta: 'Chemistry · Form 3 & 4',
    fileSize: '856 MB',
    downloadDate: 'Sep 12, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-4',
    title: 'English Grammar & Comprehension Mastery',
    type: 'book',
    author: 'Mrs. L. Phiri · English Dept',
    school: 'Blantyre Secondary School',
    meta: 'Languages · Form 3',
    fileSize: '8.7 MB',
    downloadDate: 'Sep 10, 2024',
    progress: 42,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-5',
    title: 'Biology Form 3 Notes',
    type: 'book',
    author: 'Ministry of Education',
    meta: 'Biology · Form 3',
    fileSize: '15.1 MB',
    downloadDate: 'Sep 8, 2024',
    progress: 72,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-6',
    title: 'IGCSE Biology Extended Mock Paper (2024)',
    type: 'paper',
    board: 'Cambridge Assessment',
    year: '2024',
    meta: 'Biology · Extended Theory',
    fileSize: '4.5 MB',
    downloadDate: 'Sep 5, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-7',
    title: 'Physics Practical Laboratory Handbook',
    type: 'book',
    school: 'Kamuzu Academy',
    teacher: 'Dept. of Natural Sciences',
    meta: 'Physics · Lab Manual',
    fileSize: '22.3 MB',
    downloadDate: 'Sep 3, 2024',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lib-8',
    title: 'Mathematics Video Tutorial: Calculus Basics',
    type: 'video',
    instructor: 'Prof. K. Chirwa',
    duration: '1h 30m',
    meta: 'Mathematics · Form 4',
    fileSize: '645 MB',
    downloadDate: 'Sep 1, 2024',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  }
];

const savedResources = [
  {
    id: 'saved-1',
    title: 'Advanced Organic Chemistry Reactions',
    type: 'book',
    author: 'Dr. F. Nyirenda',
    meta: 'Chemistry · Form 4',
    savedDate: 'Sep 12, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'saved-2',
    title: 'Quantum Physics Introduction',
    type: 'book',
    author: 'Prof. K. Chirwa',
    meta: 'Physics · Form 4',
    savedDate: 'Sep 10, 2024',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'saved-3',
    title: 'Statistical Analysis Methods',
    type: 'paper',
    board: 'MANEB',
    year: '2024',
    meta: 'Mathematics · Form 4',
    savedDate: 'Sep 8, 2024',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  }
];

const personalCollections = [
  {
    id: 'coll-1',
    name: 'Chemistry Study Pack',
    itemCount: 12,
    lastUpdated: 'Sep 15, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'coll-2',
    name: 'Physics Formula Collection',
    itemCount: 8,
    lastUpdated: 'Sep 10, 2024',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'coll-3',
    name: 'Mathematics Past Papers',
    itemCount: 15,
    lastUpdated: 'Sep 5, 2024',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  }
];

const completedResources = [
  {
    id: 'comp-1',
    title: 'Biology Form 2 Complete Notes',
    type: 'book',
    author: 'Ministry of Education',
    meta: 'Biology · Form 2',
    completedDate: 'Aug 25, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'comp-2',
    title: 'MSCE English Paper 1 (2023)',
    type: 'paper',
    board: 'MANEB',
    year: '2023',
    meta: 'English · Form 4',
    completedDate: 'Aug 20, 2024',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  }
];

const savedVideos = [
  {
    id: 'vid-1',
    title: 'Chemistry Balancing Equations',
    instructor: 'Dr. F. Nyirenda',
    duration: '45m',
    meta: 'Chemistry · Form 3',
    savedDate: 'Sep 14, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid-2',
    title: 'Physics Wave Properties',
    instructor: 'Prof. K. Chirwa',
    duration: '1h 15m',
    meta: 'Physics · Form 4',
    savedDate: 'Sep 8, 2024',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  }
];

const readingActivity = [
  {
    id: 'act-1',
    title: 'Physical Science Form 4 - Organic Chemistry',
    activity: 'Read Chapter 5',
    date: 'Sep 15, 2024',
    timeSpent: '45 mins',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'act-2',
    title: 'English Grammar & Comprehension',
    activity: 'Completed Quiz',
    date: 'Sep 14, 2024',
    timeSpent: '30 mins',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  }
];

const resourceHistory = [
  {
    id: 'hist-1',
    title: 'Mathematics Form 3 Algebra',
    action: 'Downloaded',
    date: 'Sep 15, 2024',
    type: 'book',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hist-2',
    title: 'Biology Lab Manual',
    action: 'Opened',
    date: 'Sep 14, 2024',
    type: 'book',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hist-3',
    title: 'Chemistry Past Paper 2024',
    action: 'Completed',
    date: 'Sep 10, 2024',
    type: 'paper',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  }
];

// Discovery Feed Posts
const discoveryPosts = [
  {
    id: 'post-1',
    type: 'question',
    author: 'Sarah Banda',
    authorAvatar: 'SB',
    school: 'Blantyre Secondary School',
    time: '2 hours ago',
    content: 'Can someone help me understand the difference between ionic and covalent bonds? I\'m struggling with the electron transfer concept in Chemistry Form 3.',
    subject: 'Chemistry',
    likes: 24,
    comments: 8,
    shares: 3
  },
  {
    id: 'post-2',
    type: 'book',
    author: 'Mr. K. Moyo',
    authorAvatar: 'KM',
    school: 'Blantyre Secondary School',
    time: '4 hours ago',
    title: 'Advanced Mathematics: Calculus & Integration',
    description: 'Just uploaded comprehensive notes on calculus covering derivatives, integrals, and their applications. Perfect for Form 4 students preparing for MSCE.',
    subject: 'Mathematics',
    file: '15.2 MB',
    likes: 56,
    comments: 12,
    shares: 8,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-3',
    type: 'paper',
    author: 'MANEB Examination Board',
    authorAvatar: 'ME',
    school: 'National Examination Board',
    time: '6 hours ago',
    title: 'MSCE Physical Science Paper 1 (2024) - Marking Scheme',
    description: 'Official marking scheme for the 2024 MSCE Physical Science Paper 1. Includes detailed step-by-step solutions and examiner comments.',
    subject: 'Physical Science',
    year: '2024',
    likes: 89,
    comments: 15,
    shares: 22,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-4',
    type: 'video',
    author: 'Dr. F. Nyirenda',
    authorAvatar: 'FN',
    school: 'University of Malawi',
    time: '8 hours ago',
    title: 'Chemistry Lab Safety & Equipment Tutorial',
    description: 'Complete guide to laboratory safety protocols and proper equipment handling. Essential for all science students.',
    subject: 'Chemistry',
    duration: '45 mins',
    likes: 34,
    comments: 6,
    shares: 11,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-5',
    type: 'question',
    author: 'John Phiri',
    authorAvatar: 'JP',
    school: 'Marist Secondary School',
    time: '12 hours ago',
    content: 'What are the main causes of the Greenhouse Effect? I need to explain this for my Geography project and want to make sure I have the right information.',
    subject: 'Geography',
    likes: 18,
    comments: 14,
    shares: 2
  },
  {
    id: 'post-6',
    type: 'book',
    author: 'Mrs. L. Phiri',
    authorAvatar: 'LP',
    school: 'Blantyre Secondary School',
    time: '1 day ago',
    title: 'English Literature: Macbeth Study Guide',
    description: 'Detailed analysis of Shakespeare\'s Macbeth with character breakdowns, themes, and key quotes. Includes practice questions and essay tips.',
    subject: 'English',
    file: '8.7 MB',
    likes: 72,
    comments: 9,
    shares: 15,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-7',
    type: 'paper',
    author: 'Cambridge Assessment',
    authorAvatar: 'CA',
    school: 'Cambridge International',
    time: '1 day ago',
    title: 'IGCSE Biology Extended Theory Paper (2024)',
    description: 'Latest IGCSE Biology extended theory paper with comprehensive marking scheme. Ideal for Cambridge curriculum students.',
    subject: 'Biology',
    year: '2024',
    likes: 67,
    comments: 11,
    shares: 19,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-8',
    type: 'video',
    author: 'Prof. K. Chirwa',
    authorAvatar: 'KC',
    school: 'University of Malawi',
    time: '2 days ago',
    title: 'Physics: Wave Properties & Sound',
    description: 'In-depth explanation of wave properties including frequency, amplitude, wavelength, and the physics of sound. Perfect for Form 3 and 4 students.',
    subject: 'Physics',
    duration: '1h 20m',
    likes: 45,
    comments: 8,
    shares: 13,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  }
];

const continueReading = [
  {
    id: 'cr-1',
    title: 'Physical Science Form 4 - Organic Chemistry',
    author: 'Mr. P. Gondwe · Head of Physics',
    school: 'Blantyre Secondary School',
    meta: 'Science · Form 4',
    progress: 68,
    lastChapter: 'Chapter 6: Hydrocarbons & Alkanes',
    pageInfo: 'Page 42 of 64',
    timeLeft: '45 mins left',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    lastAccessed: '2 hours ago'
  },
  {
    id: 'cr-2',
    title: 'English Grammar & Comprehension Mastery',
    author: 'Mrs. L. Phiri · English Dept',
    school: 'Blantyre Secondary School',
    meta: 'Languages · Form 3',
    progress: 42,
    lastChapter: 'Unit 4: Advanced Argumentative Essays',
    pageInfo: 'Page 28 of 75',
    timeLeft: '1h 20m left',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    lastAccessed: 'Yesterday'
  }
];

const recommendations = [
  {
    id: 1,
    title: 'Biology Form 3 Notes',
    author: 'Ministry of Education',
    meta: 'Biology · Form 3',
    rating: '4.8',
    reviews: '1.2k',
    progress: 72,
    timeLeft: '1h 15m left',
    format: 'Study Guide',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Mathematics Past Papers',
    author: 'MANEB Board',
    meta: 'Mathematics · Form 4',
    rating: '4.9',
    reviews: '2.8k',
    progress: 45,
    timeLeft: '2h 40m left',
    format: 'Past Papers',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Chichewa Revision Guide',
    author: 'Prof. E. Chadza',
    meta: 'Languages · Form 2',
    rating: '4.7',
    reviews: '860',
    progress: 88,
    timeLeft: '35m left',
    format: 'Revision',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Science Study Handbook',
    author: 'National Science Council',
    meta: 'Science · Form 1',
    rating: '4.6',
    reviews: '640',
    progress: 25,
    timeLeft: '3h 50m left',
    format: 'Handbook',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
];

const pastPapers = [
  {
    id: 'pp-1',
    title: 'MSCE Physical Science Paper 1 (2024)',
    board: 'MANEB National Exam',
    year: '2024',
    meta: 'Physical Science · Form 4',
    downloads: '4.2k',
    rating: '4.9',
    badge: 'Marking Scheme Included',
    format: 'Exam Paper',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pp-2',
    title: 'MSCE Mathematics Paper 2 (2023)',
    board: 'MANEB National Exam',
    year: '2023',
    meta: 'Mathematics · Form 4',
    downloads: '6.1k',
    rating: '4.8',
    badge: 'Step-by-Step Solutions',
    format: 'Exam Paper',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pp-3',
    title: 'IGCSE Biology Extended Mock Paper (2024)',
    board: 'Cambridge Assessment',
    year: '2024',
    meta: 'Biology · Extended Theory',
    downloads: '1.8k',
    rating: '4.7',
    badge: 'With Examiner Notes',
    format: 'Mock Exam',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pp-4',
    title: 'MSCE Geography & Environmental Studies (2023)',
    board: 'MANEB National Exam',
    year: '2023',
    meta: 'Geography · Form 4',
    downloads: '2.3k',
    rating: '4.6',
    badge: 'Full Mapwork Included',
    format: 'Exam Paper',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80'
  }
];

const schoolUploads = [
  {
    id: 'su-1',
    title: 'Form 4 Term 2 Chemistry Mock Paper',
    teacher: 'Mr. K. Moyo · Head of Chemistry',
    school: 'Blantyre Secondary School',
    date: '2 days ago',
    rating: '4.9',
    meta: 'Chemistry · Form 4',
    badge: 'School Verified',
    format: 'Term Mock',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'su-2',
    title: 'Advanced Calculus & Trigonometry Revision',
    teacher: 'Mrs. V. Chiume · Math Dept',
    school: 'Blantyre Secondary School',
    date: '3 days ago',
    rating: '4.8',
    meta: 'Mathematics · Form 4',
    badge: 'School Verified',
    format: 'Revision Notes',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'su-3',
    title: 'English Literature Key Themes: Macbeth',
    teacher: 'Mr. D. Mwale · Languages',
    school: 'Blantyre Secondary School',
    date: '5 days ago',
    rating: '4.7',
    meta: 'Literature · Form 3 & 4',
    badge: 'School Verified',
    format: 'Study Guide',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'su-4',
    title: 'History of Central Africa - Key MSCE Topics',
    teacher: 'Mrs. C. Banda · Social Studies',
    school: 'Blantyre Secondary School',
    date: '1 week ago',
    rating: '4.6',
    meta: 'History · Form 4',
    badge: 'School Verified',
    format: 'Notes & Questions',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
  }
];

const followedSchools = [
  {
    id: 'fs-1',
    title: 'Physics Practical Laboratory Handbook',
    school: 'Kamuzu Academy',
    location: 'Mtunthama',
    teacher: 'Dept. of Natural Sciences',
    followers: '12.4k followers',
    rating: '5.0',
    meta: 'Physics · Lab Manual',
    badge: 'Kamuzu Academy',
    format: 'Lab Manual',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fs-2',
    title: 'Top 50 Geometry Proofs with Worked Steps',
    school: 'Marist Secondary School',
    location: 'Dedza',
    teacher: 'Marist Math Union',
    followers: '8.2k followers',
    rating: '4.9',
    meta: 'Mathematics · Form 3 & 4',
    badge: 'Marist Secondary',
    format: 'Formula & Proofs',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fs-3',
    title: 'Cell Biology & Genetics Simplified Guide',
    school: "St. Patrick's Academy",
    location: 'Blantyre',
    teacher: 'Bio-Science Dept',
    followers: '9.1k followers',
    rating: '4.8',
    meta: 'Biology · Form 3',
    badge: "St. Patrick's",
    format: 'Summary Booklet',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fs-4',
    title: 'Agriculture Science Field Projects & Notes',
    school: 'Marymount Catholic Secondary',
    location: 'Mzuzu',
    teacher: 'Agri-Tech Educators',
    followers: '6.7k followers',
    rating: '4.7',
    meta: 'Agriculture · Form 4',
    badge: 'Marymount Girls',
    format: 'Full Notes',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
  }
];

const popularResources = [
  {
    id: 'pop-1',
    title: 'Complete MSCE Chemistry Formulae & Equations',
    author: 'Malawi Association of Science Teachers',
    meta: 'Chemistry · Form 1 - 4',
    rating: '4.9',
    reviews: '3.4k',
    downloads: '14.8k downloads',
    trendBadge: '🔥 #1 Most Popular',
    format: 'Quick Reference',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pop-2',
    title: 'Speed Mathematics & Mental Calculation Techniques',
    author: 'Dr. G. Tembo',
    meta: 'Mathematics · All Forms',
    rating: '4.9',
    reviews: '2.9k',
    downloads: '11.2k downloads',
    trendBadge: '🔥 #2 Trending',
    format: 'Masterclass',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pop-3',
    title: 'Senior Secondary Chichewa Grammar & Essay Writing',
    author: 'National Chichewa Curriculum Panel',
    meta: 'Languages · Form 3 & 4',
    rating: '4.8',
    reviews: '1.9k',
    downloads: '8.4k downloads',
    trendBadge: '🔥 #3 Trending',
    format: 'Core Textbook',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pop-4',
    title: 'Computer Studies & Basic Python Programming',
    author: 'STEM Malawi Initiative',
    meta: 'Computer Science · Form 1-4',
    rating: '4.9',
    reviews: '2.1k',
    downloads: '9.6k downloads',
    trendBadge: '🔥 #4 Trending',
    format: 'Interactive Guide',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80'
  }
];

const recentlyAdded = [
  {
    id: 'rec-1',
    title: '2025/2026 National Mock Predictions & Solved Questions',
    author: 'Senior Examination Syndicate',
    meta: 'All Sciences · Form 4',
    dateBadge: 'Just Added · Today',
    rating: '4.9',
    format: 'New Release',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-2',
    title: 'Physical Geography Fieldwork & Topographical Maps',
    author: 'Dept. of Educational Planning',
    meta: 'Geography · Form 3 & 4',
    dateBadge: 'Added 1 day ago',
    rating: '4.7',
    format: 'New Release',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-3',
    title: 'Junior Secondary Science Worksheets & Experiments',
    author: 'Central Region Science Teachers',
    meta: 'Integrated Science · Form 1 & 2',
    dateBadge: 'Added 2 days ago',
    rating: '4.8',
    format: 'Workbook',
    image: 'https://images.unsplash.com/photo-1507842229452-9653a992d9d9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-4',
    title: 'Principles of Accounts & Ledger Balance Mastery',
    author: 'Commercial Educators Association',
    meta: 'Accounting · Form 3 & 4',
    dateBadge: 'Added 3 days ago',
    rating: '4.6',
    format: 'Practical Guide',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  }
];

const departmentResources = [
  {
    id: 'dept-1',
    title: 'Advanced Organic Reactions & Reaction Mechanisms',
    dept: 'Sciences & Technology',
    subject: 'Chemistry',
    level: 'Form 4',
    rating: '4.9',
    author: 'Dr. F. Nyirenda',
    format: 'Dept Specialized',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dept-2',
    title: 'Electromagnetism, Quantum Concepts & Wave Optics',
    dept: 'Sciences & Technology',
    subject: 'Physics',
    level: 'Form 4',
    rating: '4.8',
    author: 'Prof. K. Chirwa',
    format: 'Dept Specialized',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dept-3',
    title: 'Human Physiology, Genetics & Population Ecology',
    dept: 'Sciences & Technology',
    subject: 'Biology',
    level: 'Form 3 & 4',
    rating: '4.9',
    author: 'Dr. M. Chimbwandira',
    format: 'Dept Specialized',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dept-4',
    title: 'Algorithms, Data Structures & Python Scripting',
    dept: 'Sciences & Technology',
    subject: 'Computer Studies',
    level: 'Form 3 & 4',
    rating: '4.9',
    author: 'Eng. S. Kumwenda',
    format: 'Dept Specialized',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80'
  }
];

const categories = [
  { name: 'Sciences & Technology', count: '142 resources', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80', color: 'category-purple' },
  { name: 'Mathematics Department', count: '98 resources', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80', color: 'category-cream' },
  { name: 'Languages Department', count: '86 resources', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80', color: 'category-blue' },
  { name: 'Social Studies Department', count: '64 resources', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80', color: 'category-orange' },
  { name: 'Business & Commerce Dept', count: '52 resources', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80', color: 'category-green' },
  { name: 'Computer Studies Dept', count: '45 resources', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=300&q=80', color: 'category-teal' },
];

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All STEM');
  const [currentPage, setCurrentPage] = useState('home');

  const handleMainScroll = (event) => {
    const scrollTop = event.currentTarget.scrollTop;
    if (scrollTop > 50) {
      setIsHeaderShrunk(true);
    } else if (scrollTop < 20) {
      setIsHeaderShrunk(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/" className="brand-link">
          <img src={logo} alt="Learn Hub Logo" className="brand-logo" />
          <span>Learn Hub</span>
        </a>

        <p className="sidebar-label">Main navigation</p>
        <nav aria-label="Sidebar navigation" className="sidebar-nav">
          <a href="#home" className={`sidebar-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>
            <IconHome size={17} stroke={2} />
            <span>Home</span>
          </a>
          <a href="#library" className={`sidebar-link ${currentPage === 'library' ? 'active' : ''}`} onClick={() => setCurrentPage('library')}>
            <IconBook size={17} stroke={2} />
            <span>Library</span>
          </a>
          <a href="#discover" className={`sidebar-link ${currentPage === 'discover' ? 'active' : ''}`} onClick={() => setCurrentPage('discover')}>
            <IconCompass size={17} stroke={2} />
            <span>Discover</span>
          </a>
          <a href="#notifications" className="sidebar-link">
            <IconBell size={17} stroke={2} />
            <span>Notifications</span>
          </a>
          <a href="#profile" className="sidebar-link">
            <IconUser size={17} stroke={2} />
            <span>Profile</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#publisher-studio" className="sidebar-link">
            <IconSparkles size={17} stroke={2} />
            <span>Publisher Studio</span>
          </a>
          <a href="#settings" className="sidebar-link">
            <IconSettings size={17} stroke={2} />
            <span>Settings</span>
          </a>
        </div>
      </aside>

      <main
        className="discovery-page"
        id={currentPage}
        onScroll={handleMainScroll}
      >
        {currentPage === 'home' ? (
          <>
        <div className="discovery-top">
          <header className={`topbar${isHeaderShrunk ? ' is-compact' : ''}`}>
          <div className="header-main">
            <div className="page-heading">
              <h1>Home</h1>
            </div>
            <div className="header-search-row">
              <form className="book-search" role="search" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="category" className="visually-hidden">Choose a category</label>
                <select id="category" defaultValue="all">
                  <option value="all">All Categories</option>
                  <option value="sciences">Sciences &amp; STEM</option>
                  <option value="math">Mathematics</option>
                  <option value="languages">Languages &amp; Literature</option>
                  <option value="social">Social Studies</option>
                  <option value="business">Business &amp; Commerce</option>
                </select>
                <span className="search-divider" aria-hidden="true" />
                <label htmlFor="book-search-input" className="visually-hidden">Search books</label>
                <input id="book-search-input" type="search" placeholder="Find books, past papers, notes..." />
                <button type="submit" className="search-submit-btn">Search</button>
              </form>
              <span className="search-baseline" aria-hidden="true" />
            </div>
          </div>
          <div className="user-actions">
            <div className="user-avatar">DW</div>
            <span className="user-name">Davis Workman</span>
            <button type="button" className="notification-button" aria-label="View notifications">
              <span>Notifications</span>
              <span className="notification-dot" aria-hidden="true" />
            </button>
          </div>
          </header>
        </div>

        <div className="discovery-bottom">
          <section className="discovery-content">
          <div className="discover-tabs-bar">
            <nav className="discover-tabs-track" aria-label="Discover resource types">
              <button
                type="button"
                className={`discover-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Resources
              </button>
              <button
                type="button"
                className={`discover-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}
              >
                Books &amp; Notes
              </button>
              <button
                type="button"
                className={`discover-tab-btn ${activeTab === 'papers' ? 'active' : ''}`}
                onClick={() => setActiveTab('papers')}
              >
                Past Papers
              </button>
              <button
                type="button"
                className={`discover-tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
                onClick={() => setActiveTab('schools')}
              >
                School Uploads
              </button>
            </nav>
          </div>

          {/* 1. Continue Reading Section */}
          <section className="shelf-section continue-reading-section" aria-labelledby="continue-reading-heading">
            <div className="section-heading">
              <div>
                <h2 id="continue-reading-heading">Continue Reading</h2>
              </div>
              <a href="#all-reading" className="view-all">View library</a>
            </div>
            <div className="continue-reading-grid">
              {continueReading.map((item) => (
                <article className="continue-card" key={item.id}>
                  <div className="continue-cover-wrapper">
                    <img className="continue-cover" src={item.image} alt={item.title} />
                    <span className="continue-badge">Active</span>
                  </div>
                  <div className="continue-details">
                    <div className="continue-meta-top">
                      <span className="continue-tag">{item.meta}</span>
                      <span className="continue-accessed">{item.lastAccessed}</span>
                    </div>
                    <h3 className="continue-title">{item.title}</h3>
                    <p className="continue-author">{item.author} · {item.school}</p>
                    <p className="continue-chapter">{item.lastChapter}</p>

                    <div className="continue-progress-wrap">
                      <div className="kindle-progress-track">
                        <div className="kindle-progress-fill" style={{ width: `${item.progress}%` }} />
                      </div>
                      <div className="continue-progress-stats">
                        <span>{item.progress}% completed ({item.pageInfo})</span>
                        <span className="time-badge">{item.timeLeft}</span>
                      </div>
                    </div>

                    <div className="continue-action-row">
                      <button type="button" className="resume-read-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Resume Reading
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 2. Book Recommendation Section */}
          <section className="shelf-section recommendation-section" aria-labelledby="recommendations-heading">
            <div className="section-heading">
              <div>
                <h2 id="recommendations-heading">Book Recommendation</h2>
              </div>
              <a href="#all-books" className="view-all">View all</a>
            </div>
            <div className="recommendation-shelf">
              {recommendations.map((book) => (
                <article className="kindle-book-card" key={book.title}>
                  <div className="kindle-thumbnail-wrapper">
                    <img className="book-cover" src={book.image} alt={`${book.title} cover`} />
                    <span className="kindle-badge">{book.format}</span>
                    <button type="button" className="save-book" aria-label={`Save ${book.title}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="kindle-info">
                    <div className="kindle-meta-row">
                      <span className="kindle-meta-tag">{book.meta}</span>
                      <div className="kindle-rating">
                        <span className="star-icon">★</span>
                        <span className="rating-val">{book.rating}</span>
                      </div>
                    </div>

                    <h3 className="kindle-title" title={book.title}>{book.title}</h3>
                    <p className="kindle-author">{book.author}</p>

                    <div className="kindle-progress-section">
                      <div className="kindle-progress-track">
                        <div
                          className="kindle-progress-fill"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <div className="kindle-progress-meta">
                        <span className="progress-percent">{book.progress}% read</span>
                        <span className="progress-time">{book.timeLeft}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 3. Recommended Past Papers Section */}
          <section className="shelf-section past-papers-section" aria-labelledby="past-papers-heading">
            <div className="section-heading">
              <div>
                <h2 id="past-papers-heading">Recommended Past Papers</h2>
              </div>
              <a href="#all-past-papers" className="view-all">View all papers</a>
            </div>
            <div className="recommendation-shelf">
              {pastPapers.map((paper) => (
                <article className="kindle-book-card paper-card" key={paper.id}>
                  <div className="kindle-thumbnail-wrapper">
                    <img className="book-cover" src={paper.image} alt={paper.title} />
                    <span className="kindle-badge paper-year-badge">{paper.year}</span>
                    <button type="button" className="save-book" aria-label={`Save ${paper.title}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="kindle-info">
                    <div className="kindle-meta-row">
                      <span className="kindle-meta-tag">{paper.meta}</span>
                      <div className="kindle-rating">
                        <span className="star-icon">★</span>
                        <span className="rating-val">{paper.rating}</span>
                      </div>
                    </div>
                    <h3 className="kindle-title" title={paper.title}>{paper.title}</h3>
                    <p className="kindle-author">{paper.board}</p>
                    <div className="paper-highlight-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      <span>{paper.badge}</span>
                    </div>
                    <div className="paper-footer-stats">
                      <span>📥 {paper.downloads}</span>
                      <button type="button" className="quick-preview-btn">Download PDF</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 4. Latest Uploads from the Student's School */}
          <section className="shelf-section school-uploads-section" aria-labelledby="school-uploads-heading">
            <div className="section-heading">
              <div>
                <h2 id="school-uploads-heading">Latest Uploads from Your School</h2>
              </div>
              <a href="#my-school" className="view-all">View school portal</a>
            </div>
            <div className="recommendation-shelf">
              {schoolUploads.map((item) => (
                <article className="kindle-book-card school-card" key={item.id}>
                  <div className="kindle-thumbnail-wrapper">
                    <img className="book-cover" src={item.image} alt={item.title} />
                    <span className="kindle-badge school-verified-tag">Verified</span>
                    <button type="button" className="save-book" aria-label={`Save ${item.title}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="kindle-info">
                    <div className="kindle-meta-row">
                      <span className="kindle-meta-tag">{item.meta}</span>
                      <span className="item-date-text">{item.date}</span>
                    </div>
                    <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                    <p className="kindle-author">{item.teacher}</p>
                    <div className="school-origin-row">
                      <span className="school-icon-badge">🏛️</span>
                      <span className="school-origin-name">{item.school}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 5. New Content from Followed Schools */}
          <section className="shelf-section followed-schools-section" aria-labelledby="followed-schools-heading">
            <div className="section-heading">
              <div>
                <h2 id="followed-schools-heading">New Content from Followed Schools</h2>
              </div>
              <a href="#followed-schools" className="view-all">Manage schools</a>
            </div>
            <div className="recommendation-shelf">
              {followedSchools.map((item) => (
                <article className="kindle-book-card followed-card" key={item.id}>
                  <div className="kindle-thumbnail-wrapper">
                    <img className="book-cover" src={item.image} alt={item.title} />
                    <span className="kindle-badge school-inst-badge">{item.badge}</span>
                    <button type="button" className="save-book" aria-label={`Save ${item.title}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="kindle-info">
                    <div className="kindle-meta-row">
                      <span className="kindle-meta-tag">{item.meta}</span>
                      <div className="kindle-rating">
                        <span className="star-icon">★</span>
                        <span className="rating-val">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                    <p className="kindle-author">{item.school} · {item.location}</p>
                    <div className="followers-count-tag">
                      <span>👥 {item.followers}</span>
                      <span className="follower-active-dot" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 6. Popular Resources */}
          <section className="shelf-section popular-section" aria-labelledby="popular-heading">
            <div className="section-heading">
              <div>
                <h2 id="popular-heading">Popular Resources</h2>
              </div>
              <a href="#popular" className="view-all">Explore leaderboard</a>
            </div>
            <div className="recommendation-shelf">
              {popularResources.map((item) => (
                <article className="kindle-book-card popular-item-card" key={item.id}>
                  <div className="kindle-thumbnail-wrapper">
                    <img className="book-cover" src={item.image} alt={item.title} />
                    <span className="kindle-badge pop-trend-tag">{item.trendBadge}</span>
                    <button type="button" className="save-book" aria-label={`Save ${item.title}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="kindle-info">
                    <div className="kindle-meta-row">
                      <span className="kindle-meta-tag">{item.meta}</span>
                      <div className="kindle-rating">
                        <span className="star-icon">★</span>
                        <span className="rating-val">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                    <p className="kindle-author">{item.author}</p>
                    <div className="pop-downloads-row">
                      <span>⚡ {item.downloads}</span>
                      <span className="pop-reviews-count">({item.reviews})</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 7. Recently Added Resources */}
          <section className="shelf-section recently-added-section" aria-labelledby="recently-added-heading">
            <div className="section-heading">
              <div>
                <h2 id="recently-added-heading">Recently Added Resources</h2>
              </div>
              <a href="#recent" className="view-all">View all fresh</a>
            </div>
            <div className="recommendation-shelf">
              {recentlyAdded.map((item) => (
                <article className="kindle-book-card recent-item-card" key={item.id}>
                  <div className="kindle-thumbnail-wrapper">
                    <img className="book-cover" src={item.image} alt={item.title} />
                    <span className="kindle-badge new-release-tag">{item.dateBadge}</span>
                    <button type="button" className="save-book" aria-label={`Save ${item.title}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="kindle-info">
                    <div className="kindle-meta-row">
                      <span className="kindle-meta-tag">{item.meta}</span>
                      <div className="kindle-rating">
                        <span className="star-icon">★</span>
                        <span className="rating-val">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                    <p className="kindle-author">{item.author}</p>
                    <div className="new-pill-indicator">
                      <span className="green-spark-dot" />
                      <span>Newly Verified &amp; Indexed</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 8. Resources Based on User's Department */}
          <section className="shelf-section dept-resources-section" aria-labelledby="dept-resources-heading">
            <div className="section-heading">
              <div>
                <h2 id="dept-resources-heading">Resources for Your Department</h2>
              </div>
              <a href="#my-department" className="view-all">Explore department</a>
            </div>

            <div className="dept-filter-bar">
              {['All STEM', 'Chemistry', 'Physics', 'Biology', 'Computer Studies'].map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className={`dept-filter-btn ${selectedDeptFilter === subject ? 'active' : ''}`}
                  onClick={() => setSelectedDeptFilter(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>

            <div className="recommendation-shelf">
              {departmentResources
                .filter(res => selectedDeptFilter === 'All STEM' || res.subject === selectedDeptFilter)
                .map((item) => (
                  <article className="kindle-book-card dept-item-card" key={item.id}>
                    <div className="kindle-thumbnail-wrapper">
                      <img className="book-cover" src={item.image} alt={item.title} />
                      <span className="kindle-badge dept-sub-tag">{item.subject}</span>
                      <button type="button" className="save-book" aria-label={`Save ${item.title}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="kindle-info">
                      <div className="kindle-meta-row">
                        <span className="kindle-meta-tag">{item.subject} · {item.level}</span>
                        <div className="kindle-rating">
                          <span className="star-icon">★</span>
                          <span className="rating-val">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                      <p className="kindle-author">{item.author}</p>
                      <div className="dept-curriculum-tag">
                        <span>🎯 Form 3 &amp; 4 STEM Track</span>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          {/* 9. Resource Categories */}
          <section className="shelf-section category-section" id="categories" aria-labelledby="categories-heading">
            <div className="section-heading">
              <div>
                <h2 id="categories-heading">Resource Categories</h2>
              </div>
              <button type="button" className="more-button" aria-label="More category options">View all categories</button>
            </div>
            <div className="category-shelf">
              {categories.map((category) => (
                <a href={`#${category.name.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="category-card" key={category.name}>
                  <span className={`category-image ${category.color}`}>
                    <img src={category.image} alt="" />
                  </span>
                  <div className="category-text-wrap">
                    <strong>{category.name}</strong>
                    <span className="category-count">{category.count}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          </section>
        </div>
          </>
        ) : currentPage === 'library' ? (
          <div className="library-page">
              <header className="library-header">
                <div className="library-header-content">
                  <div className="page-heading">
                    <h1>Library</h1>
                  </div>
                  <div className="user-actions">
                    <div className="user-avatar">DW</div>
                    <span className="user-name">Davis Workman</span>
                    <button type="button" className="notification-button" aria-label="View notifications">
                      <span>Notifications</span>
                      <span className="notification-dot" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </header>

            <div className="discovery-bottom">
              <section className="discovery-content">
                {/* Books Section */}
                <div className="section-heading">
                  <div>
                    <h2>Books</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {libraryItems.filter(item => item.type === 'book').map((item) => (
                    <article className="library-item-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className={`library-type-badge ${item.type}`}>{item.type}</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-meta-tag">{item.meta}</span>
                          <span className="library-file-size">{item.fileSize}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-author">{item.author}</p>
                        <div className="library-footer">
                          <span className="library-download-date">Downloaded {item.downloadDate}</span>
                          <button type="button" className="library-action-btn">Open</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Papers Section */}
                <div className="section-heading">
                  <div>
                    <h2>Past Papers</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {libraryItems.filter(item => item.type === 'paper').map((item) => (
                    <article className="library-item-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className={`library-type-badge ${item.type}`}>{item.type}</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-meta-tag">{item.meta}</span>
                          <span className="library-file-size">{item.fileSize}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-author">{item.board}</p>
                        <div className="library-footer">
                          <span className="library-download-date">Downloaded {item.downloadDate}</span>
                          <button type="button" className="library-action-btn">Open</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Videos Section */}
                <div className="section-heading">
                  <div>
                    <h2>Videos</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {libraryItems.filter(item => item.type === 'video').map((item) => (
                    <article className="library-item-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className={`library-type-badge ${item.type}`}>{item.type}</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-meta-tag">{item.meta}</span>
                          <span className="library-file-size">{item.fileSize}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-author">{item.instructor}</p>
                        <span className="library-duration">{item.duration}</span>
                        <div className="library-footer">
                          <span className="library-download-date">Downloaded {item.downloadDate}</span>
                          <button type="button" className="library-action-btn">Open</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Saved Resources Section */}
                <div className="section-heading">
                  <div>
                    <h2>Saved Resources</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {savedResources.map((item) => (
                    <article className="library-item-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className={`library-type-badge ${item.type}`}>{item.type}</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-meta-tag">{item.meta}</span>
                          <span className="library-saved-date">Saved {item.savedDate}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-author">{item.author}</p>
                        <div className="library-footer">
                          <button type="button" className="library-action-btn">Open</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Personal Collections Section */}
                <div className="section-heading">
                  <div>
                    <h2>Personal Collections</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {personalCollections.map((item) => (
                    <article className="library-item-card collection-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.name} />
                        <span className="library-type-badge collection">Collection</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-item-count">{item.itemCount} items</span>
                          <span className="library-updated-date">Updated {item.lastUpdated}</span>
                        </div>
                        <h3 className="library-title">{item.name}</h3>
                        <div className="library-footer">
                          <button type="button" className="library-action-btn">View Collection</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Completed Resources Section */}
                <div className="section-heading">
                  <div>
                    <h2>Completed Resources</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {completedResources.map((item) => (
                    <article className="library-item-card completed-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className={`library-type-badge ${item.type}`}>{item.type}</span>
                        <span className="library-completed-badge">✓ Completed</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-meta-tag">{item.meta}</span>
                          <span className="library-completed-date">Completed {item.completedDate}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-author">{item.author}</p>
                        <div className="library-footer">
                          <button type="button" className="library-action-btn">Review</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Saved Videos Section */}
                <div className="section-heading">
                  <div>
                    <h2>Saved Videos</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {savedVideos.map((item) => (
                    <article className="library-item-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className="library-type-badge video">video</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-meta-tag">{item.meta}</span>
                          <span className="library-duration">{item.duration}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-author">{item.instructor}</p>
                        <div className="library-footer">
                          <span className="library-saved-date">Saved {item.savedDate}</span>
                          <button type="button" className="library-action-btn">Watch</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Reading Activity Section */}
                <div className="section-heading">
                  <div>
                    <h2>Reading Activity</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {readingActivity.map((item) => (
                    <article className="library-item-card activity-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className="library-type-badge activity">Activity</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-activity-date">{item.date}</span>
                          <span className="library-time-spent">{item.timeSpent}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <p className="library-activity">{item.activity}</p>
                        <div className="library-footer">
                          <button type="button" className="library-action-btn">Continue</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Resource History Section */}
                <div className="section-heading">
                  <div>
                    <h2>Resource History</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {resourceHistory.map((item) => (
                    <article className="library-item-card history-card" key={item.id}>
                      <div className="library-thumbnail-wrapper">
                        <img className="library-cover" src={item.image} alt={item.title} />
                        <span className={`library-type-badge ${item.type}`}>{item.type}</span>
                      </div>
                      <div className="library-info">
                        <div className="library-meta-row">
                          <span className="library-action">{item.action}</span>
                          <span className="library-history-date">{item.date}</span>
                        </div>
                        <h3 className="library-title">{item.title}</h3>
                        <div className="library-footer">
                          <button type="button" className="library-action-btn">Open</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : currentPage === 'discover' ? (
          <div className="discover-feed-wrapper">
            <header className="discover-header">
              <div className="discover-header-top">
                <div className="discover-header-left">
                  <h1 className="discover-title">Discover</h1>
                </div>
                <div className="discover-header-center">
                  <div className="discover-search-bar">
                    <input type="search" placeholder="Search Learn Hub..." className="discover-search-input" />
                    <button className="discover-search-btn" aria-label="Search Learn Hub">
                      <IconSearch size={16} stroke={2} />
                    </button>
                  </div>
                </div>
                <div className="discover-header-right">
                  <div className="user-avatar">DW</div>
                  <button type="button" className="notification-button" aria-label="View notifications">
                    <IconBell size={16} stroke={2} />
                    <span>Notifications</span>
                    <span className="notification-dot" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="discover-header-bottom">
                <nav className="discover-nav" aria-label="Primary navigation">
                  <a href="#" className="discover-nav-item active" aria-label="Home">
                    <IconHome size={18} stroke={2} />
                  </a>
                  <a href="#" className="discover-nav-item" aria-label="Videos">
                    <IconVideo size={18} stroke={2} />
                  </a>
                  <a href="#" className="discover-nav-item" aria-label="Followed accounts">
                    <IconUserCheck size={18} stroke={2} />
                  </a>
                </nav>
              </div>
            </header>

            <div className="discovery-bottom">
              <div className="discover-layout">
                {/* Main Feed */}
                <main className="discover-main-feed">
                  {/* Post Creation Section */}
                  <div className="create-post-section">
                    <div className="create-post-header">
                      <div className="user-avatar">DW</div>
                      <input 
                        type="text" 
                        placeholder="What's on your mind, Davis?" 
                        className="create-post-input"
                      />
                    </div>
                    <div className="create-post-actions">
                      <button className="create-post-action">
                        <span>📷</span>
                        <span>Photo</span>
                      </button>
                      <button className="create-post-action">
                        <span>📄</span>
                        <span>Document</span>
                      </button>
                      <button className="create-post-action">
                        <span>🎥</span>
                        <span>Video</span>
                      </button>
                      <button className="create-post-action">
                        <span>❓</span>
                        <span>Question</span>
                      </button>
                    </div>
                  </div>

                  {/* Feed Posts */}
                  <div className="feed-container">
                    {discoveryPosts.map((post) => (
                      <article className={`feed-post feed-post-${post.type}`} key={post.id}>
                        <div className="feed-post-header">
                          <div className="feed-post-author">
                            <div className="feed-author-avatar">{post.authorAvatar}</div>
                            <div className="feed-author-info">
                              <span className="feed-author-name">{post.author}</span>
                              <span className="feed-author-school">{post.school}</span>
                              <span className="feed-post-time">{post.time}</span>
                            </div>
                          </div>
                          <button className="feed-post-menu">•••</button>
                        </div>

                        <div className="feed-post-content">
                          {post.type === 'question' ? (
                            <>
                              <div className="feed-subject-tag">{post.subject}</div>
                              <p className="feed-question-text">{post.content}</p>
                            </>
                          ) : post.type === 'book' ? (
                            <>
                              <div className="feed-subject-tag">{post.subject}</div>
                              <h3 className="feed-resource-title">{post.title}</h3>
                              <p className="feed-resource-description">{post.description}</p>
                              <div className="feed-resource-meta">
                                <span className="feed-file-size">{post.file}</span>
                              </div>
                              <div className="feed-resource-image">
                                <img src={post.image} alt={post.title} />
                              </div>
                            </>
                          ) : post.type === 'paper' ? (
                            <>
                              <div className="feed-subject-tag">{post.subject}</div>
                              <h3 className="feed-resource-title">{post.title}</h3>
                              <p className="feed-resource-description">{post.description}</p>
                              <div className="feed-resource-meta">
                                <span className="feed-paper-year">{post.year}</span>
                              </div>
                              <div className="feed-resource-image">
                                <img src={post.image} alt={post.title} />
                              </div>
                            </>
                          ) : post.type === 'video' ? (
                            <>
                              <div className="feed-subject-tag">{post.subject}</div>
                              <h3 className="feed-resource-title">{post.title}</h3>
                              <p className="feed-resource-description">{post.description}</p>
                              <div className="feed-resource-meta">
                                <span className="feed-video-duration">{post.duration}</span>
                              </div>
                              <div className="feed-resource-image">
                                <img src={post.image} alt={post.title} />
                                <div className="feed-video-play-overlay">
                                  <div className="feed-play-button">▶</div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>

                        <div className="feed-post-stats">
                          <span className="feed-likes-count">{post.likes} likes</span>
                          <span className="feed-comments-count">{post.comments} comments</span>
                          <span className="feed-shares-count">{post.shares} shares</span>
                        </div>

                        <div className="feed-post-actions">
                          <button type="button" className="feed-action-btn feed-like-btn">
                            <span>👍</span>
                            <span>Like</span>
                          </button>
                          <button type="button" className="feed-action-btn feed-comment-btn">
                            <span>💬</span>
                            <span>Comment</span>
                          </button>
                          <button type="button" className="feed-action-btn feed-share-btn">
                            <span>📤</span>
                            <span>Share</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </main>

                {/* Right Sidebar */}
                <aside className="discover-right-sidebar">
                  {/* Upcoming Events */}
                  <div className="sidebar-section">
                    <h3 className="sidebar-section-title">Upcoming Events</h3>
                    <div className="sidebar-events">
                      <div className="sidebar-event">
                        <div className="event-date">
                          <span className="event-day">15</span>
                          <span className="event-month">Sep</span>
                        </div>
                        <div className="event-info">
                          <h4 className="event-title">MSCE Mock Exams</h4>
                          <p className="event-time">9:00 AM - 12:00 PM</p>
                        </div>
                      </div>
                      <div className="sidebar-event">
                        <div className="event-date">
                          <span className="event-day">20</span>
                          <span className="event-month">Sep</span>
                        </div>
                        <div className="event-info">
                          <h4 className="event-title">Chemistry Lab Session</h4>
                          <p className="event-time">2:00 PM - 4:00 PM</p>
                        </div>
                      </div>
                      <div className="sidebar-event">
                        <div className="event-date">
                          <span className="event-day">25</span>
                          <span className="event-month">Sep</span>
                        </div>
                        <div className="event-info">
                          <h4 className="event-title">Mathematics Tutorial</h4>
                          <p className="event-time">10:00 AM - 11:30 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Followed Accounts */}
                  <div className="sidebar-section">
                    <h3 className="sidebar-section-title">Followed Accounts</h3>
                    <div className="sidebar-followed">
                      <div className="followed-item">
                        <div className="followed-avatar">KM</div>
                        <div className="followed-info">
                          <span className="followed-name">K. Moyo</span>
                          <span className="followed-school">Blantyre Secondary</span>
                        </div>
                        <button className="followed-btn">Following</button>
                      </div>
                      <div className="followed-item">
                        <div className="followed-avatar">FN</div>
                        <div className="followed-info">
                          <span className="followed-name">F. Nyirenda</span>
                          <span className="followed-school">University of Malawi</span>
                        </div>
                        <button className="followed-btn">Following</button>
                      </div>
                      <div className="followed-item">
                        <div className="followed-avatar">LP</div>
                        <div className="followed-info">
                          <span className="followed-name">L. Phiri</span>
                          <span className="followed-school">Blantyre Secondary</span>
                        </div>
                        <button className="followed-btn">Following</button>
                      </div>
                      <div className="followed-item">
                        <div className="followed-avatar">KC</div>
                        <div className="followed-info">
                          <span className="followed-name">K. Chirwa</span>
                          <span className="followed-school">University of Malawi</span>
                        </div>
                        <button className="followed-btn">Following</button>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Schools */}
                  <div className="sidebar-section">
                    <h3 className="sidebar-section-title">Suggested Schools</h3>
                    <div className="sidebar-suggestions">
                      <div className="suggestion-item">
                        <div className="suggestion-avatar">KA</div>
                        <div className="suggestion-info">
                          <span className="suggestion-name">Kamuzu Academy</span>
                          <span className="suggestion-followers">12.4k followers</span>
                        </div>
                        <button className="suggestion-btn">Follow</button>
                      </div>
                      <div className="suggestion-item">
                        <div className="suggestion-avatar">MS</div>
                        <div className="suggestion-info">
                          <span className="suggestion-name">Marist Secondary</span>
                          <span className="suggestion-followers">8.2k followers</span>
                        </div>
                        <button className="suggestion-btn">Follow</button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;

