import { useEffect, useRef, useState } from 'react';
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

function SettingToggle({ label, description, defaultChecked = true }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <label className="setting-toggle-row"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} /><span className="toggle-control" aria-hidden="true"><span /></span></label>;
}

function HeaderActions() {
  const headerActionsRef = useRef(null);
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
        <span className="user-avatar">SKP</span>
        <span className="user-name">SAMUEL KP</span>
      </button>
      {profileOpen && <div className="header-popover profile-popover"><div className="popover-identity"><span className="user-avatar">SKP</span><span><strong>SAMUEL KP</strong><small>Student · Form 3</small></span></div><div className="popover-links"><a href="#profile">View profile</a><a href="#library">My library</a><a href="#settings">Settings</a></div><button type="button" className="popover-signout"><IconLogout size={15} /> Log out</button></div>}
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

function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const selected = settingsSections.find(([id]) => id === activeSection);
  const SectionIcon = selected[3];
  return <div className="product-page settings-page">
    <header className="library-header settings-page-header">
      <div className="library-header-content">
        <div className="page-heading">
          <h1>Settings</h1>
        </div>
        <HeaderActions />
      </div>
    </header>
    <div className="settings-background settings-background-top" aria-hidden="true" />
    <div className="settings-background settings-background-bottom" aria-hidden="true" />
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Settings sections"><span className="settings-nav-label">Manage Learn Hub</span>{settingsSections.map(([id, label, description, ItemIcon]) => <button key={id} type="button" className={`settings-nav-item ${activeSection === id ? 'active' : ''}`} onClick={() => setActiveSection(id)}><ItemIcon size={17} stroke={1.8} /><span><b>{label}</b><small>{description}</small></span><IconChevronRight size={15} /></button>)}<button type="button" className="settings-logout"><IconLogout size={17} /> Log out</button></nav>
      <section className="settings-detail" aria-labelledby="settings-detail-title"><div className="settings-detail-heading"><div className="settings-detail-icon"><SectionIcon size={20} /></div><div><span className="eyebrow">Settings</span><h2 id="settings-detail-title">{selected[1]}</h2><p>{selected[2]}</p></div></div>
        {activeSection === 'account' && <><div className="settings-card account-summary-card"><div className="profile-avatar large">SKP</div><div className="account-summary-copy"><span className="status-pill"><span /> Active account</span><h3>SAMUEL KP</h3><p>Student · Blantyre Secondary School · Form 3</p><small>Member since 16 September 2024</small></div><button type="button" className="outline-button"><IconEdit size={15} /> Edit profile</button></div><div className="settings-card"><div className="card-title-row"><div><h3>Account information</h3><p>Your identity and school details.</p></div><IconLock size={17} /></div><div className="account-fields"><div><span>Full name</span><strong>SAMUEL KP</strong></div><div><span>Account type</span><strong>Student</strong></div><div><span>Email address</span><strong>samuel.kp@example.com</strong></div><div><span>Phone number</span><strong>+265 888 204 118</strong></div><div><span>School</span><strong>Blantyre Secondary School</strong></div><div><span>Class / Form</span><strong>Form 3</strong></div></div></div><div className="settings-card schedule-note"><IconAdjustments size={18} /><div><strong>Profile editing schedule</strong><p>Your profile was last updated on 16 September 2026. You can edit it again on 16 March 2027. Sensitive membership changes require approval.</p></div></div><div className="settings-card"><div className="card-title-row"><div><h3>Password</h3><p>Keep your account access secure.</p></div><button type="button" className="text-button">Change password <IconChevronRight size={15} /></button></div></div></>}
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

function ProfilePage({ onOpenSettings }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileName, setProfileName] = useState('SAMUEL KP');
  const [draftName, setDraftName] = useState('SAMUEL KP');
  const [profileImage, setProfileImage] = useState(null);
  const [draftImage, setDraftImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const tabs = ['overview', 'questions', 'answers', 'library', 'activity'];
  const initials = profileName.split(' ').map((part) => part[0]).join('').slice(0, 3);

  const openEditor = () => {
    setDraftName(profileName);
    setDraftImage(profileImage);
    setIsEditing(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setDraftImage(URL.createObjectURL(file));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    if (draftName.trim()) setProfileName(draftName.trim());
    setProfileImage(draftImage);
    setIsEditing(false);
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
        <HeaderActions />
      </div>
    </header>
    <div className="profile-background profile-background-top" aria-hidden="true" />
    <div className="profile-background profile-background-bottom" aria-hidden="true" />
    <header className="profile-hero">
      <div className="profile-hero-main">{renderAvatar('profile-avatar profile-avatar-hero')}<div><h1>{profileName}</h1><p className="profile-role">Student <span>·</span> Form 3</p><p className="profile-school"><IconSchool size={15} /> Blantyre Secondary School <span>·</span> Sciences &amp; Technology</p><p className="profile-bio">Curious learner building a stronger foundation in science, mathematics, and the ideas that connect them.</p><span className="visibility-indicator"><IconEye size={14} /> Visible to my school</span></div></div>
      <div className="profile-actions"><button type="button" className="outline-button" onClick={onOpenSettings}><IconAdjustments size={15} /> Settings</button><button type="button" className="primary-button" onClick={openEditor}><IconEdit size={15} /> Edit profile</button></div>
    </header>
    <nav className="profile-tabs" aria-label="Profile sections">{tabs.map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}</nav>
    <div className="profile-content">
      {activeTab === 'overview' && <><div className="profile-stats"><div><strong>18</strong><span>Questions asked</span></div><div><strong>42</strong><span>Answers received</span></div><div><strong>7</strong><span>Resources completed</span></div><div><strong>3</strong><span>Saved collections</span></div></div><div className="profile-grid"><section className="profile-panel"><div className="panel-heading"><div><span className="eyebrow">Learning focus</span><h2>My departments</h2></div><IconBook2 size={18} /></div><div className="profile-chip-row"><span className="profile-chip primary">Science <b>Primary</b></span><span className="profile-chip">Humanities</span></div><div className="panel-heading panel-heading-spaced"><div><span className="eyebrow">Subjects</span><h2>Preferred subjects</h2></div></div><div className="subject-list"><span>Biology</span><span>Chemistry</span><span>Mathematics</span></div></section><section className="profile-panel progress-panel"><div className="panel-heading"><div><span className="eyebrow">This term</span><h2>Learning progress</h2></div><IconAward size={18} /></div><div className="goal-ring"><strong>68%</strong><span>of your reading goal</span></div><div className="progress-track"><span style={{ width: '68%' }} /></div><p>12 of 18 planned resources completed this term.</p><button type="button" className="text-button">View activity <IconChevronRight size={15} /></button></section></div></>}
      {activeTab === 'questions' && <section className="profile-panel profile-list-panel"><div className="panel-heading"><div><span className="eyebrow">Public activity</span><h2>Questions asked</h2></div><span className="count-label">18 total</span></div><article className="question-row"><div><span className="profile-chip">Biology</span><h3>How does photosynthesis produce glucose?</h3><p>4 answers · 8 likes</p></div><span className="question-status answered">Answered</span></article><article className="question-row"><div><span className="profile-chip">Biology</span><h3>What is the difference between mitosis and meiosis?</h3><p>2 answers · 5 likes</p></div><span className="question-status open">Open</span></article></section>}
      {activeTab === 'answers' && <section className="profile-panel empty-profile-panel"><IconMessageCircle2 size={26} /><h2>Answers from {profileName}</h2><p>Public answers will appear here as you help other learners.</p></section>}
      {activeTab === 'library' && <section className="profile-panel profile-list-panel"><div className="panel-heading"><div><span className="eyebrow">Shared learning</span><h2>Saved collections</h2></div></div><div className="collection-list"><div><span className="collection-icon"><IconBook size={18} /></span><span><strong>Chemistry Study Pack</strong><small>12 resources · Updated 15 Sep 2026</small></span><IconChevronRight size={16} /></div><div><span className="collection-icon coral"><IconBook size={18} /></span><span><strong>Mathematics Past Papers</strong><small>15 resources · Updated 5 Sep 2026</small></span><IconChevronRight size={16} /></div></div></section>}
      {activeTab === 'activity' && <section className="profile-panel empty-profile-panel"><IconEye size={26} /><h2>Activity is private</h2><p>Recent reading, notes, and highlights are only visible to you.</p><button type="button" className="outline-button" onClick={onOpenSettings}>Review privacy settings</button></section>}
    </div>
    {isEditing && <div className="profile-modal-backdrop" role="presentation"><form className="profile-editor" onSubmit={saveProfile}><div className="profile-editor-heading"><div><span className="eyebrow">Profile details</span><h2>Edit profile</h2></div><button type="button" className="modal-close" aria-label="Close profile editor" onClick={() => setIsEditing(false)}>×</button></div><div className="profile-editor-avatar">{draftImage ? <img className="profile-image" src={draftImage} alt="Profile preview" /> : <div className="profile-avatar profile-avatar-hero">{initials}</div>}<label className="upload-button"><IconPhoto size={15} /> Change picture<input type="file" accept="image/*" onChange={handleImageChange} /></label></div><label className="profile-field">Full name<input type="text" value={draftName} onChange={(event) => setDraftName(event.target.value)} required /></label><p className="profile-editor-note">Your profile picture and name are visible according to your privacy settings.</p><div className="profile-editor-actions"><button type="button" className="outline-button" onClick={() => setIsEditing(false)}>Cancel</button><button type="submit" className="primary-button">Save changes</button></div></form></div>}
  </div>;
}

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
          <a href="#profile" className={`sidebar-link ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
            <IconUser size={17} stroke={2} />
            <span>Profile</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#publisher-studio" className="sidebar-link">
            <IconSparkles size={17} stroke={2} />
            <span>Publisher Studio</span>
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
                  <HeaderActions />
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
                      <input 
                        type="text" 
                        placeholder="What's on your mind, Samuel?"
                        className="create-post-input"
                      />
                    </div>
                    <div className="create-post-actions">
                      <button className="create-post-action" type="button" aria-label="Add photo">
                        <span><IconPhoto size={18} stroke={2} /></span>
                        <span>Photo</span>
                      </button>
                      <button className="create-post-action" type="button" aria-label="Add document">
                        <span><IconFileText size={18} stroke={2} /></span>
                        <span>Document</span>
                      </button>
                      <button className="create-post-action" type="button" aria-label="Add video">
                        <span><IconVideo size={18} stroke={2} /></span>
                        <span>Video</span>
                      </button>
                      <button className="create-post-action" type="button" aria-label="Ask a question">
                        <span><IconHelpCircle size={18} stroke={2} /></span>
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
                                  <div className="feed-play-button" aria-label="Play video">
                                    <IconPlayerPlay size={24} stroke={2.5} />
                                  </div>
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
                          <button type="button" className="feed-action-btn feed-like-btn" aria-label="Like post">
                            <span><IconThumbUp size={16} stroke={2} /></span>
                            <span>Like</span>
                          </button>
                          <button type="button" className="feed-action-btn feed-comment-btn" aria-label="Comment on post">
                            <span><IconMessageCircle size={16} stroke={2} /></span>
                            <span>Comment</span>
                          </button>
                          <button type="button" className="feed-action-btn feed-share-btn" aria-label="Repost post">
                            <span><IconRepeat size={16} stroke={2} /></span>
                            <span>Repost</span>
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
        ) : currentPage === 'profile' ? (
          <ProfilePage onOpenSettings={() => setCurrentPage('settings')} />
        ) : currentPage === 'settings' ? (
          <SettingsPage />
        ) : null}
      </main>
    </div>
  );
}

export default App;
