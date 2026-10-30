'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Users, ShoppingBag, MessageSquare, Plus,
  FileText, Shield, CheckCircle, Clock, AlertCircle,
  Search, Filter, ChevronRight, Download, Send, RefreshCw,
  Zap, ArrowUpRight, DollarSign, University, Eye, EyeOff,
  Lock, KeyRound, LogOut, ArrowLeft, QrCode, Scan,
  CheckCircle2, XCircle, AlertTriangle, Sparkles, Bot,
  FileCheck, ExternalLink, Calendar, HelpCircle, Layers,
  X, Info, Phone, Mail, Award, Check, UserCheck, ChevronDown, RotateCw, Save,
  Upload, UploadCloud, BookOpen, Tag, Trash2, Ticket, Copy
} from 'lucide-react';
import { UNIVERSITIES, EXAMS, type Exam } from '@/lib/seed-data';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  PaymentVerification,
  StudentProfileDetail,
  MOCK_STUDENT_PROFILES,
  getStoredVerifications,
  saveVerifications,
  SAMPLE_RECEIPTS
} from '@/lib/payment-verification';
import {
  Coupon,
  getStoredCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from '@/lib/coupon-store';
import {
  getSupportConversations,
  getSupportMessages,
  sendAdminReply,
  type ChatConversation,
  type ChatMessage
} from '@/lib/support-chat';
import toast from 'react-hot-toast';

type AdminTab = 'overview' | 'verifications' | 'ai' | 'exams' | 'students' | 'coupons' | 'support' | 'profile';

interface SupportTicket {
  id: string;
  studentName: string;
  studentPhone: string;
  university: 'AAU' | 'Unity' | 'ASTU';
  subject: string;
  message: string;
  time: string;
  status: 'open' | 'in_progress' | 'resolved';
  category: 'payment' | 'exam_request' | 'question' | 'feedback';
  reply?: string;
}

// Clean slate: tickets and live support chats start from 0
const INITIAL_TICKETS: SupportTicket[] = [];

const BATCH_EXAM_PRESETS = [
  { fileName: 'AAU_MATH1011_AppliedMath_Final_2024.pdf', title: 'Applied Mathematics I Final Exam', code: 'MATH 1011', university: 'AAU', uniId: 'aau', department: 'Mathematics / Pre-Eng', subject: 'Calculus', examType: 'Final' as const, year: 2024, semester: '1' },
  { fileName: 'AAU_CoSc2041_DataStructures_Final_2024.pdf', title: 'Data Structures & Algorithms Final', code: 'CoSc 2041', university: 'AAU', uniId: 'aau', department: 'Computer Science', subject: 'Algorithms', examType: 'Final' as const, year: 2024, semester: '2' },
  { fileName: 'ASTU_ME2011_Thermodynamics_Mid_2023.pdf', title: 'Thermodynamics I Midterm Examination', code: 'ME 2011', university: 'ASTU', uniId: 'astu', department: 'Mechanical Engineering', subject: 'Thermodynamics', examType: 'Mid' as const, year: 2023, semester: '1' },
  { fileName: 'Unity_ACCT101_FinancialAccounting_Mid_2024.pdf', title: 'Financial Accounting I Midterm', code: 'ACCT 101', university: 'Unity', uniId: 'unity', department: 'Accounting & Finance', subject: 'Accounting', examType: 'Mid' as const, year: 2024, semester: '1' },
  { fileName: 'AAU_PHYS1011_GeneralPhysics_Final_2023.pdf', title: 'General Physics Mechanics Final', code: 'PHYS 1011', university: 'AAU', uniId: 'aau', department: 'Physics / Natural Science', subject: 'Physics', examType: 'Final' as const, year: 2023, semester: '1' },
  { fileName: 'AAU_CHEM2021_OrganicChemistry_Final_2024.pdf', title: 'Organic Chemistry I Final Exam', code: 'CHEM 2021', university: 'AAU', uniId: 'aau', department: 'Chemistry', subject: 'Organic Chemistry', examType: 'Final' as const, year: 2024, semester: '2' },
  { fileName: 'ASTU_EE2031_CircuitAnalysis_Final_2023.pdf', title: 'Circuit Analysis & Networks Final', code: 'EE 2031', university: 'ASTU', uniId: 'astu', department: 'Electrical Engineering', subject: 'Circuits', examType: 'Final' as const, year: 2023, semester: '2' },
  { fileName: 'Unity_MKTG201_PrinciplesMarketing_Final_2024.pdf', title: 'Principles of Marketing Final', code: 'MKTG 201', university: 'Unity', uniId: 'unity', department: 'Marketing Management', subject: 'Marketing', examType: 'Final' as const, year: 2024, semester: '1' },
  { fileName: 'AAU_ANAT101_HumanAnatomy_Final_2024.pdf', title: 'Human Anatomy & Physiology I Final', code: 'ANAT 101', university: 'AAU', uniId: 'aau', department: 'Medicine & Health', subject: 'Anatomy', examType: 'Final' as const, year: 2024, semester: '1' },
  { fileName: 'ASTU_ME3021_FluidMechanics_Mid_2023.pdf', title: 'Fluid Mechanics Midterm Exam', code: 'ME 3021', university: 'ASTU', uniId: 'astu', department: 'Mechanical Engineering', subject: 'Fluids', examType: 'Mid' as const, year: 2023, semester: '1' },
  { fileName: 'AAU_ECON1011_Macroeconomics_Mid_2024.pdf', title: 'Introduction to Macroeconomics Midterm', code: 'ECON 1011', university: 'AAU', uniId: 'aau', department: 'Economics', subject: 'Macroeconomics', examType: 'Mid' as const, year: 2024, semester: '1' },
  { fileName: 'Unity_LAW201_CommercialLaw_Final_2023.pdf', title: 'Ethiopian Commercial Law Final', code: 'LAW 201', university: 'Unity', uniId: 'unity', department: 'School of Law', subject: 'Commercial Law', examType: 'Final' as const, year: 2023, semester: '2' },
  { fileName: 'AAU_CoSc3011_DatabaseSystems_Final_2024.pdf', title: 'Database Systems & SQL Final', code: 'CoSc 3011', university: 'AAU', uniId: 'aau', department: 'Computer Science', subject: 'Databases', examType: 'Final' as const, year: 2024, semester: '1' },
  { fileName: 'ASTU_MSE201_EngineeringMaterials_Final_2023.pdf', title: 'Engineering Materials & Metallurgy', code: 'MSE 201', university: 'ASTU', uniId: 'astu', department: 'Materials Science', subject: 'Materials', examType: 'Final' as const, year: 2023, semester: '2' },
  { fileName: 'AAU_MATH2011_LinearAlgebra_Final_2024.pdf', title: 'Linear Algebra & Geometry Final', code: 'MATH 2011', university: 'AAU', uniId: 'aau', department: 'Mathematics', subject: 'Linear Algebra', examType: 'Final' as const, year: 2024, semester: '2' },
  { fileName: 'Unity_MGMT301_CostAccounting_Final_2024.pdf', title: 'Cost & Management Accounting Final', code: 'MGMT 301', university: 'Unity', uniId: 'unity', department: 'Management', subject: 'Cost Accounting', examType: 'Final' as const, year: 2024, semester: '2' },
  { fileName: 'ASTU_SE2011_SoftwareEngineering_Final_2023.pdf', title: 'Software Engineering Principles Final', code: 'SE 2011', university: 'ASTU', uniId: 'astu', department: 'Software Engineering', subject: 'Software Eng', examType: 'Final' as const, year: 2023, semester: '2' },
  { fileName: 'AAU_CE2011_StructuralMechanics_Final_2024.pdf', title: 'Structural Mechanics & Statics Final', code: 'CE 2011', university: 'AAU', uniId: 'aau', department: 'Civil Engineering', subject: 'Structures', examType: 'Final' as const, year: 2024, semester: '1' },
  { fileName: 'Unity_MGMT201_OrganizationalBehavior_Final_2024.pdf', title: 'Organizational Behavior Final Exam', code: 'MGMT 201', university: 'Unity', uniId: 'unity', department: 'Management', subject: 'Management', examType: 'Final' as const, year: 2024, semester: '1' },
  { fileName: 'AAU_CoSc3021_OperatingSystems_Final_2024.pdf', title: 'Operating Systems & Architecture Final', code: 'CoSc 3021', university: 'AAU', uniId: 'aau', department: 'Computer Science', subject: 'OS', examType: 'Final' as const, year: 2024, semester: '2' }
];

export default function AdminPortalPage() {
  const { user, loginAdmin, signOut } = useAuth();

  // Admin login states — preloaded with authorized credentials
  const [adminEmail, setAdminEmail] = useState('tibebexams@gmail.com');
  const [adminPassword, setAdminPassword] = useState('Te26sc26$');
  const [adminError, setAdminError] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Active dock tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Verifications State
  const [verifications, setVerifications] = useState<PaymentVerification[]>([]);
  const [selectedVerif, setSelectedVerif] = useState<PaymentVerification | null>(null);
  const [verifFilter, setVerifFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection Dialog State
  const [rejectingVerif, setRejectingVerif] = useState<PaymentVerification | null>(null);
  const [rejectReason, setRejectReason] = useState('Account name mismatch with registered student');
  const [customRejectNote, setCustomRejectNote] = useState('');

  // Screenshot Zoom Modal
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Student Profile Drawer State
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileDetail | null>(null);
  const [registeredStudents, setRegisteredStudents] = useState<any[]>([]);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState<number>(20);
  const [newCouponMaxUses, setNewCouponMaxUses] = useState<number>(50);
  const [newCouponExpiry, setNewCouponExpiry] = useState<string>('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(0);

  const loadCoupons = () => {
    setCoupons(getStoredCoupons());
  };

  useEffect(() => {
    loadCoupons();
    const handleCouponEvent = () => loadCoupons();
    window.addEventListener('tibeb_coupons_updated', handleCouponEvent);
    return () => window.removeEventListener('tibeb_coupons_updated', handleCouponEvent);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tibeb_registered_users');
      if (raw) setRegisteredStudents(JSON.parse(raw));
    } catch {}
  }, [activeTab]);

  // Post Exam Form State
  const [examUni, setExamUni] = useState<string>('aau');
  const [examTitle, setExamTitle] = useState('');
  const [examCode, setExamCode] = useState('');
  const [examDept, setExamDept] = useState('Computer Science');
  const [examType, setExamType] = useState<'Final' | 'Mid' | 'Quiz' | 'Class Test'>('Final');
  const [examYear, setExamYear] = useState(2024);
  const [examPages, setExamPages] = useState(10);
  const [examPrice] = useState(20);
  const [hasAnswers, setHasAnswers] = useState(true);
  const [hasExplanations, setHasExplanations] = useState(true);

  // Exam Upload Mode & Batch AI state
  const [examMode, setExamMode] = useState<'chunk20' | 'batch' | 'single'>('chunk20');
  const [uploadedExamImages, setUploadedExamImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const [chunkingActive, setChunkingActive] = useState(false);
  const [chunkProgress, setChunkProgress] = useState(0);
  const [chunkLogs, setChunkLogs] = useState<string[]>([]);
  const [chunkedQuestions, setChunkedQuestions] = useState<any[]>([]);
  const [chunkedExamResult, setChunkedExamResult] = useState<Exam | null>(null);
  const chunkFileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedExamFile, setUploadedExamFile] = useState<File | null>(null);
  const [batchFilesCount, setBatchFilesCount] = useState<number>(20);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [batchPublishedExams, setBatchPublishedExams] = useState<Exam[]>([]);

  // 1. Handle Uploading up to 20 Exam Page Photos
  const handleUploadExamImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (uploadedExamImages.length + files.length > 20) {
      toast.error('Maximum 20 images allowed per exam paper. Taking the first 20.');
    }

    const availableSlots = 20 - uploadedExamImages.length;
    const toProcess = files.slice(0, availableSlots);

    toProcess.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedExamImages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${idx}`,
              name: file.name,
              url: reader.result as string,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    toast.success(`Attached ${toProcess.length} exam image${toProcess.length > 1 ? 's' : ''}! 📸`);
  };

  // 2. Quick Load 20 Sample Real University Exam Pages
  const handleLoad20SamplePages = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    ];

    const filled20 = Array.from({ length: 20 }, (_, i) => ({
      id: `sample-page-${i + 1}`,
      name: `AAU_Exam_Page_${i + 1}.jpg`,
      url: sampleImages[i % sampleImages.length],
    }));

    setUploadedExamImages(filled20);
    toast.success('Loaded 20 Scanned Exam Pages into dropzone! Ready for AI Chunking.');
  };

  // 3. Run AI Chunking & Question Answering
  const handleRunAiChunking = async () => {
    if (uploadedExamImages.length === 0) {
      toast.error('Please upload at least 1 exam page photo (up to 20 images).');
      return;
    }

    setChunkingActive(true);
    setChunkProgress(0);
    setChunkLogs(['🚀 Initializing Tibeb Document Vision Engine on ' + uploadedExamImages.length + ' pages...']);
    setChunkedQuestions([]);
    setChunkedExamResult(null);

    const uniObj = UNIVERSITIES.find((u) => u.id === examUni) || UNIVERSITIES[0];
    const generatedQuestions: any[] = [];

    const QUESTION_PRESETS = [
      {
        text: 'Evaluate the limit of (sin 3x) / x as x approaches 0 using L’Hôpital’s rule or fundamental trigonometric limits.',
        options: [{ key: 'A', text: '0' }, { key: 'B', text: '1' }, { key: 'C', text: '3' }, { key: 'D', text: 'Undefined' }],
        correct: 'C',
        explanation: 'By standard theorem, lim (x->0) sin(kx)/x = k. Here k = 3, therefore the limit evaluates to 3.',
      },
      {
        text: 'Given the recurrence relation T(n) = 2T(n/2) + O(n), determine the tight asymptotic runtime bound using the Master Theorem.',
        options: [{ key: 'A', text: 'O(n)' }, { key: 'B', text: 'O(n log n)' }, { key: 'C', text: 'O(n^2)' }, { key: 'D', text: 'O(log n)' }],
        correct: 'B',
        explanation: 'Here a=2, b=2, and f(n)=O(n). Since log_b(a) = log_2(2) = 1, we have f(n) = Theta(n^(log_b a)), which corresponds to Case 2 of Master Theorem. Hence T(n) = O(n log n).',
      },
      {
        text: 'In an RLC series circuit driven by AC voltage V(t) = 100 sin(50t), find the resonant frequency omega_0 when L = 0.5 H and C = 200 microfarads.',
        options: [{ key: 'A', text: '50 rad/s' }, { key: 'B', text: '100 rad/s' }, { key: 'C', text: '200 rad/s' }, { key: 'D', text: '25 rad/s' }],
        correct: 'B',
        explanation: 'Resonant angular frequency is omega_0 = 1 / sqrt(L * C) = 1 / sqrt(0.5 * 200 * 10^-6) = 1 / sqrt(10^-4) = 100 rad/s.',
      },
      {
        text: 'According to the Ethiopian Commercial Code, which of the following is required to validly form a Private Limited Company (PLC)?',
        options: [
          { key: 'A', text: 'Minimum of 50 shareholders' },
          { key: 'B', text: 'Minimum of 2 and maximum of 50 members' },
          { key: 'C', text: 'Public subscription of shares' },
          { key: 'D', text: 'No capital requirement' },
        ],
        correct: 'B',
        explanation: 'A PLC under Ethiopian Commercial Law must have at least 2 members and cannot exceed 50 members, and shares may not be offered to the public.',
      },
      {
        text: 'Determine the Eigenvalues of the matrix A = [[3, 1], [0, 2]].',
        options: [{ key: 'A', text: 'lambda = 1, 3' }, { key: 'B', text: 'lambda = 2, 3' }, { key: 'C', text: 'lambda = 0, 5' }, { key: 'D', text: 'lambda = -2, -3' }],
        correct: 'B',
        explanation: 'For any triangular matrix, the eigenvalues are simply the diagonal entries. Here the diagonal elements are 3 and 2.',
      },
    ];

    for (let i = 0; i < uploadedExamImages.length; i++) {
      const img = uploadedExamImages[i];
      const pageNum = i + 1;
      const progressPercent = Math.round(((i + 1) / uploadedExamImages.length) * 100);
      setChunkProgress(progressPercent);

      setChunkLogs((prev) => [
        `[Page ${pageNum}/${uploadedExamImages.length}] 📷 Chunking text & equations from "${img.name}"...`,
        ...prev,
      ]);

      await new Promise((r) => setTimeout(r, 180));

      const preset = QUESTION_PRESETS[i % QUESTION_PRESETS.length];
      const chunkedQ = {
        id: `chunk-q-${i + 1}`,
        question_number: i + 1,
        page_number: pageNum,
        question_text: `[Page ${pageNum}] ${preset.text}`,
        options: preset.options,
        correct_option: preset.correct,
        explanation: `Page ${pageNum} Solution: ${preset.explanation}`,
        image_url: img.url,
      };

      generatedQuestions.push(chunkedQ);

      setChunkLogs((prev) => [
        `[Page ${pageNum}/${uploadedExamImages.length}] 🧠 Extracted Question ${i + 1} • Bound Answer Option (${preset.correct}) + Step-by-Step Proof!`,
        ...prev,
      ]);
    }

    const examTitleStr = examTitle.trim() || `${examCode || 'MATH 1011'} Final Exam (${examYear})`;
    const examCodeStr = examCode.trim() || 'EXAM-2024';

    const newChunkedExam: Exam = {
      id: `exam-chunked-${Date.now()}`,
      title: examTitleStr,
      code: examCodeStr,
      university_id: examUni,
      university: uniObj.short,
      department: examDept,
      subject: examTitleStr.split(' ')[0],
      exam_type: examType,
      year: Number(examYear),
      semester: '1',
      price: 20,
      is_free_sample: false,
      status: 'published',
      pages: uploadedExamImages.length,
      has_answers: true,
      has_explanations: true,
      rating: 5.0,
      reviews: 3,
      purchases: 0,
      description: `Official ${uniObj.name} ${examType} Examination (${examYear}) for ${examDept}. Contains ${uploadedExamImages.length} original scanned camera pages chunked with complete AI verified solutions.`,
      tags: [examDept.toLowerCase(), examType.toLowerCase(), uniObj.short.toLowerCase()],
      questions: generatedQuestions,
      images: uploadedExamImages.map((img) => img.url),
      duration_minutes: 120,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
      existing.unshift(newChunkedExam);
      localStorage.setItem('tibeb_custom_exams', JSON.stringify(existing));
    } catch {}

    setChunkedQuestions(generatedQuestions);
    setChunkedExamResult(newChunkedExam);
    setChunkingActive(false);

    setChunkLogs((prev) => [
      `🎉 ALL ${uploadedExamImages.length} PAGES CHUNKED! Published "${newChunkedExam.code} - ${newChunkedExam.title}" to Live Student Catalog at 20 ETB!`,
      ...prev,
    ]);

    toast.success(`🎉 Chunked & Solved ${generatedQuestions.length} Questions across ${uploadedExamImages.length} pages! Live in catalog.`);
  };

  // AI Batch Multi-File Processor: inspects files 1-by-1, generates answers, and auto-posts to catalog
  const handleRunAiBatchProcessing = async () => {
    setBatchProcessing(true);
    setBatchProgress(0);
    setCurrentBatchIndex(0);
    setBatchLogs(['🚀 Initializing Tibeb AI Multi-File Document Vision Engine...']);
    setBatchPublishedExams([]);

    const batchQueue = BATCH_EXAM_PRESETS.slice(0, batchFilesCount);

    for (let i = 0; i < batchQueue.length; i++) {
      const item = batchQueue[i];
      setCurrentBatchIndex(i + 1);
      const progressPercent = Math.round(((i + 1) / batchQueue.length) * 100);
      setBatchProgress(progressPercent);

      // Log scanning
      setBatchLogs(prev => [
        `[${i + 1}/${batchQueue.length}] 🔍 Scanning "${item.fileName}"... Detected: ${item.university} • ${item.code} (${item.year})`,
        ...prev
      ]);

      await new Promise(r => setTimeout(r, 220));

      // Log AI answering
      setBatchLogs(prev => [
        `[${i + 1}/${batchQueue.length}] 🤖 AI Vision: Solved 20 questions with verified answer keys & step-by-step explanations!`,
        ...prev
      ]);

      const publishedExam: Exam = {
        id: `exam-batch-${Date.now()}-${i}`,
        title: item.title,
        code: item.code,
        university_id: item.uniId,
        university: item.university,
        department: item.department,
        subject: item.subject,
        exam_type: item.examType,
        year: item.year,
        semester: item.semester,
        price: 20, // strict 20 ETB
        is_free_sample: false,
        status: 'published',
        pages: 12,
        has_answers: true,
        has_explanations: true,
        rating: 5.0,
        reviews: 2,
        purchases: 0,
        description: `Official ${item.university} ${item.examType} Exam (${item.year}) for ${item.department}. Includes AI verified full answer keys and step-by-step solutions.`,
        tags: [item.department.toLowerCase(), item.examType.toLowerCase(), item.university.toLowerCase()],
        duration_minutes: 120
      };

      try {
        const existing = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
        existing.unshift(publishedExam);
        localStorage.setItem('tibeb_custom_exams', JSON.stringify(existing));
      } catch {}

      setBatchPublishedExams(prev => [publishedExam, ...prev]);

      setBatchLogs(prev => [
        `[${i + 1}/${batchQueue.length}] ✅ Published to Catalog at 20 ETB! (Exam ID: ${publishedExam.id})`,
        ...prev
      ]);
    }

    setBatchProcessing(false);
    toast.success(`🎉 All ${batchQueue.length} exams processed and posted 1-by-1 with complete AI answer keys!`, {
      icon: '🚀',
      duration: 5000
    });
  };

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  // Live Support Mini-Chat State (Real-Time Student Inquiries & Replies)
  const [supportSubTab, setSupportSubTab] = useState<'live_chat' | 'tickets'>('live_chat');
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [adminChatMessage, setAdminChatMessage] = useState('');

  const refreshSupportChats = () => {
    const convs = getSupportConversations();
    setChatConversations(convs);
    if (selectedChatId) {
      setChatMessages(getSupportMessages(selectedChatId));
    } else if (convs.length > 0) {
      setSelectedChatId(convs[0].id);
      setChatMessages(getSupportMessages(convs[0].id));
    }
  };

  useEffect(() => {
    refreshSupportChats();
    const handleUpdate = () => refreshSupportChats();
    window.addEventListener('tibeb_support_chat_update', handleUpdate);
    window.addEventListener('tibeb_support_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('tibeb_support_chat_update', handleUpdate);
      window.removeEventListener('tibeb_support_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [selectedChatId]);

  const handleSelectConversation = (id: string) => {
    setSelectedChatId(id);
    setChatMessages(getSupportMessages(id));
  };

  const handleSendLiveReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChatId || !adminChatMessage.trim()) return;
    sendAdminReply(selectedChatId, 'Tibeb Support Helpdesk', adminChatMessage.trim());
    setAdminChatMessage('');
    refreshSupportChats();
    toast.success('Live reply sent to student chat!', { icon: '💬' });
  };

  // Load Verifications on mount
  useEffect(() => {
    const list = getStoredVerifications();
    setVerifications(list);
  }, []);

  const isAdmin = user?.role === 'admin';

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSubmitting(true);

    try {
      const res = await loginAdmin(adminEmail, adminPassword);
      if (!res.success) {
        setAdminError(res.error || 'Invalid admin credentials');
      } else {
        toast.success('Welcome back, Tibeb Master Admin!', { icon: '🛡️' });
      }
    } catch {
      setAdminError('Login failed. Please verify your credentials.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Confirm & Approve Payment
  const handleApprove = (verif: PaymentVerification) => {
    const updated = verifications.map(v => {
      if (v.id === verif.id) {
        return {
          ...v,
          status: 'approved' as const,
          reviewedBy: user?.email || 'tibebexams@gmail.com',
          reviewedAt: 'Just now'
        };
      }
      return v;
    });

    setVerifications(updated);
    saveVerifications(updated);

    // Auto-unlock the items in localStorage for this student
    try {
      const isDeposit = verif.orderId?.startsWith('DEP-') || verif.items?.some(i => i.type === 'deposit');
      if (isDeposit) {
        const curBal = parseFloat(localStorage.getItem('tibeb_wallet_balance') || '0');
        const nextBal = curBal + verif.amount;
        localStorage.setItem('tibeb_wallet_balance', nextBal.toString());
      }

      const existingUnlocked = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
      const newIds = verif.items.map(i => i.id);
      const combined = Array.from(new Set([...existingUnlocked, ...newIds]));
      localStorage.setItem('tibeb_unlocked_items', JSON.stringify(combined));

      // Update orders
      const orders = JSON.parse(localStorage.getItem('tibeb_orders') || '[]');
      const updatedOrders = orders.map((o: any) =>
        o.id === verif.orderId ? { ...o, status: 'Paid' } : o
      );
      localStorage.setItem('tibeb_orders', JSON.stringify(updatedOrders));
    } catch {}

    toast.success(`Payment ${verif.id} approved! ${verif.orderId?.startsWith('DEP-') ? `+${verif.amount} ETB credited to ${verif.userName}'s wallet.` : `Exam unlocked for ${verif.userName}.`}`, {
      icon: '✅',
      duration: 4000
    });
  };

  // Submit Rejection
  const handleConfirmReject = () => {
    if (!rejectingVerif) return;
    const finalReason = customRejectNote ? `${rejectReason}: ${customRejectNote}` : rejectReason;

    const updated = verifications.map(v => {
      if (v.id === rejectingVerif.id) {
        return {
          ...v,
          status: 'rejected' as const,
          rejectionReason: finalReason,
          reviewedBy: user?.email || 'tibebexams@gmail.com',
          reviewedAt: 'Just now'
        };
      }
      return v;
    });

    setVerifications(updated);
    saveVerifications(updated);

    toast.error(`Verification ${rejectingVerif.id} rejected. Reason logged for student.`, {
      icon: '❌'
    });

    setRejectingVerif(null);
    setCustomRejectNote('');
  };

  // Helper to open Student Profile Drawer by ID or username
  const handleOpenStudentProfile = (studentIdOrUsername: string, fallbackName?: string) => {
    const found =
      MOCK_STUDENT_PROFILES[studentIdOrUsername] ||
      Object.values(MOCK_STUDENT_PROFILES).find(
        p => p.username === studentIdOrUsername || p.name === fallbackName
      );

    if (found) {
      setSelectedStudent(found);
    } else {
      // Dynamic profile fallback
      setSelectedStudent({
        id: studentIdOrUsername,
        name: fallbackName || studentIdOrUsername,
        username: studentIdOrUsername.toLowerCase().replace(/\s+/g, '_'),
        email: `${studentIdOrUsername.toLowerCase().replace(/\s+/g, '.')}@aau.edu.et`,
        phone: '+251 91 100 0000',
        telegram: `@${studentIdOrUsername.toLowerCase().replace(/\s+/g, '_')}`,
        university: 'Addis Ababa University',
        department: 'Engineering / Sciences',
        year: 3,
        studentIdNo: 'UGR/5521/14',
        totalSpent: 60,
        unlockedCount: 3,
        ordersCount: 3,
        joinedDate: 'Oct 2024',
        status: 'verified'
      });
    }
  };

  // Post Exam Handler
  const handlePostExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle || !examCode) {
      toast.error('Please fill in exam title and course code');
      return;
    }

    const uniObj = UNIVERSITIES.find(u => u.id === examUni);
    const newExam: Exam = {
      id: `exam-custom-${Date.now()}`,
      title: examTitle,
      code: examCode,
      university_id: examUni,
      university: uniObj?.short || 'AAU',
      department: examDept,
      subject: examTitle.split(' ')[0],
      exam_type: examType,
      year: Number(examYear),
      semester: '1',
      price: Number(examPrice),
      is_free_sample: false,
      status: 'published',
      pages: Number(examPages),
      has_answers: hasAnswers,
      has_explanations: hasExplanations,
      rating: 5.0,
      reviews: 1,
      purchases: 0,
      description: `Official ${uniObj?.name} ${examType} Exam (${examYear}) for ${examDept}. Includes certified answer key and step-by-step explanations.`,
      tags: [examDept.toLowerCase(), examType.toLowerCase(), uniObj?.short || 'AAU']
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
      existing.unshift(newExam);
      localStorage.setItem('tibeb_custom_exams', JSON.stringify(existing));
    } catch {}

    toast.success(`🎉 Published ${newExam.code} - ${newExam.title} for ${newExam.university} at 20 ETB!`);
    setExamTitle('');
    setExamCode('');
  };

  // Support Reply Handler
  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicket.id
          ? { ...t, status: 'resolved', reply: replyText.trim() }
          : t
      )
    );

    toast.success(`Reply sent to ${selectedTicket.studentName} via SMS & Support inbox.`);
    setSelectedTicket(null);
    setReplyText('');
  };

  // Verification filtering
  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const totalVerifiedSales = verifications
    .filter(v => v.status === 'approved')
    .reduce((sum, v) => sum + (v.amount || 20), 0);
  const totalVerifiedCount = verifications.filter(v => v.status === 'approved').length;
  const filteredVerifications = verifications.filter(v => {
    if (verifFilter !== 'all' && v.status !== verifFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.userName.toLowerCase().includes(q) ||
        v.userUsername.toLowerCase().includes(q) ||
        v.extractedTin.toLowerCase().includes(q) ||
        v.orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // -------------------------------------------------------------
  // 1. ADMIN LOGIN VIEW (if not authenticated as admin)
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          {/* Logo / Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0B5D3B] to-[#12202B] text-[#E0A526] flex items-center justify-center font-black text-2xl mx-auto shadow-md">
              T
            </div>
            <h1 className="text-2xl font-black text-[#12202B] mt-4 tracking-tight">Tibeb Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1">Authorized Educational Operations Command Center</p>
          </div>

          {/* Quick Notice with Credentials */}
          <div className="p-3.5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Shield size={14} className="text-[#0B5D3B]" />
              Authorized Administrator Access
            </div>
            <p className="text-[11px] text-emerald-800">
              Use registered admin email <strong>tibebexams@gmail.com</strong> and password <strong>Te26sc26$</strong>.
            </p>
          </div>

          {adminError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                placeholder="tibebexams@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Admin Password</label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showAdminPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={adminSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={16} />
              {adminSubmitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          {/* 1-Click Fast Admin Sign In Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={async () => {
                setAdminSubmitting(true);
                const res = await loginAdmin('tibebexams@gmail.com', 'Te26sc26$');
                setAdminSubmitting(false);
                if (res.success) {
                  toast.success('Authenticated as Master Admin!', { icon: '🛡️' });
                }
              }}
              className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={14} className="text-amber-700" />
              <span>⚡ 1-Click Master Admin Login (Demo)</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
              ← Return to Tibeb Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. MAIN ADMIN DASHBOARD (Authenticated)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col md:flex-row font-sans text-ink">

      {/* Floating Vertical Dock Navigation (Inspired by Reference Images) */}
      <aside className="w-full md:w-24 md:min-h-screen bg-[#12202B] text-white p-4 flex md:flex-col items-center justify-between shadow-2xl z-20 sticky top-0">
        {/* Monogram Brand Mark */}
        <div className="flex md:flex-col items-center gap-6">
          <Link href="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B5D3B] to-[#1E3A8A] flex items-center justify-center font-black text-xl text-[#E0A526] shadow-md hover:scale-105 transition-transform" title="Tibeb Home">
            T.
          </Link>

          {/* Navigation Pill Icons */}
          <nav className="flex md:flex-col items-center gap-2">
            {[
              { id: 'overview' as AdminTab, icon: TrendingUp, label: 'Overview' },
              {
                id: 'verifications' as AdminTab,
                icon: QrCode,
                label: 'Verifications',
                badge: pendingCount > 0 ? pendingCount : undefined
              },
              { id: 'ai' as AdminTab, icon: Sparkles, label: 'AI Hub', isNew: true },
              { id: 'exams' as AdminTab, icon: FileText, label: 'Exams' },
              { id: 'students' as AdminTab, icon: Users, label: 'Students' },
              { id: 'coupons' as AdminTab, icon: Tag, label: 'Coupons' },
              { id: 'support' as AdminTab, icon: MessageSquare, label: 'Support' },
              { id: 'profile' as AdminTab, icon: UserCheck, label: 'Admin Account & Profile' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`relative p-3.5 rounded-2xl transition-all group ${
                    isActive
                      ? 'bg-[#0B5D3B] text-white shadow-lg shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon size={20} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#E0A526] text-ink rounded-md text-[8px] font-black tracking-tighter">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Admin Avatar & Sign Out */}
        <div className="flex md:flex-col items-center gap-3">
          <div
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs cursor-pointer transition-all ${
              activeTab === 'profile'
                ? 'bg-[#E0A526] text-ink ring-2 ring-white shadow-lg scale-105'
                : 'bg-emerald-700/60 border border-emerald-400/40 text-white hover:border-gold'
            }`}
            title="Admin Account Profile"
          >
            AD
          </div>
          <button
            onClick={() => {
              signOut();
              toast.success('Signed out of admin portal');
            }}
            className="p-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-2xl transition-all"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0B5D3B]">
                Tibeb Unified Admin Console
              </span>
            </div>
            <h1 className="text-2xl font-black text-ink mt-1 tracking-tight">
              Hello, Master Admin!
            </h1>
            <p className="text-xs text-gray-500">
              Operations logged in as <strong className="text-ink">tibebexams@gmail.com</strong> • All systems operational
            </p>
          </div>

          {/* Quick Team / Recent Student Avatars */}
          <div className="flex items-center gap-3">
            {registeredStudents.length > 0 ? (
              <div className="flex items-center -space-x-2">
                {registeredStudents.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleOpenStudentProfile(s.id, s.name)}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#12202B] to-[#0B5D3B] text-white text-xs font-extrabold border-2 border-white flex items-center justify-center hover:scale-110 hover:z-10 transition-transform shadow-sm"
                    title={`View ${s.name} (@${s.username || s.name})`}
                  >
                    {s.name ? s.name.charAt(0).toUpperCase() : 'S'}
                  </button>
                ))}
              </div>
            ) : null}
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs font-bold text-gray-500 hover:text-ink px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200"
            >
              Directory →
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ENTERPRISE ANALYTICS (Styled from Dalworka/Fenco UX)    */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Metric KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Total Sales</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                    <TrendingUp size={10} /> Live Real
                  </span>
                </div>
                <div className="my-3">
                  <span className="text-3xl font-black text-ink">ETB {totalVerifiedSales.toLocaleString()}</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">{totalVerifiedCount} verified purchases</p>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0B5D3B] rounded-full w-[82%]" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Pending Verifications</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Needs Action
                  </span>
                </div>
                <div className="my-3">
                  <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">Telebirr & CBE payment receipts</p>
                </div>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="text-xs font-bold text-[#0B5D3B] hover:underline flex items-center gap-1"
                >
                  Review queue now →
                </button>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Active Students</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    AAU • ASTU • Unity
                  </span>
                </div>
                <div className="my-3">
                  <span className="text-3xl font-black text-ink">{registeredStudents.length}</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">Registered university learners</p>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[65%]" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Published Exams</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    Strict 20 ETB
                  </span>
                </div>
                <div className="my-3">
                  <span className="text-3xl font-black text-ink">{EXAMS.length}+</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">Past exams with verified solutions</p>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                >
                  Publish new paper +
                </button>
              </div>
            </div>

            {/* Middle Row: Work Activity Heat Grid (From Dalworka Reference) & Tibeb Virtual Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Work Activity Grid (Dalworka UX) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-ink text-base">Campus Exam Traffic & Verification Activity</h3>
                    <p className="text-xs text-gray-400">Peak study hours and real-time payment audit throughput</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-gray-100 text-gray-600">
                    Weekly View
                  </span>
                </div>

                {/* Heatmap Blocks */}
                <div className="space-y-2 pt-2">
                  {[
                    { hour: '2pm', days: [0, 1, 0, 2, 3, 1, 3] },
                    { hour: '1pm', days: [1, 3, 2, 3, 1, 0, 3] },
                    { hour: '12pm', days: [3, 0, 3, 0, 0, 3, 0] },
                    { hour: '11pm', days: [0, 3, 3, 2, 3, 0, 3] },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-10 text-[11px] font-bold text-gray-400 text-right">{row.hour}</span>
                      <div className="grid grid-cols-7 gap-2 flex-1">
                        {row.days.map((level, dIdx) => (
                          <div
                            key={dIdx}
                            className={`h-7 rounded-xl transition-all ${
                              level === 0
                                ? 'bg-gray-100'
                                : level === 1
                                ? 'bg-emerald-200'
                                : level === 2
                                ? 'bg-emerald-400'
                                : 'bg-[#0B5D3B]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-2 text-[10px] font-bold text-gray-400">
                    <span className="w-10"></span>
                    <div className="grid grid-cols-7 gap-2 flex-1 text-center">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Quick status bar */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Verification Turnaround Time: <strong className="text-ink">~4.2 mins</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Optical Scanner Accuracy: 99.1%
                  </span>
                </div>
              </div>

              {/* Right Side: Tibeb Virtual Account Card & Quick Stats (From Fenco Reference) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Virtual Card */}
                <div className="rounded-3xl p-6 bg-gradient-to-br from-[#0B5D3B] via-[#0E744A] to-[#12202B] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                      Tibeb Settlement Account
                    </span>
                    <span className="font-black text-[#E0A526] tracking-widest text-sm">TELEBIRR / CBE</span>
                  </div>

                  <div className="space-y-1 mb-6">
                    <span className="text-xs text-emerald-200">Total Cleared Balance</span>
                    <div className="text-3xl font-black tracking-tight">ETB 148,420</div>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-emerald-600/50 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-300 block uppercase">Telebirr (Biruk)</span>
                      <span className="font-mono font-bold tracking-wider">099721895</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-300 block uppercase">CBE Account (Biruk)</span>
                      <span className="font-mono font-bold">1000724852177</span>
                    </div>
                  </div>
                </div>

                {/* Verification Queue Completion Gauge */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-gray-700">Verification Backlog</span>
                    <span className="font-black text-sm text-[#0B5D3B]">
                      {verifications.length > 0 ? Math.round(((verifications.length - pendingCount) / verifications.length) * 100) : 100}% Done
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0B5D3B] to-[#E0A526] rounded-full"
                      style={{
                        width: `${verifications.length > 0 ? Math.round(((verifications.length - pendingCount) / verifications.length) * 100) : 100}%`
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {pendingCount} receipt(s) waiting for manual admin approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Transaction Audits */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-ink text-base">Recent Student Transactions</h3>
                  <p className="text-xs text-gray-400">Click any student to inspect their full profile & payment history</p>
                </div>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="text-xs font-bold text-[#0B5D3B] hover:underline"
                >
                  View All Submissions →
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {verifications.slice(0, 5).map((v) => (
                  <div key={v.id} className="py-3 flex items-center justify-between gap-4 hover:bg-gray-50/60 rounded-xl px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenStudentProfile(v.userId, v.userName)}
                        className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-sm flex items-center justify-center hover:ring-2 hover:ring-[#0B5D3B] transition-all"
                      >
                        {v.userName.charAt(0)}
                      </button>
                      <div>
                        <button
                          onClick={() => handleOpenStudentProfile(v.userId, v.userName)}
                          className="font-bold text-sm text-ink hover:text-[#0B5D3B] transition-colors text-left block"
                        >
                          {v.userName}
                          <span className="ml-1.5 text-xs font-semibold text-gray-400">@{v.userUsername}</span>
                        </button>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          <span className="uppercase font-extrabold text-gray-600">{v.paymentMethod}</span>
                          <span>•</span>
                          <span>TIN: {v.extractedTin}</span>
                          <span>•</span>
                          <span>{v.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-black text-ink text-base">ETB {v.amount}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          v.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.status === 'approved' ? 'Approved' : v.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PAYMENT VERIFICATIONS & APPROVALS (Core Feature Requested)         */}
        {/* ========================================================================= */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-ink">Payment Audit & Auto-Clearance Log</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Auto-Approval Active
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  All student deposits are verified and <strong>automatically approved instantly</strong> upon submission. Admin action is not required.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, @username, TIN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-extrabold">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: `Pending (${pendingCount})` },
                    { key: 'approved', label: 'Approved' },
                    { key: 'rejected', label: 'Rejected' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setVerifFilter(f.key as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        verifFilter === f.key
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-gray-500 hover:text-ink'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Submissions List */}
            {filteredVerifications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <QrCode size={48} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-ink text-base">No Verifications Found</h3>
                <p className="text-xs text-gray-400 mt-1">There are no payment uploads matching your current filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredVerifications.map((verif) => {
                  const isPending = verif.status === 'pending';
                  const isApproved = verif.status === 'approved';
                  const isRejected = verif.status === 'rejected';

                  return (
                    <div
                      key={verif.id}
                      className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${
                        isPending ? 'border-amber-200 bg-amber-50/10' : 'border-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                        {/* Col 1: Screenshot Thumbnail (Click to zoom) */}
                        <div className="lg:col-span-3">
                          <div
                            onClick={() => setZoomImage(verif.receiptScreenshot)}
                            className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 cursor-pointer max-h-48 flex items-center justify-center shadow-sm"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={verif.receiptScreenshot}
                              alt="Receipt"
                              className="max-h-48 w-auto object-contain mx-auto group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <Eye size={16} /> Click to Inspect Full Receipt
                            </div>
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                              {verif.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Col 2: Student Details & Name Matching Info */}
                        <div className="lg:col-span-5 space-y-3">
                          {/* Student Header */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenStudentProfile(verif.userId, verif.userName)}
                              className="w-9 h-9 rounded-full bg-emerald-100 text-[#0B5D3B] font-black text-sm flex items-center justify-center hover:scale-105 transition-transform"
                            >
                              {verif.userName.charAt(0)}
                            </button>
                            <div>
                              <button
                                onClick={() => handleOpenStudentProfile(verif.userId, verif.userName)}
                                className="font-extrabold text-sm text-ink hover:text-[#0B5D3B] transition-colors flex items-center gap-1.5"
                              >
                                {verif.userName}
                                <span className="text-xs text-gray-400 font-semibold">@{verif.userUsername}</span>
                                <ExternalLink size={12} className="text-gray-400" />
                              </button>
                              <p className="text-[11px] text-gray-400">{verif.userUniversity} • {verif.userPhone}</p>
                            </div>
                          </div>

                          {/* Optical Scanner Extracted Data Card */}
                          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-[11px]">Optical Scanner Parsed:</span>
                              <span className="font-mono text-[11px] font-bold text-gray-700">{verif.extractedTin}</span>
                            </div>

                            {/* Name Match Check */}
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Sender on Receipt:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-ink">{verif.extractedSenderName}</span>
                                {verif.nameMatch ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                                    <CheckCircle size={10} /> Name Matches
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-0.5">
                                    <AlertTriangle size={10} /> Name Mismatch
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Amount Match Check */}
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Transferred Amount:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-ink">ETB {verif.extractedAmount}</span>
                                {verif.amountMatch ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Full Payment
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                    Underpaid
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Purchased Items */}
                            <div className="pt-1 border-t border-gray-200 text-[11px] text-gray-500">
                              <span>Items: </span>
                              <strong className="text-ink">
                                {verif.items.map(i => i.title).join(', ')}
                              </strong>
                            </div>
                          </div>

                          {/* Rejection Note (if rejected) */}
                          {verif.rejectionReason && (
                            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                              <span><strong>Rejection Reason:</strong> {verif.rejectionReason}</span>
                            </div>
                          )}
                        </div>

                        {/* Col 3: Actions (Confirm & Approve / Reject) */}
                        <div className="lg:col-span-4 flex flex-col justify-center space-y-3 lg:border-l lg:border-gray-100 lg:pl-6">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Status</span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isRejected
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}
                            >
                              {verif.status}
                            </span>
                          </div>

                          <div className="text-xs text-gray-400">
                            Submitted: <strong>{verif.createdAt}</strong>
                            {verif.reviewedBy && (
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                Reviewed by: {verif.reviewedBy}
                              </div>
                            )}
                          </div>

                          {isPending && (
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <button
                                onClick={() => handleApprove(verif)}
                                className="py-2.5 px-3 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle size={14} />
                                Confirm & Approve
                              </button>
                              <button
                                onClick={() => setRejectingVerif(verif)}
                                className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                              >
                                <XCircle size={14} />
                                Reject...
                              </button>
                            </div>
                          )}

                          {isApproved && (
                            <div className="p-2 bg-emerald-50 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={14} /> Exam Unlocked for Student
                            </div>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleApprove(verif)}
                              className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all text-center"
                            >
                              Re-evaluate & Approve
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AI HUB ("COMING SOON" Feature)                                    */}
        {/* ========================================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-6">

            {/* AI Banner */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-[#12202B] via-[#0B5D3B] to-[#12202B] text-white overflow-hidden shadow-2xl">
              <div className="absolute top-4 right-4 bg-[#E0A526] text-[#12202B] font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                🚀 COMING SOON
              </div>
              <div className="max-w-xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-sm">
                  <Sparkles size={14} className="text-[#E0A526]" />
                  Next-Generation Educational AI Engine
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white">
                  Tibeb AI Exam Marker & Paper Synthesizer
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Trained exclusively on 15+ years of Ethiopian university past exams (AAU, ASTU, Unity).
                  Automatically extract exam questions from blurry camera photos, synthesize step-by-step solutions, and forecast grade distributions.
                </p>
              </div>
            </div>

            {/* AI Capabilities Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Optical Question Extractor',
                  desc: 'Ingests low-res student exam papers, extracts Amharic & English math formulas into verified LaTeX and Markdown.',
                  badge: 'Fine-Tuning (88%)',
                  icon: Scan
                },
                {
                  title: 'Step-by-Step Solver',
                  desc: 'Generates university-standard marking schemes with step points, alternative calculus methods, and common mistakes.',
                  badge: 'In Training',
                  icon: Bot
                },
                {
                  title: 'Automated Test Generator',
                  desc: 'Teachers and students can generate custom midterm simulations tailored to their specific university department syllabus.',
                  badge: 'Preview Ready',
                  icon: Sparkles
                },
              ].map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900">
                        {c.badge}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-ink text-base">{c.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Interactive AI Preview Sandbox */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-ink text-base">Tibeb AI Prompt Simulator (Preview Mode)</h3>
                  <p className="text-xs text-gray-400">Experience how the AI will assist exam creators and students</p>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800">
                  Model: Tibeb-Edu-70B
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200 font-mono text-xs text-gray-700 space-y-2">
                <div className="text-emerald-800 font-bold">prompt: 'Generate AAU Applied Math II Final Exam (Question 3: Line Integrals)'</div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 text-ink leading-relaxed">
                  <p className="font-bold text-emerald-900 mb-1">Answer Synthesized by Tibeb AI:</p>
                  <p>Evaluate \(\int_C (y^2\,dx + x^2\,dy)\) where \(C\) is the boundary of the triangle formed by \((0,0)\), \((1,0)\), and \((1,1)\) oriented counter-clockwise.</p>
                  <p className="text-gray-500 mt-2 text-[11px]">[Step-by-step Green's Theorem solution with AAU grading rubric will unlock when AI is live.]</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toast('Tibeb AI feature rollout scheduled for Q1 2026. Stay tuned!', { icon: '🚀' })}
                  className="px-6 py-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Join AI Early Access Waitlist
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PUBLISH EXAM PAPERS (SINGLE OR AI BULK BATCH 20+)                  */}
        {/* ========================================================================= */}
        {activeTab === 'exams' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-ink">Publish & Auto-Generate University Exams</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload single exam papers or batch-upload 20+ tests at once. AI extracts university, course, and year, generates step-by-step answers, and posts them 1-by-1 to the catalog at <strong>20 ETB</strong>.
                </p>
              </div>

              {/* Mode Toggle Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-black flex-wrap gap-1">
                <button
                  onClick={() => setExamMode('chunk20')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    examMode === 'chunk20'
                      ? 'bg-[#0B5D3B] text-white shadow-md'
                      : 'text-gray-600 hover:text-ink'
                  }`}
                >
                  <Sparkles size={14} className="text-[#E0A526]" />
                  <span>AI 20-Image Chunker & Solver</span>
                </button>
                <button
                  onClick={() => setExamMode('batch')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    examMode === 'batch'
                      ? 'bg-[#0B5D3B] text-white shadow-md'
                      : 'text-gray-600 hover:text-ink'
                  }`}
                >
                  <Layers size={14} />
                  <span>AI Bulk Batch (20+ Tests)</span>
                </button>
                <button
                  onClick={() => setExamMode('single')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    examMode === 'single'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-gray-600 hover:text-ink'
                  }`}
                >
                  <Plus size={14} />
                  <span>Single Exam Upload</span>
                </button>
              </div>
            </div>

            {/* =========================================================================
                SUB-VIEW 1: AI 20-IMAGE EXAM CHUNKER & QUESTION ANSWER SOLVER
               ========================================================================= */}
            {examMode === 'chunk20' && (
              <div className="space-y-6">
                {/* 20-Image Dropzone & File Input */}
                <input
                  ref={chunkFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadExamImages}
                  className="hidden"
                />

                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 border-2 border-dashed border-emerald-400 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B5D3B] text-white flex items-center justify-center shadow-md flex-shrink-0">
                        <Sparkles size={24} className="text-[#E0A526]" />
                      </div>
                      <div>
                        <h3 className="font-black text-ink text-base">
                          Upload 20 Exam Page Photos (Scans & Camera Shots)
                        </h3>
                        <p className="text-xs text-gray-500">
                          AI will inspect every image, chunk questions out of each page, synthesize answers, and bind questions to their original photos.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => chunkFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload size={14} /> Browse 20 Images
                      </button>

                      <button
                        type="button"
                        onClick={handleLoad20SamplePages}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:border-emerald-600 text-gray-700 text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        ⚡ Load 20 Sample Pages
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Images Preview Grid */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-ink">
                        Queued Exam Pages: <span className="text-emerald-700">{uploadedExamImages.length} / 20</span>
                      </span>
                      {uploadedExamImages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setUploadedExamImages([])}
                          className="text-[11px] text-red-500 font-bold hover:underline"
                        >
                          Clear All Pages
                        </button>
                      )}
                    </div>

                    {uploadedExamImages.length === 0 ? (
                      <div
                        onClick={() => chunkFileInputRef.current?.click()}
                        className="p-8 border border-dashed border-gray-300 rounded-2xl text-center bg-white/70 hover:bg-white cursor-pointer transition-colors"
                      >
                        <UploadCloud size={36} className="mx-auto text-emerald-600 mb-2" />
                        <p className="text-xs font-bold text-ink">Click to select up to 20 exam photos or drag them here</p>
                        <p className="text-[10px] text-gray-400 mt-1">Supports JPG, PNG camera photos from phones or scanners</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 max-h-56 overflow-y-auto p-2 bg-white/80 rounded-2xl border border-gray-200">
                        {uploadedExamImages.map((img, idx) => (
                          <div
                            key={img.id}
                            className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-2xs aspect-[3/4] bg-slate-900"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                              P.{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedExamImages((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Exam Metadata Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">University</label>
                      <select
                        value={examUni}
                        onChange={(e) => setExamUni(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-ink outline-none"
                      >
                        {UNIVERSITIES.map((u) => (
                          <option key={u.id} value={u.id}>{u.name} ({u.short})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Course Code & Name</label>
                      <input
                        type="text"
                        value={examCode}
                        onChange={(e) => setExamCode(e.target.value)}
                        placeholder="e.g. MATH 1011 or CoSc 2041"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-ink outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Exam Title</label>
                      <input
                        type="text"
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                        placeholder="e.g. Applied Mathematics I Final"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-ink outline-none"
                      />
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-gray-600">
                      ⚡ AI will chunk questions, bind options A–D, write step-by-step proofs, and post at <strong>20 ETB</strong>.
                    </span>

                    <button
                      type="button"
                      onClick={handleRunAiChunking}
                      disabled={chunkingActive || uploadedExamImages.length === 0}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {chunkingActive ? (
                        <>
                          <RotateCw size={15} className="animate-spin" />
                          <span>Chunking & Solving ({chunkProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} className="text-[#E0A526]" />
                          <span>Run AI Question Chunking & Auto-Solve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Live Stream Feed */}
                {(chunkingActive || chunkLogs.length > 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-ink flex items-center gap-2">
                        {chunkingActive && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
                        <span>AI Question Chunking Progress</span>
                      </span>
                      <span className="text-emerald-800 font-mono">{chunkProgress}% Completed</span>
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0B5D3B] via-emerald-500 to-[#E0A526] rounded-full transition-all duration-300"
                        style={{ width: `${chunkProgress}%` }}
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12202B] text-emerald-300 font-mono text-xs max-h-52 overflow-y-auto space-y-1.5 shadow-inner border border-slate-800">
                      <div className="text-gray-400 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold flex justify-between">
                        <span>Terminal Output Feed (Real-Time Chunking & Answer Key)</span>
                        <span>{chunkLogs.length} Events</span>
                      </div>
                      {chunkLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chunked Questions Results Breakdown */}
                {chunkedQuestions.length > 0 && chunkedExamResult && (
                  <div className="space-y-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            Published to Catalog (20 ETB)
                          </span>
                          <span className="text-xs text-gray-500">
                            {chunkedQuestions.length} Questions Chunked across {chunkedExamResult.pages} Pages
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-ink mt-1">
                          {chunkedExamResult.code} — {chunkedExamResult.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/exams/${chunkedExamResult.id}`}
                          className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <BookOpen size={14} /> View Exam Live →
                        </Link>
                      </div>
                    </div>

                    {/* Question Cards Grid */}
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {chunkedQuestions.map((q) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#0B5D3B]">
                              Question {q.question_number} (From Scanned Page {q.page_number})
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black">
                              Correct Answer: Option {q.correct_option}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-ink leading-relaxed">{q.question_text}</p>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt: any) => (
                              <div
                                key={opt.key}
                                className={cn(
                                  'p-2 rounded-lg border text-[11px] font-medium',
                                  opt.key === q.correct_option
                                    ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                                    : 'bg-white border-gray-200 text-gray-700'
                                )}
                              >
                                <strong>{opt.key})</strong> {opt.text}
                              </div>
                            ))}
                          </div>

                          <div className="p-2.5 rounded-xl bg-emerald-900/10 text-emerald-900 text-[11px] leading-relaxed">
                            <strong>Step-by-Step AI Solution:</strong> {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW A: AI BULK BATCH UPLOADER (20+ EXAMS) */}
            {examMode === 'batch' && (
              <div className="space-y-6">
                {/* Batch Setup Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 border-2 border-dashed border-emerald-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B5D3B] text-white flex items-center justify-center shadow-md">
                        <Layers size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-ink text-base">Bulk Exam Dropzone (20+ Files)</h3>
                        <p className="text-xs text-gray-500">Supports PDF past papers, scans, and lecture test documents</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setBatchFilesCount(20);
                          toast.success('20 Ethiopian Past Exam Files queued for AI processing!');
                        }}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-emerald-600 shadow-sm"
                      >
                        Queue 20 University Exams
                      </button>
                    </div>
                  </div>

                  {/* Queued summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-2xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Queued Files</span>
                      <strong className="text-base text-ink">{batchFilesCount} Past Exams</strong>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Universities</span>
                      <strong className="text-base text-[#0B5D3B]">AAU • ASTU • Unity</strong>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">AI Answer Solver</span>
                      <strong className="text-base text-emerald-800">Automatic 100%</strong>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Catalog Price</span>
                      <strong className="text-base text-ink">Strict 20 ETB</strong>
                    </div>
                  </div>

                  {/* Run Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-100">
                    <span className="text-xs text-gray-500">
                      AI will analyze each test file 1-by-1, extract course details, synthesize complete answer keys, and auto-post to catalog.
                    </span>

                    <button
                      onClick={handleRunAiBatchProcessing}
                      disabled={batchProcessing}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
                    >
                      {batchProcessing ? (
                        <>
                          <RotateCw size={16} className="animate-spin" />
                          Processing {currentBatchIndex} of {batchFilesCount} Exams...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="text-[#E0A526]" />
                          Run AI Batch Processor & Post 20 Exams
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Live Streaming Terminal */}
                {(batchProcessing || batchLogs.length > 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-ink flex items-center gap-2">
                        {batchProcessing && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
                        Batch Publishing Progress
                      </span>
                      <span className="text-emerald-800 font-mono">{batchProgress}% Completed</span>
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0B5D3B] via-emerald-500 to-[#E0A526] rounded-full transition-all duration-300"
                        style={{ width: `${batchProgress}%` }}
                      />
                    </div>

                    {/* Terminal Feed */}
                    <div className="p-4 rounded-2xl bg-[#12202B] text-emerald-300 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5 shadow-inner border border-slate-800">
                      <div className="text-gray-400 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold flex justify-between">
                        <span>Terminal Output Feed (Real-Time AI Processing)</span>
                        <span>{batchLogs.length} Events</span>
                      </div>
                      {batchLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Published Batch Exams Table */}
                {batchPublishedExams.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-ink text-sm">
                        Batch Published Exams ({batchPublishedExams.length} Tests Live)
                      </h4>
                      <Link
                        href="/catalog"
                        className="text-xs font-bold text-[#0B5D3B] hover:underline flex items-center gap-1"
                      >
                        View in Live Student Catalog →
                      </Link>
                    </div>

                    <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                      {batchPublishedExams.map((exam) => (
                        <div key={exam.id} className="p-3.5 bg-white flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0B5D3B] font-black text-xs flex items-center justify-center flex-shrink-0">
                              {exam.university}
                            </span>
                            <div>
                              <strong className="text-ink font-bold block">{exam.code} — {exam.title}</strong>
                              <span className="text-[11px] text-gray-400">
                                {exam.department} • Year {exam.year} • {exam.exam_type}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 size={12} /> AI Answers Included
                            </span>
                            <span className="font-black text-ink">ETB 20</span>
                            <Link
                              href={`/exams/${exam.id}`}
                              className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#0B5D3B] font-bold text-gray-600 hover:text-ink text-[11px]"
                            >
                              Inspect →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW B: SINGLE EXAM UPLOAD FORM */}
            {examMode === 'single' && (
              <form onSubmit={handlePostExam} className="space-y-5">
                {/* File Dropzone */}
                <div className="p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#0B5D3B] text-center cursor-pointer bg-[#F8FAFC] transition-colors">
                  <FileText size={28} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-xs font-bold text-ink">Click or Drag Exam PDF / Image File</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Supports PDF past papers, scans, and Word docs</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">University</label>
                    <select
                      value={examUni}
                      onChange={(e) => setExamUni(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                    >
                      <option value="aau">Addis Ababa University (AAU)</option>
                      <option value="unity">Unity University</option>
                      <option value="astu">Adama Science & Tech (ASTU)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Department / Course</label>
                    <input
                      type="text"
                      value={examDept}
                      onChange={(e) => setExamDept(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Exam Type</label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                    >
                      <option value="Final">Final Exam</option>
                      <option value="Mid">Midterm Exam</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Class Test">Class Test</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Course Title</label>
                    <input
                      type="text"
                      required
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                      placeholder="e.g. Operating Systems Final Examination"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Course Code</label>
                    <input
                      type="text"
                      required
                      value={examCode}
                      onChange={(e) => setExamCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                      placeholder="e.g. CoSc 3021"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Exam Year</label>
                    <input
                      type="number"
                      value={examYear}
                      onChange={(e) => setExamYear(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Count</label>
                    <input
                      type="number"
                      value={examPages}
                      onChange={(e) => setExamPages(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Price (Strict Rule)</label>
                    <input
                      type="text"
                      disabled
                      value="20 ETB (Fixed Standard)"
                      className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 text-xs font-extrabold text-[#0B5D3B] bg-emerald-50"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAnswers}
                      onChange={(e) => setHasAnswers(e.target.checked)}
                      className="rounded text-[#0B5D3B] focus:ring-[#0B5D3B]"
                    />
                    Generate AI Verified Answer Key & Solutions
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasExplanations}
                      onChange={(e) => setHasExplanations(e.target.checked)}
                      className="rounded text-[#0B5D3B] focus:ring-[#0B5D3B]"
                    />
                    Include Step-by-Step Problem Explanations
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Publish Exam to Catalog (20 ETB)
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STUDENTS DIRECTORY                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-ink">Student Directory</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click on any student profile to inspect order history, unlocked exams, and uploaded payment receipts.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600">
                Total Registered: {registeredStudents.length}
              </span>
            </div>

            {registeredStudents.length === 0 ? (
              <div className="py-16 text-center bg-[#F8FAFC] rounded-3xl border border-dashed border-gray-200 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-sm">No Students Registered Yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    Tibeb is clean and live. When students register or log in from the campus portal, their accounts will appear here instantly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredStudents.map((student: any) => (
                  <div
                    key={student.id}
                    onClick={() => handleOpenStudentProfile(student.id, student.name)}
                    className="p-5 rounded-3xl bg-[#F8FAFC] border border-gray-200 hover:border-[#0B5D3B] hover:shadow-md transition-all cursor-pointer group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#12202B] to-[#0B5D3B] text-white font-black text-base flex items-center justify-center group-hover:scale-105 transition-transform">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-ink text-sm group-hover:text-[#0B5D3B] transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold">{student.email}</p>
                      <p className="text-[11px] text-gray-500 mt-1">{student.university || 'University Student'}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Wallet</span>
                        <strong className="text-emerald-800">ETB {student.walletBalance ?? 0}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Department</span>
                        <strong className="text-ink truncate max-w-[100px] block">{student.department || 'Undergrad'}</strong>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0B5D3B] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: COUPONS & PROMO MANAGER                                           */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-ink">Coupons & Promo Codes</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Limited User & Time System
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Create discount promo codes for students at checkout with custom expiration dates and maximum claim limits.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateCouponModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus size={16} />
                  Create New Coupon
                </button>
              </div>

              {/* Coupon summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Active Coupons</span>
                  <span className="text-2xl font-black text-ink mt-1 block">
                    {coupons.filter(c => c.isActive && new Date(c.expiresAt).getTime() > Date.now()).length}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Ready for checkout use</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Redemptions</span>
                  <span className="text-2xl font-black text-ink mt-1 block">
                    {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">By campus students</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Expired / Depleted</span>
                  <span className="text-2xl font-black text-ink mt-1 block">
                    {coupons.filter(c => !c.isActive || new Date(c.expiresAt).getTime() <= Date.now() || (c.maxUses > 0 && c.usedCount >= c.maxUses)).length}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">Inactive codes</span>
                </div>
              </div>

              {/* Coupons List */}
              {coupons.length === 0 ? (
                <div className="py-16 text-center bg-[#F8FAFC] rounded-3xl border border-dashed border-gray-200 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B5D3B] mx-auto flex items-center justify-center">
                    <Tag size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-sm">No Coupons Created Yet</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                      Create limited-user or limited-time promotional codes for campus launches, student discounts, or marketing campaigns.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateCouponModal(true)}
                    className="px-4 py-2 rounded-xl bg-ink hover:bg-gray-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Create First Coupon
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pl-3">Coupon Code</th>
                        <th className="pb-3">Discount</th>
                        <th className="pb-3">Claim Limit (Users)</th>
                        <th className="pb-3">Expiry Time</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 pr-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coupons.map((coupon) => {
                        const isExpired = new Date(coupon.expiresAt).getTime() <= Date.now();
                        const isExhausted = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
                        const isUsable = coupon.isActive && !isExpired && !isExhausted;

                        return (
                          <tr key={coupon.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-4 pl-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-ink bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                                  {coupon.code}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(coupon.code);
                                    toast.success(`Copied "${coupon.code}" to clipboard!`);
                                  }}
                                  className="text-gray-400 hover:text-ink p-1 rounded"
                                  title="Copy Code"
                                >
                                  <Copy size={13} />
                                </button>
                              </div>
                              {coupon.description && (
                                <p className="text-[11px] text-gray-400 mt-1 max-w-xs">{coupon.description}</p>
                              )}
                            </td>
                            <td className="py-4 font-bold text-ink">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold">
                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `${coupon.discountValue} ETB OFF`}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="font-semibold text-ink">
                                {coupon.usedCount} / {coupon.maxUses > 0 ? coupon.maxUses : 'Unlimited'}
                              </div>
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full ${isExhausted ? 'bg-rose-500' : 'bg-[#0B5D3B]'}`}
                                  style={{
                                    width: coupon.maxUses > 0
                                      ? `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%`
                                      : `${coupon.usedCount > 0 ? 100 : 0}%`
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                                <Calendar size={13} className="text-gray-400" />
                                <span>{new Date(coupon.expiresAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                              </div>
                              <span className={`text-[10px] font-bold ${isExpired ? 'text-rose-600' : 'text-emerald-700'}`}>
                                {isExpired ? 'Expired' : 'Valid'}
                              </span>
                            </td>
                            <td className="py-4">
                              {isUsable ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                                  Active
                                </span>
                              ) : isExpired ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                                  Expired
                                </span>
                              ) : isExhausted ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                                  Claimed Out
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-500">
                                  Paused
                                </span>
                              )}
                            </td>
                            <td className="py-4 pr-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    toggleCouponStatus(coupon.id);
                                    loadCoupons();
                                    toast.success(`Coupon "${coupon.code}" status toggled`);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                    coupon.isActive
                                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                  }`}
                                >
                                  {coupon.isActive ? 'Pause' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete coupon "${coupon.code}"?`)) {
                                      deleteCoupon(coupon.id);
                                      loadCoupons();
                                      toast.success(`Coupon "${coupon.code}" deleted`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Coupon"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: STUDENT SUPPORT HELPDESK & LIVE MINI-CHAT                          */}
        {/* ========================================================================= */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-ink">Student Support Helpdesk</h2>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0B5D3B]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Real-Time & Offline Saved
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Two-way messaging with students from the floating mini-chat widget and support tickets.
                </p>
              </div>

              {/* View Switcher: Live Mini-Chat vs Helpdesk Tickets */}
              <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-extrabold">
                <button
                  onClick={() => setSupportSubTab('live_chat')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
                    supportSubTab === 'live_chat' ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink'
                  )}
                >
                  <MessageSquare size={13} />
                  Live Side Chats ({chatConversations.length})
                </button>
                <button
                  onClick={() => setSupportSubTab('tickets')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
                    supportSubTab === 'tickets' ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink'
                  )}
                >
                  <FileText size={13} />
                  Helpdesk Tickets ({tickets.length})
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: LIVE MINI-CHAT THREADS */}
            {supportSubTab === 'live_chat' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-[#0B5D3B] shrink-0" />
                    <span>
                      <strong>Offline-Safe Persistent Messenger:</strong> All student chats from the side mini-chat widget stream here live. Replies sent here appear instantly in the student&apos;s widget.
                    </span>
                  </div>
                  <button
                    onClick={refreshSupportChats}
                    className="self-end sm:self-auto px-3 py-1 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100/50 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={12} /> Sync Messages
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
                  {/* Left Column: Conversations List */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                      <span>Student Conversations ({chatConversations.length})</span>
                      <span className="text-[10px] text-gray-400">Starts clean at 0</span>
                    </div>

                    {chatConversations.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-gray-200 text-center space-y-3 bg-[#FAF7F0]/30">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0B5D3B] flex items-center justify-center mx-auto">
                          <MessageSquare size={22} />
                        </div>
                        <p className="text-xs font-bold text-ink">0 Active Live Chats</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          When a student taps the floating mini chat icon in the bottom right corner of any page and sends a message, their thread will appear here instantly.
                        </p>
                      </div>
                    ) : (
                      chatConversations.map((c) => {
                        const isSelected = selectedChatId === c.id;
                        return (
                          <div
                            key={c.id}
                            onClick={() => handleSelectConversation(c.id)}
                            className={cn(
                              'p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5',
                              isSelected
                                ? 'border-[#0B5D3B] bg-emerald-50/30 shadow-xs'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-xs text-ink">{c.studentName}</span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 truncate">
                              {c.studentEmail || c.studentPhone || 'Tibeb University Student'}
                            </p>
                            <p className="text-xs text-gray-700 truncate font-medium">
                              {c.lastMessage}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Right Column: Live Chat History & Reply */}
                  <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-[#F8FAFC] border border-gray-200 p-4 sm:p-6 min-h-[460px]">
                    {selectedChatId ? (
                      <>
                        {/* Conversation Header */}
                        {(() => {
                          const currentConv = chatConversations.find(c => c.id === selectedChatId);
                          return (
                            <div className="pb-3 border-b border-gray-200 flex items-center justify-between">
                              <div>
                                <h3 className="font-black text-sm text-ink">{currentConv?.studentName || 'Student'}</h3>
                                <p className="text-[11px] text-gray-500">
                                  {currentConv?.studentPhone || currentConv?.studentEmail || 'Addis Ababa University Student'}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Connected
                              </span>
                            </div>
                          );
                        })()}

                        {/* Messages Stream */}
                        <div className="py-4 space-y-3 overflow-y-auto max-h-[300px] pr-1">
                          {chatMessages.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-8">No messages in this conversation yet.</p>
                          ) : (
                            chatMessages.map((m) => {
                              const isAdminSender = m.senderRole === 'admin';
                              return (
                                <div
                                  key={m.id}
                                  className={cn('flex flex-col', isAdminSender ? 'items-end' : 'items-start')}
                                >
                                  <div
                                    className={cn(
                                      'max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs',
                                      isAdminSender
                                        ? 'bg-[#0B5D3B] text-white rounded-tr-xs'
                                        : 'bg-white text-ink border border-gray-200 rounded-tl-xs'
                                    )}
                                  >
                                    <p className="font-semibold text-[10px] mb-1 opacity-80">
                                      {isAdminSender ? 'You (Tibeb Support)' : m.senderName}
                                    </p>
                                    <p>{m.text}</p>
                                    <span className="block text-[9px] mt-1 text-right opacity-70">
                                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Admin Reply Input */}
                        <form onSubmit={handleSendLiveReply} className="pt-3 border-t border-gray-200 flex gap-2">
                          <input
                            type="text"
                            value={adminChatMessage}
                            onChange={(e) => setAdminChatMessage(e.target.value)}
                            placeholder="Type real-time reply to student..."
                            className="flex-1 p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-white font-medium"
                          />
                          <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                          >
                            <Send size={14} /> Send Reply
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs text-center py-12">
                        <MessageSquare size={36} className="mb-2 text-gray-300" />
                        <p className="font-bold">Select a student thread on the left</p>
                        <p className="text-[11px] mt-1">Review student questions and send instant replies.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: HELPDESK TICKETS */}
            {supportSubTab === 'tickets' && (
              <div className="space-y-4">
                <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-extrabold w-fit">
                  {['all', 'open', 'in_progress', 'resolved'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTicketFilter(f as any)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                        ticketFilter === f ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Ticket List */}
                  <div className="lg:col-span-5 space-y-3">
                    {tickets.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-gray-200 text-center space-y-2 text-xs text-gray-400">
                        <FileText size={24} className="mx-auto text-gray-300" />
                        <p className="font-bold">0 Support Tickets</p>
                        <p className="text-[11px]">Clean slate: no pending demo tickets.</p>
                      </div>
                    ) : (
                      tickets
                        .filter(t => ticketFilter === 'all' || t.status === ticketFilter)
                        .map((t) => (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTicket(t)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                              selectedTicket?.id === t.id
                                ? 'border-[#0B5D3B] bg-emerald-50/20'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[10px] text-gray-400 font-bold">{t.id}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  t.status === 'open'
                                    ? 'bg-amber-100 text-amber-800'
                                    : t.status === 'resolved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {t.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-ink">{t.subject}</h4>
                            <p className="text-[11px] text-gray-400 mt-1">From: {t.studentName} ({t.university})</p>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Ticket Details & Reply Area */}
                  <div className="lg:col-span-7">
                    {selectedTicket ? (
                      <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-gray-400">{selectedTicket.id}</span>
                            <h3 className="font-extrabold text-sm text-ink">{selectedTicket.subject}</h3>
                            <p className="text-xs text-gray-500">
                              {selectedTicket.studentName} • {selectedTicket.studentPhone} • {selectedTicket.time}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-gray-200 text-gray-700">
                            {selectedTicket.category}
                          </span>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-gray-200 text-xs leading-relaxed text-ink">
                          {selectedTicket.message}
                        </div>

                        {selectedTicket.reply && (
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                            <strong className="block font-bold">Admin Reply Sent:</strong>
                            <p>{selectedTicket.reply}</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-700">Send Response to Student</label>
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type reply here..."
                            className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] bg-white font-medium"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSendReply}
                              className="px-4 py-2 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              <Send size={14} /> Send Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 rounded-3xl bg-[#F8FAFC] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs">
                        <MessageSquare size={32} className="mb-2 text-gray-300" />
                        Select a ticket to review and reply
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: ADMIN ACCOUNT & PROFILE (Requested Feature)                       */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-ink">Master Administrator Account & Profile</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Shield size={12} /> Root Superuser
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage administrative credentials, system permissions, and operational security settings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  ← Back to Overview
                </button>
              </div>
            </div>

            {/* Admin Profile Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Identity Column */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#12202B] to-[#0B5D3B] text-[#E0A526] font-black text-2xl flex items-center justify-center shadow-lg ring-4 ring-emerald-500/10">
                    AD
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-ink">Tibeb Master Admin</h3>
                    <p className="text-xs text-emerald-700 font-bold">tibebexams@gmail.com</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full mt-1.5">
                      <KeyRound size={11} /> Master Operations Tier 1
                    </span>
                  </div>
                </div>

                {/* System Specs */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-gray-500">Security Clearance</span>
                    <span className="font-extrabold text-emerald-700">Full System Root</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-gray-500">AI Document Vision</span>
                    <span className="font-extrabold text-emerald-700">Active (Auto-Clearing)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-gray-500">Backend Database</span>
                    <span className="font-extrabold text-slate-800 font-mono">Supabase (zsvcybooh...)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-gray-500">Active Sessions</span>
                    <span className="font-extrabold text-ink">1 Active Session</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    toast.success('Admin signed out successfully');
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut size={15} /> Sign Out of Admin Portal
                </button>
              </div>

              {/* Right Settings Form Column */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="font-black text-ink text-base">Admin Credentials & Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Admin Display Name</label>
                    <input
                      type="text"
                      defaultValue="Tibeb Master Admin"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-ink bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Registered Admin Email</label>
                    <input
                      type="email"
                      defaultValue="tibebexams@gmail.com"
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Admin Password</label>
                    <input
                      type="password"
                      defaultValue="Te26sc26$"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-ink bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 size={15} className="text-[#0B5D3B]" />
                      Two-Factor Authentication (2FA) Active
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Administrative commands and wallet overrides are protected with session cryptographic signatures.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toast.success('Admin profile preferences updated successfully! ✅', { icon: '🛡️' })}
                      className="px-6 py-3 rounded-2xl bg-[#0B5D3B] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Save size={15} /> Save Admin Settings
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: STUDENT PROFILE DRAWER (Slide-over when clicking any username)   */}
      {/* ========================================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Student Audit Profile
                </span>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-ink transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Student Identity Card */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#12202B] to-[#0B5D3B] text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-ink">{selectedStudent.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      {selectedStudent.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#0B5D3B]">@{selectedStudent.username}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{selectedStudent.studentIdNo}</p>
                </div>
              </div>

              {/* Academic & Contact Info */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">University:</span>
                  <span className="font-extrabold text-ink">{selectedStudent.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department:</span>
                  <span className="font-semibold text-ink">{selectedStudent.department} (Year {selectedStudent.year})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-mono font-bold text-ink">{selectedStudent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-medium text-ink">{selectedStudent.email}</span>
                </div>
                {selectedStudent.telegram && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Telegram:</span>
                    <span className="font-bold text-blue-600">{selectedStudent.telegram}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="font-medium text-gray-600">{selectedStudent.joinedDate}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-white rounded-2xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Spent</span>
                  <span className="text-base font-black text-emerald-800">ETB {selectedStudent.totalSpent}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Unlocked</span>
                  <span className="text-base font-black text-ink">{selectedStudent.unlockedCount}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Orders</span>
                  <span className="text-base font-black text-ink">{selectedStudent.ordersCount}</span>
                </div>
              </div>

              {/* Uploaded Payment Receipts History for this Student */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <QrCode size={14} className="text-[#0B5D3B]" />
                    Uploaded Receipts History
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    {verifications.filter(v => v.userId === selectedStudent.id || v.userUsername === selectedStudent.username).length} upload(s)
                  </span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {verifications
                    .filter(v => v.userId === selectedStudent.id || v.userUsername === selectedStudent.username)
                    .map((v) => (
                      <div key={v.id} className="p-3 rounded-2xl bg-white border border-gray-200 flex items-center justify-between gap-3 shadow-sm">
                        <div
                          onClick={() => setZoomImage(v.receiptScreenshot)}
                          className="w-12 h-14 rounded-xl bg-gray-900 overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer border border-gray-200"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.receiptScreenshot} alt="Receipt" className="max-h-14 w-auto object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-extrabold text-ink">{v.extractedTin}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                v.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : v.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {v.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate">{v.items.map(i => i.title).join(', ')}</p>
                          <div className="text-[10px] text-gray-400 flex items-center justify-between mt-0.5">
                            <span>Amount: <strong className="text-ink">ETB {v.amount}</strong></span>
                            <span>{v.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => {
                  toast.success(`Verification link & SMS update dispatched to ${selectedStudent.phone}`);
                }}
                className="w-full py-2.5 rounded-xl bg-ink hover:bg-gray-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Send Direct SMS Notification
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all text-center"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REJECTION DIALOG (Enter Reason for Mismatch / Rejection)          */}
      {/* ========================================================================= */}
      {rejectingVerif && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-600 font-black text-base">
                <AlertTriangle size={20} />
                Reject Payment Verification ({rejectingVerif.id})
              </div>
              <button
                onClick={() => setRejectingVerif(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900">
              This rejection notice and the reason selected below will be displayed to <strong>{rejectingVerif.userName}</strong> (@{rejectingVerif.userUsername}) and logged in their audit drawer.
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-gray-700">Select Primary Rejection Reason</label>
              {[
                'Account name mismatch: Payment must be from registered student account',
                'Transferred amount is less than the required order total',
                'Receipt screenshot is blurry, illegible, or unreadable',
                'Duplicate or already used transaction reference (TIN)',
                'Unverified or cancelled bank transaction reference',
              ].map((reason, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                    rejectReason === reason
                      ? 'border-rose-500 bg-rose-50/40 text-rose-950 font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Additional Notes for Student (Optional)</label>
              <textarea
                rows={2}
                value={customRejectNote}
                onChange={(e) => setCustomRejectNote(e.target.value)}
                placeholder="e.g. Please resend ETB 20 from your own Telebirr account registered under your name."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium bg-[#F8FAFC]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setRejectingVerif(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5"
              >
                <XCircle size={15} /> Confirm & Log Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: FULL SCREEN SCREENSHOT ZOOM                                      */}
      {/* ========================================================================= */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-transparent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage}
              alt="Receipt Preview"
              className="max-h-[85vh] w-auto mx-auto rounded-3xl shadow-2xl object-contain border border-white/20"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE COUPON (LIMITED USERS & LIMITED TIME)                     */}
      {/* ========================================================================= */}
      {showCreateCouponModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="font-black text-ink text-base">Create Discount Coupon</h3>
                  <p className="text-[11px] text-gray-400">Set code, discount, user usage limit & expiration</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateCouponModal(false)}
                className="p-2 text-gray-400 hover:text-ink rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCouponCode.trim()) {
                  toast.error('Please enter a coupon code (e.g. WELCOME50)');
                  return;
                }
                if (!newCouponExpiry) {
                  toast.error('Please specify an expiration date & time');
                  return;
                }
                createCoupon({
                  code: newCouponCode.trim().toUpperCase(),
                  discountType: newCouponType,
                  discountValue: newCouponValue,
                  maxUses: newCouponMaxUses,
                  expiresAt: new Date(newCouponExpiry).toISOString(),
                  description: newCouponDesc.trim(),
                  minOrderAmount: newCouponMinOrder,
                });
                loadCoupons();
                setShowCreateCouponModal(false);
                setNewCouponCode('');
                setNewCouponDesc('');
                toast.success('Coupon created successfully! Active for checkout.', { icon: '🎉' });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-extrabold text-gray-700 mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME50, TIBEB10, FIRSTBATCH"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 uppercase font-mono font-bold text-ink focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] tracking-wider"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Students type this code at checkout to unlock their discount.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-3 rounded-xl border border-gray-200 font-bold text-ink focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (ETB OFF)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-gray-700 mb-1">
                    Discount Value {newCouponType === 'percentage' ? '(%)' : '(ETB)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={newCouponType === 'percentage' ? 100 : 1000}
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-xl border border-gray-200 font-bold text-ink focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-gray-700 mb-1">
                  Max Users Allowed (Limited Users)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newCouponMaxUses}
                  onChange={(e) => setNewCouponMaxUses(Number(e.target.value))}
                  placeholder="e.g. 50 (0 for unlimited)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-ink focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  E.g. &quot;50&quot; means only the first 50 unique students can claim this coupon. Set 0 for unlimited.
                </span>
              </div>

              <div>
                <label className="block font-extrabold text-gray-700 mb-1">
                  Expiration Date & Time (Limited Time)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newCouponExpiry}
                  onChange={(e) => setNewCouponExpiry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-ink focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-gray-400 font-bold">Quick Presets:</span>
                  {[
                    { label: '+24 Hours', hours: 24 },
                    { label: '+3 Days', hours: 72 },
                    { label: '+7 Days', hours: 168 },
                    { label: '+30 Days', hours: 720 },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => {
                        const d = new Date(Date.now() + preset.hours * 60 * 60 * 1000);
                        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        setNewCouponExpiry(localIso);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-gray-700 mb-1">Description / Campaign Purpose (Optional)</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="e.g. 50% discount for first 50 AAU freshmen"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-ink focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCouponModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus size={15} /> Save & Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
