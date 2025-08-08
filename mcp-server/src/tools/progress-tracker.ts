import axios from 'axios';

interface ProgressArgs {
  userId: string;
  action: 'complete_lesson' | 'pass_quiz' | 'complete_simulation' | 'get_progress';
  lessonId?: string;
  score?: number;
}

interface UserProgress {
  userId: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  passedQuizzes: number;
  totalSimulations: number;
  completedSimulations: number;
  overallProgress: number;
  achievements: Achievement[];
  currentLevel: string;
  nextMilestone: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export async function trackProgress(args: ProgressArgs): Promise<any> {
  const { userId, action, lessonId, score } = args;

  try {
    switch (action) {
      case 'complete_lesson':
        return await completeLesson(userId, lessonId || '');
      
      case 'pass_quiz':
        return await passQuiz(userId, lessonId || '', score || 0);
      
      case 'complete_simulation':
        return await completeSimulation(userId, lessonId || '');
      
      case 'get_progress':
        return await getUserProgress(userId);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error tracking progress:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Unable to track progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}

async function completeLesson(userId: string, lessonId: string): Promise<any> {
  // Mock lesson completion - in production, this would update a database
  const progress = await getMockUserProgress(userId);
  progress.completedLessons += 1;
  progress.overallProgress = calculateOverallProgress(progress);
  
  const newAchievements = checkForNewAchievements(progress);
  
  return {
    content: [
      {
        type: 'text',
        text: formatLessonCompletion(lessonId, progress, newAchievements),
      },
    ],
  };
}

async function passQuiz(userId: string, quizId: string, score: number): Promise<any> {
  const progress = await getMockUserProgress(userId);
  
  if (score >= 70) { // Passing score
    progress.passedQuizzes += 1;
    progress.overallProgress = calculateOverallProgress(progress);
  }
  
  const newAchievements = checkForNewAchievements(progress);
  
  return {
    content: [
      {
        type: 'text',
        text: formatQuizCompletion(quizId, score, progress, newAchievements),
      },
    ],
  };
}

async function completeSimulation(userId: string, simulationId: string): Promise<any> {
  const progress = await getMockUserProgress(userId);
  progress.completedSimulations += 1;
  progress.overallProgress = calculateOverallProgress(progress);
  
  const newAchievements = checkForNewAchievements(progress);
  
  return {
    content: [
      {
        type: 'text',
        text: formatSimulationCompletion(simulationId, progress, newAchievements),
      },
    ],
  };
}

async function getUserProgress(userId: string): Promise<any> {
  const progress = await getMockUserProgress(userId);
  
  return {
    content: [
      {
        type: 'text',
        text: formatProgressReport(progress),
      },
    ],
  };
}

async function getMockUserProgress(userId: string): Promise<UserProgress> {
  // Mock user progress - in production, this would fetch from database
  return {
    userId,
    totalLessons: 20,
    completedLessons: 8,
    totalQuizzes: 15,
    passedQuizzes: 6,
    totalSimulations: 10,
    completedSimulations: 3,
    overallProgress: 42,
    achievements: [
      {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Completed your first DeFi lesson',
        unlockedAt: '2024-01-15T10:00:00Z',
        icon: '🎯',
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Passed 5 quizzes in a row',
        unlockedAt: '2024-01-20T14:30:00Z',
        icon: '🧠',
      },
    ],
    currentLevel: 'Beginner',
    nextMilestone: 'Complete 10 lessons to reach Intermediate level',
  };
}

function calculateOverallProgress(progress: UserProgress): number {
  const lessonWeight = 0.5;
  const quizWeight = 0.3;
  const simulationWeight = 0.2;
  
  const lessonProgress = (progress.completedLessons / progress.totalLessons) * 100;
  const quizProgress = (progress.passedQuizzes / progress.totalQuizzes) * 100;
  const simulationProgress = (progress.completedSimulations / progress.totalSimulations) * 100;
  
  return Math.round(
    lessonProgress * lessonWeight +
    quizProgress * quizWeight +
    simulationProgress * simulationWeight
  );
}

function checkForNewAchievements(progress: UserProgress): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  // Check for various achievement conditions
  if (progress.completedLessons === 5 && !hasAchievement(progress, 'lesson_streak')) {
    newAchievements.push({
      id: 'lesson_streak',
      name: 'Learning Streak',
      description: 'Completed 5 lessons',
      unlockedAt: new Date().toISOString(),
      icon: '🔥',
    });
  }
  
  if (progress.passedQuizzes === 10 && !hasAchievement(progress, 'quiz_expert')) {
    newAchievements.push({
      id: 'quiz_expert',
      name: 'Quiz Expert',
      description: 'Passed 10 quizzes',
      unlockedAt: new Date().toISOString(),
      icon: '🏆',
    });
  }
  
  if (progress.completedSimulations === 5 && !hasAchievement(progress, 'simulation_pro')) {
    newAchievements.push({
      id: 'simulation_pro',
      name: 'Simulation Pro',
      description: 'Completed 5 simulations',
      unlockedAt: new Date().toISOString(),
      icon: '⚡',
    });
  }
  
  return newAchievements;
}

function hasAchievement(progress: UserProgress, achievementId: string): boolean {
  return progress.achievements.some(a => a.id === achievementId);
}

function formatLessonCompletion(lessonId: string, progress: UserProgress, newAchievements: Achievement[]): string {
  let message = `## ✅ Lesson Completed!

**Lesson:** ${lessonId}
**Progress:** ${progress.completedLessons}/${progress.totalLessons} lessons completed
**Overall Progress:** ${progress.overallProgress}%

`;

  if (newAchievements.length > 0) {
    message += `### 🎉 New Achievements Unlocked!
${newAchievements.map(a => `${a.icon} **${a.name}** - ${a.description}`).join('\n')}

`;
  }

  message += `### 📈 Next Steps:
- ${progress.nextMilestone}
- Take a quiz to test your knowledge
- Try a simulation to practice

Keep up the great work! 🚀`;

  return message;
}

function formatQuizCompletion(quizId: string, score: number, progress: UserProgress, newAchievements: Achievement[]): string {
  const passed = score >= 70;
  const statusIcon = passed ? '✅' : '❌';
  const statusText = passed ? 'Passed' : 'Failed';
  
  let message = `## ${statusIcon} Quiz ${statusText}!

**Quiz:** ${quizId}
**Score:** ${score}% ${score >= 90 ? '🌟' : score >= 80 ? '⭐' : ''}
**Status:** ${statusText} (70% required to pass)

`;

  if (passed) {
    message += `**Progress:** ${progress.passedQuizzes}/${progress.totalQuizzes} quizzes passed
**Overall Progress:** ${progress.overallProgress}%

`;
  }

  if (newAchievements.length > 0) {
    message += `### 🎉 New Achievements Unlocked!
${newAchievements.map(a => `${a.icon} **${a.name}** - ${a.description}`).join('\n')}

`;
  }

  if (passed) {
    message += `### 📈 Next Steps:
- ${progress.nextMilestone}
- Try a simulation to practice
- Move to the next lesson

Excellent work! 🎯`;
  } else {
    message += `### 📚 Recommendations:
- Review the lesson material
- Focus on areas where you struggled
- Retake the quiz when ready

Don't give up - learning takes time! 💪`;
  }

  return message;
}

function formatSimulationCompletion(simulationId: string, progress: UserProgress, newAchievements: Achievement[]): string {
  let message = `## ⚡ Simulation Completed!

**Simulation:** ${simulationId}
**Progress:** ${progress.completedSimulations}/${progress.totalSimulations} simulations completed
**Overall Progress:** ${progress.overallProgress}%

`;

  if (newAchievements.length > 0) {
    message += `### 🎉 New Achievements Unlocked!
${newAchievements.map(a => `${a.icon} **${a.name}** - ${a.description}`).join('\n')}

`;
  }

  message += `### 📈 Next Steps:
- ${progress.nextMilestone}
- Try the same transaction on mainnet with small amounts
- Explore more complex DeFi strategies

Great job practicing safely! 🛡️`;

  return message;
}

function formatProgressReport(progress: UserProgress): string {
  const progressBar = generateProgressBar(progress.overallProgress);
  
  return `## 📊 Your DeFi Learning Progress

**Overall Progress:** ${progress.overallProgress}% ${progressBar}
**Current Level:** ${progress.currentLevel}

### 📚 Learning Stats:
- **Lessons:** ${progress.completedLessons}/${progress.totalLessons} completed
- **Quizzes:** ${progress.passedQuizzes}/${progress.totalQuizzes} passed
- **Simulations:** ${progress.completedSimulations}/${progress.totalSimulations} completed

### 🏆 Achievements (${progress.achievements.length}):
${progress.achievements.map(a => `${a.icon} **${a.name}** - ${a.description}`).join('\n')}

### 🎯 Next Milestone:
${progress.nextMilestone}

### 📈 Recommendations:
${generateRecommendations(progress)}

Keep learning and stay safe in DeFi! 🚀`;
}

function generateProgressBar(percentage: number): string {
  const filled = Math.floor(percentage / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function generateRecommendations(progress: UserProgress): string {
  const recommendations: string[] = [];
  
  if (progress.completedLessons < progress.totalLessons / 2) {
    recommendations.push('- Focus on completing more lessons to build foundational knowledge');
  }
  
  if (progress.passedQuizzes < progress.totalQuizzes / 2) {
    recommendations.push('- Take more quizzes to test your understanding');
  }
  
  if (progress.completedSimulations < progress.totalSimulations / 2) {
    recommendations.push('- Practice with more simulations before using real funds');
  }
  
  if (progress.overallProgress > 80) {
    recommendations.push('- You\'re ready to start with small real transactions!');
    recommendations.push('- Consider exploring advanced DeFi strategies');
  }
  
  return recommendations.length > 0 ? recommendations.join('\n') : '- Keep up the great work!';
}
