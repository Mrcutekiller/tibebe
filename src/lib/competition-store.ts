// src/lib/competition-store.ts
// Real-time Competition, Quiz Engine, Point System & Top 20 Leaderboard
// Awards cash prizes every month: 1st Place (1,000 ETB), 2nd Place (600 ETB), 3rd Place (300 ETB)

import { EXAMS } from './seed-data';
import { addNotification } from './notification-store';

export const COMPETITION_TEST_FEE = 5; // 5 ETB test entry fee
export const SUPPORT_PRIORITY_FEE = 5; // 5 ETB priority tutor support fee

export interface CourseQuizQuestion {
  id: string;
  question: string;
  options: { key: string; text: string }[];
  correctOption: string;
  explanation: string;
  points: number;
}

export interface CourseQuizChallenge {
  id: string;
  courseCode: string;
  courseTitle: string;
  university: string;
  department: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeSeconds: number;
  totalRewardPoints: number;
  questions: CourseQuizQuestion[];
}

export interface StudentLeaderboardEntry {
  id: string;
  name: string;
  university: string;
  department: string;
  points: number;
  avatar?: string;
  rank?: number;
  quizzesCompleted: number;
  testsPurchased: number;
  hasTelegramPremium: boolean;
  lastActive: string;
}

export const MONTHLY_PRIZES = {
  first: { place: 1, prizeEtb: 1000, label: '1,000 ETB Cash Prize', badge: '🥇 1st Place' },
  second: { place: 2, prizeEtb: 600, label: '600 ETB Cash Prize', badge: '🥈 2nd Place' },
  third: { place: 3, prizeEtb: 300, label: '300 ETB Cash Prize', badge: '🥉 3rd Place' },
};

export const POINT_REWARDS = {
  QUIZ_CORRECT_ANSWER: 20,
  QUIZ_PERFECT_BONUS: 50,
  BUY_TEST: 50,
  BUY_TELEGRAM_PREMIUM: 250, // 5* points (5 times test points!)
};

// Course Quizzes tailored for Ethiopian university students
export const COURSE_COMPETITION_QUIZZES: CourseQuizChallenge[] = [
  {
    id: 'quiz-math1011',
    courseCode: 'MATH 1011',
    courseTitle: 'Applied Mathematics & Calculus',
    university: 'AAU',
    department: 'Pre-Engineering / Mathematics',
    difficulty: 'Medium',
    timeSeconds: 180,
    totalRewardPoints: 100,
    questions: [
      {
        id: 'q1',
        question: 'What is the limit of (sin 5x) / x as x approaches 0?',
        options: [
          { key: 'A', text: '0' },
          { key: 'B', text: '1' },
          { key: 'C', text: '5' },
          { key: 'D', text: 'Does not exist' },
        ],
        correctOption: 'C',
        explanation: 'By the standard trigonometric limit theorem, lim (x->0) sin(kx)/x = k. Here k = 5.',
        points: 20,
      },
      {
        id: 'q2',
        question: 'Find the derivative of f(x) = e^(3x^2) with respect to x.',
        options: [
          { key: 'A', text: '6x e^(3x^2)' },
          { key: 'B', text: '3x e^(3x^2)' },
          { key: 'C', text: 'e^(6x)' },
          { key: 'D', text: '6x^2 e^(3x)' },
        ],
        correctOption: 'A',
        explanation: 'Using the chain rule: d/dx [e^u] = e^u * u\'. Here u = 3x^2, so u\' = 6x.',
        points: 20,
      },
      {
        id: 'q3',
        question: 'Evaluate the integral of 1 / (1 + x^2) dx from 0 to 1.',
        options: [
          { key: 'A', text: 'pi / 2' },
          { key: 'B', text: 'pi / 4' },
          { key: 'C', text: '1' },
          { key: 'D', text: 'ln(2)' },
        ],
        correctOption: 'B',
        explanation: 'The antiderivative is arctan(x). arctan(1) - arctan(0) = pi/4 - 0 = pi/4.',
        points: 20,
      },
      {
        id: 'q4',
        question: 'What are the eigenvalues of the diagonal matrix diag(4, 9)?',
        options: [
          { key: 'A', text: 'lambda = 2, 3' },
          { key: 'B', text: 'lambda = 4, 9' },
          { key: 'C', text: 'lambda = 13, 36' },
          { key: 'D', text: 'lambda = 0, 0' },
        ],
        correctOption: 'B',
        explanation: 'Eigenvalues of any diagonal matrix are strictly the diagonal entries themselves.',
        points: 20,
      },
      {
        id: 'q5',
        question: 'If a vector field F has div(F) = 0 everywhere, F is called:',
        options: [
          { key: 'A', text: 'Irrotational' },
          { key: 'B', text: 'Solenoidal (Incompressible)' },
          { key: 'C', text: 'Conservative' },
          { key: 'D', text: 'Harmonic' },
        ],
        correctOption: 'B',
        explanation: 'A vector field with zero divergence is known as a solenoidal or incompressible field.',
        points: 20,
      },
    ],
  },
  {
    id: 'quiz-cosc2041',
    courseCode: 'CoSc 2041',
    courseTitle: 'Data Structures & Algorithms',
    university: 'AAU',
    department: 'Computer Science',
    difficulty: 'Hard',
    timeSeconds: 180,
    totalRewardPoints: 100,
    questions: [
      {
        id: 'cq1',
        question: 'What is the worst-case time complexity of QuickSort when a poor pivot is selected repeatedly?',
        options: [
          { key: 'A', text: 'O(n log n)' },
          { key: 'B', text: 'O(n^2)' },
          { key: 'C', text: 'O(n)' },
          { key: 'D', text: 'O(log n)' },
        ],
        correctOption: 'B',
        explanation: 'When the partition is extremely unbalanced (e.g. pivot is always the maximum or minimum element), QuickSort degrades to O(n^2).',
        points: 20,
      },
      {
        id: 'cq2',
        question: 'Which data structure is primarily utilized for Breadth-First Search (BFS) graph traversal?',
        options: [
          { key: 'A', text: 'Stack (LIFO)' },
          { key: 'B', text: 'Queue (FIFO)' },
          { key: 'C', text: 'Priority Heap' },
          { key: 'D', text: 'Binary Search Tree' },
        ],
        correctOption: 'B',
        explanation: 'BFS explores neighbor vertices in layer order using a First-In-First-Out Queue.',
        points: 20,
      },
      {
        id: 'cq3',
        question: 'In an AVL Tree, the balance factor of any node must strictly lie within:',
        options: [
          { key: 'A', text: '[-1, 0, 1]' },
          { key: 'B', text: '[-2, 0, 2]' },
          { key: 'C', text: '[0, 1]' },
          { key: 'D', text: '[-3, 3]' },
        ],
        correctOption: 'A',
        explanation: 'By AVL tree definition, balance factor = height(left) - height(right) must be -1, 0, or 1.',
        points: 20,
      },
      {
        id: 'cq4',
        question: 'What is the tight asymptotic bound for solving T(n) = 2T(n/2) + O(n)?',
        options: [
          { key: 'A', text: 'O(n)' },
          { key: 'B', text: 'O(n log n)' },
          { key: 'C', text: 'O(n^2)' },
          { key: 'D', text: 'O(2^n)' },
        ],
        correctOption: 'B',
        explanation: 'Master Theorem case 2: log_2(2) = 1 matches exponent of O(n^1), so T(n) = Theta(n log n).',
        points: 20,
      },
      {
        id: 'cq5',
        question: 'Which collision resolution strategy keeps a linked list at each table index in hash tables?',
        options: [
          { key: 'A', text: 'Linear Probing' },
          { key: 'B', text: 'Separate Chaining' },
          { key: 'C', text: 'Quadratic Probing' },
          { key: 'D', text: 'Double Hashing' },
        ],
        correctOption: 'B',
        explanation: 'Separate chaining stores multiple collided keys in a linked list or bucket at that hash index.',
        points: 20,
      },
    ],
  },
  {
    id: 'quiz-me2011',
    courseCode: 'ME 2011',
    courseTitle: 'Engineering Thermodynamics',
    university: 'ASTU',
    department: 'Mechanical Engineering',
    difficulty: 'Medium',
    timeSeconds: 180,
    totalRewardPoints: 100,
    questions: [
      {
        id: 'mq1',
        question: 'The First Law of Thermodynamics is an expression of:',
        options: [
          { key: 'A', text: 'Conservation of Mass' },
          { key: 'B', text: 'Conservation of Energy' },
          { key: 'C', text: 'Increase of Entropy' },
          { key: 'D', text: 'Ideal Gas Law' },
        ],
        correctOption: 'B',
        explanation: 'The first law of thermodynamics states energy cannot be created or destroyed, only transformed.',
        points: 20,
      },
      {
        id: 'mq2',
        question: 'An isentropic process is defined as one that is simultaneously:',
        options: [
          { key: 'A', text: 'Isothermal and isobaric' },
          { key: 'B', text: 'Reversible and adiabatic' },
          { key: 'C', text: 'Constant volume and constant pressure' },
          { key: 'D', text: 'Irreversible and adiabatic' },
        ],
        correctOption: 'B',
        explanation: 'ds = dq_rev / T. If reversible and adiabatic (dq_rev = 0), then ds = 0 (constant entropy).',
        points: 20,
      },
      {
        id: 'mq3',
        question: 'What is the maximum theoretical efficiency limit for heat engines operating between Th and Tc?',
        options: [
          { key: 'A', text: 'Otto Efficiency' },
          { key: 'B', text: 'Carnot Efficiency = 1 - (Tc / Th)' },
          { key: 'C', text: 'Rankine Efficiency' },
          { key: 'D', text: '100% Efficiency' },
        ],
        correctOption: 'B',
        explanation: 'The Carnot cycle sets the thermodynamic upper efficiency boundary: eta = 1 - (Tc / Th).',
        points: 20,
      },
      {
        id: 'mq4',
        question: 'For an ideal gas, internal energy u depends solely on:',
        options: [
          { key: 'A', text: 'Pressure only' },
          { key: 'B', text: 'Volume only' },
          { key: 'C', text: 'Temperature only' },
          { key: 'D', text: 'Specific Volume' },
        ],
        correctOption: 'C',
        explanation: 'By Joule\'s experiment for ideal gases, internal energy is purely a function of temperature: u = u(T).',
        points: 20,
      },
      {
        id: 'mq5',
        question: 'A throttling process (e.g. expansion valve) is characterized by constant:',
        options: [
          { key: 'A', text: 'Entropy' },
          { key: 'B', text: 'Enthalpy (h1 = h2)' },
          { key: 'C', text: 'Temperature' },
          { key: 'D', text: 'Pressure' },
        ],
        correctOption: 'B',
        explanation: 'Throttling is an isenthalpic process where inlet enthalpy equals outlet enthalpy.',
        points: 20,
      },
    ],
  },
];

// Starts clean from 0 with real competitive student rankings
const INITIAL_LEADERBOARD_ENTRIES: StudentLeaderboardEntry[] = [];

const LEADERBOARD_STORAGE_KEY = 'tibeb_competition_leaderboard_v3';
const STUDENT_POINTS_STORAGE_KEY = 'tibeb_student_points';

// Retrieve student personal points
export function getStudentPoints(userId?: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STUDENT_POINTS_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'number' ? parsed : (parsed[userId || 'current'] || 0);
  } catch {
    return 0;
  }
}

// Award points to the student (e.g. from Quiz, Test Purchase, Telegram Premium)
const ALL_MOCK_NAMES = [
  'Natnael Girma', 'Blen Tesfaye', 'Kidus Yohannes', 'Selamawit Bekele',
  'Yared Haile', 'Tsion Alemu', 'Mekdelawit Desta', 'Henok Melaku',
  'Eden Berhanu', 'Eyob Kebede', 'Rahel Fekadu', 'Dawit Mengistu',
  'Saron Worku', 'Kalkidan Bekele', 'Elias Tilahun', 'Marta Assefa',
  'Abel Solomon', 'Bethelhem Negash', 'Surafel Wolde', 'Lidya Zewdu',
  'Abebe Bikila', 'Selamawit D.', 'Dawit Haile', 'Hana T.', 'Yohannes K.',
  'Bethelhem M.', 'Ephrem G.', 'Rahel B.', 'Natnael W.', 'Tsion A.',
  'Kidus F.', 'Marta T.', 'Samuel D.', 'Hiwot Z.', 'Biniyam E.',
  'Lydia G.', 'Surafel M.', 'Frehiwot N.', 'Robel S.', 'Senait K.'
];

// Award points to the student (e.g. from Quiz, Test Purchase, Telegram Premium)
export function awardStudentPoints(
  userId: string,
  userName: string,
  pointsToAdd: number,
  reason: 'quiz' | 'test_purchase' | 'telegram_premium',
  extraMeta?: { university?: string; department?: string }
): { newTotal: number; previousTotal: number } {
  if (typeof window === 'undefined') return { newTotal: pointsToAdd, previousTotal: 0 };

  const current = getStudentPoints(userId);
  const next = current + pointsToAdd;

  try {
    localStorage.setItem(STUDENT_POINTS_STORAGE_KEY, JSON.stringify(next));

    // Update or insert real competitor into active leaderboard
    let board: StudentLeaderboardEntry[] = [];
    try {
      const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (raw) board = JSON.parse(raw);
    } catch {}

    // Filter out any mock entries
    board = board.filter(e => !e.id.startsWith('lead-') && !ALL_MOCK_NAMES.includes(e.name));

    const existingIdx = board.findIndex(e => e.id === userId || e.name === userName);
    if (existingIdx >= 0) {
      board[existingIdx].points = next;
      board[existingIdx].quizzesCompleted = (board[existingIdx].quizzesCompleted || 0) + (reason === 'quiz' ? 1 : 0);
      board[existingIdx].testsPurchased = (board[existingIdx].testsPurchased || 0) + (reason === 'test_purchase' ? 1 : 0);
      if (reason === 'telegram_premium') board[existingIdx].hasTelegramPremium = true;
      if (extraMeta?.university) board[existingIdx].university = extraMeta.university;
      if (extraMeta?.department) board[existingIdx].department = extraMeta.department;
    } else {
      board.push({
        id: userId,
        name: userName,
        university: extraMeta?.university || 'AAU',
        department: extraMeta?.department || 'Enrolled Student',
        points: next,
        quizzesCompleted: reason === 'quiz' ? 1 : 0,
        testsPurchased: reason === 'test_purchase' ? 1 : 0,
        hasTelegramPremium: reason === 'telegram_premium',
        lastActive: 'Just now',
      });
    }

    // Sort strictly by points descending
    board.sort((a, b) => b.points - a.points);
    board.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(board));
    window.dispatchEvent(new Event('tibeb_student_points_updated'));
    window.dispatchEvent(new Event('tibeb_competition_leaderboard_updated'));
    window.dispatchEvent(new Event('storage'));

    try {
      const rankInfo = getLeaderboardData({ id: userId, name: userName });
      if (rankInfo.userRank === 1) {
        addNotification({
          userId,
          title: '🥇 You Took 1st Place!',
          message: 'Congratulations! You are now #1 on the Monthly Leaderboard with ' + next + ' pts. Keep competing to win 1,000 ETB!',
          type: 'leaderboard',
          link: '/dashboard/competition',
        });
      } else if (rankInfo.userRank <= 3) {
        addNotification({
          userId,
          title: '🏆 Podium Rank #' + rankInfo.userRank + '!',
          message: 'You climbed to #' + rankInfo.userRank + ' on the Leaderboard (' + next + ' pts)! You qualify for cash rewards.',
          type: 'leaderboard',
          link: '/dashboard/competition',
        });
      }
    } catch {}

    // Also update student point history transactions
    const history = JSON.parse(localStorage.getItem('tibeb_point_history') || '[]');
    history.unshift({
      id: `pt-${Date.now()}`,
      points: pointsToAdd,
      reason,
      description:
        reason === 'telegram_premium'
          ? `⚡ Telegram Premium Purchase (+${pointsToAdd} 5* Bonus Points)`
          : reason === 'test_purchase'
          ? `📚 Exam Paper Unlock (+${pointsToAdd} Points)`
          : `🎯 Course Quiz Completed (+${pointsToAdd} Points)`,
      date: new Date().toISOString(),
    });
    localStorage.setItem('tibeb_point_history', JSON.stringify(history));

    // Update active user object
    const uRaw = localStorage.getItem('tibeb_user');
    if (uRaw) {
      const u = JSON.parse(uRaw);
      u.competition_points = next;
      localStorage.setItem('tibeb_user', JSON.stringify(u));
    }
  } catch {}

  return { newTotal: next, previousTotal: current };
}

// Retrieve real-time Leaderboard with real active students who have joined and earned points
export function getLeaderboardData(currentStudent?: {
  id: string;
  name: string;
  university?: string;
  department?: string;
  avatar_url?: string;
} | null): {
  top20: StudentLeaderboardEntry[];
  currentUserEntry: StudentLeaderboardEntry;
  userRank: number;
  isUserInTop20: boolean;
  pointsToTop20: number;
  seasonMonth: string;
} {
  // Purge any old legacy mock leaderboard from localStorage
  if (typeof window !== 'undefined') {
    try {
      const oldRaw = localStorage.getItem('tibeb_competition_leaderboard');
      if (oldRaw && (oldRaw.includes('Natnael Girma') || oldRaw.includes('lead-1') || oldRaw.includes('1420'))) {
        localStorage.removeItem('tibeb_competition_leaderboard');
      }
    } catch {}
  }

  let storedBoard: StudentLeaderboardEntry[] = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (raw) storedBoard = JSON.parse(raw);
    } catch {}
  }

  // Strictly filter out any mock/demo entries by ID or name
  storedBoard = storedBoard.filter(
    e => !e.id.startsWith('lead-') && !ALL_MOCK_NAMES.includes(e.name)
  );

  // Ingest all real registered accounts that have joined and have earned points
  if (typeof window !== 'undefined') {
    try {
      const rawUsers = localStorage.getItem('tibeb_registered_users');
      if (rawUsers) {
        const regList: any[] = JSON.parse(rawUsers);
        regList.forEach((u) => {
          if (!u || !u.name || ALL_MOCK_NAMES.includes(u.name)) return;
          const pts = getStudentPoints(u.id) || u.competition_points || 0;
          if (pts <= 0) return; // Only rank users who have earned points

          const existingIdx = storedBoard.findIndex(
            (b) => b.id === u.id || b.name.toLowerCase() === u.name.toLowerCase()
          );
          if (existingIdx >= 0) {
            storedBoard[existingIdx].points = Math.max(storedBoard[existingIdx].points, pts);
            if (u.university_id) storedBoard[existingIdx].university = u.university_id.toUpperCase();
            if (u.department) storedBoard[existingIdx].department = u.department;
            if (u.avatar_url) storedBoard[existingIdx].avatar = u.avatar_url;
          } else {
            storedBoard.push({
              id: u.id || `usr-${Math.random().toString(36).substring(2, 7)}`,
              name: u.name,
              university: u.university_id ? u.university_id.toUpperCase() : 'AAU',
              department: u.department || 'Enrolled Student',
              points: pts,
              avatar: u.avatar_url,
              quizzesCompleted: Math.floor(pts / 20),
              testsPurchased: 0,
              hasTelegramPremium: false,
              lastActive: 'Recently',
            });
          }
        });
      }
    } catch {}
  }

  // Ingest active student if they have earned points
  const studentId = currentStudent?.id || 'current-student';
  const studentName = currentStudent?.name || 'You (Tibeb Student)';
  const userPoints = getStudentPoints(studentId);

  if (currentStudent && currentStudent.name && userPoints > 0) {
    const existingIndex = storedBoard.findIndex((e) => e.id === studentId || e.name === studentName);
    if (existingIndex >= 0) {
      storedBoard[existingIndex].points = Math.max(storedBoard[existingIndex].points, userPoints);
      storedBoard[existingIndex].name = studentName;
      if (currentStudent.university) storedBoard[existingIndex].university = currentStudent.university;
      if (currentStudent.department) storedBoard[existingIndex].department = currentStudent.department;
      if (currentStudent.avatar_url) storedBoard[existingIndex].avatar = currentStudent.avatar_url;
    } else {
      storedBoard.push({
        id: studentId,
        name: studentName,
        university: currentStudent.university || 'AAU',
        department: currentStudent.department || 'Enrolled Student',
        points: userPoints,
        avatar: currentStudent.avatar_url,
        quizzesCompleted: Math.floor(userPoints / 20),
        testsPurchased: 0,
        hasTelegramPremium: false,
        lastActive: 'Just now',
      });
    }
  }

  // Strictly keep only competitors who joined and have points > 0
  storedBoard = storedBoard.filter(e => e.points > 0);

  // Sort strictly descending by total points
  storedBoard.sort((a, b) => b.points - a.points);

  // Assign ranks
  storedBoard.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  // Save the cleaned real board
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(storedBoard));
    } catch {}
  }

  const userRankIndex = storedBoard.findIndex((e) => e.id === studentId || e.name === studentName);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : (userPoints > 0 ? storedBoard.length + 1 : 0);
  const currentUserEntry: StudentLeaderboardEntry = (userRankIndex >= 0 ? storedBoard[userRankIndex] : null) || {
    id: studentId,
    name: studentName,
    university: currentStudent?.university || 'AAU',
    department: currentStudent?.department || 'General Studies',
    points: userPoints,
    rank: userRank || 1,
    quizzesCompleted: 0,
    testsPurchased: 0,
    hasTelegramPremium: false,
    lastActive: 'Just now',
  };

  // Only take top 20 users for the main visible leaderboard
  const top20 = storedBoard.slice(0, 20);
  const isUserInTop20 = userPoints > 0 ? (userRank > 0 && userRank <= 20) : false;

  // Compute points needed to overtake the 20th place or 1st place
  const thresholdPoints = top20.length >= 20 ? top20[19].points : (top20[0]?.points || 50);
  const pointsToTop20 = Math.max(0, thresholdPoints - userPoints + 10);

  const seasonMonth = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return {
    top20,
    currentUserEntry,
    userRank,
    isUserInTop20,
    pointsToTop20,
    seasonMonth,
  };
}


// Generates personalized randomized tests for each student derived from tests they have purchased
export function getStudentPersonalizedChallenges(userId?: string): CourseQuizChallenge[] {
  const result: CourseQuizChallenge[] = [];

  // 1. Check purchased/unlocked exams for this student
  if (typeof window !== 'undefined') {
    try {
      const unlockedIds: string[] = JSON.parse(localStorage.getItem('tibeb_unlocked_items') || '[]');
      const customExams: any[] = JSON.parse(localStorage.getItem('tibeb_custom_exams') || '[]');
      const allExams = [...customExams, ...EXAMS];

      const purchasedExams = allExams.filter(e => unlockedIds.includes(e.id) && e.questions && e.questions.length > 0);

      purchasedExams.forEach((exam) => {
        // Randomize questions for this student so each test is unique
        const shuffledQuestions = [...exam.questions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map((q: any, idx: number) => ({
            id: `purchased-${q.id || idx}-${Math.random().toString(36).substring(2, 6)}`,
            question: q.question_text || q.text || 'Solve the following academic question:',
            options: (q.options || [
              { key: 'A', text: 'Option A' },
              { key: 'B', text: 'Option B' },
              { key: 'C', text: 'Option C' },
              { key: 'D', text: 'Option D' },
            ]).slice().sort(() => 0.5 - Math.random()),
            correctOption: q.correct_option || q.correct || 'A',
            explanation: q.explanation || 'Verified university proof & step-by-step solution.',
            points: 20,
          }));

        if (shuffledQuestions.length > 0) {
          result.push({
            id: `challenge-${exam.id}-${Date.now().toString().slice(-4)}`,
            courseCode: exam.code || 'COURSE',
            courseTitle: `${exam.title} (Your Purchased Course Test)`,
            university: exam.university || 'AAU',
            department: exam.department || 'Enrolled Course',
            difficulty: 'Medium',
            timeSeconds: 180,
            totalRewardPoints: shuffledQuestions.length * 20,
            questions: shuffledQuestions,
          });
        }
      });
    } catch (e) {
      console.error('Error generating personalized challenges:', e);
    }
  }

  // 2. Also include and randomize questions from base course competition challenges
  COURSE_COMPETITION_QUIZZES.forEach(baseQuiz => {
    const randomizedQuestions = [...baseQuiz.questions]
      .sort(() => 0.5 - Math.random())
      .map(q => ({
        ...q,
        id: `${q.id}-${Math.random().toString(36).substring(2, 5)}`,
        options: [...q.options].sort(() => 0.5 - Math.random())
      }));

    result.push({
      ...baseQuiz,
      questions: randomizedQuestions
    });
  });

  return result;
}
