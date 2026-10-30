'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles, BookOpen, Layers, CheckCircle2, RotateCw, ChevronRight,
  ChevronLeft, Copy, Download, Trash2, ArrowRight, Lightbulb,
  HelpCircle, Check, X, Bookmark, Zap, Brain, FileText, Search,
  Folder, FolderPlus, MoreHorizontal, Calendar, Clock, Edit3, Plus,
  Share2, Award, PlayCircle, Eye, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Flashcard {
  id: string;
  front: string;
  backEasyWord: string;
  example: string;
  mastered?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  easyExample: string;
}

interface SmartNoteResult {
  id: string;
  title: string;
  folderId?: string;
  category: string;
  originalNotes: string;
  simplifiedSummary: string[];
  easyWordVocabulary: { complexTerm: string; easyWord: string; explanation: string }[];
  realWorldExamples: { title: string; eg: string }[];
  keyTakeaways: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt: string;
  timeString?: string;
  cardColor?: string;
}

interface NoteFolder {
  id: string;
  name: string;
  color: string;
  iconBg: string;
  date: string;
}

// Preset Folders matching Ethiopian University curricula
const INITIAL_FOLDERS: NoteFolder[] = [
  { id: 'f-class', name: 'Class Notes', color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800', iconBg: 'bg-emerald-600 text-white', date: 'Today' },
  { id: 'f-exam', name: 'Mid Test Prep', color: 'border-amber-200 bg-amber-50/70 text-amber-900', iconBg: 'bg-[#E0A526] text-white', date: 'This Week' },
  { id: 'f-cs', name: 'Computer Science', color: 'border-blue-200 bg-blue-50/70 text-blue-900', iconBg: 'bg-blue-600 text-white', date: 'This Month' },
  { id: 'f-econ', name: 'Economics & Business', color: 'border-purple-200 bg-purple-50/70 text-purple-900', iconBg: 'bg-purple-600 text-white', date: 'This Month' },
  { id: 'f-math', name: 'Mathematics & Calculus', color: 'border-rose-200 bg-rose-50/70 text-rose-900', iconBg: 'bg-rose-600 text-white', date: 'This Month' },
];

// Pre-seeded high quality notes so the student starts with rich notes immediately
const SEED_SMART_NOTES: SmartNoteResult[] = [
  {
    id: 'note-001',
    title: 'Mid test exam: Pointers & Memory Architecture',
    folderId: 'f-class',
    category: 'Computer Science',
    originalNotes: 'Pointers store memory addresses of variables on the heap or stack. Memory leaks occur when dynamic allocation is not freed.',
    simplifiedSummary: [
      'A pointer is simply a memory house number that tells the computer where a variable lives in RAM.',
      'Instead of copying large data structures, you pass a lightweight address pointer for speed.',
      'If you allocate memory on the heap and forget to free it, you create a memory leak.',
      'Dereferencing means visiting the memory address to read or modify the actual stored value.'
    ],
    easyWordVocabulary: [
      { complexTerm: 'Memory Address', easyWord: 'House Number / Location Tag', explanation: 'The numbered spot in RAM where a piece of data is placed.' },
      { complexTerm: 'Dereferencing (*ptr)', easyWord: 'Opening the Box', explanation: 'Reading or writing the actual value inside that memory address.' },
      { complexTerm: 'Memory Leak', easyWord: 'Forgotten Trash', explanation: 'Leaving unused data in RAM without freeing it, slowing down your system.' }
    ],
    realWorldExamples: [
      { title: 'Google Drive Share Link', eg: 'Sharing a Google Drive link with classmates instead of copying a 5GB video file represents a lightweight memory pointer.' }
    ],
    keyTakeaways: [
      'Pointers hold memory addresses, not the bulky values.',
      'Always pair malloc() with free() in C/C++ to prevent memory leaks.',
      'Pointers make passing large arrays or structures instantaneous.'
    ],
    flashcards: [
      { id: 'fc-1', front: 'What does a pointer store in memory?', backEasyWord: 'The memory address (location number) of another variable.', example: 'e.g. A locker number note.' },
      { id: 'fc-2', front: 'What is dereferencing (*p)?', backEasyWord: 'Accessing the actual data stored at that address.', example: 'e.g. Unlocking the locker to get your books.' },
      { id: 'fc-3', front: 'What causes a memory leak?', backEasyWord: 'Allocating RAM dynamically and never calling free().', example: 'e.g. Leaving the water tap running all night.' }
    ],
    quiz: [
      {
        id: 'qz-1',
        question: 'What is stored inside a pointer variable?',
        options: ['The actual value itself', 'The memory address where the value lives', 'A duplicated copy of the CPU cache', 'An encrypted user password'],
        correctIndex: 1,
        explanation: 'Pointers hold memory addresses in RAM, pointing to where data is stored.',
        easyExample: 'e.g. An address sticker on a package.'
      },
      {
        id: 'qz-2',
        question: 'What dangerous error happens when allocated memory is never released?',
        options: ['Memory leak that depletes available RAM', 'CPU screen brightness dims', 'Internet connection disconnects', 'Hard drive automatically reformats'],
        correctIndex: 0,
        explanation: 'Memory leaks occur when heap memory is allocated and never deallocated, exhausting system RAM.',
        easyExample: 'e.g. Borrowing library books and never returning them.'
      }
    ],
    createdAt: '2026-10-30T10:30:00.000Z',
    timeString: '10:30 AM, Today',
    cardColor: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white'
  },
  {
    id: 'note-002',
    title: 'Mid test exam: Inflation & Central Bank Policy',
    folderId: 'f-exam',
    category: 'Economics & Business',
    originalNotes: 'Inflation is the rate at which the general level of prices for goods and services is rising. Central banks raise policy rates to control aggregate demand.',
    simplifiedSummary: [
      'Inflation means money loses purchasing power over time so the same 100 Birr buys fewer goods.',
      'Central banks increase interest rates to make borrowing expensive and reduce excess market spending.',
      'Higher interest rates slow down money velocity and help stabilize consumer price levels.',
      'Deflation is the opposite, but can cause economic stagnation if consumers delay purchases.'
    ],
    easyWordVocabulary: [
      { complexTerm: 'Monetary Velocity', easyWord: 'Cash Handshake Speed', explanation: 'How fast money circulates from person to person through the economy.' },
      { complexTerm: 'Purchasing Power', easyWord: 'Basket Size', explanation: 'How many goods your 100 Birr can actually purchase at the market.' }
    ],
    realWorldExamples: [
      { title: 'Teff & Market Price Analogy', eg: 'If 1 quintal of teff rises from 8,000 ETB to 10,000 ETB, your money buys 20% less teff, illustrating headline inflation.' }
    ],
    keyTakeaways: [
      'Inflation erodes real purchasing power.',
      'Raising interest rates cools down overheated spending.',
      'Central banks aim for modest, predictable 2-3% inflation.'
    ],
    flashcards: [
      { id: 'fc-21', front: 'What is Inflation in simple terms?', backEasyWord: 'The steady rise in average market prices that lowers the buying power of cash.', example: 'e.g. Paying more for the same loaf of bread.' },
      { id: 'fc-22', front: 'Why do central banks raise interest rates?', backEasyWord: 'To make borrowing costlier, reduce spending, and cool inflation.', example: 'e.g. Putting the brakes on an accelerating car.' }
    ],
    quiz: [
      {
        id: 'qz-21',
        question: 'How does an increase in central bank benchmark interest rates affect inflation?',
        options: ['Increases borrowing and speeds up inflation', 'Discourages borrowing, reduces spending, and dampens inflation', 'Has no measurable effect on prices', 'Directly doubles consumer salaries'],
        correctIndex: 1,
        explanation: 'Higher rates make loans costlier, cooling consumer demand and slowing price increases.',
        easyExample: 'e.g. Less money borrowed means less bidding up of prices.'
      }
    ],
    createdAt: '2026-10-29T14:15:00.000Z',
    timeString: '02:15 PM, Yesterday',
    cardColor: 'border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white'
  },
  {
    id: 'note-003',
    title: 'Jonas\'s notes: Cramer\'s Rule & Determinants',
    folderId: 'f-math',
    category: 'Mathematics & STEM',
    originalNotes: 'Cramer\'s rule is an explicit formula for the solution of a system of linear equations with as many equations as unknowns, valid whenever the system has a unique solution (det != 0).',
    simplifiedSummary: [
      'Cramer\'s rule solves linear equation systems using matrix determinants directly.',
      'Calculate the main coefficient determinant D. If D = 0, Cramer\'s rule cannot be used.',
      'For variable x_i, replace column i with the constants vector, find D_i, and compute x_i = D_i / D.',
      'It is fast and elegant for 2x2 and 3x3 systems commonly tested on university exams.'
    ],
    easyWordVocabulary: [
      { complexTerm: 'Determinant', easyWord: 'Scaling Factor / Signature', explanation: 'A single number calculated from a square matrix that tells if it can be inverted.' },
      { complexTerm: 'Singular Matrix', easyWord: 'Dead-End Matrix', explanation: 'A matrix with determinant 0 whose equations have no unique solution.' }
    ],
    realWorldExamples: [
      { title: 'Electrical Circuit Mesh Analysis', eg: 'Finding the exact current flowing in two loops of an electrical circuit by solving a 2x2 matrix using Cramer\'s rule.' }
    ],
    keyTakeaways: [
      'Condition for unique solution: det(A) ≠ 0.',
      'x = Dx / D and y = Dy / D.',
      'Double check by plugging answers back into original equations.'
    ],
    flashcards: [
      { id: 'fc-31', front: 'When does Cramer\'s Rule fail to find a unique solution?', backEasyWord: 'When the main coefficient determinant D equals 0.', example: 'e.g. Division by zero is undefined.' },
      { id: 'fc-32', front: 'What is the formula for x₁ in Cramer\'s Rule?', backEasyWord: 'x₁ = D₁ / D (where D₁ replaces column 1 with the constant vector).', example: 'e.g. Swap column 1, calculate det, divide by D.' }
    ],
    quiz: [
      {
        id: 'qz-31',
        question: 'Under what condition does Cramer\'s rule yield a unique valid solution?',
        options: ['Determinant of A equals 0', 'Determinant of A is non-zero', 'The system has more unknowns than equations', 'All matrix elements are prime numbers'],
        correctIndex: 1,
        explanation: 'Cramer\'s rule divides by det(A); therefore det(A) must be non-zero for a unique solution.',
        easyExample: 'e.g. Cannot divide by zero.'
      }
    ],
    createdAt: '2026-10-28T09:40:00.000Z',
    timeString: '09:40 AM, Wednesday',
    cardColor: 'border-blue-200/80 bg-gradient-to-br from-blue-50/50 to-white'
  }
];

export default function SmartNotesView() {
  // Navigation & Filter states (inspired by the clean folder/note tabs in the reference image)
  const [folderFilter, setFolderFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [noteFilter, setNoteFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Folders state
  const [folders, setFolders] = useState<NoteFolder[]>(INITIAL_FOLDERS);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<SmartNoteResult[]>(SEED_SMART_NOTES);
  const [selectedNote, setSelectedNote] = useState<SmartNoteResult | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Gemini AI Generation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Computer Science');
  const [selectedFolderForNewNote, setSelectedFolderForNewNote] = useState('f-class');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedFolders = localStorage.getItem('tibeb_note_folders');
      if (storedFolders) setFolders(JSON.parse(storedFolders));

      const storedNotes = localStorage.getItem('tibeb_smart_notes');
      if (storedNotes) {
        const parsed = JSON.parse(storedNotes);
        if (parsed.length > 0) {
          setNotes(parsed);
          setSelectedNote(parsed[0]);
        } else {
          setSelectedNote(SEED_SMART_NOTES[0]);
        }
      } else {
        setSelectedNote(SEED_SMART_NOTES[0]);
      }
    } catch {
      setSelectedNote(SEED_SMART_NOTES[0]);
    }
  }, []);

  // Save to localStorage when changed
  const persistNotes = (updatedNotes: SmartNoteResult[]) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem('tibeb_smart_notes', JSON.stringify(updatedNotes));
    } catch {}
  };

  const persistFolders = (updatedFolders: NoteFolder[]) => {
    setFolders(updatedFolders);
    try {
      localStorage.setItem('tibeb_note_folders', JSON.stringify(updatedFolders));
    } catch {}
  };

  // Filtered Folders
  const filteredFolders = useMemo(() => {
    return folders.filter(f => {
      if (searchQuery) {
        return f.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (folderFilter === 'today') return f.date === 'Today';
      if (folderFilter === 'week') return f.date === 'Today' || f.date === 'This Week';
      if (folderFilter === 'month') return true;
      return true;
    });
  }, [folders, folderFilter, searchQuery]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      // Filter by folder selection if active
      if (selectedFolderId && n.folderId !== selectedFolderId) return false;

      // Filter by search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.simplifiedSummary.some(s => s.toLowerCase().includes(q));
      }

      // Filter by timeline tab
      if (noteFilter === 'today') {
        return n.timeString?.includes('Today') || n.createdAt.includes('2026-10-30');
      }
      if (noteFilter === 'week') {
        return true;
      }
      return true;
    });
  }, [notes, noteFilter, selectedFolderId, searchQuery]);

  // Handle Creating a New Folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    const colorOptions = [
      { color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800', iconBg: 'bg-emerald-600 text-white' },
      { color: 'border-amber-200 bg-amber-50/70 text-amber-900', iconBg: 'bg-[#E0A526] text-white' },
      { color: 'border-blue-200 bg-blue-50/70 text-blue-900', iconBg: 'bg-blue-600 text-white' },
      { color: 'border-purple-200 bg-purple-50/70 text-purple-900', iconBg: 'bg-purple-600 text-white' },
      { color: 'border-rose-200 bg-rose-50/70 text-rose-900', iconBg: 'bg-rose-600 text-white' },
    ];
    const picked = colorOptions[folders.length % colorOptions.length];

    const newFolder: NoteFolder = {
      id: 'f-' + Date.now(),
      name: newFolderName.trim(),
      color: picked.color,
      iconBg: picked.iconBg,
      date: 'Today'
    };

    persistFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
    toast.success(`Folder "${newFolder.name}" created!`);
  };

  // Handle Generating a Note with Gemini API
  const handleGenerateWithGemini = async () => {
    if (!inputPrompt.trim()) {
      toast.error('Please enter a topic, title, or paste your lecture notes!');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating smart note with Gemini AI ⚡...');

    try {
      const res = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputPrompt.trim(),
          category: selectedCategory,
          action: 'generate_full_note'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate note');
      }

      const generated: SmartNoteResult = {
        ...data.data,
        folderId: selectedFolderForNewNote,
        timeString: 'Just now, Today',
        cardColor: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white'
      };

      const updated = [generated, ...notes];
      persistNotes(updated);
      setSelectedNote(generated);
      setActiveTab('summary');
      setShowCreateModal(false);
      setInputPrompt('');
      toast.success('Smart Note generated successfully!', { id: toastId });

    } catch (err: any) {
      console.error('Gemini generate error:', err);
      toast.error('AI generation failed. Using fallback template.', { id: toastId });

      // Fallback note generator so user is never blocked
      const fallbackNote: SmartNoteResult = {
        id: 'note-' + Date.now(),
        title: inputPrompt.slice(0, 45) + ' (Summary)',
        folderId: selectedFolderForNewNote,
        category: selectedCategory,
        originalNotes: inputPrompt,
        simplifiedSummary: [
          'Core Concept: ' + inputPrompt.slice(0, 100),
          'Key Mechanism: Break down technical components into modular, manageable chunks for exam recall.',
          'Exam Tip: Focus on definitions, real-world examples, and step-by-step problem-solving.'
        ],
        easyWordVocabulary: [
          { complexTerm: 'Fundamental Principle', easyWord: 'Core Rule', explanation: 'The foundational law guiding this system.' }
        ],
        realWorldExamples: [
          { title: 'Ethiopian University Case Study', eg: 'Relate this topic to campus network architecture or regional economic activity.' }
        ],
        keyTakeaways: [
          'Master key formulas and definitions before sitting for the exam.',
          'Review active recall flashcards daily.'
        ],
        flashcards: [
          { id: 'fc-fb-1', front: `What is the core definition of ${inputPrompt.slice(0, 30)}?`, backEasyWord: 'A fundamental concept tested on university mid and final exams.', example: 'e.g. Study standard definition.' }
        ],
        quiz: [
          {
            id: 'qz-fb-1',
            question: `Which statement best describes ${inputPrompt.slice(0, 30)}?`,
            options: ['The foundational principle', 'An obsolete theory', 'A hardware component', 'None of the above'],
            correctIndex: 0,
            explanation: 'It represents the primary principle outlined in your lecture materials.',
            easyExample: 'e.g. Review lecture slide 1.'
          }
        ],
        createdAt: new Date().toISOString(),
        timeString: 'Just now, Today',
        cardColor: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white'
      };

      persistNotes([fallbackNote, ...notes]);
      setSelectedNote(fallbackNote);
      setShowCreateModal(false);
      setInputPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete note
  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this smart note?')) {
      const updated = notes.filter(n => n.id !== noteId);
      persistNotes(updated);
      if (selectedNote?.id === noteId) {
        setSelectedNote(updated.length > 0 ? updated[0] : null);
      }
      toast.success('Note deleted');
    }
  };

  // Toggle flashcard flip
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (!selectedNote || selectedNote.flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedNote.flashcards.length);
  };

  const handlePrevCard = () => {
    if (!selectedNote || selectedNote.flashcards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedNote.flashcards.length) % selectedNote.flashcards.length);
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const currentCards = selectedNote?.flashcards || [];
  const currentCard = currentCards[currentCardIndex] || currentCards[0];

  return (
    <div className="w-full space-y-8 font-sans">
      <div className="space-y-8">

        {/* =========================================================================
            HEADER SECTION (INSPIRED BY THE CLEAN "MY NOTES" TOP BAR)
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B5D3B] text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Brain size={24} className="text-gold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight uppercase">
                My Notes
              </h1>
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Gemini AI Smart Summaries & Flashcards
              </p>
            </div>
          </div>

          {/* Search Bar (Centered In Reference Style) */}
          <div className="w-full md:max-w-md relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes, folders or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] text-xs sm:text-sm font-semibold transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="px-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <FolderPlus size={16} className="text-[#0B5D3B]" />
              New Folder
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Sparkles size={16} className="text-gold" />
              + AI Generate Note
            </button>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: RECENT FOLDERS (MATCHING REFERENCE DESIGN WITH TIBEB AESTHETICS)
           ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                Recent Folders
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Organize your study notes by university course and semester
              </p>
            </div>

            {/* Folder Time Tabs (Inspired by Reference Image "Today's | This Week | This Month") */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: 'today', label: "Today's" },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Folders' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFolderFilter(tab.id as any)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                    folderFilter === tab.id
                      ? 'bg-[#0B5D3B] text-white shadow-sm'
                      : 'text-gray-500 hover:text-ink hover:bg-gray-100'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Folder Cards Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFolders.map((folder) => {
              const noteCount = notes.filter(n => n.folderId === folder.id).length;
              const isSelected = selectedFolderId === folder.id;

              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(isSelected ? null : folder.id)}
                  className={cn(
                    'p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative shadow-sm hover:shadow-md',
                    isSelected
                      ? 'border-[#0B5D3B] bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-gray-200/90 bg-white hover:border-emerald-300'
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-xs', folder.iconBg)}>
                      <Folder size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-ink">
                      {folder.date}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-ink text-sm sm:text-base mb-1 group-hover:text-[#0B5D3B] transition-colors truncate">
                      {folder.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold">
                      {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="absolute top-3 right-3 text-[10px] font-black text-[#0B5D3B] bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active Filter
                    </span>
                  )}
                </div>
              );
            })}

            {/* "+ New folder" Dashed Card (Matches Reference Image) */}
            <div
              onClick={() => setShowNewFolderModal(true)}
              className="p-5 rounded-3xl border-2 border-dashed border-gray-300 hover:border-[#0B5D3B] hover:bg-emerald-50/30 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-2 group min-h-[120px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-gray-100 group-hover:bg-emerald-100 text-gray-500 group-hover:text-[#0B5D3B] flex items-center justify-center transition-colors">
                <Plus size={20} />
              </div>
              <span className="text-xs font-black text-gray-600 group-hover:text-[#0B5D3B]">
                New folder
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: MY NOTES (MATCHING REFERENCE DESIGN WITH TIBEB AESTHETICS)
           ========================================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                  My Notes
                </h2>
                {selectedFolderId && (
                  <span className="text-xs font-bold text-[#0B5D3B] bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    Filtered by folder <X size={12} className="cursor-pointer" onClick={() => setSelectedFolderId(null)} />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Tap any note to study simplified summaries, active flashcards, and quizzes
              </p>
            </div>

            {/* Note Timeline Filter Tabs (Today's | This Week | This Month) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: 'today', label: "Today's" },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Notes' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setNoteFilter(tab.id as any)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                    noteFilter === tab.id
                      ? 'bg-[#0B5D3B] text-white shadow-sm'
                      : 'text-gray-500 hover:text-ink hover:bg-gray-100'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setActiveTab('summary');
                  }}
                  className={cn(
                    'p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative hover:-translate-y-1 hover:shadow-xl',
                    isSelected
                      ? 'border-[#0B5D3B] bg-white ring-4 ring-[#0B5D3B]/10 shadow-lg'
                      : 'border-gray-200/90 bg-white hover:border-emerald-300'
                  )}
                >
                  {/* Top Row: Date & Action Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                      <span className="font-semibold text-gray-500 flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        {new Date(note.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          className="w-7 h-7 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="w-7 h-7 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-400 group-hover:text-[#0B5D3B] flex items-center justify-center transition-colors">
                          <Edit3 size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Note Title */}
                    <h3 className="font-black text-ink text-base leading-snug mb-2 group-hover:text-[#0B5D3B] transition-colors line-clamp-2">
                      {note.title}
                    </h3>

                    {/* Note Excerpt / Summary Preview */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {note.simplifiedSummary?.[0] || note.originalNotes}
                    </p>
                  </div>

                  {/* Bottom Row: Time and Quick Badges */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      {note.timeString || '10:30 AM'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#0B5D3B] text-[10px] font-black uppercase">
                        {note.flashcards?.length || 0} Cards
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase">
                        {note.quiz?.length || 0} Quiz
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "+ New Note" Dashed Card (Matches Reference Image) */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="p-6 rounded-3xl border-2 border-dashed border-gray-300 hover:border-[#0B5D3B] hover:bg-emerald-50/30 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-3 group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-emerald-100 text-gray-500 group-hover:text-[#0B5D3B] flex items-center justify-center transition-colors">
                <Plus size={24} />
              </div>
              <div>
                <span className="text-sm font-black text-ink block group-hover:text-[#0B5D3B]">
                  New Note
                </span>
                <span className="text-[11px] text-gray-400">
                  Generate with Gemini AI ⚡
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ACTIVE NOTE STUDY SUITE (INTERACTIVE SUMMARY, FLASHCARDS & QUIZ)
           ========================================================================= */}
        {selectedNote && (
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden mt-8 transition-all">
            
            {/* Header / Tabs */}
            <div className="bg-gradient-to-r from-[#0B5D3B] via-[#0d7048] to-[#12202B] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="text-gold" />
                  {selectedNote.category} • Study Suite
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedNote.title}
                </h2>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center bg-black/25 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                    activeTab === 'summary'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  <FileText size={14} />
                  Smart Summary
                </button>

                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                    activeTab === 'flashcards'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  <Layers size={14} />
                  Flashcards ({selectedNote.flashcards?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                    activeTab === 'quiz'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  <HelpCircle size={14} />
                  Practice Quiz ({selectedNote.quiz?.length || 0})
                </button>
              </div>
            </div>

            {/* TAB CONTENT: SMART SUMMARY */}
            {activeTab === 'summary' && (
              <div className="p-6 sm:p-10 space-y-8 bg-white">
                
                {/* 1. Plain English Summary */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-ink flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0B5D3B]" />
                    Explain Like I&apos;m a Freshman (Key Concepts)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedNote.simplifiedSummary?.map((point, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                        <CheckCircle2 size={16} className="text-[#0B5D3B] flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Complex Terms in Easy Words */}
                {selectedNote.easyWordVocabulary && selectedNote.easyWordVocabulary.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-black text-ink flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                      Academic Vocabulary Decoder
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedNote.easyWordVocabulary.map((v, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
                          <span className="text-xs font-mono font-bold text-gray-400 block uppercase">Technical Term</span>
                          <h4 className="font-black text-sm text-ink">{v.complexTerm}</h4>
                          <span className="inline-block text-[11px] font-bold text-[#0B5D3B] bg-emerald-100 px-2 py-0.5 rounded-md">
                            Means: {v.easyWord}
                          </span>
                          <p className="text-xs text-gray-500 pt-1 leading-relaxed">{v.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Real World Examples & Exam Takeaways */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedNote.realWorldExamples && selectedNote.realWorldExamples.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                      <h4 className="font-black text-sm text-amber-950 flex items-center gap-2">
                        <Lightbulb size={16} className="text-gold" />
                        Relatable Analogy / Example
                      </h4>
                      {selectedNote.realWorldExamples.map((ex, idx) => (
                        <div key={idx} className="text-xs text-amber-900 leading-relaxed">
                          <strong>{ex.title}:</strong> {ex.eg}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedNote.keyTakeaways && selectedNote.keyTakeaways.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="font-black text-sm text-ink flex items-center gap-2">
                        <Bookmark size={16} className="text-[#0B5D3B]" />
                        Final Exam Takeaways
                      </h4>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {selectedNote.keyTakeaways.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5D3B]" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: INTERACTIVE 3D FLASHCARDS */}
            {activeTab === 'flashcards' && (
              <div className="p-6 sm:p-12 bg-gray-50 flex flex-col items-center justify-center space-y-6">
                {currentCards.length > 0 ? (
                  <>
                    <div className="w-full max-w-lg text-center space-y-1">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Card {currentCardIndex + 1} of {currentCards.length}
                      </span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0B5D3B] h-full transition-all duration-300"
                          style={{ width: `${((currentCardIndex + 1) / currentCards.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Flashcard Box */}
                    <div
                      onClick={handleFlipCard}
                      className={cn(
                        'w-full max-w-lg min-h-[260px] p-8 rounded-3xl cursor-pointer shadow-lg transition-all duration-300 flex flex-col justify-between text-center select-none border-2',
                        isFlipped
                          ? 'bg-[#0B5D3B] text-white border-emerald-700'
                          : 'bg-white text-ink border-gray-200 hover:border-emerald-300'
                      )}
                    >
                      <div className="flex items-center justify-between text-xs opacity-70">
                        <span>{isFlipped ? 'Answer (Verified)' : 'Prompt / Question'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Tap to Flip ↻</span>
                      </div>

                      <div className="py-6">
                        <h3 className={cn('text-lg sm:text-xl font-black leading-relaxed', isFlipped ? 'text-white' : 'text-ink')}>
                          {isFlipped ? currentCard.backEasyWord : currentCard.front}
                        </h3>
                        {isFlipped && currentCard.example && (
                          <p className="text-xs text-emerald-100 font-medium mt-3 bg-white/10 p-2.5 rounded-xl">
                            {currentCard.example}
                          </p>
                        )}
                      </div>

                      <div className="text-[11px] opacity-60 font-semibold">
                        {isFlipped ? '✓ Mastered concept' : 'Think of the answer before flipping'}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePrevCard}
                        className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 text-ink shadow-xs cursor-pointer transition-all"
                        title="Previous card"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={handleFlipCard}
                        className="px-6 py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 text-xs font-black text-ink shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <RotateCw size={14} />
                        Flip Card
                      </button>

                      <button
                        onClick={handleNextCard}
                        className="p-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white shadow-xs cursor-pointer transition-all"
                        title="Next card"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No flashcards found in this note.</p>
                )}
              </div>
            )}

            {/* TAB CONTENT: PRACTICE QUIZ */}
            {activeTab === 'quiz' && (
              <div className="p-6 sm:p-10 space-y-6 bg-white">
                {selectedNote.quiz && selectedNote.quiz.length > 0 ? (
                  <>
                    <div className="space-y-6 max-w-3xl mx-auto">
                      {selectedNote.quiz.map((q, qIdx) => {
                        const selectedOpt = selectedAnswers[qIdx];
                        const isAnswered = selectedOpt !== undefined;
                        const isCorrect = selectedOpt === q.correctIndex;

                        return (
                          <div key={q.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-xl bg-[#0B5D3B] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                                {qIdx + 1}
                              </span>
                              <h4 className="font-black text-sm sm:text-base text-ink">
                                {q.question}
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const isPicked = selectedOpt === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                    className={cn(
                                      'p-3.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer',
                                      quizSubmitted
                                        ? optIdx === q.correctIndex
                                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/20'
                                          : isPicked
                                            ? 'bg-red-50 border-red-300 text-red-800'
                                            : 'bg-white border-gray-200 text-gray-500'
                                        : isPicked
                                          ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-md'
                                          : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-400'
                                    )}
                                  >
                                    <span className="font-mono mr-1.5 opacity-70">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Show Explanation After Submission */}
                            {quizSubmitted && (
                              <div className={cn(
                                'p-3.5 rounded-2xl text-xs space-y-1',
                                isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                              )}>
                                <span className="font-black block">
                                  {isCorrect ? '✓ Correct Answer!' : `✗ Incorrect. Correct is: ${String.fromCharCode(65 + q.correctIndex)}`}
                                </span>
                                <p className="text-[11px] opacity-90">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Quiz Submit Bar */}
                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={() => {
                            setSelectedAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-ink hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          Reset Answers
                        </button>

                        <button
                          onClick={() => {
                            if (Object.keys(selectedAnswers).length === 0) {
                              toast.error('Please answer at least one question!');
                              return;
                            }
                            setQuizSubmitted(true);
                            toast.success('Quiz evaluated!');
                          }}
                          className="px-6 py-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                        >
                          Submit & View Explanations
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center">No quiz questions generated for this note.</p>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL: NEW FOLDER CREATION
         ========================================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink font-black text-lg">
                <FolderPlus size={20} className="text-[#0B5D3B]" />
                Create New Folder
              </div>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  Folder Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Applied Math 1011, Mid Exam Revisions"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] text-sm font-semibold"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-xs shadow-md"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: GEMINI AI NOTE GENERATOR
         ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center font-black">
                  <Sparkles size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-black text-ink text-lg">Generate Smart Note with Gemini AI</h3>
                  <p className="text-[11px] text-gray-400 font-bold">Fast structured summaries, flashcards & practice quiz</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Folder Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Select Target Folder
                  </label>
                  <select
                    value={selectedFolderForNewNote}
                    onChange={(e) => setSelectedFolderForNewNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                  >
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Academic Subject / Department
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                  >
                    <option value="Computer Science">Computer Science & IT</option>
                    <option value="Economics & Business">Economics & Business</option>
                    <option value="Mathematics & STEM">Mathematics & Calculus</option>
                    <option value="Health & Medicine">Health & Medicine</option>
                    <option value="Engineering & Physics">Engineering & Physics</option>
                  </select>
                </div>
              </div>

              {/* Input Prompt / Lecture Text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  Topic or Lecture Notes Text
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste lecture notes or type a topic (e.g. Operating System Virtual Memory Paging, Keynesian Aggregate Demand, Cramer's Rule Linear Systems)..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] text-xs sm:text-sm font-semibold"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-400 block uppercase">Or try a fast test topic:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Compiler Design: Synthesized vs Inherited Attributes',
                    'Microeconomics: Monopoly vs Perfect Competition',
                    'Android: Content Provider & Fragment Lifecycles',
                    'Calculus: Definite Integrals and Area Under Curve'
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputPrompt(preset)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-[#0B5D3B] text-[11px] font-semibold text-gray-600 transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateWithGemini}
                  className="w-full py-4 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gemini AI Analyzing & Generating Study Guide...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} className="text-gold" />
                      Generate Note with Gemini AI ⚡
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
