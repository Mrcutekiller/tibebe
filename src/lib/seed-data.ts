// src/lib/seed-data.ts — Mock data for Tibeb platform
// ALL TESTS ARE SET TO 20 ETB AS REQUIRED

export interface University {
  id: string;
  name: string;
  short: string;
  location: string;
  color: string;
  departments: { id: string; name: string }[];
}

export interface Question {
  id: string;
  question_number: number;
  page_number?: number;
  question_text: string;
  options: { key: string; text: string }[];
  correct_option: string;
  explanation: string;
  formula?: string;
  topic?: string;
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  university_id: string;
  university: string;
  department: string;
  subject: string;
  exam_type: 'Final' | 'Mid' | 'Quiz' | 'Class Test';
  year: number;
  semester: string;
  price: number; // strictly 20 ETB
  is_free_sample: boolean;
  status: 'published' | 'draft';
  pages: number;
  has_answers: boolean;
  has_explanations: boolean;
  rating: number;
  reviews: number;
  purchases: number;
  description: string;
  tags: string[];
  duration_minutes?: number;
  images?: string[];
  questions?: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
  video_url?: string;
  summary?: string;
  content?: string;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  university: string;
  department: string;
  instructor: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  students: number;
  lessons_count: number;
  lessons?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  has_certificate: boolean;
  description: string;
  learning_outcomes: string[];
  modules: CourseModule[];
  tags: string[];
}

export const UNIVERSITIES: University[] = [
  {
    id: 'aau',
    name: 'Addis Ababa University',
    short: 'AAU',
    location: 'Addis Ababa (4 Kilo, 6 Kilo & Lideta)',
    color: '#0B5D3B',
    departments: [
      { id: 'cs', name: 'Computer Science' },
      { id: 'eng', name: 'Electrical Engineering' },
      { id: 'math', name: 'Mathematics' },
      { id: 'chem', name: 'Chemistry' },
      { id: 'phys', name: 'Physics' },
      { id: 'econ', name: 'Economics' },
      { id: 'law', name: 'Law' },
      { id: 'med', name: 'Medicine' },
    ],
  },
  {
    id: 'unity',
    name: 'Unity University',
    short: 'Unity',
    location: 'Addis Ababa (Gerji Main Campus)',
    color: '#1E3A8A',
    departments: [
      { id: 'biz', name: 'Business Administration' },
      { id: 'cs', name: 'Computer Science & IT' },
      { id: 'acct', name: 'Accounting & Finance' },
      { id: 'mktg', name: 'Marketing Management' },
      { id: 'eng', name: 'Architecture & Engineering' },
    ],
  },
  {
    id: 'astu',
    name: 'Adama Science and Technology University',
    short: 'ASTU',
    location: 'Adama (Center of Excellence in Science & Tech)',
    color: '#D97706',
    departments: [
      { id: 'mech', name: 'Mechanical Engineering' },
      { id: 'ece', name: 'Electrical & Computer Engineering' },
      { id: 'math', name: 'Applied Mathematics' },
      { id: 'se', name: 'Software Engineering' },
      { id: 'chem_eng', name: 'Chemical Engineering' },
    ],
  },
];

export const EXAMS: Exam[] = [
{
    "id": "exam-001",
    "title": "Freshman Mathematics Final Exam (MATH 1011)",
    "code": "MATH 1011",
    "university_id": "aau",
    "university": "Addis Ababa University",
    "department": "Mathematics & STEM",
    "subject": "Mathematics",
    "exam_type": "Final",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": true,
    "status": "published",
    "pages": 5,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.9,
    "reviews": 142,
    "purchases": 890,
    "description": "Complete 5-page official Freshman Mathematics Final Exam covering Propositional Logic, Truth Tables, Complex Numbers, Analytic Geometry, and Differential Calculus with fully worked step-by-step solutions.",
    "tags": [
      "math",
      "calculus",
      "logic",
      "aau",
      "freshman"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-07-33.jpg",
      "/test-images/photo_2026-10-23_20-07-34.jpg",
      "/test-images/photo_2026-10-23_20-07-35.jpg",
      "/test-images/photo_2026-10-23_20-07-36.jpg",
      "/test-images/photo_2026-10-23_20-07-39.jpg"
    ],
    "questions": [
      {
        "id": "q1-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "Which of the following compound propositions is a tautology (always true for all truth values)?",
        "options": [
          {
            "key": "A",
            "text": "(p \u2227 q) \u2192 p"
          },
          {
            "key": "B",
            "text": "(p \u2228 q) \u2192 (p \u2227 q)"
          },
          {
            "key": "C",
            "text": "p \u2227 \u00acp"
          },
          {
            "key": "D",
            "text": "\u00ac(p \u2228 q) \u2194 (p \u2228 q)"
          }
        ],
        "correct_option": "A",
        "explanation": "By the law of simplification, if both p and q are true, then p is unconditionally true. Thus (p \u2227 q) \u2192 p evaluates to True across all rows of the truth table, making it a valid tautology.",
        "formula": "(p \u2227 q) \u2192 p \u2261 T",
        "topic": "Propositional Logic"
      },
      {
        "id": "q1-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "What is the contrapositive of the conditional statement: \"If a function is differentiable at x = a, then it is continuous at x = a\"?",
        "options": [
          {
            "key": "A",
            "text": "If a function is not continuous at x = a, then it is not differentiable at x = a."
          },
          {
            "key": "B",
            "text": "If a function is continuous at x = a, then it is differentiable at x = a."
          },
          {
            "key": "C",
            "text": "If a function is not differentiable at x = a, then it is not continuous at x = a."
          },
          {
            "key": "D",
            "text": "A function is continuous if and only if it is differentiable."
          }
        ],
        "correct_option": "A",
        "explanation": "The contrapositive of \"p \u2192 q\" is logically equivalent to \"\u00acq \u2192 \u00acp\". Since p is \"differentiable\" and q is \"continuous\", \u00acq \u2192 \u00acp is \"If not continuous, then not differentiable\".",
        "formula": "p \u2192 q \u2261 \u00acq \u2192 \u00acp",
        "topic": "Formal Logic & Proofs"
      },
      {
        "id": "q1-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "Let set A = {x \u2208 \u211d | x\u00b2 - 5x + 6 = 0} and B = {2, 3, 4}. What is the Cartesian product cardinality |A \u00d7 B|?",
        "options": [
          {
            "key": "A",
            "text": "6"
          },
          {
            "key": "B",
            "text": "5"
          },
          {
            "key": "C",
            "text": "9"
          },
          {
            "key": "D",
            "text": "4"
          }
        ],
        "correct_option": "A",
        "explanation": "Factoring x\u00b2 - 5x + 6 = 0 gives (x - 2)(x - 3) = 0, so A = {2, 3} with |A| = 2. Set B has 3 elements, so |A \u00d7 B| = 2 \u00d7 3 = 6.",
        "formula": "|A \u00d7 B| = |A| \u00b7 |B| = 2 \u00b7 3 = 6",
        "topic": "Set Theory"
      },
      {
        "id": "q1-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "Find the domain of the real-valued function f(x) = \u221a(4 - x\u00b2) / (x - 1).",
        "options": [
          {
            "key": "A",
            "text": "[-2, 1) \u222a (1, 2]"
          },
          {
            "key": "B",
            "text": "[-2, 2]"
          },
          {
            "key": "C",
            "text": "(-\u221e, -2] \u222a [2, \u221e)"
          },
          {
            "key": "D",
            "text": "(-2, 2) \\ {1}"
          }
        ],
        "correct_option": "A",
        "explanation": "The radicand requires 4 - x\u00b2 \u2265 0, which means -2 \u2264 x \u2264 2. The denominator cannot be zero, so x \u2260 1. Combining both conditions gives [-2, 1) \u222a (1, 2].",
        "formula": "4 - x\u00b2 \u2265 0  and  x - 1 \u2260 0",
        "topic": "Functions & Domains"
      },
      {
        "id": "q1-5",
        "question_number": 5,
        "page_number": 1,
        "question_text": "Determine the value of the limit: lim (x \u2192 0) [sin(5x) / (3x)].",
        "options": [
          {
            "key": "A",
            "text": "5/3"
          },
          {
            "key": "B",
            "text": "3/5"
          },
          {
            "key": "C",
            "text": "0"
          },
          {
            "key": "D",
            "text": "1"
          }
        ],
        "correct_option": "A",
        "explanation": "Using the standard fundamental limit lim (u \u2192 0) [sin(u)/u] = 1, we rewrite [sin(5x)/(3x)] = (5/3) \u00b7 [sin(5x)/(5x)]. As x \u2192 0, this evaluates to (5/3) \u00b7 1 = 5/3.",
        "formula": "lim_{x\u21920} \\frac{\\sin(kx)}{x} = k",
        "topic": "Limits & Continuity"
      },
      {
        "id": "q1-6",
        "question_number": 6,
        "page_number": 2,
        "question_text": "Compute the first derivative of f(x) = ln(x\u00b3 + 2x) with respect to x.",
        "options": [
          {
            "key": "A",
            "text": "(3x\u00b2 + 2) / (x\u00b3 + 2x)"
          },
          {
            "key": "B",
            "text": "1 / (3x\u00b2 + 2)"
          },
          {
            "key": "C",
            "text": "(3x\u00b2 + 2) \u00b7 (x\u00b3 + 2x)"
          },
          {
            "key": "D",
            "text": "3x\u00b2 / (x\u00b3 + 2x)"
          }
        ],
        "correct_option": "A",
        "explanation": "By the chain rule for logarithmic functions: d/dx [ln(u)] = u'/u. Here u = x\u00b3 + 2x and u' = 3x\u00b2 + 2, giving (3x\u00b2 + 2)/(x\u00b3 + 2x).",
        "formula": "\\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u}",
        "topic": "Differential Calculus"
      },
      {
        "id": "q1-7",
        "question_number": 7,
        "page_number": 2,
        "question_text": "What are the critical points of the function g(x) = 2x\u00b3 - 9x\u00b2 + 12x + 5?",
        "options": [
          {
            "key": "A",
            "text": "x = 1 and x = 2"
          },
          {
            "key": "B",
            "text": "x = -1 and x = -2"
          },
          {
            "key": "C",
            "text": "x = 0 and x = 3"
          },
          {
            "key": "D",
            "text": "x = 2 and x = 3"
          }
        ],
        "correct_option": "A",
        "explanation": "Find g'(x) = 6x\u00b2 - 18x + 12 = 6(x\u00b2 - 3x + 2) = 6(x - 1)(x - 2). Setting g'(x) = 0 yields x = 1 and x = 2.",
        "formula": "g'(x) = 6(x - 1)(x - 2) = 0",
        "topic": "Extrema & Critical Points"
      },
      {
        "id": "q1-8",
        "question_number": 8,
        "page_number": 2,
        "question_text": "Evaluate the definite integral: \u222b from 0 to 2 of (3x\u00b2 - 4x + 1) dx.",
        "options": [
          {
            "key": "A",
            "text": "2"
          },
          {
            "key": "B",
            "text": "4"
          },
          {
            "key": "C",
            "text": "0"
          },
          {
            "key": "D",
            "text": "-2"
          }
        ],
        "correct_option": "A",
        "explanation": "The antiderivative is [x\u00b3 - 2x\u00b2 + x]. Evaluating from 0 to 2: (2\u00b3 - 2(2\u00b2) + 2) - 0 = (8 - 8 + 2) = 2.",
        "formula": "\\int (3x^2 - 4x + 1)dx = [x^3 - 2x^2 + x]",
        "topic": "Integral Calculus"
      },
      {
        "id": "q1-9",
        "question_number": 9,
        "page_number": 2,
        "question_text": "In complex numbers, what is the modulus and principal argument of z = 1 + i\u221a3?",
        "options": [
          {
            "key": "A",
            "text": "|z| = 2, Arg(z) = \u03c0/3"
          },
          {
            "key": "B",
            "text": "|z| = 4, Arg(z) = \u03c0/6"
          },
          {
            "key": "C",
            "text": "|z| = 2, Arg(z) = \u03c0/6"
          },
          {
            "key": "D",
            "text": "|z| = \u221a3, Arg(z) = \u03c0/3"
          }
        ],
        "correct_option": "A",
        "explanation": "|z| = \u221a(1\u00b2 + (\u221a3)\u00b2) = \u221a(1 + 3) = 2. Arg(z) = arctan(\u221a3/1) = \u03c0/3 radians (60\u00b0).",
        "formula": "|z| = \\sqrt{a^2 + b^2}, \\quad \\theta = \\arctan(b/a)",
        "topic": "Complex Numbers"
      },
      {
        "id": "q1-10",
        "question_number": 10,
        "page_number": 2,
        "question_text": "Calculate the inverse of the 2\u00d72 matrix M = [[2, 1], [5, 3]].",
        "options": [
          {
            "key": "A",
            "text": "[[3, -1], [-5, 2]]"
          },
          {
            "key": "B",
            "text": "[[-3, 1], [5, -2]]"
          },
          {
            "key": "C",
            "text": "[[3, 5], [1, 2]]"
          },
          {
            "key": "D",
            "text": "[[2, -1], [-5, 3]]"
          }
        ],
        "correct_option": "A",
        "explanation": "Determinant det(M) = (2)(3) - (1)(5) = 6 - 5 = 1. M\u207b\u00b9 = (1/det) \u00b7 [[d, -b], [-c, a]] = [[3, -1], [-5, 2]].",
        "formula": "M^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}",
        "topic": "Matrices & Determinants"
      },
      {
        "id": "q1-11",
        "question_number": 11,
        "page_number": 3,
        "question_text": "Find the equation of the tangent line to the curve y = x\u00b3 - 2x + 1 at the point (1, 0).",
        "options": [
          {
            "key": "A",
            "text": "y = x - 1"
          },
          {
            "key": "B",
            "text": "y = 2x - 2"
          },
          {
            "key": "C",
            "text": "y = -x + 1"
          },
          {
            "key": "D",
            "text": "y = 3x - 3"
          }
        ],
        "correct_option": "A",
        "explanation": "dy/dx = 3x\u00b2 - 2. At x = 1, slope m = 3(1) - 2 = 1. Equation: y - 0 = 1(x - 1) => y = x - 1.",
        "formula": "y - y_1 = m(x - x_1)",
        "topic": "Applications of Derivatives"
      },
      {
        "id": "q1-12",
        "question_number": 12,
        "page_number": 3,
        "question_text": "Which of the following lines is perpendicular to 3x - 4y + 8 = 0?",
        "options": [
          {
            "key": "A",
            "text": "4x + 3y - 5 = 0"
          },
          {
            "key": "B",
            "text": "3x + 4y - 5 = 0"
          },
          {
            "key": "C",
            "text": "4x - 3y + 2 = 0"
          },
          {
            "key": "D",
            "text": "-3x + 4y + 1 = 0"
          }
        ],
        "correct_option": "A",
        "explanation": "Slope of 3x - 4y + 8 = 0 is m\u2081 = 3/4. The perpendicular slope must satisfy m\u2081 \u00b7 m\u2082 = -1, so m\u2082 = -4/3. The line 4x + 3y - 5 = 0 has slope -4/3.",
        "formula": "m_1 \\cdot m_2 = -1",
        "topic": "Analytic Geometry"
      },
      {
        "id": "q1-13",
        "question_number": 13,
        "page_number": 3,
        "question_text": "What is the sum of the infinite geometric series: 6 + 2 + 2/3 + 2/9 + ... ?",
        "options": [
          {
            "key": "A",
            "text": "9"
          },
          {
            "key": "B",
            "text": "8"
          },
          {
            "key": "C",
            "text": "12"
          },
          {
            "key": "D",
            "text": "18"
          }
        ],
        "correct_option": "A",
        "explanation": "First term a = 6, common ratio r = 2/6 = 1/3. Since |r| < 1, S = a / (1 - r) = 6 / (1 - 1/3) = 6 / (2/3) = 9.",
        "formula": "S_\\infty = \\frac{a}{1 - r}",
        "topic": "Sequences & Series"
      },
      {
        "id": "q1-14",
        "question_number": 14,
        "page_number": 3,
        "question_text": "If vectors u = (2, -1, 3) and v = (1, 4, -2), compute the dot product u \u00b7 v.",
        "options": [
          {
            "key": "A",
            "text": "-8"
          },
          {
            "key": "B",
            "text": "8"
          },
          {
            "key": "C",
            "text": "-4"
          },
          {
            "key": "D",
            "text": "12"
          }
        ],
        "correct_option": "A",
        "explanation": "u \u00b7 v = (2)(1) + (-1)(4) + (3)(-2) = 2 - 4 - 6 = -8.",
        "formula": "u \\cdot v = u_1 v_1 + u_2 v_2 + u_3 v_3",
        "topic": "Vectors"
      },
      {
        "id": "q1-15",
        "question_number": 15,
        "page_number": 3,
        "question_text": "Solve the trigonometric equation: 2 cos\u00b2(x) - 1 = 0 on [0, \u03c0].",
        "options": [
          {
            "key": "A",
            "text": "x = \u03c0/4 and x = 3\u03c0/4"
          },
          {
            "key": "B",
            "text": "x = \u03c0/6 and x = 5\u03c0/6"
          },
          {
            "key": "C",
            "text": "x = \u03c0/3 and x = 2\u03c0/3"
          },
          {
            "key": "D",
            "text": "x = \u03c0/2"
          }
        ],
        "correct_option": "A",
        "explanation": "2 cos\u00b2(x) = 1 => cos(x) = \u00b11/\u221a2. On [0, \u03c0], cos(x) = 1/\u221a2 at x = \u03c0/4, and cos(x) = -1/\u221a2 at x = 3\u03c0/4.",
        "formula": "\\cos(x) = \\pm \\frac{\\sqrt{2}}{2}",
        "topic": "Trigonometry"
      },
      {
        "id": "q1-16",
        "question_number": 16,
        "page_number": 4,
        "question_text": "Use L'H\u00f4pital's Rule to evaluate: lim (x \u2192 1) [(x\u2075 - 1) / (x\u00b3 - 1)].",
        "options": [
          {
            "key": "A",
            "text": "5/3"
          },
          {
            "key": "B",
            "text": "3/5"
          },
          {
            "key": "C",
            "text": "1"
          },
          {
            "key": "D",
            "text": "15"
          }
        ],
        "correct_option": "A",
        "explanation": "Direct substitution yields 0/0. Applying L'H\u00f4pital's Rule: lim (5x\u2074 / 3x\u00b2) = 5(1)\u2074 / 3(1)\u00b2 = 5/3.",
        "formula": "\\lim \\frac{f'(x)}{g'(x)} = \\frac{5}{3}",
        "topic": "Indeterminate Forms"
      },
      {
        "id": "q1-17",
        "question_number": 17,
        "page_number": 4,
        "question_text": "What is the radius and center of the circle defined by x\u00b2 + y\u00b2 - 6x + 8y = 0?",
        "options": [
          {
            "key": "A",
            "text": "Center: (3, -4), Radius: 5"
          },
          {
            "key": "B",
            "text": "Center: (-3, 4), Radius: 5"
          },
          {
            "key": "C",
            "text": "Center: (3, -4), Radius: 25"
          },
          {
            "key": "D",
            "text": "Center: (6, -8), Radius: 10"
          }
        ],
        "correct_option": "A",
        "explanation": "Completing the square: (x - 3)\u00b2 - 9 + (y + 4)\u00b2 - 16 = 0 => (x - 3)\u00b2 + (y + 4)\u00b2 = 25. Center is (3, -4) and radius is \u221a25 = 5.",
        "formula": "(x - h)^2 + (y - k)^2 = r^2",
        "topic": "Conic Sections"
      },
      {
        "id": "q1-18",
        "question_number": 18,
        "page_number": 4,
        "question_text": "What is the coefficient of x\u00b3 in the binomial expansion of (2x - 1)\u2075?",
        "options": [
          {
            "key": "A",
            "text": "80"
          },
          {
            "key": "B",
            "text": "-80"
          },
          {
            "key": "C",
            "text": "40"
          },
          {
            "key": "D",
            "text": "-40"
          }
        ],
        "correct_option": "A",
        "explanation": "The term containing x\u00b3 is C(5, 3) \u00b7 (2x)\u00b3 \u00b7 (-1)\u00b2 = 10 \u00b7 8x\u00b3 \u00b7 1 = 80x\u00b3. Coefficient is 80.",
        "formula": "T_{k+1} = \\binom{n}{k} a^{n-k} b^k",
        "topic": "Binomial Theorem"
      },
      {
        "id": "q1-19",
        "question_number": 19,
        "page_number": 4,
        "question_text": "Determine whether f(x) = x\u00b3 - 3x is an even function, an odd function, or neither.",
        "options": [
          {
            "key": "A",
            "text": "Odd function"
          },
          {
            "key": "B",
            "text": "Even function"
          },
          {
            "key": "C",
            "text": "Neither even nor odd"
          },
          {
            "key": "D",
            "text": "Periodic function"
          }
        ],
        "correct_option": "A",
        "explanation": "f(-x) = (-x)\u00b3 - 3(-x) = -x\u00b3 + 3x = -(x\u00b3 - 3x) = -f(x). Since f(-x) = -f(x), the function is odd.",
        "formula": "f(-x) = -f(x)",
        "topic": "Function Symmetry"
      },
      {
        "id": "q1-20",
        "question_number": 20,
        "page_number": 4,
        "question_text": "Compute the cross product u \u00d7 v for u = (1, 0, 0) and v = (0, 1, 0).",
        "options": [
          {
            "key": "A",
            "text": "(0, 0, 1)"
          },
          {
            "key": "B",
            "text": "(0, 0, -1)"
          },
          {
            "key": "C",
            "text": "(1, 1, 0)"
          },
          {
            "key": "D",
            "text": "(0, 0, 0)"
          }
        ],
        "correct_option": "A",
        "explanation": "i \u00d7 j = k, which in component form is (0, 0, 1).",
        "formula": "i \\times j = k",
        "topic": "Vector Cross Products"
      },
      {
        "id": "q1-21",
        "question_number": 21,
        "page_number": 5,
        "question_text": "Find the horizontal and vertical asymptotes of the rational function R(x) = (3x\u00b2 - 5) / (x\u00b2 - 4).",
        "options": [
          {
            "key": "A",
            "text": "Horizontal: y = 3; Vertical: x = 2 and x = -2"
          },
          {
            "key": "B",
            "text": "Horizontal: y = 0; Vertical: x = 2"
          },
          {
            "key": "C",
            "text": "Horizontal: y = -5/4; Vertical: none"
          },
          {
            "key": "D",
            "text": "Horizontal: y = 3; Vertical: x = 4"
          }
        ],
        "correct_option": "A",
        "explanation": "Horizontal asymptote: lim (x \u2192 \u00b1\u221e) (3x\u00b2 - 5)/(x\u00b2 - 4) = 3/1 = 3. Vertical asymptotes occur where denominator is 0: x\u00b2 - 4 = 0 => x = \u00b12.",
        "formula": "y = \\lim_{x\\to\\infty} R(x) = 3, \\quad x = \\pm 2",
        "topic": "Rational Functions & Asymptotes"
      },
      {
        "id": "q1-22",
        "question_number": 22,
        "page_number": 5,
        "question_text": "If a box with a square base and open top is to have a volume of 4 m\u00b3, what dimensions minimize surface area?",
        "options": [
          {
            "key": "A",
            "text": "Base side x = 2 m, height h = 1 m"
          },
          {
            "key": "B",
            "text": "Base side x = 1 m, height h = 4 m"
          },
          {
            "key": "C",
            "text": "Base side x = \u221a2 m, height h = 2 m"
          },
          {
            "key": "D",
            "text": "Base side x = 2 m, height h = 2 m"
          }
        ],
        "correct_option": "A",
        "explanation": "Volume V = x\u00b2h = 4 => h = 4/x\u00b2. Surface area S(x) = x\u00b2 + 4xh = x\u00b2 + 16/x. S'(x) = 2x - 16/x\u00b2 = 0 => 2x\u00b3 = 16 => x = 2 m. Then h = 4/4 = 1 m.",
        "formula": "S'(x) = 2x - \\frac{16}{x^2} = 0 \\implies x = 2",
        "topic": "Optimization Problems"
      },
      {
        "id": "q1-23",
        "question_number": 23,
        "page_number": 5,
        "question_text": "Evaluate the integral using substitution: \u222b x \u00b7 e^(x\u00b2) dx.",
        "options": [
          {
            "key": "A",
            "text": "(1/2) e^(x\u00b2) + C"
          },
          {
            "key": "B",
            "text": "e^(x\u00b2) + C"
          },
          {
            "key": "C",
            "text": "2 e^(x\u00b2) + C"
          },
          {
            "key": "D",
            "text": "x\u00b2 e^(x\u00b2) + C"
          }
        ],
        "correct_option": "A",
        "explanation": "Let u = x\u00b2, du = 2x dx => x dx = du/2. \u222b e^u (du/2) = (1/2) e^u + C = (1/2) e^(x\u00b2) + C.",
        "formula": "\\int e^u du = e^u + C",
        "topic": "Integration Techniques"
      },
      {
        "id": "q1-24",
        "question_number": 24,
        "page_number": 5,
        "question_text": "What is the solution of the linear system: 2x + y = 7 and x - 3y = -7?",
        "options": [
          {
            "key": "A",
            "text": "x = 2, y = 3"
          },
          {
            "key": "B",
            "text": "x = 3, y = 1"
          },
          {
            "key": "C",
            "text": "x = 1, y = 5"
          },
          {
            "key": "D",
            "text": "x = 4, y = -1"
          }
        ],
        "correct_option": "A",
        "explanation": "From equation 2: x = 3y - 7. Substitute into eq 1: 2(3y - 7) + y = 7 => 7y - 14 = 7 => 7y = 21 => y = 3. Then x = 3(3) - 7 = 2.",
        "formula": "x = 2, \\quad y = 3",
        "topic": "Systems of Equations"
      },
      {
        "id": "q1-25",
        "question_number": 25,
        "page_number": 5,
        "question_text": "State the conclusion of Rolle's Theorem for f(x) = x\u00b2 - 4x + 3 on [1, 3].",
        "options": [
          {
            "key": "A",
            "text": "There exists c = 2 in (1, 3) where f'(c) = 0"
          },
          {
            "key": "B",
            "text": "There exists c = 1.5 where f(c) = 0"
          },
          {
            "key": "C",
            "text": "Rolle's Theorem does not apply because f(1) \u2260 f(3)"
          },
          {
            "key": "D",
            "text": "There exists c = 0 where f'(c) = 0"
          }
        ],
        "correct_option": "A",
        "explanation": "f(1) = 0 and f(3) = 0. f is continuous on [1,3] and differentiable on (1,3). f'(x) = 2x - 4 = 0 => c = 2 \u2208 (1, 3).",
        "formula": "f'(c) = 0 \\implies 2c - 4 = 0 \\implies c = 2",
        "topic": "Mean Value & Rolle's Theorems"
      }
    ]
  },
  {
    "id": "exam-002",
    "title": "General Physics I: Mechanics & Thermodynamics (PHYS 1011)",
    "code": "PHYS 1011",
    "university_id": "aau",
    "university": "Addis Ababa Science & Technology University",
    "department": "Applied Physics & Engineering",
    "subject": "Physics",
    "exam_type": "Mid",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 5,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.8,
    "reviews": 98,
    "purchases": 640,
    "description": "Complete 5-page AASTU Physics mid exam covering Kinematics in 2D, Newton's Laws, Work-Energy Theorem, Rotational Dynamics, and Fluid Mechanics.",
    "tags": [
      "physics",
      "mechanics",
      "aastu",
      "freshman"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-07-55.jpg",
      "/test-images/photo_2026-10-23_20-07-56.jpg",
      "/test-images/photo_2026-10-23_20-07-57.jpg",
      "/test-images/photo_2026-10-23_20-07-59.jpg",
      "/test-images/photo_2026-10-23_20-08-00.jpg"
    ],
    "questions": [
      {
        "id": "q2-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "A projectile is launched from ground level with speed v\u2080 at an angle \u03b8 above the horizontal. Neglecting air resistance, what launch angle maximizes horizontal range?",
        "options": [
          {
            "key": "A",
            "text": "45\u00b0"
          },
          {
            "key": "B",
            "text": "30\u00b0"
          },
          {
            "key": "C",
            "text": "60\u00b0"
          },
          {
            "key": "D",
            "text": "90\u00b0"
          }
        ],
        "correct_option": "A",
        "explanation": "Horizontal range R = (v\u2080\u00b2 sin 2\u03b8)/g. The sine function achieves its maximum value of 1 when 2\u03b8 = 90\u00b0, which yields \u03b8 = 45\u00b0.",
        "formula": "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
        "topic": "2D Kinematics"
      },
      {
        "id": "q2-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "A block of mass 5 kg rests on a frictionless horizontal table and is pulled by a horizontal force of 20 N. What is the acceleration of the block?",
        "options": [
          {
            "key": "A",
            "text": "4 m/s\u00b2"
          },
          {
            "key": "B",
            "text": "100 m/s\u00b2"
          },
          {
            "key": "C",
            "text": "0.25 m/s\u00b2"
          },
          {
            "key": "D",
            "text": "15 m/s\u00b2"
          }
        ],
        "correct_option": "A",
        "explanation": "By Newton's Second Law, F = ma. Solving for acceleration a = F/m = 20 N / 5 kg = 4 m/s\u00b2.",
        "formula": "a = \\frac{F}{m} = \\frac{20}{5} = 4\\,\\text{m/s}^2",
        "topic": "Newton's Laws"
      },
      {
        "id": "q2-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "A spring with spring constant k = 200 N/m is compressed by 0.1 m from equilibrium. How much elastic potential energy is stored in the spring?",
        "options": [
          {
            "key": "A",
            "text": "1.0 J"
          },
          {
            "key": "B",
            "text": "2.0 J"
          },
          {
            "key": "C",
            "text": "10 J"
          },
          {
            "key": "D",
            "text": "20 J"
          }
        ],
        "correct_option": "A",
        "explanation": "Elastic potential energy U = (1/2) k x\u00b2 = 0.5 \u00d7 200 \u00d7 (0.1)\u00b2 = 100 \u00d7 0.01 = 1.0 J.",
        "formula": "U = \\frac{1}{2} k x^2",
        "topic": "Work & Energy"
      },
      {
        "id": "q2-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "Which of the following physical quantities is a scalar rather than a vector?",
        "options": [
          {
            "key": "A",
            "text": "Work"
          },
          {
            "key": "B",
            "text": "Momentum"
          },
          {
            "key": "C",
            "text": "Torque"
          },
          {
            "key": "D",
            "text": "Acceleration"
          }
        ],
        "correct_option": "A",
        "explanation": "Work is defined as the scalar dot product of force and displacement vectors (W = F \u00b7 d), having magnitude only and no directional property.",
        "formula": "W = \\vec{F} \\cdot \\vec{d}",
        "topic": "Vectors & Scalars"
      },
      {
        "id": "q2-5",
        "question_number": 5,
        "page_number": 1,
        "question_text": "An object travels in a circle of radius r = 2 m at constant speed v = 6 m/s. What is its centripetal acceleration?",
        "options": [
          {
            "key": "A",
            "text": "18 m/s\u00b2"
          },
          {
            "key": "B",
            "text": "3 m/s\u00b2"
          },
          {
            "key": "C",
            "text": "12 m/s\u00b2"
          },
          {
            "key": "D",
            "text": "36 m/s\u00b2"
          }
        ],
        "correct_option": "A",
        "explanation": "Centripetal acceleration a_c = v\u00b2 / r = 6\u00b2 / 2 = 36 / 2 = 18 m/s\u00b2.",
        "formula": "a_c = \\frac{v^2}{r}",
        "topic": "Circular Motion"
      },
      {
        "id": "q2-6",
        "question_number": 6,
        "page_number": 2,
        "question_text": "In an isolated system, two objects collide and stick together. What type of collision is this and what is conserved?",
        "options": [
          {
            "key": "A",
            "text": "Completely inelastic collision; linear momentum is conserved"
          },
          {
            "key": "B",
            "text": "Elastic collision; both momentum and kinetic energy are conserved"
          },
          {
            "key": "C",
            "text": "Superelastic collision; only kinetic energy is conserved"
          },
          {
            "key": "D",
            "text": "Inelastic collision; kinetic energy is conserved"
          }
        ],
        "correct_option": "A",
        "explanation": "When colliding bodies coalesce into a single combined mass, the collision is perfectly inelastic. Momentum is strictly conserved while maximum kinetic energy is dissipated.",
        "formula": "m_1 v_1 + m_2 v_2 = (m_1 + m_2) v_f",
        "topic": "Collisions & Momentum"
      },
      {
        "id": "q2-7",
        "question_number": 7,
        "page_number": 2,
        "question_text": "What is the moment of inertia of a solid cylinder of mass M and radius R rotating about its central cylinder axis?",
        "options": [
          {
            "key": "A",
            "text": "(1/2) M R\u00b2"
          },
          {
            "key": "B",
            "text": "M R\u00b2"
          },
          {
            "key": "C",
            "text": "(2/5) M R\u00b2"
          },
          {
            "key": "D",
            "text": "(1/12) M R\u00b2"
          }
        ],
        "correct_option": "A",
        "explanation": "Integrating dm \u00b7 r\u00b2 across the volume of a solid uniform cylinder yields I = (1/2) M R\u00b2.",
        "formula": "I = \\frac{1}{2} M R^2",
        "topic": "Rotational Inertia"
      },
      {
        "id": "q2-8",
        "question_number": 8,
        "page_number": 2,
        "question_text": "A wheel accelerates uniformly from rest to an angular velocity of 20 rad/s in 4 seconds. What is its angular acceleration?",
        "options": [
          {
            "key": "A",
            "text": "5 rad/s\u00b2"
          },
          {
            "key": "B",
            "text": "80 rad/s\u00b2"
          },
          {
            "key": "C",
            "text": "2.5 rad/s\u00b2"
          },
          {
            "key": "D",
            "text": "10 rad/s\u00b2"
          }
        ],
        "correct_option": "A",
        "explanation": "Angular acceleration \u03b1 = (\u03c9 - \u03c9\u2080) / t = (20 - 0) / 4 = 5 rad/s\u00b2.",
        "formula": "\\alpha = \\frac{\\Delta\\omega}{\\Delta t}",
        "topic": "Rotational Kinematics"
      },
      {
        "id": "q2-9",
        "question_number": 9,
        "page_number": 2,
        "question_text": "According to Pascal's Principle, what happens to external pressure applied to an enclosed fluid?",
        "options": [
          {
            "key": "A",
            "text": "It is transmitted undiminished to every portion of the fluid and container walls"
          },
          {
            "key": "B",
            "text": "It decreases linearly with fluid depth"
          },
          {
            "key": "C",
            "text": "It increases exponentially toward the center"
          },
          {
            "key": "D",
            "text": "It only affects the surface layer"
          }
        ],
        "correct_option": "A",
        "explanation": "Pascal's Principle states that pressure applied to an enclosed fluid is transmitted equally and undiminished to all points within the fluid and to the walls of its vessel.",
        "formula": "\\Delta P_1 = \\Delta P_2",
        "topic": "Fluid Mechanics"
      },
      {
        "id": "q2-10",
        "question_number": 10,
        "page_number": 2,
        "question_text": "What is the buoyant force acting on a completely submerged object of volume 0.02 m\u00b3 in water (density \u03c1 = 1000 kg/m\u00b3, g = 9.8 m/s\u00b2)?",
        "options": [
          {
            "key": "A",
            "text": "196 N"
          },
          {
            "key": "B",
            "text": "20 N"
          },
          {
            "key": "C",
            "text": "98 N"
          },
          {
            "key": "D",
            "text": "392 N"
          }
        ],
        "correct_option": "A",
        "explanation": "By Archimedes' principle, F_b = \u03c1 \u00b7 V \u00b7 g = 1000 kg/m\u00b3 \u00d7 0.02 m\u00b3 \u00d7 9.8 m/s\u00b2 = 196 N.",
        "formula": "F_b = \\rho V g",
        "topic": "Archimedes Principle"
      },
      {
        "id": "q2-11",
        "question_number": 11,
        "page_number": 3,
        "question_text": "What is the period T of a simple pendulum of length L = 0.98 m in a gravitational field g = 9.8 m/s\u00b2?",
        "options": [
          {
            "key": "A",
            "text": "2.0 seconds"
          },
          {
            "key": "B",
            "text": "1.0 second"
          },
          {
            "key": "C",
            "text": "3.14 seconds"
          },
          {
            "key": "D",
            "text": "0.5 seconds"
          }
        ],
        "correct_option": "A",
        "explanation": "T = 2\u03c0 \u221a(L/g) = 2\u03c0 \u221a(0.98/9.8) = 2\u03c0 \u221a(0.1) \u2248 2 \u00d7 3.1416 \u00d7 0.3162 \u2248 1.99 s \u2248 2.0 s.",
        "formula": "T = 2\\pi \\sqrt{\\frac{L}{g}}",
        "topic": "Simple Harmonic Motion"
      },
      {
        "id": "q2-12",
        "question_number": 12,
        "page_number": 3,
        "question_text": "Which law of thermodynamics establishes that entropy of an isolated system always increases or remains constant in reversible processes?",
        "options": [
          {
            "key": "A",
            "text": "Second Law of Thermodynamics"
          },
          {
            "key": "B",
            "text": "First Law of Thermodynamics"
          },
          {
            "key": "C",
            "text": "Zeroth Law of Thermodynamics"
          },
          {
            "key": "D",
            "text": "Third Law of Thermodynamics"
          }
        ],
        "correct_option": "A",
        "explanation": "The Second Law states that in any spontaneous natural process, the total entropy of an isolated system never decreases over time.",
        "formula": "\\Delta S_{isolated} \\ge 0",
        "topic": "Thermodynamics"
      },
      {
        "id": "q2-13",
        "question_number": 13,
        "page_number": 3,
        "question_text": "How much heat is required to raise the temperature of 2 kg of water (c = 4186 J/kg\u00b7K) from 20\u00b0C to 50\u00b0C?",
        "options": [
          {
            "key": "A",
            "text": "2.51 \u00d7 10\u2075 J"
          },
          {
            "key": "B",
            "text": "1.25 \u00d7 10\u2075 J"
          },
          {
            "key": "C",
            "text": "4.18 \u00d7 10\u2075 J"
          },
          {
            "key": "D",
            "text": "8.37 \u00d7 10\u2074 J"
          }
        ],
        "correct_option": "A",
        "explanation": "Q = m c \u0394T = 2 kg \u00d7 4186 J/kg\u00b7K \u00d7 (50 - 20) K = 2 \u00d7 4186 \u00d7 30 = 251,160 J \u2248 2.51 \u00d7 10\u2075 J.",
        "formula": "Q = m c \\Delta T",
        "topic": "Calorimetry"
      },
      {
        "id": "q2-14",
        "question_number": 14,
        "page_number": 3,
        "question_text": "In an adiabatic expansion of an ideal gas, what is the net heat exchange Q between system and surroundings?",
        "options": [
          {
            "key": "A",
            "text": "Q = 0"
          },
          {
            "key": "B",
            "text": "Q > 0"
          },
          {
            "key": "C",
            "text": "Q < 0"
          },
          {
            "key": "D",
            "text": "Q = W"
          }
        ],
        "correct_option": "A",
        "explanation": "By definition, an adiabatic process occurs without any heat transfer between the system and its environment, so Q = 0.",
        "formula": "Q = 0, \\quad \\Delta U = -W",
        "topic": "Thermodynamic Processes"
      },
      {
        "id": "q2-15",
        "question_number": 15,
        "page_number": 3,
        "question_text": "What is the theoretical maximum thermal efficiency of a Carnot engine operating between 600 K and 300 K?",
        "options": [
          {
            "key": "A",
            "text": "50%"
          },
          {
            "key": "B",
            "text": "100%"
          },
          {
            "key": "C",
            "text": "25%"
          },
          {
            "key": "D",
            "text": "75%"
          }
        ],
        "correct_option": "A",
        "explanation": "Carnot efficiency \u03b7 = 1 - (T_c / T_h) = 1 - (300 / 600) = 1 - 0.5 = 0.5 or 50%.",
        "formula": "\\eta = 1 - \\frac{T_c}{T_h}",
        "topic": "Heat Engines"
      },
      {
        "id": "q2-16",
        "question_number": 16,
        "page_number": 4,
        "question_text": "A sound wave of frequency 680 Hz travels through air at 340 m/s. What is its wavelength?",
        "options": [
          {
            "key": "A",
            "text": "0.50 m"
          },
          {
            "key": "B",
            "text": "2.0 m"
          },
          {
            "key": "C",
            "text": "0.25 m"
          },
          {
            "key": "D",
            "text": "1.5 m"
          }
        ],
        "correct_option": "A",
        "explanation": "Wave speed v = f \u00b7 \u03bb => \u03bb = v / f = 340 m/s / 680 Hz = 0.50 m.",
        "formula": "\\lambda = \\frac{v}{f}",
        "topic": "Waves & Sound"
      },
      {
        "id": "q2-17",
        "question_number": 17,
        "page_number": 4,
        "question_text": "What is the speed of an electromagnetic wave in vacuum?",
        "options": [
          {
            "key": "A",
            "text": "3.0 \u00d7 10\u2078 m/s"
          },
          {
            "key": "B",
            "text": "3.0 \u00d7 10\u2076 m/s"
          },
          {
            "key": "C",
            "text": "340 m/s"
          },
          {
            "key": "D",
            "text": "1.5 \u00d7 10\u2078 m/s"
          }
        ],
        "correct_option": "A",
        "explanation": "In vacuum, all electromagnetic waves travel at the speed of light c \u2248 3.00 \u00d7 10\u2078 m/s.",
        "formula": "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} \\approx 3 \\times 10^8\\,\\text{m/s}",
        "topic": "Electromagnetic Waves"
      },
      {
        "id": "q2-18",
        "question_number": 18,
        "page_number": 4,
        "question_text": "The Doppler effect causes an observed increase in sound frequency when:",
        "options": [
          {
            "key": "A",
            "text": "The source moves toward a stationary observer"
          },
          {
            "key": "B",
            "text": "The source moves away from a stationary observer"
          },
          {
            "key": "C",
            "text": "Both source and observer are at rest"
          },
          {
            "key": "D",
            "text": "Sound amplitude decreases"
          }
        ],
        "correct_option": "A",
        "explanation": "When source and observer approach each other, wave crests arrive closer together in time, leading to higher observed frequency.",
        "formula": "f' = f \\left(\\frac{v}{v - v_s}\\right)",
        "topic": "Doppler Effect"
      },
      {
        "id": "q2-19",
        "question_number": 19,
        "page_number": 4,
        "question_text": "Two point charges of +2 \u03bcC and -4 \u03bcC are separated by 0.3 m. What is the nature of the electrostatic force between them?",
        "options": [
          {
            "key": "A",
            "text": "Attractive force"
          },
          {
            "key": "B",
            "text": "Repulsive force"
          },
          {
            "key": "C",
            "text": "Zero force"
          },
          {
            "key": "D",
            "text": "Gravitational only"
          }
        ],
        "correct_option": "A",
        "explanation": "According to Coulomb's Law, opposite charges (+ and -) attract each other with force F = k |q\u2081q\u2082| / r\u00b2.",
        "formula": "F = \\frac{k |q_1 q_2|}{r^2}",
        "topic": "Electrostatics"
      },
      {
        "id": "q2-20",
        "question_number": 20,
        "page_number": 4,
        "question_text": "What is the electric potential V at distance r = 0.5 m from a point charge q = 5 nC in vacuum (k = 9 \u00d7 10\u2079 N\u00b7m\u00b2/C\u00b2)?",
        "options": [
          {
            "key": "A",
            "text": "90 V"
          },
          {
            "key": "B",
            "text": "45 V"
          },
          {
            "key": "C",
            "text": "180 V"
          },
          {
            "key": "D",
            "text": "9 V"
          }
        ],
        "correct_option": "A",
        "explanation": "V = k q / r = (9 \u00d7 10\u2079 \u00d7 5 \u00d7 10\u207b\u2079) / 0.5 = 45 / 0.5 = 90 V.",
        "formula": "V = \\frac{k q}{r}",
        "topic": "Electric Potential"
      },
      {
        "id": "q2-21",
        "question_number": 21,
        "page_number": 5,
        "question_text": "Three identical resistors of 6 \u03a9 each are connected in parallel. What is their equivalent resistance?",
        "options": [
          {
            "key": "A",
            "text": "2 \u03a9"
          },
          {
            "key": "B",
            "text": "18 \u03a9"
          },
          {
            "key": "C",
            "text": "3 \u03a9"
          },
          {
            "key": "D",
            "text": "0.5 \u03a9"
          }
        ],
        "correct_option": "A",
        "explanation": "1/R_eq = 1/6 + 1/6 + 1/6 = 3/6 = 1/2 => R_eq = 2 \u03a9.",
        "formula": "\\frac{1}{R_{eq}} = \\sum \\frac{1}{R_i}",
        "topic": "DC Circuits"
      },
      {
        "id": "q2-22",
        "question_number": 22,
        "page_number": 5,
        "question_text": "A current of 3 A flows through an 8 \u03a9 resistor for 10 seconds. What is the total electrical energy dissipated as thermal heat?",
        "options": [
          {
            "key": "A",
            "text": "720 J"
          },
          {
            "key": "B",
            "text": "240 J"
          },
          {
            "key": "C",
            "text": "72 J"
          },
          {
            "key": "D",
            "text": "1440 J"
          }
        ],
        "correct_option": "A",
        "explanation": "P = I\u00b2 R = 3\u00b2 \u00d7 8 = 9 \u00d7 8 = 72 W. Energy E = P \u00b7 t = 72 W \u00d7 10 s = 720 J.",
        "formula": "E = I^2 R t",
        "topic": "Joule Heating"
      },
      {
        "id": "q2-23",
        "question_number": 23,
        "page_number": 5,
        "question_text": "What is the magnetic force on a charge q = 2 C moving at v = 5 m/s perpendicular to a uniform magnetic field B = 0.4 T?",
        "options": [
          {
            "key": "A",
            "text": "4 N"
          },
          {
            "key": "B",
            "text": "2 N"
          },
          {
            "key": "C",
            "text": "10 N"
          },
          {
            "key": "D",
            "text": "0 N"
          }
        ],
        "correct_option": "A",
        "explanation": "Lorentz force F = q v B sin(90\u00b0) = 2 C \u00d7 5 m/s \u00d7 0.4 T \u00d7 1 = 4 N.",
        "formula": "F = q v B \\sin\\theta",
        "topic": "Magnetic Forces"
      },
      {
        "id": "q2-24",
        "question_number": 24,
        "page_number": 5,
        "question_text": "According to Faraday's Law of Induction, the induced electromotive force (EMF) in a closed coil is directly proportional to:",
        "options": [
          {
            "key": "A",
            "text": "The time rate of change of magnetic flux through the coil"
          },
          {
            "key": "B",
            "text": "The constant strength of the magnetic field"
          },
          {
            "key": "C",
            "text": "The resistance of the wire material"
          },
          {
            "key": "D",
            "text": "The mass of the coil"
          }
        ],
        "correct_option": "A",
        "explanation": "Faraday's law states EMF \u03b5 = -d\u03a6_B/dt, meaning induced voltage depends on how fast magnetic flux changes over time.",
        "formula": "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}",
        "topic": "Electromagnetic Induction"
      },
      {
        "id": "q2-25",
        "question_number": 25,
        "page_number": 5,
        "question_text": "What optical phenomenon explains how optical fibers transmit light signals across long distances with minimal loss?",
        "options": [
          {
            "key": "A",
            "text": "Total Internal Reflection"
          },
          {
            "key": "B",
            "text": "Diffraction"
          },
          {
            "key": "C",
            "text": "Polarization"
          },
          {
            "key": "D",
            "text": "Constructive Interference"
          }
        ],
        "correct_option": "A",
        "explanation": "When light travels inside a denser core toward a lower-index cladding at an incident angle exceeding the critical angle, 100% of the light is totally reflected.",
        "formula": "\\theta_c = \\arcsin(n_2 / n_1)",
        "topic": "Geometric Optics"
      }
    ]
  },
  {
    "id": "exam-003",
    "title": "Applied Physics & Electrical Foundations (PHYS 1022)",
    "code": "PHYS 1022",
    "university_id": "astu",
    "university": "Adama Science and Technology University",
    "department": "Electrical Engineering & Physics",
    "subject": "Physics",
    "exam_type": "Final",
    "year": 2025,
    "semester": "2",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 5,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.7,
    "reviews": 74,
    "purchases": 480,
    "description": "Complete 5-page ASTU engineering physics exam paper on Electromagnetism, Gauss's Law, AC Circuit Resonance, Wave Optics, and Quantum Physics.",
    "tags": [
      "physics",
      "circuits",
      "electromagnetism",
      "astu"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-08-10.jpg",
      "/test-images/photo_2026-10-23_20-08-12.jpg",
      "/test-images/photo_2026-10-23_20-08-13.jpg",
      "/test-images/photo_2026-10-23_20-08-15.jpg",
      "/test-images/photo_2026-10-23_20-08-16.jpg"
    ],
    "questions": [
      {
        "id": "q3-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "What is the electric flux through a closed spherical surface enclosing a net positive charge Q in vacuum?",
        "options": [
          {
            "key": "A",
            "text": "Q / \u03b5\u2080"
          },
          {
            "key": "B",
            "text": "Q \u00b7 \u03b5\u2080"
          },
          {
            "key": "C",
            "text": "4\u03c0 k Q"
          },
          {
            "key": "D",
            "text": "Zero"
          }
        ],
        "correct_option": "A",
        "explanation": "By Gauss's Law, the total outward flux of electric field across any closed Gaussian surface equals the net enclosed charge divided by vacuum permittivity \u03b5\u2080.",
        "formula": "\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enc}}{\\varepsilon_0}",
        "topic": "Gauss's Law"
      },
      {
        "id": "q3-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "A parallel plate capacitor has plate area A, separation d, and is filled with air. How does capacitance change if plate separation is halved (d/2)?",
        "options": [
          {
            "key": "A",
            "text": "It doubles (2C)"
          },
          {
            "key": "B",
            "text": "It is halved (C/2)"
          },
          {
            "key": "C",
            "text": "It quadruples (4C)"
          },
          {
            "key": "D",
            "text": "It remains unchanged"
          }
        ],
        "correct_option": "A",
        "explanation": "Capacitance C = \u03b5\u2080 A / d. If d becomes d/2, C' = \u03b5\u2080 A / (d/2) = 2 (\u03b5\u2080 A / d) = 2C.",
        "formula": "C = \\frac{\\varepsilon_0 A}{d}",
        "topic": "Capacitance"
      },
      {
        "id": "q3-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "What is the drift velocity of conduction electrons in a copper wire carrying 10 A of current?",
        "options": [
          {
            "key": "A",
            "text": "On the order of mm/s (very slow macroscopic flow)"
          },
          {
            "key": "B",
            "text": "Equal to the speed of light (3 \u00d7 10\u2078 m/s)"
          },
          {
            "key": "C",
            "text": "Equal to sound speed (340 m/s)"
          },
          {
            "key": "D",
            "text": "Zero because electrons vibrate in place"
          }
        ],
        "correct_option": "A",
        "explanation": "While the electrical signal field propagates near light speed, the net physical drift velocity v_d = I / (n q A) is tiny (typically ~0.1 to 1 mm/s).",
        "formula": "I = n q A v_d",
        "topic": "Current & Resistance"
      },
      {
        "id": "q3-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "Kirchhoff's Junction Rule (Current Law) is a direct consequence of which conservation law?",
        "options": [
          {
            "key": "A",
            "text": "Conservation of Electric Charge"
          },
          {
            "key": "B",
            "text": "Conservation of Energy"
          },
          {
            "key": "C",
            "text": "Conservation of Momentum"
          },
          {
            "key": "D",
            "text": "Conservation of Mass"
          }
        ],
        "correct_option": "A",
        "explanation": "Kirchhoff's junction rule (\u2211 I_in = \u2211 I_out) states that electric charge cannot accumulate at or disappear from a node in a steady circuit.",
        "formula": "\\sum I_{in} = \\sum I_{out}",
        "topic": "Kirchhoff's Laws"
      },
      {
        "id": "q3-5",
        "question_number": 5,
        "page_number": 1,
        "question_text": "A 100 mH inductor carries a current increasing at a rate of 50 A/s. What is the magnitude of the self-induced EMF?",
        "options": [
          {
            "key": "A",
            "text": "5.0 V"
          },
          {
            "key": "B",
            "text": "500 V"
          },
          {
            "key": "C",
            "text": "0.5 V"
          },
          {
            "key": "D",
            "text": "50 V"
          }
        ],
        "correct_option": "A",
        "explanation": "EMF \u03b5 = L (di/dt) = 0.100 H \u00d7 50 A/s = 5.0 V.",
        "formula": "\\mathcal{E} = L \\frac{di}{dt}",
        "topic": "Inductance"
      },
      {
        "id": "q3-6",
        "question_number": 6,
        "page_number": 2,
        "question_text": "What is the resonant angular frequency \u03c9\u2080 of a series RLC circuit with L = 0.5 H and C = 2 \u03bcF?",
        "options": [
          {
            "key": "A",
            "text": "1000 rad/s"
          },
          {
            "key": "B",
            "text": "500 rad/s"
          },
          {
            "key": "C",
            "text": "2000 rad/s"
          },
          {
            "key": "D",
            "text": "100 rad/s"
          }
        ],
        "correct_option": "A",
        "explanation": "\u03c9\u2080 = 1 / \u221a(L C) = 1 / \u221a(0.5 \u00d7 2 \u00d7 10\u207b\u2076) = 1 / \u221a(10\u207b\u2076) = 1 / 10\u207b\u00b3 = 1000 rad/s.",
        "formula": "\\omega_0 = \\frac{1}{\\sqrt{LC}}",
        "topic": "RLC Resonant Circuits"
      },
      {
        "id": "q3-7",
        "question_number": 7,
        "page_number": 2,
        "question_text": "What happens to the inductive reactance X_L as the frequency of an AC voltage source increases?",
        "options": [
          {
            "key": "A",
            "text": "It increases linearly (X_L = 2\u03c0 f L)"
          },
          {
            "key": "B",
            "text": "It decreases inversely"
          },
          {
            "key": "C",
            "text": "It stays constant"
          },
          {
            "key": "D",
            "text": "It drops to zero"
          }
        ],
        "correct_option": "A",
        "explanation": "X_L = \u03c9 L = 2\u03c0 f L, which is directly proportional to frequency f.",
        "formula": "X_L = 2\\pi f L",
        "topic": "AC Circuits"
      },
      {
        "id": "q3-8",
        "question_number": 8,
        "page_number": 2,
        "question_text": "Which Maxwell equation explains that magnetic monopoles do not exist in nature?",
        "options": [
          {
            "key": "A",
            "text": "Gauss's Law for Magnetism: \u2207 \u00b7 B = 0"
          },
          {
            "key": "B",
            "text": "Amp\u00e8re-Maxwell Law"
          },
          {
            "key": "C",
            "text": "Faraday's Law"
          },
          {
            "key": "D",
            "text": "Gauss's Law for Electricity"
          }
        ],
        "correct_option": "A",
        "explanation": "Gauss's law for magnetism states that magnetic field lines are always closed loops with zero net divergence (\u2207 \u00b7 B = 0), precluding isolated magnetic charges.",
        "formula": "\\nabla \\cdot \\vec{B} = 0",
        "topic": "Maxwell's Equations"
      },
      {
        "id": "q3-9",
        "question_number": 9,
        "page_number": 2,
        "question_text": "What is the Poynting vector S and what physical quantity does it represent?",
        "options": [
          {
            "key": "A",
            "text": "S = (1/\u03bc\u2080)(E \u00d7 B); represents directional energy flux density of EM waves"
          },
          {
            "key": "B",
            "text": "Electric force per unit volume"
          },
          {
            "key": "C",
            "text": "Total charge density"
          },
          {
            "key": "D",
            "text": "Magnetic dipole moment"
          }
        ],
        "correct_option": "A",
        "explanation": "The Poynting vector S = (1/\u03bc\u2080) (E \u00d7 B) gives the rate of energy transport per unit area per unit time in watts per square meter.",
        "formula": "\\vec{S} = \\frac{1}{\\mu_0}(\\vec{E} \\times \\vec{B})",
        "topic": "Electromagnetic Radiation"
      },
      {
        "id": "q3-10",
        "question_number": 10,
        "page_number": 2,
        "question_text": "What condition gives constructive interference in Young's Double Slit experiment for slit separation d and wavelength \u03bb?",
        "options": [
          {
            "key": "A",
            "text": "d sin \u03b8 = m \u03bb, where m = 0, \u00b11, \u00b12..."
          },
          {
            "key": "B",
            "text": "d sin \u03b8 = (m + 1/2) \u03bb"
          },
          {
            "key": "C",
            "text": "d / sin \u03b8 = m \u03bb"
          },
          {
            "key": "D",
            "text": "d cos \u03b8 = m \u03bb"
          }
        ],
        "correct_option": "A",
        "explanation": "For constructive interference (bright fringes), the optical path difference d sin \u03b8 must equal an integer multiple of the wavelength m \u03bb.",
        "formula": "d \\sin\\theta = m \\lambda",
        "topic": "Wave Optics"
      },
      {
        "id": "q3-11",
        "question_number": 11,
        "page_number": 3,
        "question_text": "What is Brewster's angle \u03b8_B for light incident from air (n = 1) upon glass with refractive index n = 1.50?",
        "options": [
          {
            "key": "A",
            "text": "56.3\u00b0"
          },
          {
            "key": "B",
            "text": "41.8\u00b0"
          },
          {
            "key": "C",
            "text": "33.7\u00b0"
          },
          {
            "key": "D",
            "text": "45.0\u00b0"
          }
        ],
        "correct_option": "A",
        "explanation": "tan(\u03b8_B) = n\u2082 / n\u2081 = 1.50 / 1.00 => \u03b8_B = arctan(1.50) \u2248 56.3\u00b0.",
        "formula": "\\tan\\theta_B = \\frac{n_2}{n_1}",
        "topic": "Polarization"
      },
      {
        "id": "q3-12",
        "question_number": 12,
        "page_number": 3,
        "question_text": "What is the energy of a photon of light with frequency f = 5 \u00d7 10\u00b9\u2074 Hz (Planck constant h = 6.63 \u00d7 10\u207b\u00b3\u2074 J\u00b7s)?",
        "options": [
          {
            "key": "A",
            "text": "3.315 \u00d7 10\u207b\u00b9\u2079 J"
          },
          {
            "key": "B",
            "text": "1.326 \u00d7 10\u207b\u00b9\u2079 J"
          },
          {
            "key": "C",
            "text": "6.630 \u00d7 10\u207b\u00b9\u2079 J"
          },
          {
            "key": "D",
            "text": "2.480 \u00d7 10\u207b\u00b9\u2078 J"
          }
        ],
        "correct_option": "A",
        "explanation": "E = h f = 6.63 \u00d7 10\u207b\u00b3\u2074 J\u00b7s \u00d7 5 \u00d7 10\u00b9\u2074 s\u207b\u00b9 = 3.315 \u00d7 10\u207b\u00b9\u2079 J (approx 2.07 eV).",
        "formula": "E = h f",
        "topic": "Quantum Physics"
      },
      {
        "id": "q3-13",
        "question_number": 3,
        "page_number": 3,
        "question_text": "In the Photoelectric Effect, what happens to the maximum kinetic energy of emitted photoelectrons if the intensity of incident light is doubled while frequency is kept constant?",
        "options": [
          {
            "key": "A",
            "text": "It remains unchanged, but twice as many electrons are emitted per second"
          },
          {
            "key": "B",
            "text": "It doubles"
          },
          {
            "key": "C",
            "text": "It quadruples"
          },
          {
            "key": "D",
            "text": "It drops to zero"
          }
        ],
        "correct_option": "A",
        "explanation": "By Einstein's photoelectric equation, K_max = h f - \u03a6 depends solely on photon frequency f. Increasing intensity increases photon count and photocurrent rate, not individual electron kinetic energy.",
        "formula": "K_{max} = h f - \\Phi",
        "topic": "Photoelectric Effect"
      },
      {
        "id": "q3-14",
        "question_number": 14,
        "page_number": 3,
        "question_text": "What is the de Broglie wavelength of an electron of mass m moving with momentum p?",
        "options": [
          {
            "key": "A",
            "text": "\u03bb = h / p"
          },
          {
            "key": "B",
            "text": "\u03bb = p / h"
          },
          {
            "key": "C",
            "text": "\u03bb = h \u00b7 p"
          },
          {
            "key": "D",
            "text": "\u03bb = m c\u00b2 / p"
          }
        ],
        "correct_option": "A",
        "explanation": "De Broglie hypothesized that all matter displays wave-particle duality with wavelength \u03bb = h / p = h / (m v).",
        "formula": "\\lambda = \\frac{h}{p}",
        "topic": "Wave-Particle Duality"
      },
      {
        "id": "q3-15",
        "question_number": 15,
        "page_number": 3,
        "question_text": "According to Heisenberg's Uncertainty Principle, the product of uncertainties in position and momentum satisfies:",
        "options": [
          {
            "key": "A",
            "text": "\u0394x \u00b7 \u0394p \u2265 \u210f / 2"
          },
          {
            "key": "B",
            "text": "\u0394x \u00b7 \u0394p = 0"
          },
          {
            "key": "C",
            "text": "\u0394x / \u0394p \u2264 \u210f"
          },
          {
            "key": "D",
            "text": "\u0394x \u00b7 \u0394p \u2265 h\u00b2"
          }
        ],
        "correct_option": "A",
        "explanation": "The fundamental quantum limit states \u0394x \u00b7 \u0394p_x \u2265 \u210f / 2, where \u210f = h / (2\u03c0).",
        "formula": "\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}",
        "topic": "Heisenberg Principle"
      },
      {
        "id": "q3-16",
        "question_number": 16,
        "page_number": 4,
        "question_text": "What is the magnetic field inside an ideal solenoid having n turns per unit length carrying current I?",
        "options": [
          {
            "key": "A",
            "text": "B = \u03bc\u2080 n I"
          },
          {
            "key": "B",
            "text": "B = \u03bc\u2080 I / (2\u03c0 r)"
          },
          {
            "key": "C",
            "text": "B = \u03bc\u2080 n I / (2 r)"
          },
          {
            "key": "D",
            "text": "B = Zero"
          }
        ],
        "correct_option": "A",
        "explanation": "Applying Amp\u00e8re's law across an interior rectangular path yields uniform field B = \u03bc\u2080 n I inside the core.",
        "formula": "B = \\mu_0 n I",
        "topic": "Solenoids & Amp\u00e8re's Law"
      },
      {
        "id": "q3-17",
        "question_number": 17,
        "page_number": 4,
        "question_text": "An AC circuit has impedance Z = 100 \u03a9 and resistance R = 80 \u03a9. What is the power factor cos(\u03c6)?",
        "options": [
          {
            "key": "A",
            "text": "0.80"
          },
          {
            "key": "B",
            "text": "0.60"
          },
          {
            "key": "C",
            "text": "1.25"
          },
          {
            "key": "D",
            "text": "0.50"
          }
        ],
        "correct_option": "A",
        "explanation": "Power factor is defined as cos(\u03c6) = R / Z = 80 / 100 = 0.80.",
        "formula": "\\cos\\phi = \\frac{R}{Z}",
        "topic": "AC Power"
      },
      {
        "id": "q3-18",
        "question_number": 18,
        "page_number": 4,
        "question_text": "In Bohr's model of the hydrogen atom, the principal energy levels are proportional to:",
        "options": [
          {
            "key": "A",
            "text": "-13.6 eV / n\u00b2"
          },
          {
            "key": "B",
            "text": "-13.6 eV \u00b7 n"
          },
          {
            "key": "C",
            "text": "13.6 eV / n"
          },
          {
            "key": "D",
            "text": "-13.6 eV / n\u00b3"
          }
        ],
        "correct_option": "A",
        "explanation": "Quantization of angular momentum results in discrete electron binding energies E_n = -13.6 eV / n\u00b2.",
        "formula": "E_n = -\\frac{13.6\\,\\text{eV}}{n^2}",
        "topic": "Bohr Model"
      },
      {
        "id": "q3-19",
        "question_number": 19,
        "page_number": 4,
        "question_text": "What type of semiconductor is formed when pure silicon (group IV) is doped with phosphorus (group V)?",
        "options": [
          {
            "key": "A",
            "text": "n-type semiconductor (electrons are majority carriers)"
          },
          {
            "key": "B",
            "text": "p-type semiconductor (holes are majority carriers)"
          },
          {
            "key": "C",
            "text": "Intrinsic insulator"
          },
          {
            "key": "D",
            "text": "Superconductor"
          }
        ],
        "correct_option": "A",
        "explanation": "Phosphorus atoms donate an extra fifth valence electron to the conduction band, producing negative (n-type) conduction carriers.",
        "formula": "\\text{Donor dopant} \\implies n_e \\gg n_h",
        "topic": "Solid State Physics"
      },
      {
        "id": "q3-20",
        "question_number": 20,
        "page_number": 4,
        "question_text": "What is the voltage drop across a silicon p-n junction diode in forward bias under standard room temperature conduction?",
        "options": [
          {
            "key": "A",
            "text": "Approximately 0.7 V"
          },
          {
            "key": "B",
            "text": "Approximately 0.3 V"
          },
          {
            "key": "C",
            "text": "5.0 V"
          },
          {
            "key": "D",
            "text": "0.0 V"
          }
        ],
        "correct_option": "A",
        "explanation": "The built-in barrier potential for silicon p-n junctions is roughly 0.7 V (compared to ~0.3 V for germanium).",
        "formula": "V_{barrier} \\approx 0.7\\,\\text{V}",
        "topic": "Semiconductors"
      },
      {
        "id": "q3-21",
        "question_number": 21,
        "page_number": 5,
        "question_text": "What is the SI unit of magnetic flux \u03a6_B?",
        "options": [
          {
            "key": "A",
            "text": "Weber (Wb)"
          },
          {
            "key": "B",
            "text": "Tesla (T)"
          },
          {
            "key": "C",
            "text": "Henry (H)"
          },
          {
            "key": "D",
            "text": "Lumen (lm)"
          }
        ],
        "correct_option": "A",
        "explanation": "Magnetic flux is measured in Webers (Wb), where 1 Wb = 1 T\u00b7m\u00b2 = 1 V\u00b7s.",
        "formula": "1\\,\\text{Wb} = 1\\,\\text{T}\\cdot\\text{m}^2",
        "topic": "Units & Constants"
      },
      {
        "id": "q3-22",
        "question_number": 22,
        "page_number": 5,
        "question_text": "A transformer has 200 primary turns and 1000 secondary turns. If 120 V AC is supplied to the primary, what is the output voltage?",
        "options": [
          {
            "key": "A",
            "text": "600 V"
          },
          {
            "key": "B",
            "text": "24 V"
          },
          {
            "key": "C",
            "text": "240 V"
          },
          {
            "key": "D",
            "text": "1200 V"
          }
        ],
        "correct_option": "A",
        "explanation": "Turns ratio V_s / V_p = N_s / N_p => V_s = 120 \u00d7 (1000 / 200) = 120 \u00d7 5 = 600 V.",
        "formula": "\\frac{V_s}{V_p} = \\frac{N_s}{N_p}",
        "topic": "Transformers"
      },
      {
        "id": "q3-23",
        "question_number": 23,
        "page_number": 5,
        "question_text": "What is the decay constant \u03bb of a radioactive isotope with half-life T_{1/2} = 10 days?",
        "options": [
          {
            "key": "A",
            "text": "0.0693 day\u207b\u00b9"
          },
          {
            "key": "B",
            "text": "0.693 day\u207b\u00b9"
          },
          {
            "key": "C",
            "text": "14.4 days"
          },
          {
            "key": "D",
            "text": "0.100 day\u207b\u00b9"
          }
        ],
        "correct_option": "A",
        "explanation": "\u03bb = ln(2) / T_{1/2} = 0.69315 / 10 = 0.0693 day\u207b\u00b9.",
        "formula": "\\lambda = \\frac{\\ln 2}{T_{1/2}}",
        "topic": "Nuclear Physics"
      },
      {
        "id": "q3-24",
        "question_number": 24,
        "page_number": 5,
        "question_text": "In special relativity, how does the measured length L of a moving spaceship compare to its rest length L\u2080 along the direction of motion?",
        "options": [
          {
            "key": "A",
            "text": "L = L\u2080 \u221a(1 - v\u00b2/c\u00b2) (Length contraction)"
          },
          {
            "key": "B",
            "text": "L = L\u2080 / \u221a(1 - v\u00b2/c\u00b2) (Length dilation)"
          },
          {
            "key": "C",
            "text": "It remains unchanged"
          },
          {
            "key": "D",
            "text": "L becomes infinite"
          }
        ],
        "correct_option": "A",
        "explanation": "Lorentz length contraction indicates that an object moving at relativistic speed v contracts along its axis of motion by factor \u221a(1 - v\u00b2/c\u00b2).",
        "formula": "L = L_0 \\sqrt{1 - \\frac{v^2}{c^2}}",
        "topic": "Special Relativity"
      },
      {
        "id": "q3-25",
        "question_number": 25,
        "page_number": 5,
        "question_text": "What is the mass equivalent of 1 Joule of energy according to Einstein's mass-energy equivalence equation?",
        "options": [
          {
            "key": "A",
            "text": "1.11 \u00d7 10\u207b\u00b9\u2077 kg"
          },
          {
            "key": "B",
            "text": "3.0 \u00d7 10\u2078 kg"
          },
          {
            "key": "C",
            "text": "9.0 \u00d7 10\u00b9\u2076 kg"
          },
          {
            "key": "D",
            "text": "1.0 kg"
          }
        ],
        "correct_option": "A",
        "explanation": "m = E / c\u00b2 = 1 J / (3.0 \u00d7 10\u2078 m/s)\u00b2 = 1 / (9 \u00d7 10\u00b9\u2076) \u2248 1.11 \u00d7 10\u207b\u00b9\u2077 kg.",
        "formula": "m = \\frac{E}{c^2}",
        "topic": "Relativity"
      }
    ]
  },
  {
    "id": "exam-004",
    "title": "Communicative English Skills Final Exam (FLEn 1011)",
    "code": "FLEn 1011",
    "university_id": "unity",
    "university": "Hawassa University",
    "department": "Foreign Languages & Communication",
    "subject": "English",
    "exam_type": "Final",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 4,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.8,
    "reviews": 82,
    "purchases": 560,
    "description": "Complete 4-page official freshman Communicative English exam paper covering Reading Comprehension, Context Clues, Tense Agreement, Modal Auxiliaries, and Paragraph Cohesion.",
    "tags": [
      "english",
      "grammar",
      "reading",
      "freshman"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-08-21.jpg",
      "/test-images/photo_2026-10-23_20-08-23.jpg",
      "/test-images/photo_2026-10-23_20-08-24.jpg",
      "/test-images/photo_2026-10-23_20-08-29.jpg"
    ],
    "questions": [
      {
        "id": "q4-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "Choose the sentence with correct subject-verb agreement:",
        "options": [
          {
            "key": "A",
            "text": "Neither the lecture notes nor the textbook was returned to the library."
          },
          {
            "key": "B",
            "text": "Neither the lecture notes nor the textbook were returned to the library."
          },
          {
            "key": "C",
            "text": "Neither the lecture notes or the textbook are returned."
          },
          {
            "key": "D",
            "text": "Neither the lecture note nor the textbook have returned."
          }
        ],
        "correct_option": "A",
        "explanation": "When subjects are joined by \"neither... nor...\", the verb agrees in number with the closer subject. \"Textbook\" is singular, so singular \"was\" is required.",
        "topic": "Subject-Verb Agreement"
      },
      {
        "id": "q4-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "Identify the contextual meaning of the underlined word: \"The professor offered a succinct summary that clarified the dense chapter in three minutes.\"",
        "options": [
          {
            "key": "A",
            "text": "Brief and clearly expressed"
          },
          {
            "key": "B",
            "text": "Vague and complicated"
          },
          {
            "key": "C",
            "text": "Lengthy and verbose"
          },
          {
            "key": "D",
            "text": "Repetitive"
          }
        ],
        "correct_option": "A",
        "explanation": "Succinct means concise, brief, and clearly articulated without unnecessary words.",
        "topic": "Vocabulary in Context"
      },
      {
        "id": "q4-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "Which transition word best expresses a concession between two contrasting arguments?",
        "options": [
          {
            "key": "A",
            "text": "Nonetheless"
          },
          {
            "key": "B",
            "text": "Furthermore"
          },
          {
            "key": "C",
            "text": "Consequently"
          },
          {
            "key": "D",
            "text": "Similarly"
          }
        ],
        "correct_option": "A",
        "explanation": "\"Nonetheless\" introduces an acknowledgment of opposition or concession before maintaining the central claim.",
        "topic": "Cohesion & Transitions"
      },
      {
        "id": "q4-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "Select the correct conditional sentence denoting an impossible past condition:",
        "options": [
          {
            "key": "A",
            "text": "If she had studied the past exam papers, she would have passed with distinction."
          },
          {
            "key": "B",
            "text": "If she studied the past exam papers, she will pass."
          },
          {
            "key": "C",
            "text": "If she would have studied, she had passed."
          },
          {
            "key": "D",
            "text": "If she has studied, she would pass."
          }
        ],
        "correct_option": "A",
        "explanation": "Third conditional (unreal past) follows: If + past perfect (had studied), would have + past participle (would have passed).",
        "topic": "Conditional Clauses"
      },
      {
        "id": "q4-5",
        "question_number": 5,
        "page_number": 1,
        "question_text": "Convert into passive voice: \"The examination board announced the national results yesterday.\"",
        "options": [
          {
            "key": "A",
            "text": "The national results were announced by the examination board yesterday."
          },
          {
            "key": "B",
            "text": "The national results are announced by the examination board."
          },
          {
            "key": "C",
            "text": "The examination board was announced by the results."
          },
          {
            "key": "D",
            "text": "The national results have been announced yesterday."
          }
        ],
        "correct_option": "A",
        "explanation": "Simple past passive requires: object + were + past participle (were announced) + agent.",
        "topic": "Voice & Transformations"
      },
      {
        "id": "q4-6",
        "question_number": 6,
        "page_number": 2,
        "question_text": "Identify the sentence containing a misplaced modifier:",
        "options": [
          {
            "key": "A",
            "text": "Running across the campus quad, the rain soaked my notebook."
          },
          {
            "key": "B",
            "text": "Running across the campus quad, I tried to protect my notebook from the rain."
          },
          {
            "key": "C",
            "text": "As I ran across the campus quad, the rain soaked my notebook."
          },
          {
            "key": "D",
            "text": "While running across the campus quad, I got drenched by the rain."
          }
        ],
        "correct_option": "A",
        "explanation": "In choice A, \"running across the campus quad\" modifies \"the rain\", implying the rain was running.",
        "topic": "Sentence Mechanics"
      },
      {
        "id": "q4-7",
        "question_number": 7,
        "page_number": 2,
        "question_text": "Which sentence correctly demonstrates parallel structure?",
        "options": [
          {
            "key": "A",
            "text": "Students must balance attending lectures, reviewing notes, and completing assignments."
          },
          {
            "key": "B",
            "text": "Students must balance attending lectures, to review notes, and completing assignments."
          },
          {
            "key": "C",
            "text": "Students must balance lectures, reviewing notes, and assignments."
          },
          {
            "key": "D",
            "text": "Students must balance to attend lectures, review notes, and completing assignments."
          }
        ],
        "correct_option": "A",
        "explanation": "All listed items use parallel gerund forms (-ing): attending, reviewing, and completing.",
        "topic": "Parallelism"
      },
      {
        "id": "q4-8",
        "question_number": 8,
        "page_number": 2,
        "question_text": "What is the tone of an academic argumentative essay?",
        "options": [
          {
            "key": "A",
            "text": "Objective, evidence-based, and formal"
          },
          {
            "key": "B",
            "text": "Emotional, colloquial, and hyperbolic"
          },
          {
            "key": "C",
            "text": "Sarcastic and humorous"
          },
          {
            "key": "D",
            "text": "Subjective and informal"
          }
        ],
        "correct_option": "A",
        "explanation": "Academic argumentation demands impartial analysis, formal vocabulary, and objective citations.",
        "topic": "Academic Writing"
      },
      {
        "id": "q4-9",
        "question_number": 9,
        "page_number": 2,
        "question_text": "Choose the appropriate modal auxiliary: \"You ______ speak loudly in the library; it is strictly prohibited.\"",
        "options": [
          {
            "key": "A",
            "text": "must not"
          },
          {
            "key": "B",
            "text": "might not"
          },
          {
            "key": "C",
            "text": "need not"
          },
          {
            "key": "D",
            "text": "could not"
          }
        ],
        "correct_option": "A",
        "explanation": "\"Must not\" expresses formal prohibition.",
        "topic": "Modals"
      },
      {
        "id": "q4-10",
        "question_number": 10,
        "page_number": 2,
        "question_text": "Which sentence correctly uses a semicolon?",
        "options": [
          {
            "key": "A",
            "text": "The library closes at midnight; however, students may request extended access."
          },
          {
            "key": "B",
            "text": "The library closes at midnight; and students may study."
          },
          {
            "key": "C",
            "text": "Although the library closes at midnight; students study."
          },
          {
            "key": "D",
            "text": "The library closes; because it is late."
          }
        ],
        "correct_option": "A",
        "explanation": "A semicolon separates two independent clauses linked by a conjunctive adverb like \"however\".",
        "topic": "Punctuation"
      },
      {
        "id": "q4-11",
        "question_number": 11,
        "page_number": 3,
        "question_text": "Identify the thesis statement among the following sentences:",
        "options": [
          {
            "key": "A",
            "text": "Renewable energy investments in Ethiopia should expand because they reduce drought vulnerability and stimulate youth employment."
          },
          {
            "key": "B",
            "text": "Renewable energy is becoming very popular in East Africa."
          },
          {
            "key": "C",
            "text": "Did you know that hydroelectric dams generate clean power?"
          },
          {
            "key": "D",
            "text": "In this essay I will talk about power stations."
          }
        ],
        "correct_option": "A",
        "explanation": "A strong thesis takes a debatable stance and outlines specific supporting reasons.",
        "topic": "Essay Structure"
      },
      {
        "id": "q4-12",
        "question_number": 12,
        "page_number": 3,
        "question_text": "What does the idiom \"burn the midnight oil\" mean in an academic context?",
        "options": [
          {
            "key": "A",
            "text": "To work or study late into the night"
          },
          {
            "key": "B",
            "text": "To waste resources carelessly"
          },
          {
            "key": "C",
            "text": "To cause an accidental laboratory fire"
          },
          {
            "key": "D",
            "text": "To finish tasks early in the morning"
          }
        ],
        "correct_option": "A",
        "explanation": "\"Burn the midnight oil\" is a common idiom meaning to study or work until very late hours.",
        "topic": "Idiomatic Expressions"
      },
      {
        "id": "q4-13",
        "question_number": 13,
        "page_number": 3,
        "question_text": "Which of the following is a run-on sentence?",
        "options": [
          {
            "key": "A",
            "text": "The lecture was inspiring the students asked numerous questions."
          },
          {
            "key": "B",
            "text": "Because the lecture was inspiring, the students asked numerous questions."
          },
          {
            "key": "C",
            "text": "The lecture was inspiring, so the students asked numerous questions."
          },
          {
            "key": "D",
            "text": "The lecture was inspiring; the students asked numerous questions."
          }
        ],
        "correct_option": "A",
        "explanation": "Two independent clauses are fused together without coordinating conjunction or punctuation.",
        "topic": "Sentence Errors"
      },
      {
        "id": "q4-14",
        "question_number": 14,
        "page_number": 3,
        "question_text": "Select the correct reported speech form: He said, \"I have completed all assignments.\"",
        "options": [
          {
            "key": "A",
            "text": "He said that he had completed all assignments."
          },
          {
            "key": "B",
            "text": "He said that he has completed all assignments."
          },
          {
            "key": "C",
            "text": "He said that I had completed all assignments."
          },
          {
            "key": "D",
            "text": "He said that he completed all assignments yesterday."
          }
        ],
        "correct_option": "A",
        "explanation": "In indirect speech, present perfect \"have completed\" shifts back into past perfect \"had completed\".",
        "topic": "Indirect Speech"
      },
      {
        "id": "q4-15",
        "question_number": 15,
        "page_number": 3,
        "question_text": "What is the main purpose of an abstract in a research paper?",
        "options": [
          {
            "key": "A",
            "text": "To provide a concise overview of the objective, methods, findings, and conclusion"
          },
          {
            "key": "B",
            "text": "To list all bibliography sources alphabetically"
          },
          {
            "key": "C",
            "text": "To express gratitude to university advisers"
          },
          {
            "key": "D",
            "text": "To reproduce raw experimental tables"
          }
        ],
        "correct_option": "A",
        "explanation": "An abstract provides a comprehensive summary of the entire study.",
        "topic": "Academic Conventions"
      },
      {
        "id": "q4-16",
        "question_number": 16,
        "page_number": 4,
        "question_text": "Choose the correct preposition: \"The scholarship committee congratulated her ______ winning the award.\"",
        "options": [
          {
            "key": "A",
            "text": "on"
          },
          {
            "key": "B",
            "text": "for"
          },
          {
            "key": "C",
            "text": "with"
          },
          {
            "key": "D",
            "text": "at"
          }
        ],
        "correct_option": "A",
        "explanation": "The standard collocated verb pattern is \"to congratulate someone ON an accomplishment\".",
        "topic": "Prepositional Usage"
      },
      {
        "id": "q4-17",
        "question_number": 17,
        "page_number": 4,
        "question_text": "Which sentence uses commas correctly with a non-restrictive relative clause?",
        "options": [
          {
            "key": "A",
            "text": "Professor Alemayehu, who teaches calculus, received the excellence award."
          },
          {
            "key": "B",
            "text": "Professor Alemayehu who teaches calculus, received the excellence award."
          },
          {
            "key": "C",
            "text": "Professor Alemayehu, who teaches calculus received the excellence award."
          },
          {
            "key": "D",
            "text": "Professor Alemayehu who teaches calculus received the excellence award, today."
          }
        ],
        "correct_option": "A",
        "explanation": "Non-restrictive clauses add non-essential descriptive details and must be bracketed by commas on both sides.",
        "topic": "Punctuation"
      },
      {
        "id": "q4-18",
        "question_number": 18,
        "page_number": 4,
        "question_text": "What is plagiarism in academic ethics?",
        "options": [
          {
            "key": "A",
            "text": "Using another author's ideas or words without proper attribution"
          },
          {
            "key": "B",
            "text": "Collaborating in a study group with peers"
          },
          {
            "key": "C",
            "text": "Conducting statistical data collection"
          },
          {
            "key": "D",
            "text": "Publishing research in open access journals"
          }
        ],
        "correct_option": "A",
        "explanation": "Plagiarism is the wrongful appropriation of someone else's language or thoughts without crediting the creator.",
        "topic": "Academic Integrity"
      },
      {
        "id": "q4-19",
        "question_number": 19,
        "page_number": 4,
        "question_text": "Choose the correct antonym of \"ephemeral\":",
        "options": [
          {
            "key": "A",
            "text": "Permanent"
          },
          {
            "key": "B",
            "text": "Fleeting"
          },
          {
            "key": "C",
            "text": "Temporary"
          },
          {
            "key": "D",
            "text": "Transitory"
          }
        ],
        "correct_option": "A",
        "explanation": "\"Ephemeral\" means short-lived or fleeting; its direct antonym is permanent or enduring.",
        "topic": "Vocabulary"
      },
      {
        "id": "q4-20",
        "question_number": 20,
        "page_number": 4,
        "question_text": "Which of the following concluding sentences offers the strongest closure for an academic essay?",
        "options": [
          {
            "key": "A",
            "text": "Ultimately, addressing these structural barriers empowers universities to foster sustainable research innovation."
          },
          {
            "key": "B",
            "text": "In conclusion, that is all I have to write about this topic."
          },
          {
            "key": "C",
            "text": "Thanks for reading my paper, hope you learned something."
          },
          {
            "key": "D",
            "text": "And finally here is one more unrelated point."
          }
        ],
        "correct_option": "A",
        "explanation": "A strong conclusion synthesizes key insights and highlights broader significance without introducing abrupt extraneous arguments.",
        "topic": "Essay Writing"
      }
    ]
  },
  {
    "id": "exam-005",
    "title": "Introduction to Computing & Programming (COSC 1011)",
    "code": "COSC 1011",
    "university_id": "aau",
    "university": "Jimma University",
    "department": "Computer Science & Software Eng.",
    "subject": "Computer Science",
    "exam_type": "Final",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 3,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.9,
    "reviews": 110,
    "purchases": 720,
    "description": "Complete 3-page Jimma University computer science final exam paper covering Binary Conversions, C++ Control Flow, Pointers, Arrays, and Algorithm Complexity.",
    "tags": [
      "computer science",
      "programming",
      "c++",
      "algorithms"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-08-50.jpg",
      "/test-images/photo_2026-10-23_20-08-51.jpg",
      "/test-images/photo_2026-10-23_20-08-53.jpg"
    ],
    "questions": [
      {
        "id": "q5-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "Convert the decimal integer (45)\u2081\u2080 into its 8-bit binary representation:",
        "options": [
          {
            "key": "A",
            "text": "00101101"
          },
          {
            "key": "B",
            "text": "00110101"
          },
          {
            "key": "C",
            "text": "00101111"
          },
          {
            "key": "D",
            "text": "00010101"
          }
        ],
        "correct_option": "A",
        "explanation": "45 = 32 + 8 + 4 + 1 = 2\u2075 + 2\u00b3 + 2\u00b2 + 2\u2070 = (00101101)\u2082.",
        "formula": "45 = 32 + 8 + 4 + 1",
        "topic": "Number Systems"
      },
      {
        "id": "q5-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "What will be printed by the C++ code snippet:\nint x = 5;\ncout << x++ << \" \" << ++x;",
        "options": [
          {
            "key": "A",
            "text": "5 7"
          },
          {
            "key": "B",
            "text": "6 7"
          },
          {
            "key": "C",
            "text": "5 6"
          },
          {
            "key": "D",
            "text": "6 6"
          }
        ],
        "correct_option": "A",
        "explanation": "Post-increment x++ outputs 5 and then increments x to 6. Pre-increment ++x then increments x to 7 and outputs 7.",
        "topic": "C++ Operators"
      },
      {
        "id": "q5-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "What is the worst-case time complexity of Binary Search on a sorted array of n elements?",
        "options": [
          {
            "key": "A",
            "text": "O(log n)"
          },
          {
            "key": "B",
            "text": "O(n)"
          },
          {
            "key": "C",
            "text": "O(n\u00b2)"
          },
          {
            "key": "D",
            "text": "O(1)"
          }
        ],
        "correct_option": "A",
        "explanation": "Binary search halves the search space at each comparison step, yielding logarithmic O(log\u2082 n) runtime.",
        "formula": "T(n) = T(n/2) + O(1) \\implies O(\\log n)",
        "topic": "Algorithm Analysis"
      },
      {
        "id": "q5-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "In C++, what does the dereference operator (*) do when applied to a pointer variable?",
        "options": [
          {
            "key": "A",
            "text": "It accesses the value stored at the memory address pointed to"
          },
          {
            "key": "B",
            "text": "It returns the memory address of the pointer"
          },
          {
            "key": "C",
            "text": "It multiplies the address by 2"
          },
          {
            "key": "D",
            "text": "It frees the allocated heap memory"
          }
        ],
        "correct_option": "A",
        "explanation": "*ptr accesses the value held at the memory address currently pointed to by ptr.",
        "formula": "*p = \\text{value at address } p",
        "topic": "Pointers & Memory"
      },
      {
        "id": "q5-5",
        "question_number": 5,
        "page_number": 1,
        "question_text": "Which data structure follows the Last-In, First-Out (LIFO) access principle?",
        "options": [
          {
            "key": "A",
            "text": "Stack"
          },
          {
            "key": "B",
            "text": "Queue"
          },
          {
            "key": "C",
            "text": "Linked List"
          },
          {
            "key": "D",
            "text": "Binary Tree"
          }
        ],
        "correct_option": "A",
        "explanation": "A Stack strictly operates on a LIFO discipline where elements pushed last are popped first.",
        "topic": "Data Structures"
      },
      {
        "id": "q5-6",
        "question_number": 6,
        "page_number": 2,
        "question_text": "What is the output of the recursive function: int f(int n) { if(n <= 1) return 1; return n * f(n-1); } when called as f(4)?",
        "options": [
          {
            "key": "A",
            "text": "24"
          },
          {
            "key": "B",
            "text": "12"
          },
          {
            "key": "C",
            "text": "16"
          },
          {
            "key": "D",
            "text": "4"
          }
        ],
        "correct_option": "A",
        "explanation": "f(4) computes 4! = 4 \u00d7 3 \u00d7 2 \u00d7 1 = 24.",
        "formula": "4! = 24",
        "topic": "Recursion"
      },
      {
        "id": "q5-7",
        "question_number": 7,
        "page_number": 2,
        "question_text": "What is the role of the operating system's CPU scheduler?",
        "options": [
          {
            "key": "A",
            "text": "To allocate CPU execution time among ready processes"
          },
          {
            "key": "B",
            "text": "To compile high-level source code into machine binaries"
          },
          {
            "key": "C",
            "text": "To power down the motherboard"
          },
          {
            "key": "D",
            "text": "To detect network virus attacks"
          }
        ],
        "correct_option": "A",
        "explanation": "The CPU scheduler selects among runnable processes and allocates core time slices.",
        "topic": "Operating Systems"
      },
      {
        "id": "q5-8",
        "question_number": 8,
        "page_number": 2,
        "question_text": "In object-oriented programming, which principle allows different classes to define unique implementations of the same interface method?",
        "options": [
          {
            "key": "A",
            "text": "Polymorphism"
          },
          {
            "key": "B",
            "text": "Encapsulation"
          },
          {
            "key": "C",
            "text": "Inheritance"
          },
          {
            "key": "D",
            "text": "Compilation"
          }
        ],
        "correct_option": "A",
        "explanation": "Polymorphism enables an interface or base class method to be overridden and behave differently depending on the runtime instance.",
        "topic": "OOP Concepts"
      },
      {
        "id": "q5-9",
        "question_number": 9,
        "page_number": 2,
        "question_text": "How many bytes of storage does a 32-bit integer typically occupy in memory?",
        "options": [
          {
            "key": "A",
            "text": "4 bytes"
          },
          {
            "key": "B",
            "text": "2 bytes"
          },
          {
            "key": "C",
            "text": "8 bytes"
          },
          {
            "key": "D",
            "text": "1 byte"
          }
        ],
        "correct_option": "A",
        "explanation": "32 bits / 8 bits per byte = 4 bytes.",
        "formula": "\\frac{32}{8} = 4\\,\\text{bytes}",
        "topic": "Data Representation"
      },
      {
        "id": "q5-10",
        "question_number": 10,
        "page_number": 2,
        "question_text": "Which boolean gate outputs 1 only when both of its inputs are different (one 1 and one 0)?",
        "options": [
          {
            "key": "A",
            "text": "XOR gate"
          },
          {
            "key": "B",
            "text": "AND gate"
          },
          {
            "key": "C",
            "text": "NOR gate"
          },
          {
            "key": "D",
            "text": "NAND gate"
          }
        ],
        "correct_option": "A",
        "explanation": "An exclusive-OR (XOR) gate evaluates to true (1) if and only if the inputs differ.",
        "formula": "A \\oplus B",
        "topic": "Digital Logic"
      },
      {
        "id": "q5-11",
        "question_number": 11,
        "page_number": 3,
        "question_text": "What will happen if a program allocates heap memory using `new` in a loop without ever calling `delete`?",
        "options": [
          {
            "key": "A",
            "text": "A memory leak occurs, consuming RAM over time"
          },
          {
            "key": "B",
            "text": "The compiler will automatically optimize it away"
          },
          {
            "key": "C",
            "text": "The program will execute twice as fast"
          },
          {
            "key": "D",
            "text": "The hard drive will reformat"
          }
        ],
        "correct_option": "A",
        "explanation": "Failing to deallocate dynamic memory leads to memory leaks, gradually exhausting available system memory.",
        "topic": "Memory Management"
      },
      {
        "id": "q5-12",
        "question_number": 12,
        "page_number": 3,
        "question_text": "What is the base case in a recursive algorithm?",
        "options": [
          {
            "key": "A",
            "text": "The terminating condition that stops further recursive calls"
          },
          {
            "key": "B",
            "text": "The initial input passed by the user"
          },
          {
            "key": "C",
            "text": "The maximum memory allocated"
          },
          {
            "key": "D",
            "text": "The main function declaration"
          }
        ],
        "correct_option": "A",
        "explanation": "The base case handles simple inputs directly without further recursion, preventing infinite loops and stack overflow.",
        "topic": "Recursion"
      },
      {
        "id": "q5-13",
        "question_number": 13,
        "page_number": 3,
        "question_text": "Which of the following sorting algorithms has the best average-case time complexity of O(n log n)?",
        "options": [
          {
            "key": "A",
            "text": "Merge Sort"
          },
          {
            "key": "B",
            "text": "Bubble Sort"
          },
          {
            "key": "C",
            "text": "Insertion Sort"
          },
          {
            "key": "D",
            "text": "Selection Sort"
          }
        ],
        "correct_option": "A",
        "explanation": "Merge sort divides the array into halves and merges in linear time, guaranteeing O(n log n) in all cases.",
        "formula": "O(n \\log n)",
        "topic": "Sorting Algorithms"
      },
      {
        "id": "q5-14",
        "question_number": 14,
        "page_number": 3,
        "question_text": "In SQL database queries, which keyword is used to filter records matching specific conditions?",
        "options": [
          {
            "key": "A",
            "text": "WHERE"
          },
          {
            "key": "B",
            "text": "GROUP BY"
          },
          {
            "key": "C",
            "text": "ORDER BY"
          },
          {
            "key": "D",
            "text": "SELECT"
          }
        ],
        "correct_option": "A",
        "explanation": "The WHERE clause specifies search criteria for filtering rows returned by a query.",
        "topic": "Databases & SQL"
      },
      {
        "id": "q5-15",
        "question_number": 15,
        "page_number": 3,
        "question_text": "What does the HTTP 404 status code indicate in web applications?",
        "options": [
          {
            "key": "A",
            "text": "Resource Not Found on the server"
          },
          {
            "key": "B",
            "text": "Request Successful (OK)"
          },
          {
            "key": "C",
            "text": "Internal Server Error"
          },
          {
            "key": "D",
            "text": "Unauthorized Access"
          }
        ],
        "correct_option": "A",
        "explanation": "HTTP 404 Not Found signifies that the client was able to communicate with the server, but the requested URI could not be found.",
        "topic": "Networking & Web"
      }
    ]
  },
  {
    "id": "exam-006",
    "title": "Mobile Application Development (Android) Final Exam",
    "code": "COSC 4022",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Computer Science",
    "subject": "Mobile Computing",
    "exam_type": "Final",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 3,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.95,
    "reviews": 38,
    "purchases": 210,
    "description": "Official 2025 Mobile Application Development (Android) Exam with verified answers. Covers Content Providers, Fragments, Service lifecycle, Android Architecture stack, TextView formatting, and AdapterView components.",
    "tags": [
      "android",
      "java",
      "kotlin",
      "mobile",
      "computer science",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_12-41-09.jpg",
      "/test-images/photo_2026-10-30_12-41-14.jpg",
      "/test-images/photo_2026-10-30_12-41-12.jpg"
    ],
    "questions": [
      {
        "id": "q6-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "What is the primary use of a Content Provider in Android?",
        "options": [
          {
            "key": "A",
            "text": "For storing the data exclusively in a local private database"
          },
          {
            "key": "B",
            "text": "For sharing structured data securely between different applications"
          },
          {
            "key": "C",
            "text": "For sending arbitrary network data across remote HTTP web servers"
          },
          {
            "key": "D",
            "text": "None of the above"
          }
        ],
        "correct_option": "B",
        "explanation": "A ContentProvider manages access to a central repository of data, allowing secure, standardized cross-application data sharing using content URIs.",
        "topic": "Android System Components"
      },
      {
        "id": "q6-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "Which Android component displays a modular, reusable part of an activity UI on the screen?",
        "options": [
          {
            "key": "A",
            "text": "View"
          },
          {
            "key": "B",
            "text": "Manifest"
          },
          {
            "key": "C",
            "text": "Intent"
          },
          {
            "key": "D",
            "text": "Fragment"
          }
        ],
        "correct_option": "D",
        "explanation": "A Fragment represents a reusable sub-section of an Activity's user interface, with its own lifecycle and event handling.",
        "topic": "UI Components"
      },
      {
        "id": "q6-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "Which of the following is the direct parent class of the Android Service component?",
        "options": [
          {
            "key": "A",
            "text": "Context"
          },
          {
            "key": "B",
            "text": "Object"
          },
          {
            "key": "C",
            "text": "ContextThemeWrapper"
          },
          {
            "key": "D",
            "text": "ContextWrapper"
          }
        ],
        "correct_option": "D",
        "explanation": "In Android framework architecture, android.app.Service extends android.content.ContextWrapper, which in turn extends Context.",
        "topic": "Services & Lifecycle"
      },
      {
        "id": "q6-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "Which of the following is the topmost layer of the Android software architecture stack?",
        "options": [
          {
            "key": "A",
            "text": "System Libraries and Android Runtime"
          },
          {
            "key": "B",
            "text": "Linux Kernel"
          },
          {
            "key": "C",
            "text": "Applications"
          },
          {
            "key": "D",
            "text": "Application Framework"
          }
        ],
        "correct_option": "C",
        "explanation": "The top layer of Android architecture is the Applications layer (System Apps like Phone/Browser, and third-party User Apps).",
        "topic": "Android Architecture"
      },
      {
        "id": "q6-5",
        "question_number": 5,
        "page_number": 2,
        "question_text": "What does the 'ems' attribute determine when applied to a TextView or EditText?",
        "options": [
          {
            "key": "A",
            "text": "Text color code"
          },
          {
            "key": "B",
            "text": "Text typeface font style"
          },
          {
            "key": "C",
            "text": "Width of the view in terms of 'M' character widths"
          },
          {
            "key": "D",
            "text": "Maximum height limit of the text view"
          }
        ],
        "correct_option": "C",
        "explanation": "android:ems sets the width of the TextView to fit exactly N 'M' characters, providing typographic proportional sizing.",
        "topic": "Layout Attributes"
      },
      {
        "id": "q6-6",
        "question_number": 6,
        "page_number": 2,
        "question_text": "Which lifecycle state does an Activity enter when another non-full-screen activity takes focus?",
        "options": [
          {
            "key": "A",
            "text": "It is destroyed (onDestroy)"
          },
          {
            "key": "B",
            "text": "It enters the paused state (onPause)"
          },
          {
            "key": "C",
            "text": "It enters the stopped state (onStop)"
          },
          {
            "key": "D",
            "text": "It restarts automatically (onRestart)"
          }
        ],
        "correct_option": "B",
        "explanation": "When an activity loses foreground focus but remains partially visible (e.g. dialogue popup), it enters onPause().",
        "topic": "Activity Lifecycle"
      }
    ]
  },
  {
    "id": "exam-007",
    "title": "Computer Organization & Architecture Mid-Exam",
    "code": "COSC 2062",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Computer Science",
    "subject": "Computer Architecture",
    "exam_type": "Mid",
    "year": 2026,
    "semester": "2",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 4,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.88,
    "reviews": 46,
    "purchases": 194,
    "description": "Authentic certified exam paper covering Direct-Mapped & Set-Associative Caches, Programmed I/O Polling vs Interrupts, PIC Controllers, and Multiprocessor Cache Coherence protocols.",
    "tags": [
      "hardware",
      "cache",
      "architecture",
      "cpu",
      "computer science",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_12-51-51.jpg",
      "/test-images/photo_2026-10-30_12-51-52.jpg",
      "/test-images/photo_2026-10-30_12-51-53.jpg"
    ],
    "questions": [
      {
        "id": "q7-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "In a direct-mapped cache organization, a specific main memory block can be placed:",
        "options": [
          {
            "key": "A",
            "text": "Anywhere in any available line of the cache"
          },
          {
            "key": "B",
            "text": "In exactly one specific cache line determined by (Block Address) mod (Total Lines)"
          },
          {
            "key": "C",
            "text": "In a dynamically chosen set of two or more cache lines"
          },
          {
            "key": "D",
            "text": "Only in the highest indexed cache line"
          }
        ],
        "correct_option": "B",
        "explanation": "Direct-mapped cache has strict modulo mapping where index = (Block Address) mod (Number of cache lines). Each block has only one valid cache location.",
        "topic": "Memory Hierarchy & Caching"
      },
      {
        "id": "q7-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "What is the primary operational disadvantage of Programmed I/O (polling)?",
        "options": [
          {
            "key": "A",
            "text": "It requires excessively complex interrupt-handling hardware"
          },
          {
            "key": "B",
            "text": "It wastes substantial CPU clock cycles by repeatedly querying device status flags"
          },
          {
            "key": "C",
            "text": "It cannot communicate with more than one peripheral device"
          },
          {
            "key": "D",
            "text": "It is only compatible with high-speed secondary storage drives"
          }
        ],
        "correct_option": "B",
        "explanation": "In programmed I/O, the processor enters a busy-waiting loop checking status bits until the device is ready, wasting CPU processing capacity.",
        "topic": "I/O Management"
      },
      {
        "id": "q7-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "Which hardware device implements prioritized interrupt handling without physical daisy-chain wiring?",
        "options": [
          {
            "key": "A",
            "text": "Polling software routine"
          },
          {
            "key": "B",
            "text": "Direct Memory Access (DMA) engine"
          },
          {
            "key": "C",
            "text": "Programmable Interrupt Controller (PIC)"
          },
          {
            "key": "D",
            "text": "I/O Channel"
          }
        ],
        "correct_option": "C",
        "explanation": "A Programmable Interrupt Controller (such as Intel 8259A) accepts multi-device interrupt request lines and prioritizes them via software registers.",
        "topic": "Interrupt Systems"
      },
      {
        "id": "q7-4",
        "question_number": 4,
        "page_number": 1,
        "question_text": "Why does the cache coherence problem occur in symmetric multiprocessor systems?",
        "options": [
          {
            "key": "A",
            "text": "Individual L1 caches are too small to store shared arrays"
          },
          {
            "key": "B",
            "text": "Memory bus bandwidth is insufficient to propagate write cycles"
          },
          {
            "key": "C",
            "text": "Processor cores execute instructions at different clock frequencies"
          },
          {
            "key": "D",
            "text": "Multiple processors hold private cached copies of the same memory block, and one processor writes to its copy"
          }
        ],
        "correct_option": "D",
        "explanation": "When multiple CPU cores cache the same shared variable and core 1 writes a new value, core 2's local copy becomes stale unless bus snooping (MESI protocol) invalidates or updates it.",
        "topic": "Multiprocessor Systems"
      }
    ]
  },
  {
    "id": "exam-008",
    "title": "Compiler Design & System Programming Final Exam",
    "code": "COSC 3081",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Computer Science",
    "subject": "System Programming",
    "exam_type": "Final",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 3,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.92,
    "reviews": 51,
    "purchases": 230,
    "description": "Comprehensive compiler design exam covering Lexical vs Syntax analysis, Synthesized vs Inherited parse tree attributes, Type Checking, and Bottom-Up LR Parsing reductions.",
    "tags": [
      "compiler",
      "automata",
      "grammar",
      "parsing",
      "computer science",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_12-40-47.jpg",
      "/test-images/photo_2026-10-30_12-40-50.jpg"
    ],
    "questions": [
      {
        "id": "q8-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "In an attributed parse tree (Syntax-Directed Definition), synthesized attributes of a node depend strictly upon:",
        "options": [
          {
            "key": "A",
            "text": "The parent node's attribute values exclusively"
          },
          {
            "key": "B",
            "text": "The attribute values of its children nodes and the node itself"
          },
          {
            "key": "C",
            "text": "The right-side sibling nodes exclusively"
          },
          {
            "key": "D",
            "text": "None of the above"
          }
        ],
        "correct_option": "B",
        "explanation": "A synthesized attribute at node N is defined only in terms of attribute values at the children of N and at N itself, evaluated bottom-up.",
        "topic": "Syntax-Directed Translation"
      },
      {
        "id": "q8-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "A compiler should report a semantic error when an operator is applied to incompatible operands during which compilation phase?",
        "options": [
          {
            "key": "A",
            "text": "Lexical Analysis (Scanner)"
          },
          {
            "key": "B",
            "text": "Syntax Analysis (Parser)"
          },
          {
            "key": "C",
            "text": "Semantic Analysis (Type Checker)"
          },
          {
            "key": "D",
            "text": "Code Optimization"
          }
        ],
        "correct_option": "C",
        "explanation": "Semantic analysis checks source code for semantic consistency with the language definition, including type matching and operator compatibility.",
        "topic": "Semantic Analysis"
      },
      {
        "id": "q8-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "Which parsing methodology starts from the input token tokens (leaves) and iteratively applies reductions toward the root start symbol?",
        "options": [
          {
            "key": "A",
            "text": "Top-Down Recursive Descent Parser"
          },
          {
            "key": "B",
            "text": "Bottom-Up (Shift-Reduce / LR) Parser"
          },
          {
            "key": "C",
            "text": "LL(1) Predictive Parser"
          },
          {
            "key": "D",
            "text": "Lexical Analyzer"
          }
        ],
        "correct_option": "B",
        "explanation": "Bottom-up parsing builds the parse tree from leaves to the root by shifting tokens and reducing handles corresponding to rightmost derivations in reverse.",
        "topic": "Bottom-Up Parsing"
      }
    ]
  },
  {
    "id": "exam-009",
    "title": "Cryptography & Network Security Final Exam",
    "code": "COSC 4112",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Computer Science",
    "subject": "Cybersecurity",
    "exam_type": "Final",
    "year": 2025,
    "semester": "2",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 4,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.96,
    "reviews": 63,
    "purchases": 320,
    "description": "Authentic examination paper with verified solutions on AES vs DES key and block sizes, Elliptic Curve Cryptography (ECC) advantages, Public Key Infrastructure, and Secure Email protocols (PGP/S-MIME).",
    "tags": [
      "cryptography",
      "security",
      "aes",
      "des",
      "ecc",
      "computer science"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-08-21.jpg",
      "/test-images/photo_2026-10-23_20-08-24.jpg",
      "/test-images/photo_2026-10-23_20-08-51.jpg"
    ],
    "questions": [
      {
        "id": "q9-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "What is the primary technological advantage of Elliptic Curve Cryptography (ECC) over RSA?",
        "options": [
          {
            "key": "A",
            "text": "ECC requires much larger key sizes to ensure baseline security"
          },
          {
            "key": "B",
            "text": "ECC provides equivalent cryptographic security with significantly smaller key sizes"
          },
          {
            "key": "C",
            "text": "ECC is a symmetric cipher whereas RSA is asymmetric"
          },
          {
            "key": "D",
            "text": "ECC eliminates the need for mathematical modular arithmetic"
          }
        ],
        "correct_option": "B",
        "explanation": "A 256-bit ECC key provides roughly the same security as a 3072-bit RSA key, enabling faster operations, lower power consumption, and smaller ciphertext/signatures.",
        "topic": "Asymmetric Cryptography"
      },
      {
        "id": "q9-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "Which symmetric block cipher standard utilizes a fixed 128-bit block size with selectable 128, 192, or 256-bit key lengths?",
        "options": [
          {
            "key": "A",
            "text": "DES (Data Encryption Standard)"
          },
          {
            "key": "B",
            "text": "Triple DES (3DES)"
          },
          {
            "key": "C",
            "text": "AES (Advanced Encryption Standard)"
          },
          {
            "key": "D",
            "text": "RC4 Stream Cipher"
          }
        ],
        "correct_option": "C",
        "explanation": "AES (Rijndael) was established by NIST with a fixed block length of 128 bits and three standardized key lengths: 128, 192, and 256 bits.",
        "topic": "Symmetric Ciphers"
      },
      {
        "id": "q9-3",
        "question_number": 3,
        "page_number": 2,
        "question_text": "In public key digital signatures, how does the recipient verify authenticity and non-repudiation?",
        "options": [
          {
            "key": "A",
            "text": "Decrypts the digital signature using the sender's public key and compares the hash with the received message digest"
          },
          {
            "key": "B",
            "text": "Decrypts the signature using the recipient's private key"
          },
          {
            "key": "C",
            "text": "Encrypts the message using a shared pre-shared secret key"
          },
          {
            "key": "D",
            "text": "Transmits an unencrypted checksum back to the certificate authority"
          }
        ],
        "correct_option": "A",
        "explanation": "The sender creates the signature by encrypting the message hash with their private key. Anyone with the sender's public key can verify that only the sender could have signed it.",
        "topic": "Digital Signatures & PKI"
      }
    ]
  },
  {
    "id": "exam-010",
    "title": "Microeconomics & Market Structures Mid-Exam",
    "code": "ECON 2011",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Economics",
    "subject": "Microeconomics",
    "exam_type": "Mid",
    "year": 2026,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 3,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.89,
    "reviews": 34,
    "purchases": 165,
    "description": "Authentic Ethiopian university past exam paper with step-by-step verified economic solutions. Covers Perfect Competition, Marginal Revenue, Shut-down conditions (P >= AVC), Monopoly pricing, and Oligopoly price leadership.",
    "tags": [
      "economics",
      "microeconomics",
      "market structures",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_12-52-15.jpg",
      "/test-images/photo_2026-10-30_12-59-07.jpg",
      "/test-images/photo_2026-10-30_12-59-08.jpg"
    ],
    "questions": [
      {
        "id": "q10-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "Which of the following characteristics accurately defines a perfectly competitive market structure?",
        "options": [
          {
            "key": "A",
            "text": "The market share of each individual firm is very small, making each firm a price taker"
          },
          {
            "key": "B",
            "text": "Firms produce highly differentiated products with trademark protection"
          },
          {
            "key": "C",
            "text": "Significant legal and financial barriers restrict entry and exit"
          },
          {
            "key": "D",
            "text": "A small group of dominant firms sets prices through collusive agreements"
          }
        ],
        "correct_option": "A",
        "explanation": "In perfect competition, there are so many sellers of an identical (homogeneous) good that no single firm has the market power to influence the market clearing price.",
        "topic": "Perfect Competition"
      },
      {
        "id": "q10-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "What is the shape and elasticity of the individual demand curve faced by a single firm in perfect competition?",
        "options": [
          {
            "key": "A",
            "text": "Downward sloping with unitary elasticity"
          },
          {
            "key": "B",
            "text": "Upward sloping due to economies of scale"
          },
          {
            "key": "C",
            "text": "Horizontal line indicating infinitely elastic demand at market price P"
          },
          {
            "key": "D",
            "text": "U-shaped curve reflecting average variable cost"
          }
        ],
        "correct_option": "C",
        "explanation": "Because the firm can sell any quantity at the established market price, it faces a perfectly horizontal demand curve where P = AR = MR.",
        "topic": "Competitive Revenue Curves"
      },
      {
        "id": "q10-3",
        "question_number": 3,
        "page_number": 1,
        "question_text": "Why will a rational competitive firm continue operating in the short run even while incurring an economic loss, provided P >= AVC?",
        "options": [
          {
            "key": "A",
            "text": "The government reimburses fixed capital losses through educational subsidies"
          },
          {
            "key": "B",
            "text": "Free entry and exit is prohibited in the short run"
          },
          {
            "key": "C",
            "text": "Revenue covers all variable costs and contributes toward paying fixed costs, losing less than if it shut down completely"
          },
          {
            "key": "D",
            "text": "Marginal revenue exceeds marginal cost at all production levels"
          }
        ],
        "correct_option": "C",
        "explanation": "If a firm shuts down, its loss equals Total Fixed Cost (TFC). If P >= AVC, operating revenue covers all TVC and offsets part of TFC, minimizing total losses.",
        "topic": "Short-Run Shutdown Decision"
      }
    ]
  },
  {
    "id": "exam-011",
    "title": "Linear Algebra & Matrix Operations Final Exam",
    "code": "MATH 2011",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Mathematics & Statistics",
    "subject": "Mathematics",
    "exam_type": "Final",
    "year": 2026,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 2,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.94,
    "reviews": 42,
    "purchases": 250,
    "description": "Certified University Mathematics Exam covering Cramer's Rule for Linear Systems, Determinants, Matrix Inversion, and Definite/Indefinite Trigonometric Integrals with worked step-by-step proofs.",
    "tags": [
      "math",
      "linear algebra",
      "matrices",
      "cramer",
      "calculus",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_12-44-17.jpg",
      "/test-images/photo_2026-10-30_13-04-44.jpg"
    ],
    "questions": [
      {
        "id": "q11-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "Solve the following system of linear equations using Cramer's rule:\\n  x\u2081 + 3x\u2082 = 5\\n  2x\u2081 + x\u2082 = 5",
        "options": [
          {
            "key": "A",
            "text": "x\u2081 = 2,  x\u2082 = 1"
          },
          {
            "key": "B",
            "text": "x\u2081 = 1,  x\u2082 = 2"
          },
          {
            "key": "C",
            "text": "x\u2081 = -2, x\u2082 = 3"
          },
          {
            "key": "D",
            "text": "x\u2081 = 3,  x\u2082 = 1"
          }
        ],
        "correct_option": "A",
        "explanation": "Coefficient matrix determinant D = (1)(1) - (3)(2) = 1 - 6 = -5. For x\u2081: replace column 1 with [5, 5]^T -> D\u2081 = (5)(1) - (3)(5) = 5 - 15 = -10. x\u2081 = -10 / -5 = 2. For x\u2082: replace column 2 -> D\u2082 = (1)(5) - (5)(2) = 5 - 10 = -5. x\u2082 = -5 / -5 = 1. Verification: 2 + 3(1) = 5 and 2(2) + 1 = 5.",
        "formula": "x_i = \\det(A_i) / \\det(A)",
        "topic": "Systems of Linear Equations"
      },
      {
        "id": "q11-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "What is the result of evaluating the indefinite integral: \u222b tan(x) dx?",
        "options": [
          {
            "key": "A",
            "text": "sec\u00b2(x) + C"
          },
          {
            "key": "B",
            "text": "ln|sec(x)| + C"
          },
          {
            "key": "C",
            "text": "-ln|sec(x)| + C"
          },
          {
            "key": "D",
            "text": "cot(x) + C"
          }
        ],
        "correct_option": "B",
        "explanation": "\u222b tan(x) dx = \u222b (sin(x)/cos(x)) dx. Substituting u = cos(x), du = -sin(x) dx gives -\u222b (1/u) du = -ln|cos(x)| + C = ln|sec(x)| + C.",
        "formula": "\\int \\tan(x) dx = \\ln|\\sec(x)| + C",
        "topic": "Integral Calculus"
      }
    ]
  },
  {
    "id": "exam-012",
    "title": "Entrepreneurship & Small Business Management Final Exam",
    "code": "MGMT 3021",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Business & Management",
    "subject": "Management",
    "exam_type": "Final",
    "year": 2025,
    "semester": "1",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 3,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.91,
    "reviews": 39,
    "purchases": 180,
    "description": "Authentic examination questions and verified solutions on Patent Protection, Entrepreneurial Marketing Strategies, Credit Union vs Bank Financing, and Business Plan Feasibility Analysis.",
    "tags": [
      "business",
      "management",
      "entrepreneurship",
      "marketing",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-23_20-07-33.jpg",
      "/test-images/photo_2026-10-23_20-07-34.jpg",
      "/test-images/photo_2026-10-23_20-07-35.jpg"
    ],
    "questions": [
      {
        "id": "q12-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "What is the primary legal function and exclusive right granted by an invention patent?",
        "options": [
          {
            "key": "A",
            "text": "To protect published artistic, musical, and literary copyright material"
          },
          {
            "key": "B",
            "text": "To grant the inventor an exclusive monopoly right to manufacture, use, and sell the invention for a set statutory period"
          },
          {
            "key": "C",
            "text": "To guarantee automatic commercial success and profit margins in the market"
          },
          {
            "key": "D",
            "text": "To prevent other firms from advertising similar product branding slogans"
          }
        ],
        "correct_option": "B",
        "explanation": "A patent is an exclusive legal property right granted by a government to exclude others from making, using, offering for sale, or selling an invention for a limited period (normally 20 years).",
        "topic": "Intellectual Property"
      },
      {
        "id": "q12-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "What distinguishes credit union financing from commercial bank loans in entrepreneurial financing?",
        "options": [
          {
            "key": "A",
            "text": "Credit unions are for-profit commercial entities funded by venture capital"
          },
          {
            "key": "B",
            "text": "Credit unions are member-owned non-profit financial cooperatives that often provide lower interest rates to members"
          },
          {
            "key": "C",
            "text": "Commercial banks never require collateral or personal guarantees"
          },
          {
            "key": "D",
            "text": "Credit unions can only issue equity shares, not debt financing"
          }
        ],
        "correct_option": "B",
        "explanation": "Credit unions are cooperative, democratically owned financial institutions formed by groups with a common affiliation, returning earnings to members through lower loan rates and fees.",
        "topic": "Venture Financing"
      }
    ]
  },
  {
    "id": "exam-013",
    "title": "Object-Oriented Programming with C# Final Exam",
    "code": "COSC 2041",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Computer Science",
    "subject": "Programming",
    "exam_type": "Final",
    "year": 2025,
    "semester": "2",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 2,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.93,
    "reviews": 32,
    "purchases": 150,
    "description": "Certified C# Examination covering Classes, Inheritance, Encapsulation, Console I/O, Loops, and Constructors with double-checked code outputs and explanations.",
    "tags": [
      "c#",
      "dotnet",
      "oop",
      "programming",
      "computer science",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_12-41-21.jpg",
      "/test-images/photo_2026-10-30_12-41-22.jpg"
    ],
    "questions": [
      {
        "id": "q13-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "What is the exact output of the following C# snippet:\\n  int i = 0;\\n  while (i < 5) {\\n    Console.Write(i);\\n    i++;\\n  }",
        "options": [
          {
            "key": "A",
            "text": "01234"
          },
          {
            "key": "B",
            "text": "12345"
          },
          {
            "key": "C",
            "text": "0 1 2 3 4 5"
          },
          {
            "key": "D",
            "text": "012345"
          }
        ],
        "correct_option": "A",
        "explanation": "The loop initializes i at 0, writes 0, increments to 1, repeats through 4, and terminates when i reaches 5, producing the concatenated string '01234'.",
        "topic": "Control Structures"
      },
      {
        "id": "q13-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "In C# class inheritance, which keyword is used by a derived class to call the base class constructor?",
        "options": [
          {
            "key": "A",
            "text": "this"
          },
          {
            "key": "B",
            "text": "base"
          },
          {
            "key": "C",
            "text": "super"
          },
          {
            "key": "D",
            "text": "parent"
          }
        ],
        "correct_option": "B",
        "explanation": "In C#, the 'base' keyword explicitly calls constructors and members of the immediate base class (e.g. public Derived(int x) : base(x) { }).",
        "topic": "Object-Oriented Programming"
      }
    ]
  },
  {
    "id": "exam-014",
    "title": "Communicative English Language Skills II Final Exam",
    "code": "FLEn 1012",
    "university_id": "uni-005",
    "university": "Unity University",
    "department": "Languages & Social Sciences",
    "subject": "English",
    "exam_type": "Final",
    "year": 2026,
    "semester": "2",
    "price": 20,
    "is_free_sample": false,
    "status": "published",
    "pages": 2,
    "has_answers": true,
    "has_explanations": true,
    "rating": 4.9,
    "reviews": 48,
    "purchases": 220,
    "description": "Authentic English Skills exam paper featuring relative pronoun syntax (who vs whom), future perfect passive verb tenses, and direct-to-indirect reported speech transformations.",
    "tags": [
      "english",
      "grammar",
      "relative pronouns",
      "reported speech",
      "unity"
    ],
    "images": [
      "/test-images/photo_2026-10-30_13-05-07.jpg",
      "/test-images/photo_2026-10-30_13-05-41.jpg"
    ],
    "questions": [
      {
        "id": "q14-1",
        "question_number": 1,
        "page_number": 1,
        "question_text": "Complete the sentence: 'The committee selected the candidate _______ they believed had the most innovative proposal.'",
        "options": [
          {
            "key": "A",
            "text": "whom"
          },
          {
            "key": "B",
            "text": "who"
          },
          {
            "key": "C",
            "text": "that"
          },
          {
            "key": "D",
            "text": "which"
          }
        ],
        "correct_option": "B",
        "explanation": "'Who' is the subject of the clause 'had the most innovative proposal'. The phrase 'they believed' is an inserted parenthetical clause that does not make the pronoun an object.",
        "topic": "Relative Pronouns"
      },
      {
        "id": "q14-2",
        "question_number": 2,
        "page_number": 1,
        "question_text": "Complete the sentence: 'By the time you realize the implications of this decision, the damage _______ irreversibly.'",
        "options": [
          {
            "key": "A",
            "text": "will have been caused"
          },
          {
            "key": "B",
            "text": "will cause"
          },
          {
            "key": "C",
            "text": "is going to have caused"
          },
          {
            "key": "D",
            "text": "is causing"
          }
        ],
        "correct_option": "A",
        "explanation": "The Future Perfect Passive ('will have been caused') correctly indicates an action that will be completed prior to a designated reference time in the future.",
        "topic": "Verb Tenses"
      },
      {
        "id": "q14-3",
        "question_number": 3,
        "page_number": 2,
        "question_text": "Which is the correct reported speech transformation of: \\\"Don't forget to call your grandmother,\\\" her mother reminded her?",
        "options": [
          {
            "key": "A",
            "text": "Her mother reminded her not to forget to call her grandmother."
          },
          {
            "key": "B",
            "text": "Her mother told her that you don't forget calling her grandmother."
          },
          {
            "key": "C",
            "text": "Her mother asked her if she forgets to call your grandmother."
          },
          {
            "key": "D",
            "text": "Her mother reminded that she hasn't forgotten her grandmother."
          }
        ],
        "correct_option": "A",
        "explanation": "Negative imperatives in reported speech are transformed into 'reminded/told + object + not to + base verb' with pronouns shifted from second person 'your' to third person 'her'.",
        "topic": "Reported Speech"
      }
    ]
  }
];

export const COURSES: Course[] = [
  {
    "id": "course-001",
    "title": "Master Applied Mathematics for AAU",
    "subtitle": "Complete exam prep and core foundations for Ethiopian university students",
    "university": "AAU",
    "department": "Computer Science",
    "instructor": "Tibeb Academic Team",
    "price": 200,
    "original_price": 200,
    "rating": 4.9,
    "reviews": 234,
    "students": 1820,
    "lessons_count": 5,
    "lessons": 5,
    "duration": "24 hours",
    "level": "Beginner",
    "has_certificate": true,
    "description": "Master all the mathematics you need for university exams. Covers limits, differential calculus, integration, linear algebra, and probability with verified problem sets.",
    "learning_outcomes": [
      "Solve limit, continuity, and differentiability problems with ease",
      "Compute multivariable integrals and master matrix determinants",
      "Ace AAU Mid and Final Applied Math examinations with verified solutions",
      "Earn an official Tibeb Certificate of Completion"
    ],
    "modules": [
      {
        "id": "mod-1",
        "title": "Module 1: Differential Calculus Mastery",
        "lessons": [
          {
            "id": "les-1",
            "title": "1.1 Limits, Continuity & Epsilon-Delta proofs",
            "duration": "25 min",
            "type": "video",
            "summary": "Formal definition of limits, one-sided limits, and squeeze theorem applications.",
            "content": "Full theoretical foundations and solved example problems commonly appearing in AAU exams."
          },
          {
            "id": "les-2",
            "title": "1.2 Chain Rule, Implicit Differentiation & Related Rates",
            "duration": "30 min",
            "type": "video",
            "summary": "Techniques for differentiating composite functions and implicit relations.",
            "content": "Step-by-step problem-solving methods with authentic engineering examples."
          }
        ]
      },
      {
        "id": "mod-2",
        "title": "Module 2: Integral Calculus & Matrices",
        "lessons": [
          {
            "id": "les-3",
            "title": "2.1 Integration by Parts & Partial Fractions",
            "duration": "35 min",
            "type": "video",
            "summary": "Advanced techniques for evaluating complex rational and trigonometric integrals.",
            "content": "Systematic approaches to integration questions with verified solutions."
          },
          {
            "id": "les-4",
            "title": "2.2 Matrix Determinants & System of Linear Equations",
            "duration": "25 min",
            "type": "video",
            "summary": "Cramer's rule, Gaussian elimination, and matrix inversion algorithms.",
            "content": "Comprehensive review of linear algebra concepts tested in university curriculums."
          }
        ]
      }
    ],
    "tags": [
      "calculus",
      "linear algebra",
      "mathematics",
      "AAU"
    ]
  },
  {
    "id": "course-002",
    "title": "General Physics Mechanics & Waves Bootcamp",
    "subtitle": "From Newtonian Dynamics to Wave Optics for STEM Freshmen",
    "university": "AASTU",
    "department": "Applied Physics",
    "instructor": "Dr. Selamawit Tadesse",
    "price": 180,
    "original_price": 180,
    "rating": 4.8,
    "reviews": 189,
    "students": 1420,
    "lessons_count": 4,
    "lessons": 4,
    "duration": "20 hours",
    "level": "Beginner",
    "has_certificate": true,
    "description": "Thorough coverage of General Physics I and II syllabus used across Ethiopian science and technology universities.",
    "learning_outcomes": [
      "Analyze 2D kinematics and rotational dynamics with free-body diagrams",
      "Apply work-energy theorem and momentum conservation to collision problems",
      "Understand fluid dynamics, Archimedes principle, and simple harmonic oscillations",
      "Score top marks on university midterms and finals"
    ],
    "modules": [
      {
        "id": "phys-mod-1",
        "title": "Module 1: Classical Mechanics",
        "lessons": [
          {
            "id": "phys-les-1",
            "title": "1.1 Vectors, Newton's Laws & Friction Analysis",
            "duration": "25 min",
            "type": "video",
            "summary": "Rigorous vector decomposition and static/kinetic friction calculations.",
            "content": "In-depth analysis of inclined planes, connected blocks, and pulley dynamics."
          },
          {
            "id": "phys-les-2",
            "title": "1.2 Work, Kinetic Energy & Conservation Laws",
            "duration": "30 min",
            "type": "video",
            "summary": "Conservative forces, potential energy curves, and elastic collision proofs.",
            "content": "Detailed explanations of high-yield exam scenarios."
          }
        ]
      }
    ],
    "tags": [
      "physics",
      "mechanics",
      "AASTU",
      "waves"
    ]
  },
  {
    "id": "course-003",
    "title": "Data Structures & Algorithms in C++",
    "subtitle": "Pass University CS Programming Exams with High Distinction",
    "university": "Unity",
    "department": "Computer Science",
    "instructor": "Yonas Getachew",
    "price": 240,
    "original_price": 240,
    "rating": 4.9,
    "reviews": 312,
    "students": 2150,
    "lessons_count": 6,
    "lessons": 6,
    "duration": "28 hours",
    "level": "Intermediate",
    "has_certificate": true,
    "description": "Comprehensive course on linked lists, stacks, queues, binary trees, graphs, sorting, and algorithmic complexity in modern C++.",
    "learning_outcomes": [
      "Implement robust memory-safe linked lists, stacks, and binary trees in C++",
      "Master big-O notation, tree traversals, and dynamic programming",
      "Understand OS memory management, paging, and CPU scheduling algorithms",
      "Confidently tackle technical exams at AAU, JU, and BDU"
    ],
    "modules": [
      {
        "id": "cs-mod-1",
        "title": "Module 1: Essential Data Structures",
        "lessons": [
          {
            "id": "cs-les-1",
            "title": "1.1 Arrays, Linked Lists & Complexity Analysis",
            "duration": "20 min",
            "type": "video",
            "summary": "Time and space complexity comparisons of linked lists vs arrays.",
            "content": "In-depth analysis of singly and doubly linked lists, pointer manipulation, and asymptotic runtime."
          },
          {
            "id": "cs-les-2",
            "title": "1.2 Binary Trees, Heaps & Priority Queues",
            "duration": "25 min",
            "type": "video",
            "summary": "Tree traversals (Inorder, Preorder, Postorder) and heap properties.",
            "content": "How BSTs ensure O(log n) operations and how binary heaps power Dijkstra's algorithm."
          }
        ]
      }
    ],
    "tags": [
      "computer science",
      "database",
      "Unity"
    ]
  }
];

export interface TelegramPremiumPlan {
  id: string;
  name: string;
  duration: string;
  months: number;
  price: number;
  original_price: number;
  discount_percent: number;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
  delivery: string;
}

export const TELEGRAM_PREMIUM_PLANS: TelegramPremiumPlan[] = [
  {
    id: 'tg-3m',
    name: 'Telegram Premium 3 Months',
    duration: '3 Months',
    months: 3,
    price: 2990,
    original_price: 3600,
    discount_percent: 17,
    badge: 'Semester Plan',
    popular: false,
    description: '3 full months of Telegram Premium. Ideal for a full university semester with 4 GB uploads and max download speeds.',
    delivery: 'Instant (5-15 mins via @username)',
    features: [
      'Full 90 days uninterrupted Premium access',
      '4 GB high-res document & PDF downloads',
      'Real-time chat & channel translation',
      'Advanced chat management & folders',
      'Animated profile pictures & emoji status',
      'Telegram Business basic tools included',
      'Direct Telebirr, CBE & Chapa activation'
    ]
  },
  {
    id: 'tg-6m',
    name: 'Telegram Premium 6 Months',
    duration: '6 Months',
    months: 6,
    price: 3990,
    original_price: 5200,
    discount_percent: 24,
    badge: 'Popular 🔥',
    popular: true,
    description: 'Our #1 most popular Telegram Premium package in Ethiopia. Highest value with massive savings over the monthly rate.',
    delivery: 'Instant (5-15 mins via @username)',
    features: [
      '180 days uninterrupted Telegram Premium',
      'Instant activation directly to your @handle',
      'Max download bandwidth for course materials',
      'Voice note speech-to-text with one tap',
      'Star badge + custom reactive emojis',
      'Zero advertising anywhere on Telegram',
      'Priority customer support via Telegram'
    ]
  },
  {
    id: 'tg-12m',
    name: 'Telegram Premium 1 Year (12 Months)',
    duration: '12 Months',
    months: 12,
    price: 7190,
    original_price: 9900,
    discount_percent: 28,
    badge: 'Best Value 👑',
    popular: false,
    description: 'Complete 1-year Telegram Premium subscription with bonus Telegram Stars included. Pay once with Telebirr and enjoy all year round.',
    delivery: 'Instant (5-15 mins via @username)',
    features: [
      '365 days full Telegram Premium membership',
      '+74 Free Telegram Stars bonus included',
      '4 GB upload limit for all videos & large files',
      'Infinite cloud storage for notes & documents',
      'Exclusive profile icons, colors & star badges',
      'Automatic audio transcription in chats',
      'VIP Telegram concierge activation guarantee'
    ]
  }
];

// PRODUCTS alias mapped to Telegram Premium Plans for backward compatibility
export const PRODUCTS = TELEGRAM_PREMIUM_PLANS.map(plan => ({
  id: plan.id,
  name: plan.name,
  subtitle: plan.description,
  price: plan.price,
  original_price: plan.original_price,
  category: 'Telegram Premium',
  stock: 999,
  rating: 4.9,
  reviews: 240,
  description: plan.description,
  images: [],
  sizes: [plan.duration],
  variants: ['Direct @Username Gift / Activation'],
  delivery_days: plan.delivery,
  specifications: plan.features.map(f => ({ label: 'Feature', value: f }))
}));

export const BUNDLES = [
  {
    id: 'bundle-001',
    title: 'AAU CS Semester 1 Exam Pack',
    description: '5 essential CS first-year exam papers with full answer keys (20 ETB each).',
    price: 80,
    original_price: 100,
    items: ['exam-001', 'exam-002', 'exam-003'],
    university: 'AAU',
  },
];

