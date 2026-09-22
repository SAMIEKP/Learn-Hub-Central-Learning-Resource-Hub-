import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  IconPhoto,
  IconFileText,
  IconHelpCircle,
  IconThumbUp,
  IconMessageCircle,
  IconRepeat,
  IconPlayerPlay,
  IconTrendingUp,
  IconBolt,
  IconTarget,
  IconStarFilled,
  IconDownload,
  IconBuildingStore,
  IconUsers,
  IconChevronRight,
  IconCheck,
  IconShieldCheck,
  IconMail,
  IconSchool,
  IconLock,
  IconPalette,
  IconEye,
  IconLogout,
  IconEdit,
  IconMessageCircle2,
  IconBook2,
  IconQuestionMark,
  IconAward,
  IconAdjustments,
} from '@tabler/icons-react';
import './App.css';
import logo from './logo.svg';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useDialogAccessibility } from './hooks/useDialogAccessibility';

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

const initialPostComments = {
  'post-1': [
    { id: 'comment-1a', authorId: 'user-sarah', author: 'Sarah Banda', authorAvatar: 'SB', content: 'I think the key difference is how the electrons are shared or transferred.', likes: 4, liked: false, replies: [{ id: 'reply-1a', authorId: 'user-moyo', author: 'K. Moyo', authorAvatar: 'KM', content: 'That explanation helped me too.', likes: 1, liked: false }] },
    { id: 'comment-1b', authorId: 'user-john', author: 'John Phiri', authorAvatar: 'JP', content: 'The diagrams in the Form 3 chemistry notes make this much easier to see.', likes: 2, liked: false, replies: [] },
  ],
  'post-2': [{ id: 'comment-2a', authorId: 'user-linda', author: 'L. Phiri', authorAvatar: 'LP', content: 'These calculus notes are really useful for revision.', likes: 6, liked: false, replies: [] }],
  'post-3': [{ id: 'comment-3a', authorId: 'user-maneb', author: 'MANEB Examination Board', authorAvatar: 'ME', content: 'Please check the marking notes below each worked solution.', likes: 3, liked: false, replies: [] }],
  'post-4': [{ id: 'comment-4a', authorId: 'user-felix', author: 'F. Nyirenda', authorAvatar: 'FN', content: 'Remember to wear your goggles during every practical session.', likes: 5, liked: false, replies: [] }],
  'post-5': [{ id: 'comment-5a', authorId: 'user-grace', author: 'G. Banda', authorAvatar: 'GB', content: 'Greenhouse gases trap heat in the atmosphere and raise global temperatures.', likes: 3, liked: false, replies: [] }],
  'post-6': [{ id: 'comment-6a', authorId: 'user-louise', author: 'L. Phiri', authorAvatar: 'LP', content: 'I saved this resource for my next study session.', likes: 1, liked: false, replies: [] }],
  'post-7': [{ id: 'comment-7a', authorId: 'user-peter', author: 'P. Gondwe', authorAvatar: 'PG', content: 'The examples on hydrocarbons are especially helpful.', likes: 2, liked: false, replies: [] }],
  'post-8': [{ id: 'comment-8a', authorId: 'user-chirwa', author: 'K. Chirwa', authorAvatar: 'KC', content: 'The sound-wave demonstration starts at 12:40 in the video.', likes: 4, liked: false, replies: [] }],
};

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
    trendBadge: '#1 Most Popular',
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
    trendBadge: '#2 Trending',
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
    trendBadge: '#3 Trending',
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
    trendBadge: '#4 Trending',
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

const settingsSections = [
  ['account', 'Account', 'Identity, contact details, and password', IconUser],
  ['membership', 'School and membership', 'School, class, and department', IconSchool],
  ['notifications', 'Notifications', 'School, questions, and new materials', IconBell],
  ['library', 'Library and downloads', 'Views, history, and offline files', IconBook2],
  ['recommendations', 'Recommendations', 'Personalization and discovery', IconCompass],
  ['privacy', 'Privacy and visibility', 'Profile and activity controls', IconEye],
  ['appearance', 'Appearance and accessibility', 'Theme, layout, and reading comfort', IconPalette],
  ['security', 'Security', 'Sessions, verification, and recovery', IconShieldCheck],
  ['help', 'Help and feedback', 'Support, policies, and feedback', IconMessageCircle2],
  ['about', 'About Learn Hub', 'Version, licenses, and acknowledgements', IconAward],
];

const resourceCatalog = [
  ...libraryItems.map((item) => ({ ...item, resourceType: item.type })),
  ...continueReading.map((item) => ({ ...item, resourceType: 'book' })),
  ...recommendations.map((item) => ({ ...item, resourceType: item.format === 'Past Papers' ? 'paper' : 'book' })),
  ...pastPapers.map((item) => ({ ...item, resourceType: 'paper' })),
  ...schoolUploads.map((item) => ({ ...item, resourceType: item.format.includes('Paper') ? 'paper' : 'book', author: item.teacher })),
  ...followedSchools.map((item) => ({ ...item, resourceType: 'book', author: item.teacher })),
  ...popularResources.map((item) => ({ ...item, resourceType: 'book' })),
  ...recentlyAdded.map((item) => ({ ...item, resourceType: 'book' })),
  ...departmentResources.map((item) => ({ ...item, resourceType: 'book' })),
  ...savedResources.map((item) => ({ ...item, resourceType: item.type })),
  ...savedVideos.map((item) => ({ ...item, resourceType: 'video' })),
];

const resourceByTitle = (title) => continueReading.find((resource) => resource.title === title) || resourceCatalog.find((resource) => resource.title === title) || {
  id: `resource-${title}`,
  title,
  resourceType: 'book',
  author: 'Learn Hub library',
  meta: 'Learning resource',
  image: recommendations[0].image,
};

const resourceKey = (resource) => String(resource.id || resource.title);
const defaultCurrentUser = { id: 'user-samuel', name: 'SAMUEL KP', initials: 'SKP', role: 'Student · Form 3', school: 'Blantyre Secondary School' };

const readStoredValue = (key, fallback) => {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeStoredValue = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage can be unavailable in private browsing or restricted embeds.
  }
};

function SettingToggle({ label, description, defaultChecked = true }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <label className="setting-toggle-row"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} /><span className="toggle-control" aria-hidden="true"><span /></span></label>;
}

function HeaderActions({ onNavigate = () => {}, onAction = () => {}, user = defaultCurrentUser }) {
  const headerActionsRef = useRef(null);
  const storedProfile = readStoredValue('learnhub-profile-details', {});
  const profileImage = user.image || storedProfile.image;
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Biology notes uploaded', detail: 'Blantyre Secondary School · 12 min ago' },
    { id: 2, title: 'Your question received an answer', detail: 'Photosynthesis · 1 hour ago' },
    { id: 3, title: 'Past Paper collection updated', detail: 'Mathematics Form 4 · Yesterday' },
  ]);
  const unreadCount = notifications.length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerActionsRef.current && !headerActionsRef.current.contains(event.target)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  return <div className="user-actions" ref={headerActionsRef}>
    <div className="header-profile-menu">
      <button type="button" className="header-profile-trigger" aria-expanded={profileOpen} onClick={toggleProfile}>
        {profileImage ? <img className="user-avatar header-user-image" src={profileImage} alt={`${user.name} profile`} /> : <span className="user-avatar">{user.initials}</span>}
        <span className="user-name">{user.name}</span>
      </button>
      {profileOpen && <div className="header-popover profile-popover"><div className="popover-identity">{profileImage ? <img className="user-avatar header-user-image" src={profileImage} alt={`${user.name} profile`} /> : <span className="user-avatar">{user.initials}</span>}<span><strong>{user.name}</strong><small>{user.role}</small></span></div><div className="popover-links"><a href="#profile" onClick={(event) => { event.preventDefault(); onNavigate('profile'); setProfileOpen(false); }}>View profile</a><a href="#library" onClick={(event) => { event.preventDefault(); onNavigate('library'); setProfileOpen(false); }}>My library</a><a href="#settings" onClick={(event) => { event.preventDefault(); onNavigate('settings'); setProfileOpen(false); }}>Settings</a></div><button type="button" className="popover-signout" onClick={() => onAction('Log out is not available in this demo yet.')}><IconLogout size={15} /> Log out</button></div>}
    </div>
    <div className="header-notifications">
      <button type="button" className="notification-button" aria-expanded={notificationsOpen} aria-label={`View ${unreadCount} notifications`} onClick={toggleNotifications}>
        <span>Notifications</span>
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        <span className="notification-dot" aria-hidden="true" />
      </button>
      {notificationsOpen && <div className="header-popover notifications-popover"><div className="notifications-heading"><strong>Notifications</strong>{unreadCount > 0 && <button type="button" onClick={() => setNotifications([])}>Clear all</button>}</div>{notifications.length > 0 ? notifications.map((notification) => <div className="notification-item" key={notification.id}><span className="notification-item-dot" /><span><strong>{notification.title}</strong><small>{notification.detail}</small></span><button type="button" aria-label={`Clear ${notification.title}`} onClick={() => setNotifications(notifications.filter((item) => item.id !== notification.id))}>×</button></div>) : <p className="notifications-empty">You are all caught up.</p>}</div>}
    </div>
  </div>;
}

function SettingsPage({ onNavigate = () => {}, onAction = () => {} }) {
  const [activeSection, setActiveSection] = useState('account');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const profileDetails = readStoredValue('learnhub-profile-details', { name: 'SAMUEL KP', role: 'Student', form: 'Form 3', school: 'Blantyre Secondary School', department: 'Sciences & Technology', email: 'samuel.kp@example.com', phone: '+265 888 204 118', image: null });
  const profileInitials = profileDetails.name.split(' ').map((part) => part[0]).join('').slice(0, 3);
  const selected = settingsSections.find(([id]) => id === activeSection);
  const SectionIcon = selected[3];
  return <div className="product-page settings-page">
    <header className="library-header settings-page-header">
      <div className="library-header-content">
        <div className="page-heading">
          <h1>Settings</h1>
        </div>
        <HeaderActions onNavigate={onNavigate} onAction={onAction} user={{ ...defaultCurrentUser, name: profileDetails.name, initials: profileInitials, role: `${profileDetails.role} · ${profileDetails.form}`, school: profileDetails.school, image: profileDetails.image }} />
      </div>
    </header>
    <div className="settings-background settings-background-top" aria-hidden="true" />
    <div className="settings-background settings-background-bottom" aria-hidden="true" />
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Settings sections"><span className="settings-nav-label">Manage Learn Hub</span>{settingsSections.map(([id, label, description, ItemIcon]) => <button key={id} type="button" className={`settings-nav-item ${activeSection === id ? 'active' : ''}`} onClick={() => setActiveSection(id)}><ItemIcon size={17} stroke={1.8} /><span><b>{label}</b><small>{description}</small></span><IconChevronRight size={15} /></button>)}<button type="button" className="settings-logout" onClick={() => onAction('Log out is not available in this demo yet.')}><IconLogout size={17} /> Log out</button></nav>
      <section className="settings-detail" aria-labelledby="settings-detail-title"><div className="settings-detail-heading"><div className="settings-detail-icon"><SectionIcon size={20} /></div><div><span className="eyebrow">Settings</span><h2 id="settings-detail-title">{selected[1]}</h2><p>{selected[2]}</p></div></div>
        {activeSection === 'account' && <><div className="settings-card account-summary-card"><div className="profile-avatar large">SKP</div><div className="account-summary-copy"><span className="status-pill"><span /> Active account</span><h3>SAMUEL KP</h3><p>Student · Blantyre Secondary School · Form 3</p><small>Member since 16 September 2024</small></div><button type="button" className="outline-button" onClick={() => onNavigate('profile')}><IconEdit size={15} /> Edit profile</button></div><div className="settings-card"><div className="card-title-row"><div><h3>Account information</h3><p>Your identity and school details.</p></div><IconLock size={17} /></div><div className="account-fields"><div><span>Full name</span><strong>SAMUEL KP</strong></div><div><span>Account type</span><strong>Student</strong></div><div><span>Email address</span><strong>samuel.kp@example.com</strong></div><div><span>Phone number</span><strong>+265 888 204 118</strong></div><div><span>School</span><strong>Blantyre Secondary School</strong></div><div><span>Class / Form</span><strong>Form 3</strong></div></div></div><div className="settings-card schedule-note"><IconAdjustments size={18} /><div><strong>Profile editing schedule</strong><p>Your profile was last updated on 16 September 2026. You can edit it again on 16 March 2027. Sensitive membership changes require approval.</p></div></div><div className="settings-card"><div className="card-title-row"><div><h3>Password</h3><p>Keep your account access secure.</p></div><button type="button" className="text-button" onClick={() => onAction('Password change is ready to connect when authentication is enabled.')}>Change password <IconChevronRight size={15} /></button></div></div></>}
        {activeSection === 'membership' && <><div className="settings-card"><div className="card-title-row"><div><h3>Student membership</h3><p>These details connect you to the right resources.</p></div><span className="status-pill"><span /> Approved</span></div><div className="account-fields"><div><span>Current school</span><strong>Blantyre Secondary School</strong></div><div><span>Class / Form</span><strong>Form 3</strong></div><div><span>Registration number</span><strong>BS-24-0318</strong></div><div><span>Primary department</span><strong>Sciences &amp; Technology</strong></div><div><span>Membership approved</span><strong>18 September 2024</strong></div></div></div><div className="settings-card"><div className="card-title-row"><div><h3>Departments and subjects</h3><p>Your selections shape recommendations and notifications.</p></div><button type="button" className="outline-button">Update preferences</button></div><div className="chip-list"><span className="choice-chip selected"><IconCheck size={13} /> Science <b>Primary</b></span><span className="choice-chip selected"><IconCheck size={13} /> Humanities</span><span className="choice-chip">Business</span><span className="choice-chip">Languages</span></div></div><div className="action-list"><button type="button">Request a school change <IconChevronRight size={16} /></button><button type="button">Report incorrect school information <IconChevronRight size={16} /></button></div></>}
        {activeSection === 'notifications' && <div className="settings-card settings-card-stack"><div className="card-title-row"><div><h3>Notification channels</h3><p>Security and recovery alerts always stay on.</p></div></div><SettingToggle label="In-app notifications" description="Updates inside Learn Hub" /><SettingToggle label="Push notifications" description="New activity on your devices" /><SettingToggle label="Email notifications" defaultChecked={false} /><div className="subsection-heading">School notifications</div><SettingToggle label="Books and subject notes" /><SettingToggle label="Past papers" /><SettingToggle label="Video tutorials" defaultChecked={false} /><SettingToggle label="School announcements" /><div className="subsection-heading">Question notifications</div><SettingToggle label="Answers to my questions" /><SettingToggle label="Correct-answer confirmations" /><SettingToggle label="Activity on followed questions" defaultChecked={false} /></div>}
        {activeSection === 'library' && <div className="settings-card settings-card-stack"><div className="card-title-row"><div><h3>Library preferences</h3><p>Make your study library behave the way you expect.</p></div></div><div className="select-row"><label>Default library view<select defaultValue="grid"><option value="grid">Grid</option><option value="list">List</option></select></label><label>Default sorting<select defaultValue="recent"><option value="recent">Recent activity</option><option value="title">Title</option><option value="author">Author</option></select></label></div><SettingToggle label="Automatically add opened resources to history" /><SettingToggle label="Show completed resources" /><SettingToggle label="Confirm before removing a resource" /><div className="subsection-heading">Downloads</div><SettingToggle label="Wi-Fi-only downloads" /><SettingToggle label="Ask before downloading large files" /><div className="storage-meter"><div><span>Storage used</span><strong>420 MB of 2 GB</strong></div><div className="meter-track"><span style={{ width: '21%' }} /></div><button type="button" className="text-button">Manage downloads <IconChevronRight size={15} /></button></div></div>}
        {activeSection === 'recommendations' && <div className="settings-card settings-card-stack"><div className="card-title-row"><div><h3>Recommendation sources</h3><p>Choose what Learn Hub can use to personalize your shelves.</p></div></div><SettingToggle label="My department" /><SettingToggle label="My class / Form" /><SettingToggle label="My school" /><SettingToggle label="My reading history" /><SettingToggle label="My likes and saved items" /><SettingToggle label="Popular resources" /><div className="recommendation-note"><IconCompass size={17} /><span>Recommendations may include “Recommended because you selected Science” or “New from your school.”</span></div><button type="button" className="danger-link">Reset recommendation history</button></div>}
        {activeSection === 'privacy' && <div className="settings-card settings-card-stack"><div className="card-title-row"><div><h3>Profile visibility</h3><p>Control who can discover your public learning identity.</p></div></div><div className="visibility-options"><label><input type="radio" name="visibility" defaultChecked /> <span><strong>My school</strong><small>Recommended for students</small></span></label><label><input type="radio" name="visibility" /> <span><strong>All approved Learn Hub users</strong><small>Your public profile can be viewed by approved members</small></span></label><label><input type="radio" name="visibility" /> <span><strong>Private</strong><small>Only you can see your profile activity</small></span></label></div><div className="subsection-heading">Activity privacy</div><SettingToggle label="Questions and answers" /><SettingToggle label="Liked resources" defaultChecked={false} /><SettingToggle label="Recently read and completed resources" defaultChecked={false} /><div className="privacy-callout"><IconLock size={16} /><span>Private notes, highlights, email, phone number, and reading history are private by default.</span></div></div>}
        {activeSection === 'appearance' && <div className="settings-card settings-card-stack"><div className="card-title-row"><div><h3>Appearance and accessibility</h3><p>Comfortable reading for every study session.</p></div></div><div className="theme-selector" role="group" aria-label="Theme"><span className="theme-selector-label">Theme</span><div className="theme-options">{[['light', 'Light'], ['dark', 'Dark'], ['system', 'System']].map(([theme, label]) => <button key={theme} type="button" className={`theme-choice ${selectedTheme === theme ? 'active' : ''}`} aria-pressed={selectedTheme === theme} onClick={() => setSelectedTheme(theme)}><span className={`theme-swatch ${theme}`} /><span>{label}</span>{selectedTheme === theme && <IconCheck size={15} />}</button>)}</div></div><SettingToggle label="Larger text" /><SettingToggle label="High contrast colors" /><SettingToggle label="Reduced motion" defaultChecked={false} /><SettingToggle label="Dyslexia-friendly font" defaultChecked={false} /><SettingToggle label="Prefer captions" /><SettingToggle label="Prefer transcripts" /></div>}
        {activeSection === 'security' && <div className="settings-card settings-card-stack"><div className="security-status-row"><span className="security-check"><IconCheck size={15} /></span><div><strong>Email verified</strong><small>samuel.kp@example.com</small></div><b>Yes</b></div><div className="security-status-row"><span className="security-check"><IconCheck size={15} /></span><div><strong>Phone verified</strong><small>+265 888 204 118</small></div><b>Yes</b></div><div className="security-status-row"><span className="security-icon"><IconShieldCheck size={15} /></span><div><strong>Two-step verification</strong><small>Add another layer of protection</small></div><button type="button" className="outline-button">Set up</button></div><div className="security-summary"><span>Active devices <strong>2</strong></span><span>Last login <strong>Today, 14:20</strong></span></div><button type="button" className="danger-button">Sign out of all devices</button></div>}
        {activeSection === 'help' && <div className="settings-card settings-card-stack"><div className="help-row"><IconQuestionMark size={19} /><div><strong>Help center</strong><span>Answers about learning, publishing, and downloads</span></div><IconChevronRight size={16} /></div><div className="help-row"><IconMessageCircle2 size={19} /><div><strong>Report a technical problem</strong><span>Tell us what went wrong</span></div><IconChevronRight size={16} /></div><div className="help-row"><IconMail size={19} /><div><strong>Contact platform support</strong><span>support@learnhub.mw</span></div><IconChevronRight size={16} /></div><div className="link-row"><span>Terms of use</span><span>Privacy policy</span><span>Community guidelines</span></div></div>}
        {activeSection === 'about' && <div className="settings-card about-card"><div className="about-mark"><img src={logo} alt="" /></div><h3>Learn Hub</h3><p>A digital educational library for secondary schools in Malawi.</p><span className="version-label">Version 1.0.0 · Build 2026.09.20</span><div className="link-row"><span>Terms of use</span><span>Privacy policy</span><span>Licenses</span></div><button type="button" className="outline-button">Check for updates</button></div>}
      </section>
    </div>
  </div>;
}

function ResourceListPage({ title, items, onNavigate, onOpenResource }) {
  return <div className="product-page resource-list-page">
    <header className="library-header resource-list-header"><div className="library-header-content"><div className="page-heading"><h1>{title}</h1></div><HeaderActions onNavigate={onNavigate} /></div></header>
    <div className="resource-list-content">
      <div className="resource-list-heading"><span className="eyebrow">Learn Hub library</span><p>Select a resource to view its information.</p></div>
      <div className="resource-list-grid">{items.map((item) => { const resource = { ...item, resourceType: item.resourceType || (item.type === 'paper' ? 'paper' : item.type === 'video' ? 'video' : 'book') }; return <article className="resource-list-item" key={resource.id || resource.title} onClick={() => onOpenResource(resource)}><div className="resource-list-image"><img src={resource.image} alt="" /><span>{resource.resourceType}</span></div><div className="resource-list-copy"><span className="kindle-meta-tag">{resource.meta}</span><h2>{resource.title}</h2><p>{resource.author || resource.board || resource.instructor || resource.teacher || 'Learn Hub library'}</p><div><span>{resource.rating ? `${resource.rating} rating` : resource.year || resource.duration || 'Open resource'}</span><button type="button" onClick={(event) => { event.stopPropagation(); onOpenResource(resource); }}>{resource.resourceType === 'video' ? 'Watch' : 'View details'} <IconChevronRight size={14} /></button></div></div></article>; })}</div>
    </div>
  </div>;
}

function BookDetailsPage({ resource, returnPage, onNavigate, onAction, onOpenReader, onOpenResource, onOpenPublisher, isInLibrary, isDownloaded, onToggleLibrary, onDownload }) {
  const [inLibrary, setInLibrary] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [askQuestion, setAskQuestion] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const chapters = ['Introduction and study guide', 'Cell structure and organisation', 'Nutrition and digestion', 'Reproduction', 'Ecology and environments', 'Genetics and inheritance', 'Human health'];
  const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 4);
  const author = resource.author || 'Learn Hub contributor';
  const publisher = resource.school || 'Learn Hub Academic Library';
  const form = resource.meta?.match(/Form[s]? [^·]+/)?.[0] || 'Forms 3–4';
  const currentSubject = resource.meta?.split('·')[0]?.trim().toLowerCase();
  const bookResources = resourceCatalog.filter((item) => item.title !== resource.title && item.resourceType === 'book');
  const related = Array.from(new Map([...bookResources.filter((item) => currentSubject && item.meta?.toLowerCase().includes(currentSubject)), ...bookResources].map((item) => [item.title, item])).values()).slice(0, 3);

  const saved = isInLibrary ?? inLibrary;
  const downloaded = isDownloaded;

  return <div className="product-page book-details-page">
    <header className="library-header resource-detail-header"><div className="library-header-content"><div className="page-heading"><h1>Book details</h1></div><HeaderActions onNavigate={onNavigate} /></div></header>
    <div className="book-details-background book-details-background-top" aria-hidden="true" />
    <div className="book-details-background book-details-background-bottom" aria-hidden="true" />
    <main className="book-details-content">
      <section className="book-detail-hero"><div className="book-detail-cover"><img src={resource.image} alt={`${resource.title} cover`} /><span>Digital book</span></div><div className="book-detail-summary"><span className="eyebrow">{resource.meta || 'Learning resource'}</span><h2>{resource.title}</h2><p className="book-subtitle">A curriculum-aligned resource for secondary school learners.</p><p className="book-byline">By <strong>{author}</strong></p><p className="book-publisher">Published by <strong>{publisher}</strong> <span className="verified-badge"><IconCheck size={11} /> Verified publisher</span></p><div className="book-meta-line"><span>{resource.meta || 'Biology · Science · Forms 3–4'}</span><span>★ {resource.rating || '4.6'} · {resource.reviews || '245'} reviews</span><span>{resource.pages || '245'} pages · {resource.year || '2024'} edition</span></div><div className="book-primary-actions"><button type="button" className="primary-button" onClick={onOpenReader}>{resource.progress ? 'Continue reading' : 'Read now'}</button><button type="button" className={`outline-button ${saved ? 'is-selected' : ''}`} onClick={() => { if (onToggleLibrary) onToggleLibrary(); else setInLibrary(!inLibrary); }}>{saved ? 'In my library' : 'Add to library'}</button><button type="button" className="outline-button" onClick={onDownload}>{downloaded ? 'Downloaded' : 'Download'}</button></div>{resource.progress && <div className="book-progress"><div><span>Your progress</span><strong>{resource.progress}% complete · {resource.pageInfo || 'Page 42'}</strong></div><div className="progress-track"><span style={{ width: `${resource.progress}%` }} /></div></div>}</div></section>
      <div className="book-details-grid"><div className="book-details-main"><section className="book-info-card"><span className="eyebrow">About this book</span><h3>Learn with {resource.title}</h3><p>This resource covers key concepts, worked examples, and revision points for secondary school learners. It is designed to support classroom learning, independent study, and examination preparation in {form}.{showFullDescription && ' Use the chapter list below to move through the material in a focused order and revisit difficult concepts whenever you need.'}</p><button type="button" className="text-button" onClick={() => setShowFullDescription(!showFullDescription)}>{showFullDescription ? 'Show less' : 'Read more'} <IconChevronRight size={15} /></button></section><section className="book-info-card"><span className="eyebrow">Book information</span><div className="book-information-list"><span><b>Author</b>{author}</span><span><b>Publisher</b>{publisher}</span><span><b>Subject</b>{resource.meta?.split('·')[0]?.trim() || 'Biology'}</span><span><b>Department</b>Sciences &amp; Technology</span><span><b>Class / Form</b>{form}</span><span><b>Language</b>English</span><span><b>Publication year</b>{resource.year || '2024'}</span><span><b>Resource type</b>Digital book</span><span><b>File size</b>{resource.fileSize || '8.4 MB'}</span></div></section><section className="book-info-card"><div className="book-section-heading"><div><span className="eyebrow">Contents</span><h3>Chapters in this book</h3></div><span className="count-label">{chapters.length} chapters</span></div><div className="book-contents-list">{visibleChapters.map((chapter, index) => <button type="button" key={chapter} onClick={onOpenReader}><span>{index + 1}</span>{chapter}<IconChevronRight size={14} /></button>)}</div>{chapters.length > 4 && <button type="button" className="text-button" onClick={() => setShowAllChapters(!showAllChapters)}>{showAllChapters ? 'Show fewer chapters' : 'Show all chapters'} <IconChevronRight size={15} /></button>}</section></div><aside className="book-details-side"><section className="book-side-card publisher-card"><span className="eyebrow">Published by</span><div className="publisher-identity"><span className="publisher-avatar">{publisher.slice(0, 2).toUpperCase()}</span><span><strong>{publisher}</strong><small>Verified school publisher · Malawi</small></span></div><div className="publisher-actions"><button type="button" className="outline-button" onClick={onOpenPublisher}>View profile</button><button type="button" className={`text-button ${followed ? 'is-selected' : ''}`} onClick={() => setFollowed(!followed)}>{followed ? 'Following' : 'Follow'}</button></div></section><section className="book-side-card"><span className="eyebrow">Questions about this book</span><h3>Learn together</h3><p>Ask a question linked to a chapter or page and get help from learners and teachers.</p><button type="button" className="primary-button" onClick={() => setAskQuestion(true)}>Ask a question</button>{askQuestion && <form className="ask-book-question" onSubmit={(event) => { event.preventDefault(); setAskQuestion(false); onAction('Question posted about this book.'); }}><label>Chapter<select defaultValue={chapters[0]}>{chapters.map((chapter) => <option key={chapter}>{chapter}</option>)}</select></label><label>Page<input type="number" min="1" placeholder="42" /></label><label>Question<textarea required placeholder="What would you like to understand?" /></label><button type="submit" className="primary-button">Post question</button></form>}</section><section className="book-side-card"><span className="eyebrow">Your progress</span><h3>{resource.progress ? `${resource.progress}% complete` : 'Not started'}</h3><p>{resource.progress ? `You left off at ${resource.pageInfo || 'page 42'}` : 'Start reading to track your progress.'}</p><button type="button" className="outline-button" onClick={onOpenReader}>{resource.progress ? 'Continue reading' : 'Start reading'}</button></section></aside></div>
      <section className="book-related-section"><div className="book-section-heading"><div><span className="eyebrow">Related learning</span><h3>Related books</h3></div><button type="button" className="text-button" onClick={() => onNavigate('library')}>View library <IconChevronRight size={15} /></button></div><div className="book-related-grid">{related.map((item) => <button type="button" className="related-resource-card" key={item.id || item.title} aria-label={`Open ${item.title}`} onClick={() => onOpenResource({ ...item, resourceType: 'book' })}><img src={item.image} alt={`${item.title} cover`} /><span><strong>{item.title}</strong><small>{item.meta || 'Learning resource'}</small></span><IconChevronRight size={15} /></button>)}</div></section>
      <section className="book-feedback-card"><div><span className="eyebrow">Ratings and feedback</span><h3>Was this resource useful?</h3><p>Help other learners discover useful study material.</p></div><div className="book-rating-actions"><strong>★ {resource.rating || '4.6'} / 5</strong><button type="button" className={feedback === 'yes' ? 'is-selected' : ''} onClick={() => setFeedback('yes')}>Yes</button><button type="button" className={feedback === 'no' ? 'is-selected' : ''} onClick={() => setFeedback('no')}>No</button></div></section>
    </main>
  </div>;
}

function PublisherPage({ resource, onNavigate, onOpenResource }) {
  const publisher = resource.school || 'Learn Hub Academic Library';
  const publisherResources = resourceCatalog.filter((item) => (item.school || 'Learn Hub Academic Library') === publisher && item.title !== resource.title).slice(0, 3);
  const visibleResources = publisherResources.length > 0 ? publisherResources : recommendations.slice(0, 3);

  return <div className="product-page resource-detail-page">
    <header className="library-header resource-detail-header"><div className="library-header-content"><div className="page-heading"><h1>Publisher profile</h1></div><HeaderActions onNavigate={onNavigate} /></div></header>
    <main className="resource-detail-content">
      <section className="book-info-card publisher-profile-page-card"><span className="eyebrow">Verified publisher</span><h2>{publisher}</h2><p>School publisher · Malawi</p><div className="publisher-identity"><span className="publisher-avatar">{publisher.slice(0, 2).toUpperCase()}</span><span><strong>{publisher}</strong><small>Learning resources for secondary school learners.</small></span></div><button type="button" className="outline-button" onClick={() => onNavigate('library')}>View library <IconChevronRight size={15} /></button></section>
      <section className="book-related-section"><div className="book-section-heading"><div><span className="eyebrow">Published resources</span><h3>Explore this publisher's resources</h3></div></div><div className="book-related-grid">{visibleResources.map((item) => <button type="button" className="related-resource-card" key={item.id || item.title} onClick={() => onOpenResource(item)}><img src={item.image} alt="" /><span><strong>{item.title}</strong><small>{item.meta || 'Learning resource'}</small></span><IconChevronRight size={15} /></button>)}</div></section>
    </main>
  </div>;
}

function PublisherStudioPage({ onNavigate, onAction, onSubmitResource }) {
  const [postType, setPostType] = useState('book');
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const typeName = postType === 'book' ? 'Book' : postType === 'paper' ? 'Past paper' : 'Video lesson';
  const stepSets = {
    book: [
      { title: 'Choose resource type', fields: [{ key: 'type', label: 'What do you want to post?', kind: 'type' }] },
      { title: 'Basic information', fields: [{ key: 'title', label: 'Book title', placeholder: 'Enter the book title' }, { key: 'subject', label: 'Subject or department', kind: 'subject' }] },
      { title: 'Book details', fields: [{ key: 'author', label: 'Author', placeholder: 'Author name' }, { key: 'publisher', label: 'Publisher', placeholder: 'Publisher or school' }] },
      { title: 'Description and file', fields: [{ key: 'description', label: 'Description', kind: 'textarea', placeholder: 'Describe what learners will find in this book' }, { key: 'file', label: 'Book file', kind: 'file', accept: '.pdf,.epub,.doc,.docx' }] },
    ],
    paper: [
      { title: 'Choose resource type', fields: [{ key: 'type', label: 'What do you want to post?', kind: 'type' }] },
      { title: 'Basic information', fields: [{ key: 'title', label: 'Paper title', placeholder: 'Enter the paper title' }, { key: 'subject', label: 'Subject or department', kind: 'subject' }] },
      { title: 'Exam details', fields: [{ key: 'board', label: 'Exam board', placeholder: 'e.g. MANEB or Cambridge' }, { key: 'year', label: 'Exam year', kind: 'number', placeholder: '2026' }] },
      { title: 'Description and file', fields: [{ key: 'description', label: 'Description', kind: 'textarea', placeholder: 'Describe what learners will find in this paper' }, { key: 'file', label: 'Paper file', kind: 'file', accept: '.pdf,.doc,.docx' }] },
    ],
    video: [
      { title: 'Choose resource type', fields: [{ key: 'type', label: 'What do you want to post?', kind: 'type' }] },
      { title: 'Basic information', fields: [{ key: 'title', label: 'Video title', placeholder: 'Enter the video title' }, { key: 'subject', label: 'Subject or department', kind: 'subject' }] },
      { title: 'Lesson details and video file', fields: [{ key: 'instructor', label: 'Instructor', placeholder: 'Instructor name' }, { key: 'duration', label: 'Duration', placeholder: 'e.g. 45 minutes' }, { key: 'file', label: 'Video file', kind: 'file', accept: 'video/*' }, { key: 'description', label: 'Description', kind: 'textarea', placeholder: 'Describe what learners will learn in this video' }] },
    ],
  };
  const steps = stepSets[postType];
  const currentStep = steps[step];

  const updateField = (key, value) => setFormData((currentData) => ({ ...currentData, [key]: value }));
  const handleFile = (key, file) => {
    if (!file) return;
    const extension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = postType === 'video' ? ['mp4', 'webm', 'mov', 'avi', 'mkv'] : postType === 'paper' ? ['pdf', 'doc', 'docx'] : ['pdf', 'epub', 'doc', 'docx'];
    const isVideo = postType === 'video' && !file.type.startsWith('image/') && (file.type.startsWith('video/') || allowedExtensions.includes(extension));
    const isDocument = postType !== 'video' && allowedExtensions.includes(extension) && !file.type.startsWith('image/');
    if (!isVideo && !isDocument) {
      onAction(`That file type is not allowed for a ${postType}. Images cannot be uploaded.`);
      setDragActive(false);
      return;
    }
    updateField(key, file.name);
    setDragActive(false);
  };
  const handleFileDrop = (event, key) => {
    event.preventDefault();
    handleFile(key, event.dataTransfer.files[0]);
  };
  const changeType = (event) => {
    setPostType(event.target.value);
    setStep(0);
    setFormData({});
  };

  const nextStep = (event) => {
    event.preventDefault();
    const missingField = currentStep.fields.find((field) => field.key !== 'type' && !formData[field.key]);
    if (missingField) {
      onAction(`Please complete ${missingField.label.toLowerCase()}.`);
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
    else {
      onSubmitResource({
        id: `posted-${Date.now()}`,
        title: formData.title,
        resourceType: postType,
        type: postType,
        meta: `${formData.subject || 'General'} · Learn Hub submission`,
        author: formData.author || formData.instructor || 'Learn Hub contributor',
        board: formData.board,
        year: formData.year,
        duration: formData.duration,
        fileName: formData.file,
        image: recommendations[0].image,
      });
      setSubmitted(true);
    }
  };

  const renderField = (field) => {
    if (field.kind === 'type') return <select value={postType} onChange={changeType}><option value="book">Book</option><option value="paper">Past paper</option><option value="video">Video lesson</option></select>;
    if (field.kind === 'subject') return <select value={formData[field.key] || ''} onChange={(event) => updateField(field.key, event.target.value)}><option value="">Choose a subject</option><option>Science</option><option>Mathematics</option><option>Languages</option><option>Humanities</option><option>Business</option></select>;
    if (field.kind === 'textarea') return <textarea value={formData[field.key] || ''} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} />;
    if (field.kind === 'file') return <div className={`publish-file-drop ${dragActive ? 'is-dragging' : ''} ${formData[field.key] ? 'has-file' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(event) => handleFileDrop(event, field.key)}><input id={`publish-file-${field.key}`} type="file" accept={field.accept} onChange={(event) => handleFile(field.key, event.target.files[0])} /><span className="publish-file-icon">↑</span><strong>{formData[field.key] || 'Drop your file here'}</strong><small>or choose a file from your device</small></div>;
    return <input type={field.kind || 'text'} value={formData[field.key] || ''} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} />;
  };

  return <div className="product-page resource-detail-page publish-book-page">
    <header className="library-header resource-detail-header"><div className="library-header-content"><div className="page-heading"><h1>Post a resource</h1></div><HeaderActions onNavigate={onNavigate} /></div></header>
    <div className="publish-book-background publish-book-background-top" aria-hidden="true" />
    <div className="publish-book-background publish-book-background-bottom" aria-hidden="true" />
    <main className="resource-detail-content">
      <div className="publish-layout"><section className="book-info-card publish-book-card"><span className="eyebrow">Publisher Studio</span><h2>{submitted ? `${typeName} submitted` : 'Share a resource with Learn Hub'}</h2><p>{submitted ? 'Your resource is now queued for review by the Learn Hub team.' : 'Complete each step to provide the information learners need.'}</p>{submitted ? <div className="publish-success"><span className="publish-success-icon"><IconCheck size={18} /></span><strong>Thanks for contributing to Learn Hub.</strong><small>Our team will review your {postType} before it becomes available to learners.</small><button type="button" className="primary-button" onClick={() => { setSubmitted(false); setStep(0); setFormData({}); }}>Post another resource</button></div> : <form className="publish-book-form" onSubmit={nextStep}><div className="publish-step-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((item, index) => <div key={item.title} className={`publish-step-indicator ${index <= step ? 'is-current' : ''}`}><span>{index + 1}</span><small>{item.title}</small></div>)}</div><div className="publish-step-card"><span className="eyebrow">Step {step + 1} of {steps.length}</span><h3>{currentStep.title}</h3>{currentStep.fields.map((field) => <label key={field.key}>{field.label}{renderField(field)}</label>)}</div><div className="publish-book-actions"><button type="button" className="outline-button" onClick={() => step === 0 ? onNavigate('home') : setStep(step - 1)}>{step === 0 ? 'Cancel' : 'Back'}</button><button type="submit" className="primary-button">{step === steps.length - 1 ? `Submit ${postType}` : 'Continue'}</button></div></form>}</section><aside className="publish-help-card"><span className="eyebrow">Upload guide</span><h3>Prepare your resource</h3><p>Follow these quick tips before you submit.</p><div className="publish-help-item"><strong>Book</strong><span>Upload a clear PDF, EPUB, DOC, or DOCX file. Include the author and publisher details.</span></div><div className="publish-help-item"><strong>Past paper</strong><span>Upload a PDF, DOC, or DOCX file and include the exam board and year.</span></div><div className="publish-help-item"><strong>Video lesson</strong><span>Upload an MP4, WebM, MOV, AVI, or MKV file with the instructor and duration.</span></div><div className="publish-help-note"><IconCheck size={14} /> Images are not accepted.</div></aside></div>
    </main>
  </div>;
}

function ResourceDetailPage({ resource, returnPage, onNavigate, onAction, onOpenReader, onOpenResource, onOpenPublisher, isInLibrary, isDownloaded, onToggleLibrary, onDownload }) {
  const isVideo = resource.resourceType === 'video';
  const isPaper = resource.resourceType === 'paper';
  if (!isVideo && !isPaper) return <BookDetailsPage resource={resource} returnPage={returnPage} onNavigate={onNavigate} onAction={onAction} onOpenReader={onOpenReader} onOpenResource={onOpenResource} onOpenPublisher={onOpenPublisher} isInLibrary={isInLibrary} isDownloaded={isDownloaded} onToggleLibrary={onToggleLibrary} onDownload={onDownload} />;
  const author = resource.author || resource.board || resource.instructor || resource.teacher || 'Learn Hub library';
  return <div className="product-page resource-detail-page">
    <header className="library-header resource-detail-header"><div className="library-header-content"><div className="page-heading"><h1>{isVideo ? 'Video lesson' : isPaper ? 'Past paper' : 'Book details'}</h1></div><HeaderActions onNavigate={onNavigate} /></div></header>
    <main className="resource-detail-content">
      <button type="button" className="detail-back-button" onClick={() => onNavigate(returnPage)}><IconChevronRight size={16} /> Back to {returnPage === 'home' ? 'Home' : 'Library'}</button>
      <section className="resource-detail-card">
        {isVideo ? <div className="resource-video-player"><video controls poster={resource.image} preload="metadata"><source src={resource.videoUrl || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'} type="video/mp4" />Your browser does not support video playback.</video><div className="resource-video-caption"><IconPlayerPlay size={16} /> Press play to start the lesson</div></div> : <div className="resource-detail-cover"><img src={resource.image} alt={`${resource.title} cover`} /><span>{isPaper ? 'Paper' : 'Book'}</span></div>}
        <div className="resource-detail-copy"><span className="eyebrow">{resource.meta || 'Learning resource'}</span><h2>{resource.title}</h2><p className="resource-detail-author">{author}</p><p className="resource-detail-description">{isVideo ? 'Watch this lesson at your own pace, pause when you need to take notes, and return to it from your library.' : isPaper ? 'Review the examination paper, understand its format, and use it to prepare for your next assessment.' : 'Explore this learning resource from Learn Hub and continue building your understanding step by step.'}</p><div className="resource-detail-facts"><span><b>Type</b>{isVideo ? 'Video lesson' : isPaper ? 'Past paper' : 'Study resource'}</span><span><b>{isPaper ? 'Year' : isVideo ? 'Duration' : 'Format'}</b>{resource.year || resource.duration || resource.format || 'Digital resource'}</span><span><b>Rating</b>{resource.rating ? `${resource.rating} / 5` : 'New resource'}</span></div><div className="resource-detail-actions"><button type="button" className="primary-button" onClick={() => onAction(isVideo ? 'Video lesson started.' : isPaper ? 'Paper added to your study list.' : 'Book added to your reading list.')}>{isVideo ? 'Start lesson' : isPaper ? 'Save paper' : 'Start reading'}</button><button type="button" className={`outline-button ${isInLibrary ? 'is-selected' : ''}`} onClick={() => onToggleLibrary?.()}>{isInLibrary ? 'In my library' : 'Save to library'}</button><button type="button" className="outline-button" onClick={() => onDownload?.()}>{isDownloaded ? 'Downloaded' : 'Download'}</button></div></div>
      </section>
    </main>
  </div>;
}

function ResourceReaderPage({ resource, returnPage, onNavigate, onAction }) {
  const isPaper = resource.resourceType === 'paper';
  const totalPages = isPaper ? 20 : 64;
  const [pageNumber, setPageNumber] = useState(1);
  const pageInfo = isPaper ? `Paper 1 · Question ${pageNumber}` : `Page ${pageNumber} of ${totalPages}`;
  return <div className="product-page resource-reader-page">
    <header className="library-header resource-detail-header"><div className="library-header-content"><div className="page-heading"><h1>{isPaper ? 'Paper viewer' : 'Reading view'}</h1></div><HeaderActions onNavigate={onNavigate} /></div></header>
    <div className="resource-reader-background resource-reader-background-top" aria-hidden="true" />
    <div className="resource-reader-background resource-reader-background-bottom" aria-hidden="true" />
    <main className="resource-reader-content"><button type="button" className="detail-back-button" onClick={() => onNavigate(returnPage)}><IconChevronRight size={16} /> Back to {returnPage === 'home' ? 'Home' : 'Library'}</button><section className="resource-reader-shell"><aside className="resource-reader-cover"><img src={resource.image} alt="" /><span>{isPaper ? 'Paper' : 'Book'}</span></aside><div className="resource-reader-main"><div className="resource-reader-toolbar"><span>{resource.meta || 'Learning resource'}</span><strong>{pageInfo}</strong></div><div className="resource-reader-paper"><span className="eyebrow">{isPaper ? 'Examination paper' : 'Study chapter'}</span><h2>{resource.title}</h2><p>{isPaper ? 'Work through each question carefully. Use the viewer controls to move through the paper and keep your answers organised.' : `Continue from ${pageInfo}. Read at your own pace and return to your saved position whenever you need to.`}</p><div className="reader-lines"><span /><span /><span /><span /><span /></div></div><div className="resource-reader-controls"><button type="button" className="outline-button" disabled={pageNumber === 1} onClick={() => setPageNumber((currentPage) => Math.max(1, currentPage - 1))}>Previous</button><button type="button" className="primary-button" onClick={() => onAction(`Progress saved at ${pageInfo}.`)}>Save progress</button><button type="button" className="outline-button" disabled={pageNumber === totalPages} onClick={() => setPageNumber((currentPage) => Math.min(totalPages, currentPage + 1))}>Next</button></div></div></section></main>
  </div>;
}

function ProfilePage({ onOpenSettings }) {
  const [activeTab, setActiveTab] = useState('overview');
  const profileDefaults = { name: 'SAMUEL KP', role: 'Student', form: 'Form 3', school: 'Blantyre Secondary School', department: 'Sciences & Technology', subjects: 'Biology, Chemistry, Mathematics', bio: 'Curious learner building a stronger foundation in science, mathematics, and the ideas that connect them.', visibility: 'My school', email: 'samuel.kp@example.com', phone: '+265 888 204 118', image: null };
  const [profileDetails, setProfileDetails] = useState(() => ({ ...profileDefaults, ...readStoredValue('learnhub-profile-details', {}) }));
  const [draftProfile, setDraftProfile] = useState(profileDetails);
  const [profileImageError, setProfileImageError] = useState('');
  const [profileSaveMessage, setProfileSaveMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const closeProfileEditor = useCallback(() => setIsEditing(false), []);
  const profileDialogRef = useDialogAccessibility(isEditing, closeProfileEditor);
  const tabs = ['overview', 'questions', 'answers', 'library', 'activity'];
  const profileName = profileDetails.name;
  const profileImage = profileDetails.image;
  const initials = profileName.split(' ').map((part) => part[0]).join('').slice(0, 3);

  const openEditor = () => {
    setDraftProfile({ ...profileDetails });
    setProfileImageError('');
    setIsEditing(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      setProfileImageError('Please choose a JPG, PNG, or WEBP image.');
      event.target.setCustomValidity('Please choose a JPG, PNG, or WEBP image.');
      event.target.reportValidity();
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileImageError('Profile pictures must be smaller than 5 MB.');
      event.target.setCustomValidity('Profile pictures must be smaller than 5 MB.');
      event.target.reportValidity();
      event.target.value = '';
      return;
    }
    event.target.setCustomValidity('');
    const reader = new FileReader();
    reader.onload = () => {
      setDraftProfile((currentProfile) => ({ ...currentProfile, image: reader.result }));
      setProfileImageError('');
    };
    reader.onerror = () => setProfileImageError('The image could not be read. Please try another file.');
    reader.readAsDataURL(file);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    if (!draftProfile.name.trim() || profileImageError) return;
    const savedProfile = { ...draftProfile, name: draftProfile.name.trim(), subjects: draftProfile.subjects.trim(), bio: draftProfile.bio.trim() };
    setProfileDetails(savedProfile);
    writeStoredValue('learnhub-profile-details', savedProfile);
    setIsEditing(false);
    setProfileSaveMessage('Profile changes saved.');
    window.setTimeout(() => setProfileSaveMessage(''), 2600);
  };

  const renderAvatar = (className) => profileImage
    ? <img className={`${className} profile-image`} src={profileImage} alt={`${profileName} profile`} />
    : <div className={className}>{initials}</div>;

  return <div className="product-page profile-page">
    <header className="library-header profile-page-header">
      <div className="library-header-content">
        <div className="page-heading">
          <h1>Profile</h1>
        </div>
        <HeaderActions user={{ ...defaultCurrentUser, name: profileDetails.name, initials, role: `${profileDetails.role} · ${profileDetails.form}`, school: profileDetails.school, image: profileDetails.image }} />
      </div>
    </header>
    <div className="profile-background profile-background-top" aria-hidden="true" />
    <div className="profile-background profile-background-bottom" aria-hidden="true" />
    <header className="profile-hero">
      <div className="profile-hero-main">{renderAvatar('profile-avatar profile-avatar-hero')}<div><h1>{profileName}</h1><p className="profile-role">{profileDetails.role} <span>·</span> {profileDetails.form}</p><p className="profile-school"><IconSchool size={15} /> {profileDetails.school} <span>·</span> {profileDetails.department}</p><p className="profile-bio">{profileDetails.bio}</p><span className="visibility-indicator"><IconEye size={14} /> Visible to {profileDetails.visibility.toLowerCase()}</span></div></div>
      <div className="profile-actions"><button type="button" className="outline-button" onClick={onOpenSettings}><IconAdjustments size={15} /> Settings</button><button type="button" className="primary-button" onClick={openEditor}><IconEdit size={15} /> Edit profile</button></div>
    </header>
    <nav className="profile-tabs" aria-label="Profile sections">{tabs.map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}</nav>
    {profileSaveMessage && <div className="app-action-feedback" role="status">{profileSaveMessage}</div>}
    <div className="profile-content">
      {activeTab === 'overview' && <><div className="profile-stats"><div><strong>18</strong><span>Questions asked</span></div><div><strong>42</strong><span>Answers received</span></div><div><strong>7</strong><span>Resources completed</span></div><div><strong>3</strong><span>Saved collections</span></div></div><div className="profile-grid"><section className="profile-panel"><div className="panel-heading"><div><span className="eyebrow">Learning focus</span><h2>My departments</h2></div><IconBook2 size={18} /></div><div className="profile-chip-row"><span className="profile-chip primary">{profileDetails.department} <b>Primary</b></span></div><div className="panel-heading panel-heading-spaced"><div><span className="eyebrow">Subjects</span><h2>Preferred subjects</h2></div></div><div className="subject-list">{profileDetails.subjects.split(',').map((subject) => <span key={subject.trim()}>{subject.trim()}</span>)}</div></section><section className="profile-panel progress-panel"><div className="panel-heading"><div><span className="eyebrow">This term</span><h2>Learning progress</h2></div><IconAward size={18} /></div><div className="goal-ring"><strong>68%</strong><span>of your reading goal</span></div><div className="progress-track"><span style={{ width: '68%' }} /></div><p>12 of 18 planned resources completed this term.</p><button type="button" className="text-button">View activity <IconChevronRight size={15} /></button></section></div></>}
      {activeTab === 'questions' && <section className="profile-panel profile-list-panel"><div className="panel-heading"><div><span className="eyebrow">Public activity</span><h2>Questions asked</h2></div><span className="count-label">18 total</span></div><article className="question-row"><div><span className="profile-chip">Biology</span><h3>How does photosynthesis produce glucose?</h3><p>4 answers · 8 likes</p></div><span className="question-status answered">Answered</span></article><article className="question-row"><div><span className="profile-chip">Biology</span><h3>What is the difference between mitosis and meiosis?</h3><p>2 answers · 5 likes</p></div><span className="question-status open">Open</span></article></section>}
      {activeTab === 'answers' && <section className="profile-panel empty-profile-panel"><IconMessageCircle2 size={26} /><h2>Answers from {profileName}</h2><p>Public answers will appear here as you help other learners.</p></section>}
      {activeTab === 'library' && <section className="profile-panel profile-list-panel"><div className="panel-heading"><div><span className="eyebrow">Shared learning</span><h2>Saved collections</h2></div></div><div className="collection-list"><div><span className="collection-icon"><IconBook size={18} /></span><span><strong>Chemistry Study Pack</strong><small>12 resources · Updated 15 Sep 2026</small></span><IconChevronRight size={16} /></div><div><span className="collection-icon coral"><IconBook size={18} /></span><span><strong>Mathematics Past Papers</strong><small>15 resources · Updated 5 Sep 2026</small></span><IconChevronRight size={16} /></div></div></section>}
      {activeTab === 'activity' && <section className="profile-panel empty-profile-panel"><IconEye size={26} /><h2>Activity is private</h2><p>Recent reading, notes, and highlights are only visible to you.</p><button type="button" className="outline-button" onClick={onOpenSettings}>Review privacy settings</button></section>}
    </div>
    {isEditing && <div className="profile-modal-backdrop" role="presentation"><form ref={profileDialogRef} role="dialog" aria-modal="true" aria-labelledby="profile-editor-title" className="profile-editor" onSubmit={saveProfile}><div className="profile-editor-heading"><div><span className="eyebrow">Profile details</span><h2 id="profile-editor-title">Edit profile</h2></div><button type="button" className="modal-close" aria-label="Close profile editor" onClick={closeProfileEditor}>×</button></div><div className="profile-editor-avatar">{draftProfile.image ? <img className="profile-image" src={draftProfile.image} alt="Profile preview" /> : <div className="profile-avatar profile-avatar-hero">{initials}</div>}<label className="upload-button"><IconPhoto size={15} /> Change picture<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} /></label></div>{profileImageError && <p className="form-inline-error" role="alert">{profileImageError}</p>}<div className="profile-editor-grid"><label className="profile-field">Full name<input type="text" value={draftProfile.name} onChange={(event) => setDraftProfile({ ...draftProfile, name: event.target.value })} required /></label><label className="profile-field">Role<input type="text" value={draftProfile.role} onChange={(event) => setDraftProfile({ ...draftProfile, role: event.target.value })} required /></label><label className="profile-field">Class / Form<select value={draftProfile.form} onChange={(event) => setDraftProfile({ ...draftProfile, form: event.target.value })}><option>Form 1</option><option>Form 2</option><option>Form 3</option><option>Form 4</option></select></label><label className="profile-field">School<input type="text" value={draftProfile.school} onChange={(event) => setDraftProfile({ ...draftProfile, school: event.target.value })} required /></label><label className="profile-field">Department<input type="text" value={draftProfile.department} onChange={(event) => setDraftProfile({ ...draftProfile, department: event.target.value })} required /></label><label className="profile-field">Visibility<select value={draftProfile.visibility} onChange={(event) => setDraftProfile({ ...draftProfile, visibility: event.target.value })}><option>My school</option><option>My class</option><option>Everyone</option><option>Only me</option></select></label><label className="profile-field">Email address<input type="email" value={draftProfile.email} onChange={(event) => setDraftProfile({ ...draftProfile, email: event.target.value })} required /></label><label className="profile-field">Phone number<input type="tel" value={draftProfile.phone} onChange={(event) => setDraftProfile({ ...draftProfile, phone: event.target.value })} /></label></div><label className="profile-field">Preferred subjects<input type="text" value={draftProfile.subjects} onChange={(event) => setDraftProfile({ ...draftProfile, subjects: event.target.value })} placeholder="Biology, Chemistry, Mathematics" /></label><label className="profile-field">Bio<textarea value={draftProfile.bio} onChange={(event) => setDraftProfile({ ...draftProfile, bio: event.target.value })} maxLength={240} /></label><p className="profile-editor-note">Your profile details are shown according to your visibility setting.</p><div className="profile-editor-actions"><button type="button" className="outline-button" onClick={closeProfileEditor}>Cancel</button><button type="submit" className="primary-button">Save changes</button></div></form></div>}
  </div>;
}

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All STEM');
  const [currentPage, setCurrentPage] = useState(() => {
    const route = window.location.hash.slice(1);
    return ['home', 'library', 'discover', 'profile', 'settings'].includes(route) ? route : 'home';
  });
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceReturnPage, setResourceReturnPage] = useState('home');
  const [resourceCollection, setResourceCollection] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [libraryResourceKeys, setLibraryResourceKeys] = useState(() => new Set(readStoredValue('learnhub-library-keys', [...libraryItems, ...savedResources].map(resourceKey))));
  const [downloadedResourceKeys, setDownloadedResourceKeys] = useState(() => new Set(readStoredValue('learnhub-downloaded-keys', libraryItems.map(resourceKey))));
  const [postedResources, setPostedResources] = useLocalStorageState('learnhub-posted-resources', []);
  const [feedPosts, setFeedPosts] = useState(discoveryPosts);
  const [discoverDraft, setDiscoverDraft] = useState('');
  const [discoverImage, setDiscoverImage] = useState('');
  const [discoverImageName, setDiscoverImageName] = useState('');
  const [discoverImageMeta, setDiscoverImageMeta] = useState({ type: '', size: 0, width: 0, height: 0 });
  const [discoverPostType, setDiscoverPostType] = useState('question');
  const [discoverSubject, setDiscoverSubject] = useState('');
  const [discoverDepartment, setDiscoverDepartment] = useState('');
  const [discoverClass, setDiscoverClass] = useState('');
  const [discoverTopic, setDiscoverTopic] = useState('');
  const [discoverRelatedResource, setDiscoverRelatedResource] = useState('');
  const [discoverImageAlt, setDiscoverImageAlt] = useState('');
  const [discoverImageCaption, setDiscoverImageCaption] = useState('');
  const [discoverValidationErrors, setDiscoverValidationErrors] = useState([]);
  const [isDiscoverPreviewOpen, setIsDiscoverPreviewOpen] = useState(false);
  const [, setDiscoverDraftPosts] = useLocalStorageState('learnhub-discover-drafts', []);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isPostImageDragging, setIsPostImageDragging] = useState(false);
  const [discoverFeedFilter, setDiscoverFeedFilter] = useState('all');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [feedInteractions, setFeedInteractions] = useState({});
  const [postComments, setPostComments] = useState(initialPostComments);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [openCommentPosts, setOpenCommentPosts] = useState({});
  const [activeReply, setActiveReply] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [commentPages, setCommentPages] = useState({});
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostDraft, setEditingPostDraft] = useState('');
  const [hiddenPostIds, setHiddenPostIds] = useState([]);
  const [reportedPostIds, setReportedPostIds] = useState([]);
  const [, setPostReports] = useLocalStorageState('learnhub-post-reports', []);
  const [reportDialogPost, setReportDialogPost] = useState(null);
  const [reportCategory, setReportCategory] = useState('spam');
  const [pendingFeedAction, setPendingFeedAction] = useState(null);
  const [feedNotifications, setFeedNotifications] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [currentUser] = useState(() => readStoredValue('learnhub-current-user', defaultCurrentUser));
  const [feedVisibleCount, setFeedVisibleCount] = useState(5);
  const recentCommentTimesRef = useRef([]);
  const recentPostTimesRef = useRef([]);
  const feedLoadMoreRef = useRef(null);
  const actionTimerRef = useRef(null);

  useEffect(() => {
    writeStoredValue('learnhub-library-keys', [...libraryResourceKeys]);
  }, [libraryResourceKeys]);

  useEffect(() => {
    writeStoredValue('learnhub-downloaded-keys', [...downloadedResourceKeys]);
  }, [downloadedResourceKeys]);

  useEffect(() => {
    writeStoredValue('learnhub-discover-composer-draft', { content: discoverDraft, postType: discoverPostType, subject: discoverSubject, department: discoverDepartment, classForm: discoverClass, topic: discoverTopic, relatedResource: discoverRelatedResource, imageCaption: discoverImageCaption, imageAlt: discoverImageAlt });
  }, [discoverDraft, discoverPostType, discoverSubject, discoverDepartment, discoverClass, discoverTopic, discoverRelatedResource, discoverImageCaption, discoverImageAlt]);

  const showAction = (message) => {
    setActionMessage(message);
    window.clearTimeout(actionTimerRef.current);
    actionTimerRef.current = window.setTimeout(() => setActionMessage(''), 2600);
  };

  const navigateTo = (page) => {
    if (['home', 'library', 'discover', 'profile', 'settings'].includes(page)) {
      setCurrentPage(page);
      window.history.pushState({ page }, '', `#${page}`);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const nextPage = window.location.hash.slice(1) || 'home';
      if (['home', 'library', 'discover', 'profile', 'settings'].includes(nextPage)) setCurrentPage(nextPage);
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const openResource = (resource) => {
    setSelectedResource(resource);
    setResourceReturnPage(currentPage === 'resource' ? resourceReturnPage : currentPage);
    setCurrentPage('resource');
  };

  const openReader = (resource = selectedResource) => {
    if (!resource) return;
    setSelectedResource(resource);
    setResourceReturnPage(currentPage === 'resource' || currentPage === 'reader' ? resourceReturnPage : currentPage);
    setCurrentPage('reader');
  };

  const openPublisher = (resource) => {
    setSelectedResource(resource);
    setResourceReturnPage(currentPage === 'resource' ? resourceReturnPage : currentPage);
    setCurrentPage('publisher');
  };

  const toggleLibrary = (resource) => {
    const key = resourceKey(resource);
    setLibraryResourceKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);
      const alreadySaved = nextKeys.has(key);
      if (alreadySaved) nextKeys.delete(key);
      else nextKeys.add(key);
      showAction(alreadySaved ? 'Removed from your library.' : 'Added to your library.');
      return nextKeys;
    });
  };

  const downloadResource = (resource) => {
    const key = resourceKey(resource);
    setDownloadedResourceKeys((currentKeys) => {
      if (currentKeys.has(key)) {
        showAction('This resource is already downloaded.');
        return currentKeys;
      }
      const nextKeys = new Set(currentKeys);
      nextKeys.add(key);
      showAction('Download completed.');
      return nextKeys;
    });
  };

  const savePostedResource = (resource) => {
    setPostedResources((currentResources) => [resource, ...currentResources.filter((item) => resourceKey(item) !== resourceKey(resource))]);
    showAction(`${resource.resourceType === 'paper' ? 'Paper' : resource.resourceType === 'video' ? 'Video' : 'Book'} submitted for review.`);
  };

  const resetDiscoverComposer = () => {
    setDiscoverDraft('');
    setDiscoverImage('');
    setDiscoverImageName('');
    setDiscoverImageMeta({ type: '', size: 0, width: 0, height: 0 });
    setDiscoverPostType('question');
    setDiscoverSubject('');
    setDiscoverDepartment('');
    setDiscoverClass('');
    setDiscoverTopic('');
    setDiscoverRelatedResource('');
    setDiscoverImageAlt('');
    setDiscoverImageCaption('');
    setDiscoverValidationErrors([]);
    setIsDiscoverPreviewOpen(false);
    setIsPostImageDragging(false);
  };

  const validateDiscoverPost = () => {
    const errors = [];
    if (!['question', 'image'].includes(discoverPostType)) errors.push('You do not have permission to create this post type.');
    if (discoverPostType === 'question' && !discoverDraft.trim()) errors.push('Please enter the question.');
    if (discoverPostType === 'image' && !discoverDraft.trim() && !discoverImage) errors.push('Please add an image or enter something to share.');
    if (discoverPostType === 'question' && !discoverSubject) errors.push('Please select a subject.');
    if (discoverPostType === 'question' && !discoverClass) errors.push('Please select a class or Form.');
    if (discoverDraft.trim().length > 2000) errors.push('Your post is too long. Keep it under 2,000 characters.');
    setDiscoverValidationErrors(errors);
    return errors;
  };

  const addFeedNotification = (title, detail) => {
    setFeedNotifications((currentNotifications) => [{ id: `notification-${Date.now()}`, title, detail }, ...currentNotifications].slice(0, 20));
  };

  const moderationErrorFor = (content, kind) => {
    const maxLength = kind === 'post' ? 2000 : 500;
    if (content.length > maxLength) return `This ${kind} is too long. Keep it under ${maxLength} characters.`;
    if (/(.)\1{8,}/i.test(content) || /(https?:\/\/\S+\s*){3,}/i.test(content)) return 'This content was blocked by spam protection.';
    const now = Date.now();
    const timeWindow = kind === 'post' ? 60000 : 30000;
    const timesRef = kind === 'post' ? recentPostTimesRef : recentCommentTimesRef;
    const recentTimes = timesRef.current.filter((time) => now - time < timeWindow);
    if (recentTimes.length >= (kind === 'post' ? 3 : 5)) return 'You are doing that too quickly. Please try again later.';
    timesRef.current = [...recentTimes, now];
    return '';
  };

  const createFeedPost = (event) => {
    event.preventDefault();
    const errors = validateDiscoverPost();
    if (errors.length) return;
    const moderationError = moderationErrorFor(discoverDraft.trim(), 'post');
    if (moderationError) { setDiscoverValidationErrors([moderationError]); return; }
    const createdDate = new Date().toISOString();
    const media = discoverImage ? { post: `post-${Date.now()}`, filePath: discoverImageName, fileType: discoverImageMeta.type, fileSize: discoverImageMeta.size, imageWidth: discoverImageMeta.width, imageHeight: discoverImageMeta.height, altText: discoverImageAlt.trim(), caption: discoverImageCaption.trim(), displayOrder: 0 } : null;
    const newPost = { id: `post-${Date.now()}`, type: discoverPostType, author: currentUser.name, authorAvatar: currentUser.initials, school: currentUser.school, time: 'Just now', content: discoverDraft.trim(), image: discoverImage, subject: discoverSubject, department: discoverDepartment, classForm: discoverClass, topic: discoverTopic, relatedResource: discoverRelatedResource, status: 'published', createdDate, media, likes: 0, comments: 0, shares: 0 };
    setFeedLoading(true);
    setFeedError('');
    window.setTimeout(() => {
      setFeedPosts((currentPosts) => [newPost, ...currentPosts]);
      resetDiscoverComposer();
      setIsCreatePostOpen(false);
      setFeedLoading(false);
      showAction('Post published.');
    }, 250);
  };

  const saveDiscoverDraft = () => {
    setDiscoverDraftPosts((currentDrafts) => [{ id: `draft-${Date.now()}`, author: 'SAMUEL KP', postType: discoverPostType, content: discoverDraft.trim(), subject: discoverSubject, department: discoverDepartment, classForm: discoverClass, topic: discoverTopic, status: 'draft', createdDate: new Date().toISOString() }, ...currentDrafts]);
    resetDiscoverComposer();
    setIsCreatePostOpen(false);
    showAction('Draft saved.');
  };

  const handleDiscoverImage = (fileOrEvent) => {
    const file = fileOrEvent?.target ? fileOrEvent.target.files[0] : fileOrEvent;
    if (!file) return;
    const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedImageTypes.includes(file.type)) {
      setDiscoverValidationErrors(['This file type is not supported.']);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setDiscoverValidationErrors(['This image is larger than the allowed size.']);
      return;
    }
    setDiscoverImage(URL.createObjectURL(file));
    setDiscoverImageName(file.name);
    setDiscoverImageMeta({ type: file.type, size: file.size, width: 0, height: 0 });
    const image = new Image();
    image.onload = () => setDiscoverImageMeta((currentMeta) => ({ ...currentMeta, width: image.naturalWidth, height: image.naturalHeight }));
    image.src = URL.createObjectURL(file);
    setDiscoverValidationErrors([]);
    setIsPostImageDragging(false);
  };

  const closeCreatePost = useCallback(() => {
    setIsCreatePostOpen(false);
    setIsDiscoverPreviewOpen(false);
    setIsPostImageDragging(false);
  }, []);

  const createPostDialogRef = useDialogAccessibility(isCreatePostOpen, closeCreatePost);
  const closeFeedDialogs = useCallback(() => {
    setPendingFeedAction(null);
    setReportDialogPost(null);
  }, []);
  const feedDialogRef = useDialogAccessibility(Boolean(pendingFeedAction || reportDialogPost), closeFeedDialogs);

  const openCreatePost = () => {
    const savedComposer = readStoredValue('learnhub-discover-composer-draft', null);
    if (!discoverDraft && savedComposer?.content) {
      setDiscoverDraft(savedComposer.content || '');
      setDiscoverPostType(savedComposer.postType || 'question');
      setDiscoverSubject(savedComposer.subject || '');
      setDiscoverDepartment(savedComposer.department || '');
      setDiscoverClass(savedComposer.classForm || '');
      setDiscoverTopic(savedComposer.topic || '');
      setDiscoverRelatedResource(savedComposer.relatedResource || '');
      setDiscoverImageCaption(savedComposer.imageCaption || '');
      setDiscoverImageAlt(savedComposer.imageAlt || '');
      showAction('Draft restored.');
    }
    setIsCreatePostOpen(true);
  };

  useEffect(() => {
    const handleDocumentKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setPostMenuOpen(null);
      setReportDialogPost(null);
      setPendingFeedAction(null);
      setEditingComment(null);
    };
    const handleOutsideMenuClick = (event) => {
      if (!event.target.closest('.feed-post-menu-wrap')) setPostMenuOpen(null);
    };
    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('pointerdown', handleOutsideMenuClick);
    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('pointerdown', handleOutsideMenuClick);
    };
  }, [isCreatePostOpen]);

  const interactWithPost = (postId, action) => {
    setFeedInteractions((currentInteractions) => {
      const current = currentInteractions[postId] || {};
      if (action === 'like') return { ...currentInteractions, [postId]: { ...current, liked: !current.liked } };
      if (action === 'repost') return { ...currentInteractions, [postId]: { ...current, reposted: !current.reposted } };
      return currentInteractions;
    });
    if (action === 'comment') {
      setOpenCommentPosts((currentOpenPosts) => ({ ...currentOpenPosts, [postId]: !currentOpenPosts[postId] }));
      return;
    }
    if (action === 'like') showAction('Like updated.');
    if (action === 'repost') showAction('Repost updated.');
  };

  const addComment = (postId, event) => {
    event.preventDefault();
    const content = (commentDrafts[postId] || '').trim();
    if (!content) return;
    const moderationError = moderationErrorFor(content, 'comment');
    if (moderationError) { setFeedError(moderationError); return; }
    const comment = { id: `comment-${Date.now()}`, authorId: currentUser.id, author: currentUser.name, authorAvatar: currentUser.initials, content, likes: 0, liked: false, replies: [], createdDate: new Date().toISOString() };
    setFeedLoading(true);
    setFeedError('');
    window.setTimeout(() => {
      setPostComments((currentComments) => ({ ...currentComments, [postId]: [...(currentComments[postId] || []), comment] }));
      setCommentDrafts((currentDrafts) => ({ ...currentDrafts, [postId]: '' }));
      setOpenCommentPosts((currentOpenPosts) => ({ ...currentOpenPosts, [postId]: true }));
      setFeedLoading(false);
      addFeedNotification('Comment posted', 'Your comment was added to the discussion.');
      showAction('Comment added.');
    }, 180);
  };

  const toggleCommentLike = (postId, commentId) => {
    setPostComments((currentComments) => ({
      ...currentComments,
      [postId]: (currentComments[postId] || []).map((comment) => comment.id === commentId ? { ...comment, liked: !comment.liked, likes: comment.likes + (comment.liked ? -1 : 1) } : comment),
    }));
  };

  const openReplyBox = (postId, commentId) => {
    setActiveReply({ postId, commentId });
    setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [`${postId}:${commentId}`]: currentDrafts[`${postId}:${commentId}`] || '' }));
  };

  const addReply = (postId, commentId, event) => {
    event.preventDefault();
    const replyKey = `${postId}:${commentId}`;
    const content = (replyDrafts[replyKey] || '').trim();
    if (!content) return;
    const moderationError = moderationErrorFor(content, 'comment');
    if (moderationError) { setFeedError(moderationError); return; }
    const reply = { id: `reply-${Date.now()}`, authorId: currentUser.id, author: currentUser.name, authorAvatar: currentUser.initials, content, liked: false, likes: 0, createdDate: new Date().toISOString() };
    setFeedLoading(true);
    setFeedError('');
    window.setTimeout(() => {
      setPostComments((currentComments) => ({
        ...currentComments,
        [postId]: (currentComments[postId] || []).map((comment) => comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), reply] } : comment),
      }));
      setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [replyKey]: '' }));
      setActiveReply(null);
      setFeedLoading(false);
      addFeedNotification('Reply posted', 'Your reply was added to the discussion.');
      showAction('Reply added.');
    }, 180);
  };

  const toggleReplyLike = (postId, commentId, replyId) => {
    setPostComments((currentComments) => ({ ...currentComments, [postId]: (currentComments[postId] || []).map((comment) => comment.id === commentId ? { ...comment, replies: (comment.replies || []).map((reply) => reply.id === replyId ? { ...reply, liked: !reply.liked, likes: reply.likes + (reply.liked ? -1 : 1) } : reply) } : comment) }));
  };

  const editComment = (postId, commentId, content) => {
    const moderationError = moderationErrorFor(content.trim(), 'comment');
    if (!content.trim() || moderationError) { setFeedError(moderationError || 'Comment cannot be empty.'); return; }
    setPostComments((currentComments) => ({ ...currentComments, [postId]: (currentComments[postId] || []).map((comment) => comment.id === commentId ? { ...comment, content: content.trim(), edited: true } : comment) }));
    setEditingComment(null);
    showAction('Comment updated.');
  };

  const deleteComment = (postId, commentId) => {
    setPendingFeedAction({ type: 'delete-comment', postId, commentId });
  };

  const confirmDeleteComment = (postId, commentId) => {
    setPostComments((currentComments) => ({ ...currentComments, [postId]: (currentComments[postId] || []).filter((comment) => comment.id !== commentId) }));
    setPendingFeedAction(null);
    showAction('Comment deleted.');
  };

  const deleteReply = (postId, commentId, replyId) => {
    setPendingFeedAction({ type: 'delete-reply', postId, commentId, replyId });
  };

  const confirmDeleteReply = (postId, commentId, replyId) => {
    setPostComments((currentComments) => ({ ...currentComments, [postId]: (currentComments[postId] || []).map((comment) => comment.id === commentId ? { ...comment, replies: (comment.replies || []).filter((reply) => reply.id !== replyId) } : comment) }));
    setPendingFeedAction(null);
    showAction('Reply deleted.');
  };

  const startPostEdit = (post) => {
    if (post.author !== currentUser.name) { showAction('You can only edit your own posts.'); return; }
    setEditingPostId(post.id);
    setEditingPostDraft(post.content || '');
    setPostMenuOpen(null);
  };

  const savePostEdit = (postId, event) => {
    event.preventDefault();
    const content = editingPostDraft.trim();
    const moderationError = moderationErrorFor(content, 'post');
    if (!content || moderationError) { setFeedError(moderationError || 'Post cannot be empty.'); return; }
    setFeedPosts((currentPosts) => currentPosts.map((post) => post.id === postId ? { ...post, content, edited: true } : post));
    setEditingPostId(null);
    setEditingPostDraft('');
    showAction('Post updated.');
  };

  const deletePost = (post) => {
    if (post.author !== currentUser.name) { showAction('You can only delete your own posts.'); return; }
    setPendingFeedAction({ type: 'delete', post });
    setPostMenuOpen(null);
  };

  const confirmDeletePost = (post) => {
    setFeedPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id));
    setPendingFeedAction(null);
    showAction('Post deleted.');
  };

  const hidePost = (postId) => {
    setPendingFeedAction({ type: 'hide', postId });
    setPostMenuOpen(null);
  };

  const confirmHidePost = (postId) => {
    setHiddenPostIds((currentIds) => [...currentIds, postId]);
    setPendingFeedAction(null);
    showAction('Post hidden from your feed.');
  };

  const reportPost = (post) => {
    setReportDialogPost(post);
    setReportCategory('spam');
    setPostMenuOpen(null);
  };

  const submitPostReport = (event) => {
    event.preventDefault();
    if (!reportDialogPost) return;
    const report = { id: `report-${Date.now()}`, postId: reportDialogPost.id, category: reportCategory, status: 'pending', createdDate: new Date().toISOString() };
    setPostReports((currentReports) => [...currentReports, report]);
    setReportedPostIds((currentIds) => currentIds.includes(reportDialogPost.id) ? currentIds : [...currentIds, reportDialogPost.id]);
    addFeedNotification('Post reported', `Report status: ${report.status}. It was sent for moderation review.`);
    setReportDialogPost(null);
    showAction('Report submitted for review.');
  };

  const filteredFeedPosts = feedPosts.filter((post) => {
    const matchesFilter = discoverFeedFilter === 'all' || (discoverFeedFilter === 'videos' && post.type === 'video') || (discoverFeedFilter === 'followed' && post.school === 'Blantyre Secondary School');
    const searchableText = `${post.title || ''} ${post.content || ''} ${post.subject || ''} ${post.author || ''}`.toLowerCase();
    return !hiddenPostIds.includes(post.id) && matchesFilter && (!discoverSearch || searchableText.includes(discoverSearch.toLowerCase()));
  });
  const visibleFeedPosts = filteredFeedPosts.slice(0, feedVisibleCount);

  useEffect(() => {
    setFeedVisibleCount(5);
  }, [discoverFeedFilter, discoverSearch]);

  useEffect(() => {
    const target = feedLoadMoreRef.current;
    if (!target || currentPage !== 'discover' || visibleFeedPosts.length >= filteredFeedPosts.length || !window.IntersectionObserver) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setFeedVisibleCount((currentCount) => Math.min(currentCount + 5, filteredFeedPosts.length));
    }, { rootMargin: '240px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, visibleFeedPosts.length, filteredFeedPosts.length]);

  const highlightSearchText = (value) => {
    if (!value || !discoverSearch.trim()) return value;
    const expression = new RegExp(`(${discoverSearch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    const matchExpression = new RegExp(`(${discoverSearch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
    return String(value).split(expression).map((part, index) => matchExpression.test(part) ? <mark className="discover-search-highlight" key={`${part}-${index}`}>{part}</mark> : part);
  };

  const recommendedDiscoverResources = recommendations.filter((resource) => `${resource.title} ${resource.meta || ''}`.toLowerCase().includes('biology') || `${resource.title} ${resource.meta || ''}`.toLowerCase().includes('form 3')).slice(0, 3);

  const openCollection = (title, items) => {
    setResourceCollection({ title, items });
    setCurrentPage('resource-list');
  };

  const handleInteractiveClick = (event) => {
    if (event.target.closest('.book-details-page, .resource-detail-page, .resource-reader-page, .discover-post-modal, .create-post-section, .feed-post') || event.target.closest('.sidebar-post-book')) return;
    const card = event.target.closest('.kindle-book-card, .continue-card, .library-item-card');
    const control = event.target.closest('button, a');
    if (!control && !card) return;

    const label = control ? control.textContent.trim().replace(/\s+/g, ' ') : '';
    const href = control ? control.getAttribute('href') || '' : '';
    const routeMatches = { home: 'home', library: 'library', discover: 'discover', profile: 'profile', settings: 'settings' };
    const hashRoute = href.startsWith('#') ? routeMatches[href.slice(1)] : null;

    if (card && !control?.classList.contains('save-book') && !/Download PDF/i.test(label)) {
      const titleNode = card.querySelector('.kindle-title, .library-title, .continue-title');
      if (titleNode) {
        const resource = postedResources.find((item) => item.title === titleNode.textContent.trim()) || resourceByTitle(titleNode.textContent.trim());
        if (/^(Continue|Resume Reading|Open|Review)/i.test(label)) {
          setSelectedResource(resource);
          setResourceReturnPage(currentPage);
          setCurrentPage('reader');
        } else if (/^Watch/i.test(label)) {
          openResource(resource);
        } else {
          openResource(resource);
        }
        return;
      }
    }

    if (hashRoute) {
      event.preventDefault();
      navigateTo(hashRoute);
      return;
    }

    if (href === '/') {
      event.preventDefault();
      navigateTo('home');
      return;
    }

    if (/^Download PDF/i.test(label)) {
      const titleNode = card?.querySelector('.kindle-title, .library-title, .continue-title');
      if (titleNode) {
        const resource = postedResources.find((item) => item.title === titleNode.textContent.trim()) || resourceByTitle(titleNode.textContent.trim());
        downloadResource(resource);
      }
    } else if (/^View library/i.test(label) || /^Manage downloads/i.test(label)) {
      navigateTo('library');
      showAction('Opening your library…');
    } else if (/^View all categories/i.test(label)) {
      openCollection('Resource categories', categories.map((item) => ({ ...item, title: item.name, resourceType: 'book', meta: item.count })));
    } else if (/^View all papers/i.test(label)) {
      openCollection('Past papers', pastPapers.map((item) => ({ ...item, resourceType: 'paper' })));
    } else if (/^View all fresh/i.test(label)) {
      openCollection('Recently added', recentlyAdded.map((item) => ({ ...item, resourceType: 'book' })));
    } else if (/^View all/i.test(label)) {
      const shelf = control.closest('.shelf-section');
      const heading = shelf?.querySelector('h2')?.textContent || '';
      const shelfMap = heading.includes('Recommendation') ? ['Book recommendations', recommendations] : heading.includes('School') ? ['School uploads', schoolUploads] : heading.includes('Followed') ? ['Followed schools', followedSchools] : heading.includes('Popular') ? ['Popular resources', popularResources] : heading.includes('Department') ? ['Department resources', departmentResources] : ['Library resources', libraryItems];
      openCollection(shelfMap[0], shelfMap[1].map((item) => ({ ...item, resourceType: item.resourceType || (item.type === 'paper' ? 'paper' : 'book') })));
    } else if (/^(Search|Explore department|Explore leaderboard|View school portal|Manage schools|View all categories)/i.test(label)) {
      navigateTo('discover');
      showAction('Opening Discover…');
    } else if (/^(Edit profile|View profile)/i.test(label)) {
      navigateTo('profile');
    } else if (/^(Settings|Review privacy settings)/i.test(label)) {
      navigateTo('settings');
    } else if (/^(Follow|Following|Like|Comment|Repost|Add photo|Add document|Add video|Ask a question)/i.test(label)) {
      showAction(`${label || 'Action'} is ready to connect.`);
    } else if (control?.classList.contains('save-book')) {
      const titleNode = card?.querySelector('.kindle-title, .library-title, .continue-title');
      const resource = titleNode && (postedResources.find((item) => item.title === titleNode.textContent.trim()) || resourceByTitle(titleNode.textContent.trim()));
      if (resource) toggleLibrary(resource);
    } else if (control?.classList.contains('popover-signout') || /^(Log out|Sign out)/i.test(label)) {
      showAction('Log out is not available in this demo yet.');
    } else if (control?.type === 'button' && !control.closest('.settings-nav')) {
      showAction(`${label || 'This action'} is ready to connect.`);
    }
  };

  const handleMainScroll = (event) => {
    const scrollTop = event.currentTarget.scrollTop;
    if (scrollTop > 50) {
      setIsHeaderShrunk(true);
    } else if (scrollTop < 20) {
      setIsHeaderShrunk(false);
    }
  };

  const displayLibraryItems = [...libraryItems, ...postedResources];

  return (
    <div className="app-shell" onClick={handleInteractiveClick}>
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
          <button type="button" className={`sidebar-link sidebar-post-book ${currentPage === 'publisher-studio' ? 'active' : ''}`} onClick={() => setCurrentPage('publisher-studio')}>
            <IconFileText size={17} stroke={2} />
            <span>Post a book</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <a href="#profile" className={`sidebar-link ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
            <IconUser size={17} stroke={2} />
            <span>Profile</span>
          </a>
          <a href="#settings" className={`sidebar-link ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => setCurrentPage('settings')}>
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
          <HeaderActions />
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
                        <span className="star-icon"><IconStarFilled size={12} /></span>
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
                        <span className="star-icon"><IconStarFilled size={12} /></span>
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
                      <span><IconDownload size={12} stroke={2} /> {paper.downloads}</span>
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
                      <span className="school-icon-badge"><IconBuildingStore size={12} stroke={2} /></span>
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
                        <span className="star-icon"><IconStarFilled size={12} /></span>
                        <span className="rating-val">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                    <p className="kindle-author">{item.school} · {item.location}</p>
                    <div className="followers-count-tag">
                      <span><IconUsers size={12} stroke={2} /> {item.followers}</span>
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
                    <span className="kindle-badge pop-trend-tag">
                      <IconTrendingUp size={10} stroke={2} />
                      <span>{item.trendBadge}</span>
                    </span>
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
                        <span className="star-icon"><IconStarFilled size={12} /></span>
                        <span className="rating-val">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                    <p className="kindle-author">{item.author}</p>
                    <div className="pop-downloads-row">
                      <span className="pop-downloads-metric"><IconBolt size={12} stroke={2} /> {item.downloads}</span>
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
                        <span className="star-icon"><IconStarFilled size={12} /></span>
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
                          <span className="star-icon"><IconStarFilled size={12} /></span>
                          <span className="rating-val">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="kindle-title" title={item.title}>{item.title}</h3>
                      <p className="kindle-author">{item.author}</p>
                      <div className="dept-curriculum-tag">
                        <IconTarget size={12} stroke={2} />
                        <span>Form 3 &amp; 4 STEM Track</span>
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
                  <HeaderActions />
                </div>
              </header>

            <div className={`discovery-bottom ${isCreatePostOpen ? 'has-create-post-modal' : ''}`}>
              <section className="discovery-content">
                {/* Books Section */}
                <div className="section-heading">
                  <div>
                    <h2>Books</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {displayLibraryItems.filter(item => item.type === 'book').map((item) => (
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
                  {displayLibraryItems.filter(item => item.type === 'paper').map((item) => (
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
                  {displayLibraryItems.filter(item => item.type === 'video').map((item) => (
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
          <div className={`discover-feed-wrapper ${isCreatePostOpen ? 'is-modal-open' : ''}`}>
            <header className="discover-header">
              <div className="discover-header-top">
                <div className="discover-header-left">
                  <h1 className="discover-title">Discover</h1>
                </div>
                <div className="discover-header-center">
                  <form className="discover-search-bar" onSubmit={(event) => event.preventDefault()}>
                    <input type="search" value={discoverSearch} onChange={(event) => setDiscoverSearch(event.target.value)} placeholder="Search Learn Hub..." className="discover-search-input" />
                    <button type="submit" className="discover-search-btn" aria-label="Search Learn Hub">
                      <IconSearch size={16} stroke={2} />
                    </button>
                  </form>
                </div>
                <div className="discover-header-right">
                  <HeaderActions user={currentUser} />
                </div>
              </div>

              <div className="discover-header-bottom">
                <nav className="discover-nav" aria-label="Primary navigation">
                  <a href="#all" className={`discover-nav-item ${discoverFeedFilter === 'all' ? 'active' : ''}`} aria-label="Home" onClick={(event) => { event.preventDefault(); setDiscoverFeedFilter('all'); }}>
                    <IconHome size={18} stroke={2} />
                  </a>
                  <a href="#videos" className={`discover-nav-item ${discoverFeedFilter === 'videos' ? 'active' : ''}`} aria-label="Videos" onClick={(event) => { event.preventDefault(); setDiscoverFeedFilter('videos'); }}>
                    <IconVideo size={18} stroke={2} />
                  </a>
                  <a href="#followed" className={`discover-nav-item ${discoverFeedFilter === 'followed' ? 'active' : ''}`} aria-label="Followed accounts" onClick={(event) => { event.preventDefault(); setDiscoverFeedFilter('followed'); }}>
                    <IconUserCheck size={18} stroke={2} />
                  </a>
                </nav>
              </div>
            </header>

            <div className="discover-background discover-background-top" aria-hidden="true" />
            <div className="discover-background discover-background-bottom" aria-hidden="true" />

            <div className="discovery-bottom">
              <div className="discover-layout">
                {/* Main Feed */}
                <main className="discover-main-feed">
                  {/* Post Creation Section */}
                  <div className="create-post-section">
                    <div className="create-post-header">
                      <div className="user-avatar">SKP</div>
                      <button type="button" className="create-post-trigger" onClick={openCreatePost}>What's on your mind, {currentUser.name.split(' ')[0]}?</button>
                    </div>
                    <div className="create-post-actions">
                      <button type="button" className="create-post-action" aria-label="Add photo" onClick={openCreatePost}>
                        <span><IconPhoto size={18} stroke={2} /></span>
                        <span>Photo</span>
                      </button>
                      <button className="primary-button create-post-submit" type="button" onClick={openCreatePost}>Create post</button>
                    </div>
                  </div>

                  {feedError && <div className="feed-error" role="alert"><span>{feedError}</span><button type="button" aria-label="Dismiss error" onClick={() => setFeedError('')}>×</button></div>}
                  {feedLoading && <div className="feed-loading" role="status">Saving your change…</div>}

                  {isCreatePostOpen && createPortal(<div className="discover-post-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreatePost(); }}>
                    <form ref={createPostDialogRef} role="dialog" aria-modal="true" aria-labelledby="create-post-title" className="discover-post-modal" onSubmit={createFeedPost}>
                      <div className="discover-post-modal-header">
                        <h2 id="create-post-title">Create post</h2>
                        <button type="button" className="modal-close" aria-label="Close create post" onClick={closeCreatePost}>×</button>
                      </div>
                      <div className="discover-post-author">
                        <div className="user-avatar">{currentUser.initials}</div>
                        <div><strong>{currentUser.name}</strong><span>{currentUser.role}</span><span>{currentUser.school}</span></div>
                      </div>

                      {!isDiscoverPreviewOpen ? <>
                        <label className="discover-post-field">
                          <span>Post type</span>
                          <select value={discoverPostType} onChange={(event) => { const nextType = event.target.value; setDiscoverPostType(nextType); setDiscoverValidationErrors([]); if (nextType !== 'image') setDiscoverImageCaption(''); if (nextType === 'question') { setDiscoverImage(''); setDiscoverImageName(''); setDiscoverImageMeta({ type: '', size: 0, width: 0, height: 0 }); setDiscoverImageAlt(''); } }}>
                            <option value="question">Question</option>
                            <option value="image">Image post</option>
                          </select>
                        </label>
                        <label className="discover-post-field">
                          <span>What would you like to share?</span>
                          <textarea value={discoverDraft} onChange={(event) => setDiscoverDraft(event.target.value)} placeholder={discoverPostType === 'question' ? 'How does photosynthesis produce glucose?' : 'Share a thought, study tip, or useful update...'} autoFocus />
                        </label>
                        <div className="discover-post-fields-grid">
                          <label className="discover-post-field"><span>Subject</span><select value={discoverSubject} onChange={(event) => setDiscoverSubject(event.target.value)}><option value="">Select subject</option><option>Biology</option><option>Chemistry</option><option>Mathematics</option><option>Physics</option><option>English</option></select></label>
                          <label className="discover-post-field"><span>Department</span><select value={discoverDepartment} onChange={(event) => setDiscoverDepartment(event.target.value)}><option value="">Select department</option><option>Science</option><option>Humanities</option><option>Languages</option><option>Business</option></select></label>
                          <label className="discover-post-field"><span>Class / Form</span><select value={discoverClass} onChange={(event) => setDiscoverClass(event.target.value)}><option value="">Select class</option><option>Form 1</option><option>Form 2</option><option>Form 3</option><option>Form 4</option></select></label>
                          <label className="discover-post-field"><span>Topic</span><input type="text" value={discoverTopic} onChange={(event) => setDiscoverTopic(event.target.value)} placeholder="e.g. Photosynthesis" /></label>
                        </div>
                        <label className="discover-post-field"><span>Related resource</span><select value={discoverRelatedResource} onChange={(event) => setDiscoverRelatedResource(event.target.value)}><option value="">None</option>{libraryItems.slice(0, 5).map((resource) => <option key={resource.id} value={resource.title}>{resource.title}</option>)}</select></label>
                        {discoverPostType === 'image' && <>
                          <div className={`discover-image-dropzone ${isPostImageDragging ? 'is-dragging' : ''} ${discoverImage ? 'has-preview' : ''}`} onDragOver={(event) => { event.preventDefault(); setIsPostImageDragging(true); }} onDragLeave={() => setIsPostImageDragging(false)} onDrop={(event) => { event.preventDefault(); handleDiscoverImage(event.dataTransfer.files[0]); }}>
                            {discoverImage ? <img className="discover-image-preview" src={discoverImage} alt={discoverImageAlt || 'Post preview'} /> : <div className="discover-image-drop-copy"><IconPhoto size={26} /><strong>Add image</strong><span>Drag an image here or click to choose · JPG, PNG, WEBP, GIF · max 5 MB</span></div>}
                            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Choose an image for your post" onChange={handleDiscoverImage} />
                          </div>
                          {discoverImage && <div className="discover-post-fields-grid"><label className="discover-post-field"><span>Image description</span><input type="text" value={discoverImageAlt} onChange={(event) => setDiscoverImageAlt(event.target.value)} placeholder="Describe the image for accessibility" /></label>{discoverPostType === 'image' && <label className="discover-post-field"><span>Image caption</span><input type="text" value={discoverImageCaption} onChange={(event) => setDiscoverImageCaption(event.target.value)} placeholder="Add a caption (optional)" /></label>}</div>}
                        </>}
                        {discoverValidationErrors.length > 0 && <div className="discover-post-errors" role="alert" aria-live="assertive"><strong>Check your post</strong>{discoverValidationErrors.map((error) => <span key={error}>{error}</span>)}</div>}
                        <div className="discover-post-modal-footer"><button type="button" className="text-button" onClick={saveDiscoverDraft}>Save draft</button><span>{discoverImageName || 'Images are optional'}</span><div className="discover-post-footer-actions"><button type="button" className="outline-button" onClick={closeCreatePost}>Cancel</button><button type="button" className="outline-button" onClick={() => { if (!validateDiscoverPost().length) setIsDiscoverPreviewOpen(true); }}>Preview</button><button type="submit" className="primary-button" disabled={feedLoading}>Post</button></div></div>
                      </> : <>
                        <div className="discover-post-preview-card"><span className="eyebrow">Post preview</span><div className="discover-post-preview-meta"><div className="user-avatar">{currentUser.initials}</div><div><strong>{currentUser.name}</strong><span>{discoverPostType === 'question' ? 'Question' : 'Image post'}</span></div></div><span className="feed-subject-tag">{discoverSubject || 'General'}</span><p>{discoverDraft}</p>{discoverImage && <img src={discoverImage} alt={discoverImageAlt || 'Post preview'} />}{discoverImageCaption && <small>{discoverImageCaption}</small>}</div>
                        <div className="discover-post-modal-footer"><button type="button" className="outline-button" onClick={() => setIsDiscoverPreviewOpen(false)}>Edit post</button><div className="discover-post-footer-actions"><button type="button" className="outline-button" onClick={closeCreatePost}>Cancel</button><button type="submit" className="primary-button" disabled={feedLoading}>Post</button></div></div>
                      </>}
                    </form>
                  </div>, document.body)}

                  {/* Feed Posts */}
                  <div className="feed-container">
                    {visibleFeedPosts.map((post) => {
                      const interaction = feedInteractions[post.id] || {};
                      const likeCount = post.likes + (interaction.liked ? 1 : 0);
                      const comments = postComments[post.id] || [];
                      const visibleComments = comments.slice(0, (commentPages[post.id] || 1) * 5);
                      const commentCount = post.comments + comments.length;
                      const shareCount = post.shares + (interaction.reposted ? 1 : 0);
                      return (
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
                          <div className="feed-post-menu-wrap">
                            <button type="button" className="feed-post-menu" aria-label="Post options" aria-expanded={postMenuOpen === post.id} onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}>•••</button>
                            {postMenuOpen === post.id && <div className="feed-post-menu-popover">
                              {post.author === currentUser.name && <button type="button" onClick={() => startPostEdit(post)}>Edit post</button>}
                              {post.author === currentUser.name && <button type="button" onClick={() => deletePost(post)}>Delete post</button>}
                              <button type="button" onClick={() => hidePost(post.id)}>Hide post</button>
                              {!reportedPostIds.includes(post.id) && <button type="button" onClick={() => reportPost(post)}>Report post</button>}
                              {reportedPostIds.includes(post.id) && <span className="feed-post-menu-note">Reported</span>}
                            </div>}
                          </div>
                        </div>

                        {editingPostId === post.id ? <form className="feed-post-edit-form" onSubmit={(event) => savePostEdit(post.id, event)}><textarea value={editingPostDraft} onChange={(event) => setEditingPostDraft(event.target.value)} aria-label="Edit post" autoFocus /><div><button type="button" className="outline-button" onClick={() => setEditingPostId(null)}>Cancel</button><button type="submit" className="primary-button" disabled={feedLoading}>Save</button></div></form> : <div className="feed-post-content">
                          {post.type === 'question' ? (
                            <>
                              <div className="feed-subject-tag">{post.subject}</div>
                              <p className="feed-question-text">{highlightSearchText(post.content)}</p>
                            </>
                          ) : post.type === 'book' ? (
                            <>
                              <div className="feed-subject-tag">{post.subject}</div>
                              <h3 className="feed-resource-title">{highlightSearchText(post.title)}</h3>
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
                              <h3 className="feed-resource-title">{highlightSearchText(post.title)}</h3>
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
                              <h3 className="feed-resource-title">{highlightSearchText(post.title)}</h3>
                              <p className="feed-resource-description">{post.description}</p>
                              <div className="feed-resource-meta">
                                <span className="feed-video-duration">{post.duration}</span>
                              </div>
                              <div className="feed-resource-image">
                                <img src={post.image} alt={post.title} />
                                <div className="feed-video-play-overlay">
                                  <div className="feed-play-button" aria-label="Play video">
                                    <IconPlayerPlay size={24} stroke={2.5} />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="feed-question-text">{highlightSearchText(post.content)}</p>
                              {post.image && <div className="feed-resource-image"><img src={post.image} alt="Attached to post" /></div>}
                            </>
                          )}
                        </div>}

                        <div className="feed-post-stats">
                          <span className="feed-likes-count">{likeCount} likes</span>
                          <button type="button" className="feed-comments-count feed-stat-button" onClick={() => interactWithPost(post.id, 'comment')} aria-label={`View ${commentCount} comments`}>{commentCount} comments</button>
                          <span className="feed-shares-count">{shareCount} shares</span>
                        </div>

                        <div className="feed-post-actions">
                          <button type="button" className={`feed-action-btn feed-like-btn ${interaction.liked ? 'is-active' : ''}`} aria-label="Like post" aria-pressed={Boolean(interaction.liked)} onClick={() => interactWithPost(post.id, 'like')}>
                            <span><IconThumbUp size={16} stroke={2} /></span>
                            <span>Like</span>
                          </button>
                          <button type="button" className="feed-action-btn feed-comment-btn" aria-label="Comment on post" onClick={() => interactWithPost(post.id, 'comment')}>
                            <span><IconMessageCircle size={16} stroke={2} /></span>
                            <span>Comment</span>
                          </button>
                          <button type="button" className={`feed-action-btn feed-share-btn ${interaction.reposted ? 'is-active' : ''}`} aria-label="Repost post" aria-pressed={Boolean(interaction.reposted)} onClick={() => interactWithPost(post.id, 'repost')}>
                            <span><IconRepeat size={16} stroke={2} /></span>
                            <span>{interaction.reposted ? 'Reposted' : 'Repost'}</span>
                          </button>
                        </div>

                        {openCommentPosts[post.id] && <section className="feed-comments" aria-label={`Comments on ${post.author}'s post`}>
                          <form className="feed-comment-composer" onSubmit={(event) => addComment(post.id, event)}>
                            <div className="feed-comment-avatar">{currentUser.initials}</div>
                            <input type="text" value={commentDrafts[post.id] || ''} onChange={(event) => setCommentDrafts((currentDrafts) => ({ ...currentDrafts, [post.id]: event.target.value }))} placeholder="Write a comment..." aria-label="Write a comment" />
                            <button type="submit" className="feed-comment-submit" disabled={feedLoading}>Post</button>
                          </form>
                          {comments.length === 0 ? <p className="feed-comments-empty">Be the first to comment.</p> : <div className="feed-comment-list">
                            {visibleComments.map((comment) => <div className="feed-comment" key={comment.id}>
                              <div className="feed-comment-avatar">{comment.authorAvatar}</div>
                              <div className="feed-comment-content">
                                {editingComment?.postId === post.id && editingComment.commentId === comment.id ? <form className="feed-inline-edit" onSubmit={(event) => { event.preventDefault(); editComment(post.id, comment.id, editingComment.content); }}><input type="text" value={editingComment.content} onChange={(event) => setEditingComment({ ...editingComment, content: event.target.value })} autoFocus /><button type="submit">Save</button><button type="button" onClick={() => setEditingComment(null)}>Cancel</button></form> : <div className="feed-comment-bubble"><strong>{comment.author}</strong><p>{comment.content}{comment.edited && <em> · edited</em>}</p></div>}
                                <div className="feed-comment-actions"><button type="button" className={comment.liked ? 'is-active' : ''} onClick={() => toggleCommentLike(post.id, comment.id)}>{comment.liked ? 'Liked' : 'Like'}{comment.likes > 0 ? ` · ${comment.likes}` : ''}</button><button type="button" onClick={() => openReplyBox(post.id, comment.id)}>Reply</button>{comment.authorId === currentUser.id && <><button type="button" onClick={() => setEditingComment({ postId: post.id, commentId: comment.id, content: comment.content })}>Edit</button><button type="button" onClick={() => deleteComment(post.id, comment.id)}>Delete</button></>}</div>
                                {(comment.replies || []).map((reply) => <div className="feed-reply" key={reply.id}><div className="feed-comment-avatar">{reply.authorAvatar}</div><div><div className="feed-comment-bubble"><strong>{reply.author}</strong><p>{reply.content}{reply.edited && <em> · edited</em>}</p></div><div className="feed-comment-actions"><button type="button" className={reply.liked ? 'is-active' : ''} onClick={() => toggleReplyLike(post.id, comment.id, reply.id)}>{reply.liked ? 'Liked' : 'Like'}{reply.likes > 0 ? ` · ${reply.likes}` : ''}</button>{reply.authorId === currentUser.id && <button type="button" onClick={() => deleteReply(post.id, comment.id, reply.id)}>Delete</button>}</div></div></div>)}
                                {activeReply?.postId === post.id && activeReply.commentId === comment.id && <form className="feed-reply-composer" onSubmit={(event) => addReply(post.id, comment.id, event)}><input type="text" value={replyDrafts[`${post.id}:${comment.id}`] || ''} onChange={(event) => setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [`${post.id}:${comment.id}`]: event.target.value }))} placeholder="Write a reply..." aria-label="Write a reply" /><button type="submit" disabled={feedLoading}>Reply</button></form>}
                              </div>
                            </div>)}
                            {visibleComments.length < comments.length && <button type="button" className="feed-load-more" onClick={() => setCommentPages((currentPages) => ({ ...currentPages, [post.id]: (currentPages[post.id] || 1) + 1 }))}>Load more comments</button>}
                          </div>}
                        </section>}
                      </article>
                      );
                    })}
                  </div>
                  {visibleFeedPosts.length < filteredFeedPosts.length && <div ref={feedLoadMoreRef} className="feed-infinite-loading" role="status">Loading more posts…</div>}
                </main>

                {/* Right Sidebar */}
                <aside className="discover-right-sidebar">
                  {feedNotifications.length > 0 && <div className="sidebar-section discover-notifications-section">
                    <div className="sidebar-section-heading"><h3 className="sidebar-section-title">Activity</h3><button type="button" className="text-button" onClick={() => setFeedNotifications([])}>Clear</button></div>
                    <div className="discover-notifications-list">{feedNotifications.slice(0, 4).map((notification) => <div className="discover-notification" key={notification.id}><span className="notification-item-dot" /><span><strong>{notification.title}</strong><small>{notification.detail}</small></span></div>)}</div>
                  </div>}
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

                  <div className="sidebar-section">
                    <div className="sidebar-section-heading"><h3 className="sidebar-section-title">Recommended for Form 3</h3><span className="recommendation-label">For you</span></div>
                    <div className="discover-recommendations">{recommendedDiscoverResources.map((resource) => <button type="button" className="discover-recommendation" key={resource.id} onClick={() => openResource(resource)}><img src={resource.image} alt="" /><span><strong>{resource.title}</strong><small>{resource.meta}</small></span></button>)}</div>
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
        ) : currentPage === 'publisher-studio' ? (
          <PublisherStudioPage onNavigate={navigateTo} onAction={showAction} onSubmitResource={savePostedResource} />
        ) : currentPage === 'resource-list' && resourceCollection ? (
          <ResourceListPage title={resourceCollection.title} items={resourceCollection.items} onNavigate={navigateTo} onOpenResource={openResource} />
        ) : currentPage === 'resource' && selectedResource ? (
          <ResourceDetailPage resource={selectedResource} returnPage={resourceReturnPage} onNavigate={navigateTo} onAction={showAction} onOpenReader={() => openReader(selectedResource)} onOpenResource={openResource} onOpenPublisher={() => openPublisher(selectedResource)} isInLibrary={libraryResourceKeys.has(resourceKey(selectedResource))} isDownloaded={downloadedResourceKeys.has(resourceKey(selectedResource))} onToggleLibrary={() => toggleLibrary(selectedResource)} onDownload={() => downloadResource(selectedResource)} />
        ) : currentPage === 'publisher' && selectedResource ? (
          <PublisherPage resource={selectedResource} onNavigate={navigateTo} onOpenResource={openResource} />
        ) : currentPage === 'reader' && selectedResource ? (
          <ResourceReaderPage resource={selectedResource} returnPage={resourceReturnPage} onNavigate={navigateTo} onAction={showAction} />
        ) : currentPage === 'profile' ? (
          <ProfilePage onOpenSettings={() => setCurrentPage('settings')} />
        ) : currentPage === 'settings' ? (
          <SettingsPage onNavigate={navigateTo} onAction={showAction} />
        ) : null}
      </main>
      {(pendingFeedAction || reportDialogPost) && createPortal(<div className="feed-confirmation-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeFeedDialogs(); }}>
        {reportDialogPost ? <form ref={feedDialogRef} role="dialog" aria-modal="true" aria-labelledby="report-post-title" className="feed-confirmation-dialog" onSubmit={submitPostReport}>
          <div className="feed-confirmation-heading"><div><span className="eyebrow">Safety review</span><h2 id="report-post-title">Report post</h2></div><button type="button" className="modal-close" aria-label="Close report dialog" onClick={closeFeedDialogs}>×</button></div>
          <p>Tell us why you are reporting this post. The report will be recorded as pending for moderation review.</p>
          <label className="discover-post-field"><span>Report category</span><select value={reportCategory} onChange={(event) => setReportCategory(event.target.value)}><option value="spam">Spam or misleading content</option><option value="harassment">Harassment or bullying</option><option value="inappropriate">Inappropriate content</option><option value="copyright">Copyright concern</option><option value="other">Something else</option></select></label>
          <div className="feed-confirmation-actions"><button type="button" className="outline-button" onClick={() => setReportDialogPost(null)}>Cancel</button><button type="submit" className="primary-button">Submit report</button></div>
        </form> : <div ref={feedDialogRef} role="dialog" aria-modal="true" aria-labelledby="feed-confirmation-title" className="feed-confirmation-dialog"><div className="feed-confirmation-heading"><div><span className="eyebrow">Confirm action</span><h2 id="feed-confirmation-title">{pendingFeedAction?.type === 'delete' ? 'Delete post?' : pendingFeedAction?.type === 'delete-comment' ? 'Delete comment?' : pendingFeedAction?.type === 'delete-reply' ? 'Delete reply?' : 'Hide post?'}</h2></div><button type="button" className="modal-close" aria-label="Close confirmation" onClick={closeFeedDialogs}>×</button></div><p>{pendingFeedAction?.type === 'delete' ? 'This post will be permanently removed from your Discover feed.' : pendingFeedAction?.type === 'delete-comment' ? 'This comment will be permanently removed from the discussion.' : pendingFeedAction?.type === 'delete-reply' ? 'This reply will be permanently removed from the discussion.' : 'This post will be removed from your feed.'}</p><div className="feed-confirmation-actions"><button type="button" className="outline-button" onClick={closeFeedDialogs}>Cancel</button><button type="button" className="primary-button" onClick={() => { if (pendingFeedAction?.type === 'delete') confirmDeletePost(pendingFeedAction.post); else if (pendingFeedAction?.type === 'delete-comment') confirmDeleteComment(pendingFeedAction.postId, pendingFeedAction.commentId); else if (pendingFeedAction?.type === 'delete-reply') confirmDeleteReply(pendingFeedAction.postId, pendingFeedAction.commentId, pendingFeedAction.replyId); else confirmHidePost(pendingFeedAction.postId); }}>{pendingFeedAction?.type.startsWith('delete') ? 'Delete' : 'Hide post'}</button></div></div>}
      </div>, document.body)}
      {actionMessage && <div className="app-action-feedback" role="status">{actionMessage}</div>}
    </div>
  );
}

export default App;
