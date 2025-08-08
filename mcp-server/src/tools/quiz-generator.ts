import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface QuizArgs {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

interface Quiz {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
  totalQuestions: number;
}

export async function generateQuiz(args: QuizArgs): Promise<any> {
  const { topic, difficulty = 'easy', questionCount = 5 } = args;

  try {
    const quiz = await createQuiz(topic, difficulty, questionCount);
    
    return {
      content: [
        {
          type: 'text',
          text: formatQuiz(quiz),
        },
      ],
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Unable to generate quiz for "${topic}". Please try again.`,
        },
      ],
      isError: true,
    };
  }
}

async function createQuiz(topic: string, difficulty: string, questionCount: number): Promise<Quiz> {
  const prompt = `
Create a ${difficulty} level quiz about "${topic}" in DeFi with exactly ${questionCount} multiple choice questions.

Requirements:
- Each question should have 4 options (A, B, C, D)
- Include clear explanations for correct answers
- Focus on practical knowledge and real-world applications
- Avoid overly technical jargon for easy level
- Include risk awareness questions

Format each question as:
Question X: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [Letter]
Explanation: [Detailed explanation]

Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${questionCount}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert DeFi educator creating educational quizzes. Focus on practical knowledge that helps users make better decisions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const quizText = completion.choices[0]?.message?.content || '';
    return parseQuizFromText(quizText, topic, difficulty);
  } catch (error) {
    console.error('Error calling Groq API:', error);
    // Fallback to predefined quiz
    return getFallbackQuiz(topic, difficulty, questionCount);
  }
}

function parseQuizFromText(text: string, topic: string, difficulty: string): Quiz {
  const questions: QuizQuestion[] = [];
  const questionBlocks = text.split(/Question \d+:/);
  
  questionBlocks.slice(1).forEach((block, index) => {
    const lines = block.trim().split('\n');
    const questionText = lines[0]?.trim();
    
    const options: string[] = [];
    let correctAnswer = 0;
    let explanation = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^[A-D]\)/)) {
        options.push(line.substring(3).trim());
      } else if (line.startsWith('Correct Answer:')) {
        const answerLetter = line.split(':')[1]?.trim().toUpperCase();
        correctAnswer = answerLetter ? answerLetter.charCodeAt(0) - 65 : 0;
      } else if (line.startsWith('Explanation:')) {
        explanation = line.substring(12).trim();
      }
    }
    
    if (questionText && options.length === 4) {
      questions.push({
        id: index + 1,
        question: questionText,
        options,
        correctAnswer,
        explanation,
        difficulty,
      });
    }
  });
  
  return {
    topic,
    difficulty,
    questions,
    totalQuestions: questions.length,
  };
}

function getFallbackQuiz(topic: string, difficulty: string, questionCount: number): Quiz {
  const fallbackQuizzes: Record<string, QuizQuestion[]> = {
    'liquidity pools': [
      {
        id: 1,
        question: 'What is a liquidity pool in DeFi?',
        options: [
          'A swimming pool for crypto miners',
          'A smart contract holding tokens for trading',
          'A type of cryptocurrency wallet',
          'A mining reward system'
        ],
        correctAnswer: 1,
        explanation: 'A liquidity pool is a smart contract that holds tokens to facilitate decentralized trading.',
        difficulty: 'easy',
      },
      {
        id: 2,
        question: 'What is impermanent loss?',
        options: [
          'Permanent loss of funds',
          'Temporary reduction in value due to price changes',
          'Loss due to smart contract bugs',
          'Transaction fees'
        ],
        correctAnswer: 1,
        explanation: 'Impermanent loss occurs when the price ratio of tokens in a pool changes compared to when you deposited them.',
        difficulty: 'easy',
      },
    ],
    'yield farming': [
      {
        id: 1,
        question: 'What is yield farming?',
        options: [
          'Growing crops on a farm',
          'Earning rewards by providing liquidity to DeFi protocols',
          'Mining cryptocurrency',
          'Trading cryptocurrencies'
        ],
        correctAnswer: 1,
        explanation: 'Yield farming involves providing liquidity to DeFi protocols in exchange for rewards, often in the form of tokens.',
        difficulty: 'easy',
      },
    ],
  };
  
  const questions = fallbackQuizzes[topic.toLowerCase()] || fallbackQuizzes['liquidity pools'];
  
  return {
    topic,
    difficulty,
    questions: questions.slice(0, questionCount),
    totalQuestions: Math.min(questions.length, questionCount),
  };
}

function formatQuiz(quiz: Quiz): string {
  const difficultyEmoji = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
  };
  
  let formatted = `# 📚 DeFi Quiz: ${quiz.topic}

**Difficulty:** ${quiz.difficulty.toUpperCase()} ${difficultyEmoji[quiz.difficulty as keyof typeof difficultyEmoji]}
**Questions:** ${quiz.totalQuestions}

---

`;

  quiz.questions.forEach((q, index) => {
    formatted += `## Question ${q.id}
${q.question}

${q.options.map((option, i) => `**${String.fromCharCode(65 + i)})** ${option}`).join('\n')}

<details>
<summary>Click to see answer and explanation</summary>

**Correct Answer:** ${String.fromCharCode(65 + q.correctAnswer)}

**Explanation:** ${q.explanation}
</details>

---

`;
  });

  formatted += `## 🎯 Quiz Tips:
- Take your time to read each question carefully
- Think about real-world applications
- Consider the risks involved in each scenario
- Review explanations to deepen your understanding

## 📈 Next Steps:
1. Complete this quiz
2. Review any questions you got wrong
3. Practice the concepts on testnet
4. Take a more advanced quiz on this topic

*Remember: Understanding these concepts is crucial for safe DeFi participation!*`;

  return formatted;
}

// Helper function to check quiz answers
export function checkQuizAnswer(questionId: number, userAnswer: number, quiz: Quiz): {
  correct: boolean;
  explanation: string;
  correctAnswer: string;
} {
  const question = quiz.questions.find(q => q.id === questionId);
  if (!question) {
    return {
      correct: false,
      explanation: 'Question not found',
      correctAnswer: 'Unknown',
    };
  }
  
  const correct = userAnswer === question.correctAnswer;
  return {
    correct,
    explanation: question.explanation,
    correctAnswer: String.fromCharCode(65 + question.correctAnswer),
  };
}
