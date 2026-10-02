import { useEffect, useMemo, useState } from 'react';
import {
  IconAdjustments,
  IconAward,
  IconBook2,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconCloudDownload,
  IconDownload,
  IconEye,
  IconFileCheck,
  IconFileText,
  IconFilter,
  IconFlask,
  IconFolderCheck,
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconShare,
  IconShieldCheck,
  IconSparkles,
  IconTarget,
  IconTrash,
  IconTrendingUp,
  IconUsers,
  IconX,
} from '@tabler/icons-react';

const initialResources = [
  {
    id: 'bio-2022',
    title: 'MSCE Biology Paper 1 & 2 Marking Scheme',
    subject: 'Biology',
    form: 'Form 4',
    type: 'Marking Scheme',
    year: 2022,
    size: 1.4,
    tags: 'photosynthesis thylakoid photolysis maneb genetics',
    author: 'Malawi National Examinations Board',
    verified: true,
    rating: 4.9,
    reads: '1.2k',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    description: 'Official MANEB marking scheme covering cellular biology, plant physiology, and genetics with model scoring keys.',
  },
  {
    id: 'bio-notes',
    title: 'Comprehensive Form 4 Plant Physiology Notes',
    subject: 'Biology',
    form: 'Form 4',
    type: 'Class Notes',
    year: 2023,
    size: 0.85,
    tags: 'chloroplast photosynthesis transpiration osmosis stomata',
    author: 'Bwaila Secondary School',
    verified: true,
    rating: 4.8,
    reads: '980',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    description: 'Concise, illustrated lesson notes covering photosynthesis pathways, transpiration mechanisms, and plant transport.',
  },
  {
    id: 'math-2023',
    title: '2023 MSCE Mathematics Paper 2 Mock Examination',
    subject: 'Mathematics',
    form: 'Form 4',
    type: 'Past Paper',
    year: 2023,
    size: 2.2,
    tags: 'quadratic equations vectors probability calculus trigonometry',
    author: 'Central Region Education Division',
    verified: true,
    rating: 4.9,
    reads: '2.4k',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    description: 'Full mock paper with structured questions on algebraic geometry, statistics, vectors, and trigonometry.',
  },
  {
    id: 'science-lab',
    title: 'Practical Biology: Rate of Photosynthesis in Elodea',
    subject: 'Biology',
    form: 'Form 4',
    type: 'Practical Guide',
    year: 2023,
    size: 0.62,
    tags: 'elodea light intensity oxygen experiment laboratory practical',
    author: 'Lilongwe Girls Secondary School',
    verified: true,
    rating: 4.7,
    reads: '750',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    description: 'Step-by-step laboratory guide with apparatus checklists, error control tips, and graph interpretation questions.',
  },
  {
    id: 'english-2023',
    title: 'MSCE English Paper 1 Comprehension & Summary Practice',
    subject: 'English',
    form: 'Form 4',
    type: 'Past Paper',
    year: 2023,
    size: 1.1,
    tags: 'comprehension grammar writing summary maneb idioms',
    author: 'Ministry of Education',
    verified: true,
    rating: 4.6,
    reads: '1.8k',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    description: 'Past exam passages with model summary responses, contextual vocabulary exercises, and syntax breakdowns.',
  },
  {
    id: 'physics-guide',
    title: 'Physical Science Practical Laboratory Handbook',
    subject: 'Physical Science',
    form: 'Form 3',
    type: 'Practical Guide',
    year: 2022,
    size: 2.7,
    tags: 'forces electricity mechanics laboratory chemistry experiments',
    author: 'Kamuzu Academy',
    verified: true,
    rating: 4.9,
    reads: '1.5k',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    description: 'Essential experiments handbook detailing Ohm\'s Law, titrations, density measures, and pendulum mechanics.',
  },
  {
    id: 'math-formulas',
    title: 'Senior Secondary Mathematics Quick Formula Booklet',
    subject: 'Mathematics',
    form: 'Form 3',
    type: 'Class Notes',
    year: 2024,
    size: 0.45,
    tags: 'formulas algebra geometry coordinate mensuration statistics',
    author: 'Blantyre Secondary School',
    verified: true,
    rating: 5.0,
    reads: '3.1k',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=600&q=80',
    description: 'Pocket-sized quick reference sheet containing essential formulas for geometry, algebra, trigonometry, and calculus.',
  },
];

const initialMilestones = [
  { id: 'm1', title: 'Complete Biology photosynthesis & respiration revision', subject: 'Biology', progress: 85, completed: false, due: '14 Oct', estimatedHours: '3 hrs' },
  { id: 'm2', title: 'Attempt 2023 Mathematics Paper 2 under timed conditions', subject: 'Mathematics', progress: 45, completed: false, due: '18 Oct', estimatedHours: '2.5 hrs' },
  { id: 'm3', title: 'Review Physical Science laboratory apparatus & diagrams', subject: 'Physical Science', progress: 100, completed: true, due: 'Completed', estimatedHours: '1.5 hrs' },
  { id: 'm4', title: 'Memorize English grammar rules and summary writing conventions', subject: 'English', progress: 60, completed: false, due: '22 Oct', estimatedHours: '2 hrs' },
];

const initialReviewQueue = [
  {
    id: 'rev-1',
    title: 'Form 3 Inorganic Chemistry Equations & Salts Guide',
    subject: 'Physical Science',
    author: 'Mr. C. Phiri (Chichiri Secondary School)',
    type: 'Class Notes',
    fileName: 'inorganic_salts_f3.pdf',
    size: '1.2 MB',
    date: 'Today, 10:45 AM',
    status: 'Pending review',
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=600&q=80',
    comments: 'Awaiting MANEB syllabus cross-reference for section 4.2.',
  },
  {
    id: 'rev-2',
    title: '2024 Term 2 Northern Education Division Mathematics Mock',
    subject: 'Mathematics',
    author: 'NED Teachers Association',
    type: 'Past Paper',
    fileName: 'ned_mock_math_2024.pdf',
    size: '2.8 MB',
    date: 'Yesterday',
    status: 'Pending review',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80',
    comments: 'Reviewing solution key accuracy for question 14 vectors.',
  },
  {
    id: 'rev-3',
    title: 'Chichewa Literature: Ndakatulo Zosankhidwa Analysis',
    subject: 'Languages',
    author: 'Mrs. T. Banda (Marymount Catholic)',
    type: 'Class Notes',
    fileName: 'ndakatulo_analysis.pdf',
    size: '0.9 MB',
    date: '3 days ago',
    status: 'Verified',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    comments: 'Approved by Secondary Languages Curriculum Committee.',
  },
];

// Search indexing and ranking are implemented in backend/python/search_algorithms.py.
// The frontend keeps a small fallback for the static prototype data until it is
// connected to the Python search endpoint.
const rankResource = (resource, query) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return 1;
  const haystack = `${resource.title} ${resource.subject} ${resource.form} ${resource.type} ${resource.tags} ${resource.author}`.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? (resource.title.toLowerCase().includes(term) ? 4 : 1) : 0), 0);
};

export default function ScholasticHub({
  HeaderActions,
  onAction = () => {},
  onNavigate,
  onOpenResource,
  initialView = 'repository',
  showOverview = true,
}) {
  const [activeView, setActiveView] = useState(initialView);
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All subjects');
  const [formFilter, setFormFilter] = useState('All forms');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [sortBy, setSortBy] = useState('relevance');

  // Vault state
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('learnhub-scholastic-saved');
      return stored ? JSON.parse(stored) : ['bio-2022', 'bio-notes', 'science-lab'];
    } catch {
      return ['bio-2022', 'bio-notes', 'science-lab'];
    }
  });

  // Milestones / Progress state
  const [milestones, setMilestones] = useState(() => {
    try {
      const stored = localStorage.getItem('learnhub-scholastic-milestones');
      return stored ? JSON.parse(stored) : initialMilestones;
    } catch {
      return initialMilestones;
    }
  });

  // Review queue state
  const [reviewQueue, setReviewQueue] = useState(() => {
    try {
      const stored = localStorage.getItem('learnhub-scholastic-review-queue');
      return stored ? JSON.parse(stored) : initialReviewQueue;
    } catch {
      return initialReviewQueue;
    }
  });

  const [reviewFilter, setReviewFilter] = useState('all');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneSubject, setNewMilestoneSubject] = useState('Biology');
  const [nodeSyncing, setNodeSyncing] = useState(false);

  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  // Persist savedIds
  const toggleSaved = (id, resourceTitle) => {
    setSavedIds((current) => {
      const exists = current.includes(id);
      const next = exists ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('learnhub-scholastic-saved', JSON.stringify(next));
      if (exists) {
        onAction(`“${resourceTitle || 'Resource'}” removed from offline vault.`);
      } else {
        onAction(`“${resourceTitle || 'Resource'}” downloaded to offline vault for offline study.`);
      }
      return next;
    });
  };

  // Toggle milestone completion
  const toggleMilestone = (id) => {
    setMilestones((current) => {
      const next = current.map((m) => {
        if (m.id === id) {
          const completed = !m.completed;
          return { ...m, completed, progress: completed ? 100 : Math.min(50, m.progress) };
        }
        return m;
      });
      localStorage.setItem('learnhub-scholastic-milestones', JSON.stringify(next));
      return next;
    });
  };

  // Add custom milestone
  const addMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const newItem = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      subject: newMilestoneSubject,
      progress: 0,
      completed: false,
      due: 'Custom target',
      estimatedHours: '2 hrs',
    };
    const next = [newItem, ...milestones];
    setMilestones(next);
    localStorage.setItem('learnhub-scholastic-milestones', JSON.stringify(next));
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
    onAction('New study milestone added to your MSCE roadmap.');
  };

  // Moderation Review Actions
  const handleReviewStatus = (id, newStatus, title) => {
    setReviewQueue((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
      localStorage.setItem('learnhub-scholastic-review-queue', JSON.stringify(next));
      onAction(`“${title}” marked as ${newStatus.toLowerCase()}.`);
      return next;
    });
  };

  // Sync Node Simulation
  const syncNode = () => {
    setNodeSyncing(true);
    setTimeout(() => {
      setNodeSyncing(false);
      onAction('MANEB Central Repository Node synchronized. 148 verified items up to date.');
    }, 850);
  };

  // Open resource
  const handleOpenResource = (res) => {
    if (onOpenResource) {
      onOpenResource({
        id: res.id,
        title: res.title,
        resourceType: res.type === 'Past Paper' ? 'paper' : 'book',
        author: res.author,
        meta: `${res.subject} · ${res.form} · MANEB Aligned`,
        image: res.image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
        year: res.year,
        fileSize: `${res.size} MB`,
        rating: res.rating,
      });
    } else {
      onAction(`Opening “${res.title}” in reader.`);
    }
  };

  // Filtered resources
  const visibleResources = useMemo(() => {
    let list = initialResources
      .filter((item) => subjectFilter === 'All subjects' || item.subject === subjectFilter)
      .filter((item) => formFilter === 'All forms' || item.form === formFilter)
      .filter((item) => typeFilter === 'All types' || item.type === typeFilter)
      .map((item) => ({ ...item, score: rankResource(item, query) }))
      .filter((item) => !query || item.score > 0);

    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'year') {
      list.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'size') {
      list.sort((a, b) => a.size - b.size);
    } else {
      list.sort((a, b) => b.score - a.score);
    }
    return list;
  }, [query, subjectFilter, formFilter, typeFilter, sortBy]);

  // Vault calculations
  const vaultItems = useMemo(
    () => initialResources.filter((item) => savedIds.includes(item.id)),
    [savedIds]
  );
  const totalVaultSize = useMemo(
    () => vaultItems.reduce((acc, item) => acc + item.size, 0).toFixed(1),
    [vaultItems]
  );

  // Overall progress calculation
  const completedCount = milestones.filter((m) => m.completed).length;
  const overallProgressScore = Math.round(
    milestones.reduce((sum, m) => sum + m.progress, 0) / (milestones.length || 1)
  );

  const subjects = ['All subjects', 'Biology', 'Mathematics', 'English', 'Physical Science'];
  const viewRoutes = {
    repository: 'scholastic-repository',
    progress: 'scholastic-progress',
    vault: 'scholastic-vault',
    review: 'scholastic-review',
    docs: 'scholastic-docs',
  };
  const openView = (view) => {
    if (onNavigate && viewRoutes[view]) {
      onNavigate(viewRoutes[view]);
      return;
    }
    setActiveView(view);
  };

  return (
    <div className={`product-page scholastic-page${showOverview ? ' scholastic-page-overview' : ' scholastic-page-standalone'}`}>
      {/* 1. Header Matching Library Page */}
      <header className="library-header scholastic-page-header">
        <div className="library-header-content">
          <div className="page-heading">
            <h1>{showOverview ? 'Scholastic Hub' : {
              repository: 'Resource Repository',
              progress: 'Learning Progress',
              vault: 'Offline Vault',
              review: 'Review Queue',
              docs: 'System Guide',
            }[activeView]}</h1>
          </div>
          {HeaderActions && <HeaderActions onNavigate={onNavigate} onAction={onAction} />}
        </div>
      </header>

      {/* Hero Header Decorative Backgrounds */}
      <div className="scholastic-background scholastic-background-top" aria-hidden="true" />
      <div className="scholastic-background scholastic-background-bottom" aria-hidden="true" />

      <main className="scholastic-main-content">
        {showOverview && <>
        {/* Hero Banner & Status Pill */}
        <div className="scholastic-hero-banner">
          <div className="scholastic-hero-text">
            <div className="scholastic-badge-row">
              <span className="eyebrow">National Secondary Repository</span>
              <span className="scholastic-live-pill">
                <span className="live-dot" /> Live Repository Active
              </span>
            </div>
            <h2>Curriculum & Examination Hub</h2>
            <p>
              Search MANEB-aligned study resources, track your MSCE preparation milestones, and download
              low-bandwidth study packs directly to your offline vault.
            </p>
          </div>
          <div className="scholastic-hero-action-box">
            <div className="scholastic-node-status">
              <div className="node-icon-wrapper">
                <IconShieldCheck size={22} />
              </div>
              <div className="node-info">
                <strong>MANEB Secondary Node</strong>
                <small>Connected · Blantyre Local Cluster</small>
              </div>
            </div>
            <button
              type="button"
              className="scholastic-sync-btn"
              onClick={syncNode}
              disabled={nodeSyncing}
              title="Synchronize repository manifest"
            >
              <IconRefresh size={14} className={nodeSyncing ? 'is-spinning' : ''} />
              <span>{nodeSyncing ? 'Syncing Node...' : 'Sync Manifest'}</span>
            </button>
          </div>
        </div>

        {/* 2. Senior-Designer Stat Widgets */}
        <section className="scholastic-stat-cards-grid" aria-label="Scholastic metrics summary">
          <button
            type="button"
            className={`scholastic-stat-tile ${activeView === 'repository' ? 'is-selected' : ''}`}
            onClick={() => openView('repository')}
          >
            <div className="stat-tile-top">
              <div className="stat-icon-badge icon-green">
                <IconBook2 size={20} />
              </div>
              <span className="stat-trend-tag positive">+14 this term</span>
            </div>
            <div className="stat-tile-numbers">
              <strong>148</strong>
              <span>Verified MSCE Resources</span>
            </div>
            <div className="stat-tile-footer">
              <small>Explore subjects & past papers</small>
              <IconChevronRight size={14} />
            </div>
          </button>

          <button
            type="button"
            className={`scholastic-stat-tile ${activeView === 'progress' ? 'is-selected' : ''}`}
            onClick={() => openView('progress')}
          >
            <div className="stat-tile-top">
              <div className="stat-icon-badge icon-coral">
                <IconTarget size={20} />
              </div>
              <span className="stat-trend-tag highlight">{completedCount} of {milestones.length} done</span>
            </div>
            <div className="stat-tile-numbers">
              <strong>{overallProgressScore}%</strong>
              <span>MSCE Readiness Score</span>
            </div>
            <div className="stat-tile-footer">
              <small>View study milestone targets</small>
              <IconChevronRight size={14} />
            </div>
          </button>

          <button
            type="button"
            className={`scholastic-stat-tile ${activeView === 'vault' ? 'is-selected' : ''}`}
            onClick={() => openView('vault')}
          >
            <div className="stat-tile-top">
              <div className="stat-icon-badge icon-gold">
                <IconCloudDownload size={20} />
              </div>
              <span className="stat-trend-tag">{savedIds.length} items cached</span>
            </div>
            <div className="stat-tile-numbers">
              <strong>{totalVaultSize} MB</strong>
              <span>Offline Vault Storage</span>
            </div>
            <div className="stat-tile-footer">
              <small>Manage local study cache</small>
              <IconChevronRight size={14} />
            </div>
          </button>

          <button
            type="button"
            className={`scholastic-stat-tile ${activeView === 'review' ? 'is-selected' : ''}`}
            onClick={() => openView('review')}
          >
            <div className="stat-tile-top">
              <div className="stat-icon-badge icon-teal">
                <IconUsers size={20} />
              </div>
              <span className="stat-trend-tag neutral">{reviewQueue.filter((q) => q.status === 'Pending review').length} in queue</span>
            </div>
            <div className="stat-tile-numbers">
              <strong>32</strong>
              <span>Teacher Reviewers</span>
            </div>
            <div className="stat-tile-footer">
              <small>Check moderation standards</small>
              <IconChevronRight size={14} />
            </div>
          </button>
        </section>
        </>}

        {/* Destination navigation remains available on large screens and dedicated pages. */}
        <nav className="scholastic-segmented-nav" aria-label="Scholastic Hub views">
          <div className="segmented-pill-container">
            {[
              ['repository', 'Resource Repository', IconBook2],
              ['progress', 'Learning Progress', IconTrendingUp],
              ['vault', 'Offline Vault', IconDownload],
              ['review', 'Review Queue', IconShieldCheck],
              ['docs', 'System Guide', IconFileText],
            ].map(([key, label, IconComponent]) => (
              <button
                key={key}
                type="button"
                className={`segmented-tab-btn ${activeView === key ? 'active' : ''}`}
                onClick={() => openView(key)}
              >
                <IconComponent size={16} />
                <span>{label}</span>
                {key === 'vault' && savedIds.length > 0 && (
                  <span className="tab-counter-badge">{savedIds.length}</span>
                )}
                {key === 'review' && (
                  <span className="tab-counter-badge warning">
                    {reviewQueue.filter((i) => i.status === 'Pending review').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* VIEW 1: Resource Repository */}
        {activeView === 'repository' && (
          <section className="scholastic-view-container" aria-label="Resource repository view">
            {/* Search & Filter Bar */}
            <div className="scholastic-filter-toolbar">
              <div className="scholastic-search-field">
                <IconSearch size={18} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search biology, plant physiology, quadratic equations, marking schemes..."
                  aria-label="Search scholastic resources"
                />
                {query && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <IconX size={14} />
                  </button>
                )}
                <span className="search-mode-tag">Ranked MANEB Index</span>
              </div>

              <div className="scholastic-dropdown-group">
                <div className="filter-select-wrapper">
                  <IconFilter size={15} />
                  <select
                    value={formFilter}
                    onChange={(e) => setFormFilter(e.target.value)}
                    aria-label="Filter by form"
                  >
                    <option>All forms</option>
                    <option>Form 1</option>
                    <option>Form 2</option>
                    <option>Form 3</option>
                    <option>Form 4</option>
                  </select>
                </div>

                <div className="filter-select-wrapper">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    aria-label="Filter by resource type"
                  >
                    <option>All types</option>
                    <option>Class Notes</option>
                    <option>Past Paper</option>
                    <option>Practical Guide</option>
                    <option>Marking Scheme</option>
                  </select>
                </div>

                <div className="filter-select-wrapper sort-select">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort resources"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="title">Sort: Title (A-Z)</option>
                    <option value="year">Sort: Year (Newest)</option>
                    <option value="size">Sort: File Size (Smallest)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Subject Chips */}
            <div className="scholastic-subject-chips" role="group" aria-label="Subject quick filter">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  className={`subject-chip-btn ${subjectFilter === sub ? 'active' : ''}`}
                  onClick={() => setSubjectFilter(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Results Header */}
            <div className="scholastic-results-header">
              <div>
                <h2>{query ? `Search Results (${visibleResources.length})` : 'Curated Secondary Materials'}</h2>
                <p>
                  Showing {visibleResources.length} approved curriculum items · Low-bandwidth ready in PDF & EPUB.
                </p>
              </div>
              <div className="results-actions">
                <button
                  type="button"
                  className="text-action-btn"
                  onClick={() => {
                    setQuery('');
                    setSubjectFilter('All subjects');
                    setFormFilter('All forms');
                    setTypeFilter('All types');
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>

            {/* Resource Card Grid with Thumbnails */}
            <div className="scholastic-cards-grid">
              {visibleResources.map((res) => {
                const isSaved = savedIds.includes(res.id);
                return (
                  <article className="scholastic-card" key={res.id}>
                    {/* Media Thumbnail Container */}
                    <div className="scholastic-card-thumbnail" onClick={() => handleOpenResource(res)}>
                      <img src={res.image} alt={res.title} className="scholastic-cover-img" loading="lazy" />
                      <div className="card-thumbnail-gradient" />
                      <div className="card-thumbnail-overlay">
                        <span className={`card-type-pill ${res.subject.toLowerCase().replace(/\s+/g, '-')}`}>
                          {res.type}
                        </span>
                        <span className="card-size-pill">{res.size} MB</span>
                      </div>
                    </div>

                    <div className="scholastic-card-body">
                      <div className="card-meta-row">
                        <span className="card-subject-tag">{res.subject} · {res.form}</span>
                        <span className="card-rating-tag">★ {res.rating}</span>
                      </div>

                      <h3 className="card-title" onClick={() => handleOpenResource(res)}>{res.title}</h3>
                      <p className="card-author">{res.author} · {res.year}</p>
                      <p className="card-description">{res.description}</p>

                      <div className="scholastic-card-footer">
                        <button
                          type="button"
                          className={`card-vault-btn ${isSaved ? 'is-saved' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaved(res.id, res.title);
                          }}
                        >
                          {isSaved ? (
                            <>
                              <IconCheck size={15} /> <span>In Vault</span>
                            </>
                          ) : (
                            <>
                              <IconCloudDownload size={15} /> <span>Save Offline</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="card-open-btn"
                          onClick={() => handleOpenResource(res)}
                        >
                          <span>Open</span>
                          <IconChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* VIEW 2: Learning Progress */}
        {activeView === 'progress' && (
          <section className="scholastic-view-container" aria-label="Learning progress view">
            <div className="scholastic-progress-dashboard">
              {/* Left Column: Milestones & Tracker */}
              <div className="progress-main-card">
                <div className="card-heading-split">
                  <div>
                    <span className="eyebrow">MSCE Examination Roadmap</span>
                    <h2>Study Milestones & Goal Targets</h2>
                    <p>Track revision progress against key syllabus topics and past paper drills.</p>
                  </div>
                  <div className="overall-score-pill">
                    <strong>{overallProgressScore}%</strong>
                    <small>Completed</small>
                  </div>
                </div>

                <div className="progress-large-bar-wrapper">
                  <div className="progress-large-bar">
                    <span style={{ width: `${overallProgressScore}%` }} />
                  </div>
                  <div className="progress-bar-labels">
                    <span>{completedCount} of {milestones.length} milestones complete</span>
                    <span>Target: 100% by MSCE Finals</span>
                  </div>
                </div>

                {/* Add Milestone Toggle */}
                <div className="milestones-action-bar">
                  <h3>Active Milestones</h3>
                  <button
                    type="button"
                    className="outline-action-btn"
                    onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                  >
                    <IconPlus size={15} />
                    <span>{isAddingMilestone ? 'Close' : 'Add Target'}</span>
                  </button>
                </div>

                {isAddingMilestone && (
                  <form className="add-milestone-form" onSubmit={addMilestone}>
                    <div className="form-fields-row">
                      <input
                        type="text"
                        placeholder="e.g. Solve 2022 Physical Science past paper questions"
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        required
                      />
                      <select
                        value={newMilestoneSubject}
                        onChange={(e) => setNewMilestoneSubject(e.target.value)}
                      >
                        <option>Biology</option>
                        <option>Mathematics</option>
                        <option>English</option>
                        <option>Physical Science</option>
                      </select>
                      <button type="submit" className="primary-action-btn">
                        Save Target
                      </button>
                    </div>
                  </form>
                )}

                <div className="milestones-interactive-list">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`interactive-milestone-card ${m.completed ? 'is-done' : ''}`}
                    >
                      <button
                        type="button"
                        className="milestone-checkbox"
                        onClick={() => toggleMilestone(m.id)}
                        aria-label={`Mark ${m.title} as ${m.completed ? 'incomplete' : 'complete'}`}
                      >
                        {m.completed ? <IconCheck size={16} /> : null}
                      </button>

                      <div className="milestone-content">
                        <div className="milestone-meta-row">
                          <span className="milestone-sub-badge">{m.subject}</span>
                          <span className="milestone-due-badge"><IconClock size={12} /> {m.due}</span>
                          <span className="milestone-hours-badge">{m.estimatedHours}</span>
                        </div>
                        <h4 className="milestone-heading">{m.title}</h4>
                        <div className="milestone-micro-progress">
                          <span style={{ width: `${m.progress}%` }} />
                        </div>
                      </div>

                      <div className="milestone-progress-number">
                        <strong>{m.progress}%</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Recommendations & Streak */}
              <div className="progress-side-column">
                <div className="callout-action-card">
                  <div className="callout-icon-top">
                    <IconSparkles size={24} />
                  </div>
                  <span className="eyebrow">Next Recommended Action</span>
                  <h3>Attempt Biology Paper 2 Review</h3>
                  <p>
                    Targeted practice on plant physiology questions will boost your overall readiness by +12%.
                  </p>
                  <button
                    type="button"
                    className="primary-action-btn full-width"
                    onClick={() => {
                      onAction('Biology Paper 2 added to your active study drill.');
                      setActiveView('repository');
                      setQuery('Biology');
                    }}
                  >
                    <IconPlayerPlay size={16} />
                    <span>Start Practice Drill</span>
                  </button>
                </div>

                <div className="study-streak-card">
                  <div className="streak-header">
                    <IconAward size={22} />
                    <div>
                      <strong>Study Consistency</strong>
                      <small>3-week revision streak active</small>
                    </div>
                  </div>
                  <p>Study daily to maintain optimal recall before mock examinations.</p>
                  <button
                    type="button"
                    className="outline-action-btn full-width"
                    onClick={() => onAction('Today’s study session logged.')}
                  >
                    Log Study Session
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: Offline Vault */}
        {activeView === 'vault' && (
          <section className="scholastic-view-container" aria-label="Offline vault view">
            <div className="vault-overview-card">
              <div className="vault-header-split">
                <div>
                  <span className="eyebrow">Local Browser Storage</span>
                  <h2>Offline Vault Manager</h2>
                  <p>
                    All saved resources remain completely readable without an active internet connection.
                  </p>
                </div>
                <div className="vault-stats-badge">
                  <strong>{vaultItems.length} Cached Items</strong>
                  <span>{totalVaultSize} MB of 200 MB</span>
                </div>
              </div>

              <div className="vault-gauge-wrapper">
                <div className="vault-gauge-bar">
                  <span style={{ width: `${(parseFloat(totalVaultSize) / 200) * 100}%` }} />
                </div>
                <div className="vault-gauge-details">
                  <span>{(200 - parseFloat(totalVaultSize)).toFixed(1)} MB available offline storage</span>
                  <span>Quota: 200 MB maximum</span>
                </div>
              </div>

              <div className="vault-controls-bar">
                <button
                  type="button"
                  className="outline-action-btn"
                  onClick={() => onAction('Offline vault cache verified. All downloaded files intact.')}
                >
                  <IconFolderCheck size={16} />
                  <span>Verify Local Files</span>
                </button>

                {savedIds.length > 0 && (
                  <button
                    type="button"
                    className="danger-text-btn"
                    onClick={() => {
                      setSavedIds([]);
                      localStorage.setItem('learnhub-scholastic-saved', JSON.stringify([]));
                      onAction('Offline vault cleared.');
                    }}
                  >
                    <IconTrash size={15} />
                    <span>Clear All Items</span>
                  </button>
                )}
              </div>

              {vaultItems.length === 0 ? (
                <div className="vault-empty-state">
                  <IconCloudDownload size={42} />
                  <h3>Your Offline Vault is Empty</h3>
                  <p>Save notes, papers, or marking schemes from the repository to read offline anytime.</p>
                  <button
                    type="button"
                    className="primary-action-btn"
                    onClick={() => setActiveView('repository')}
                  >
                    Browse Repository
                  </button>
                </div>
              ) : (
                <div className="vault-items-list">
                  {vaultItems.map((item) => (
                    <div className="vault-row-card" key={item.id}>
                      <div className="vault-row-thumb">
                        <img src={item.image} alt={item.title} className="vault-item-img" loading="lazy" />
                      </div>
                      <div className="vault-row-details">
                        <h4>{item.title}</h4>
                        <div className="vault-row-meta">
                          <span>{item.subject}</span>
                          <span>·</span>
                          <span>{item.type}</span>
                          <span>·</span>
                          <span>{item.size} MB</span>
                          <span>·</span>
                          <span className="cached-status-badge">Available Offline</span>
                        </div>
                      </div>
                      <div className="vault-row-actions">
                        <button
                          type="button"
                          className="primary-action-btn compact"
                          onClick={() => handleOpenResource(item)}
                        >
                          <IconPlayerPlay size={14} /> Open
                        </button>
                        <button
                          type="button"
                          className="icon-action-btn danger"
                          onClick={() => toggleSaved(item.id, item.title)}
                          title="Remove from vault"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* VIEW 4: Review Queue */}
        {activeView === 'review' && (
          <section className="scholastic-view-container" aria-label="Submission review queue">
            <div className="review-queue-card">
              <div className="card-heading-split">
                <div>
                  <span className="eyebrow">Academic Moderation Desk</span>
                  <h2>Teacher & Board Submission Queue</h2>
                  <p>
                    Submitted learning materials are verified for syllabus fidelity, clarity, and formatting
                    before being published nationwide.
                  </p>
                </div>
                <div className="review-filter-pills">
                  {['all', 'Pending review', 'Verified'].map((statusKey) => (
                    <button
                      key={statusKey}
                      type="button"
                      className={`filter-pill ${reviewFilter === statusKey ? 'active' : ''}`}
                      onClick={() => setReviewFilter(statusKey)}
                    >
                      {statusKey === 'all' ? 'All Items' : statusKey}
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-items-container">
                {reviewQueue
                  .filter((item) => reviewFilter === 'all' || item.status === reviewFilter)
                  .map((item) => (
                    <article className="review-item-card" key={item.id}>
                      <div className="review-item-header">
                        <div className="review-header-left">
                          <div className="review-thumb-wrapper">
                            <img src={item.image} alt={item.title} className="review-item-img" loading="lazy" />
                          </div>
                          <div>
                            <div className="review-tags-row">
                              <span className="item-subject-tag">{item.subject}</span>
                              <span className="item-type-tag">{item.type}</span>
                              <span
                                className={`item-status-tag ${
                                  item.status === 'Verified' ? 'verified' : 'pending'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <h3 className="review-title">{item.title}</h3>
                            <p className="review-byline">Submitted by {item.author} · {item.date}</p>
                          </div>
                        </div>
                        <span className="review-file-badge">{item.size}</span>
                      </div>

                      <div className="review-notes-box">
                        <strong>Reviewer Note:</strong>
                        <span>{item.comments}</span>
                      </div>

                      <div className="review-card-actions">
                        <button
                          type="button"
                          className="outline-action-btn compact"
                          onClick={() => onAction(`Fingerprint verified for ${item.fileName}`)}
                        >
                          <IconFileCheck size={14} /> Verify Checksum
                        </button>

                        {item.status !== 'Verified' && (
                          <button
                            type="button"
                            className="primary-action-btn compact"
                            onClick={() => handleReviewStatus(item.id, 'Verified', item.title)}
                          >
                            <IconCheck size={14} /> Approve & Publish
                          </button>
                        )}

                        {item.status === 'Verified' && (
                          <button
                            type="button"
                            className="outline-action-btn compact"
                            onClick={() => handleReviewStatus(item.id, 'Pending review', item.title)}
                          >
                            Move back to Pending
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* VIEW 5: System Guide */}
        {activeView === 'docs' && (
          <section className="scholastic-view-container" aria-label="System guide view">
            <div className="docs-overview-card">
              <div className="card-heading-split">
                <div>
                  <span className="eyebrow">Platform Architecture</span>
                  <h2>Scholastic System Operations & Standards</h2>
                  <p>Detailed guide on offline caching, low-data modes, and MANEB curriculum indexing.</p>
                </div>
              </div>

              <div className="docs-bento-grid">
                <div className="bento-tile">
                  <div className="bento-icon-badge">
                    <IconCloudDownload size={22} />
                  </div>
                  <h3>Low-Data First Protocol</h3>
                  <p>
                    All PDF and EPUB resources are compressed and fingerprinted. The offline vault uses browser
                    storage to eliminate cellular data consumption during repeat study sessions.
                  </p>
                  <button
                    type="button"
                    className="text-action-btn"
                    onClick={() => setActiveView('vault')}
                  >
                    Open Offline Vault <IconChevronRight size={14} />
                  </button>
                </div>

                <div className="bento-tile">
                  <div className="bento-icon-badge">
                    <IconShieldCheck size={22} />
                  </div>
                  <h3>Curriculum Verification Standards</h3>
                  <p>
                    Teacher contributions undergo a strict 3-tier moderation check ensuring alignment with the
                    Malawi National Examinations Board (MANEB) Form 1–4 secondary syllabi.
                  </p>
                  <button
                    type="button"
                    className="text-action-btn"
                    onClick={() => setActiveView('review')}
                  >
                    View Review Queue <IconChevronRight size={14} />
                  </button>
                </div>

                <div className="bento-tile">
                  <div className="bento-icon-badge">
                    <IconTrendingUp size={22} />
                  </div>
                  <h3>Readiness & Milestone Engine</h3>
                  <p>
                    Progress weights are computed using active milestone completions, mock exam drills, and
                    reading history preserved on your personal device.
                  </p>
                  <button
                    type="button"
                    className="text-action-btn"
                    onClick={() => setActiveView('progress')}
                  >
                    View Roadmap <IconChevronRight size={14} />
                  </button>
                </div>

                <div className="bento-tile">
                  <div className="bento-icon-badge">
                    <IconAdjustments size={22} />
                  </div>
                  <h3>Diagnostic & Sync Engine</h3>
                  <p>
                    Network and manifest status can be polled at any time against the Blantyre cluster node to
                    ensure zero corrupted local downloads.
                  </p>
                  <button
                    type="button"
                    className="text-action-btn"
                    onClick={syncNode}
                  >
                    Run Sync Check <IconChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
