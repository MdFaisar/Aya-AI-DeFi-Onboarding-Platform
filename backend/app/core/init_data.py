from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizQuestion
from app.models.simulation import Simulation
from app.models.achievement import Achievement
import structlog

logger = structlog.get_logger()

def create_initial_data():
    """Create initial data for the application"""
    db = SessionLocal()
    try:
        # Create lessons
        create_initial_lessons(db)
        
        # Create quizzes
        create_initial_quizzes(db)
        
        # Create simulations
        create_initial_simulations(db)
        
        # Create achievements
        create_initial_achievements(db)
        
        db.commit()
        logger.info("Initial data created successfully")
        
    except Exception as e:
        logger.error("Failed to create initial data", error=str(e))
        db.rollback()
        raise
    finally:
        db.close()

def create_initial_lessons(db: Session):
    """Create initial lessons"""
    lessons_data = [
        {
            "lesson_id": "defi-fundamentals",
            "title": "DeFi Fundamentals",
            "description": "Learn the basics of decentralized finance",
            "difficulty": "beginner",
            "estimated_time": 30,
            "order": 1,
            "category": "fundamentals"
        },
        {
            "lesson_id": "understanding-wallets",
            "title": "Understanding Wallets",
            "description": "Master wallet security and management",
            "difficulty": "beginner",
            "estimated_time": 25,
            "order": 2,
            "category": "security"
        },
        {
            "lesson_id": "tokens-and-standards",
            "title": "Tokens and Standards",
            "description": "Understanding ERC-20, ERC-721, and other token standards",
            "difficulty": "beginner",
            "estimated_time": 35,
            "order": 3,
            "category": "fundamentals"
        },
        {
            "lesson_id": "decentralized-exchanges",
            "title": "Decentralized Exchanges",
            "description": "Learn how DEXs work and how to trade safely",
            "difficulty": "intermediate",
            "estimated_time": 45,
            "order": 4,
            "category": "trading"
        },
        {
            "lesson_id": "liquidity-pools",
            "title": "Liquidity Pools",
            "description": "Deep dive into liquidity provision and AMMs",
            "difficulty": "intermediate",
            "estimated_time": 50,
            "order": 5,
            "category": "trading"
        },
        {
            "lesson_id": "yield-farming",
            "title": "Yield Farming Strategies",
            "description": "Learn advanced yield optimization techniques",
            "difficulty": "advanced",
            "estimated_time": 60,
            "order": 6,
            "category": "advanced"
        },
        {
            "lesson_id": "risk-management",
            "title": "Risk Management",
            "description": "Advanced risk assessment and mitigation strategies",
            "difficulty": "advanced",
            "estimated_time": 55,
            "order": 7,
            "category": "risk"
        }
    ]
    
    for lesson_data in lessons_data:
        existing_lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_data["lesson_id"]).first()
        if not existing_lesson:
            lesson = Lesson(**lesson_data)
            db.add(lesson)

def create_initial_quizzes(db: Session):
    """Create initial quizzes"""
    quizzes_data = [
        {
            "quiz_id": "defi-basics",
            "title": "DeFi Basics Quiz",
            "description": "Test your understanding of DeFi fundamentals",
            "difficulty": "beginner",
            "category": "fundamentals",
            "time_limit": 300,
            "passing_score": 70,
            "questions": [
                {
                    "question_text": "What does DeFi stand for?",
                    "options": ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Deferred Finance"],
                    "correct_answer": 1,
                    "explanation": "DeFi stands for Decentralized Finance, referring to financial services built on blockchain."
                },
                {
                    "question_text": "Which blockchain is most commonly used for DeFi applications?",
                    "options": ["Bitcoin", "Ethereum", "Litecoin", "Ripple"],
                    "correct_answer": 1,
                    "explanation": "Ethereum is the most popular blockchain for DeFi due to its smart contract capabilities."
                },
                {
                    "question_text": "What is a smart contract?",
                    "options": ["A legal document", "Self-executing code on blockchain", "A type of cryptocurrency", "A trading strategy"],
                    "correct_answer": 1,
                    "explanation": "Smart contracts are self-executing programs on the blockchain that automatically enforce agreements."
                }
            ]
        },
        {
            "quiz_id": "wallet-security",
            "title": "Wallet Security Quiz",
            "description": "Assess your knowledge of wallet security practices",
            "difficulty": "beginner",
            "category": "security",
            "time_limit": 240,
            "passing_score": 75,
            "questions": [
                {
                    "question_text": "What should you never share with anyone?",
                    "options": ["Your wallet address", "Your private key", "Your transaction history", "Your DeFi portfolio"],
                    "correct_answer": 1,
                    "explanation": "Your private key should never be shared as it gives complete control over your wallet."
                },
                {
                    "question_text": "How many words are typically in a seed phrase?",
                    "options": ["8 or 16", "12 or 24", "6 or 12", "10 or 20"],
                    "correct_answer": 1,
                    "explanation": "Seed phrases typically contain 12 or 24 words that can restore your entire wallet."
                }
            ]
        }
    ]
    
    for quiz_data in quizzes_data:
        existing_quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_data["quiz_id"]).first()
        if not existing_quiz:
            questions_data = quiz_data.pop("questions")
            quiz = Quiz(**quiz_data)
            db.add(quiz)
            db.flush()  # Get the quiz ID
            
            for i, question_data in enumerate(questions_data):
                question = QuizQuestion(
                    quiz_id=quiz.id,
                    order=i + 1,
                    **question_data
                )
                db.add(question)

def create_initial_simulations(db: Session):
    """Create initial simulations"""
    simulations_data = [
        {
            "simulation_id": "uniswap-swap",
            "name": "Uniswap Token Swap",
            "description": "Practice swapping tokens on Uniswap",
            "type": "swap",
            "protocol": "uniswap",
            "difficulty": "beginner",
            "estimated_time": 15,
            "default_params": {
                "token_a": "ETH",
                "token_b": "USDC",
                "amount": "0.1",
                "slippage": 0.5
            }
        },
        {
            "simulation_id": "aave-lending",
            "name": "Aave Lending",
            "description": "Practice lending tokens on Aave",
            "type": "lend",
            "protocol": "aave",
            "difficulty": "beginner",
            "estimated_time": 20,
            "default_params": {
                "token": "USDC",
                "amount": "100"
            }
        },
        {
            "simulation_id": "aave-borrowing",
            "name": "Aave Borrowing",
            "description": "Practice borrowing tokens on Aave",
            "type": "borrow",
            "protocol": "aave",
            "difficulty": "intermediate",
            "estimated_time": 25,
            "default_params": {
                "collateral_token": "ETH",
                "collateral_amount": "1.0",
                "borrow_token": "USDC",
                "borrow_amount": "1000"
            }
        },
        {
            "simulation_id": "uniswap-liquidity",
            "name": "Uniswap Liquidity Provision",
            "description": "Practice providing liquidity on Uniswap",
            "type": "provide_liquidity",
            "protocol": "uniswap",
            "difficulty": "advanced",
            "estimated_time": 30,
            "default_params": {
                "token_a": "ETH",
                "token_b": "USDC",
                "amount_a": "1.0",
                "amount_b": "1850",
                "fee_tier": "0.3%"
            }
        }
    ]
    
    for simulation_data in simulations_data:
        existing_simulation = db.query(Simulation).filter(Simulation.simulation_id == simulation_data["simulation_id"]).first()
        if not existing_simulation:
            simulation = Simulation(**simulation_data)
            db.add(simulation)

def create_initial_achievements(db: Session):
    """Create initial achievements"""
    achievements_data = [
        {
            "achievement_id": "first_lesson",
            "name": "First Steps",
            "description": "Completed your first DeFi lesson",
            "icon": "🎯",
            "category": "learning",
            "rarity": "common",
            "points": 10,
            "conditions": {
                "type": "lesson_count",
                "target": 1
            }
        },
        {
            "achievement_id": "quiz_master",
            "name": "Quiz Master",
            "description": "Scored 90%+ on 3 quizzes",
            "icon": "🧠",
            "category": "learning",
            "rarity": "uncommon",
            "points": 25,
            "conditions": {
                "type": "quiz_high_score",
                "target": 3,
                "min_score": 90
            }
        },
        {
            "achievement_id": "simulation_pro",
            "name": "Simulation Pro",
            "description": "Completed 5 simulations successfully",
            "icon": "⚡",
            "category": "practice",
            "rarity": "rare",
            "points": 50,
            "conditions": {
                "type": "simulation_count",
                "target": 5
            }
        },
        {
            "achievement_id": "learning_streak_7",
            "name": "Week Warrior",
            "description": "Learn for 7 consecutive days",
            "icon": "🔥",
            "category": "engagement",
            "rarity": "uncommon",
            "points": 30,
            "conditions": {
                "type": "learning_streak",
                "target": 7
            }
        },
        {
            "achievement_id": "perfect_quiz",
            "name": "Perfect Score",
            "description": "Score 100% on any quiz",
            "icon": "💯",
            "category": "learning",
            "rarity": "rare",
            "points": 75,
            "conditions": {
                "type": "perfect_quiz_score",
                "target": 1
            }
        },
        {
            "achievement_id": "defi_expert",
            "name": "DeFi Expert",
            "description": "Complete all lessons and achieve expert level",
            "icon": "👑",
            "category": "mastery",
            "rarity": "legendary",
            "points": 200,
            "conditions": {
                "type": "expert_level",
                "target": 1
            }
        }
    ]
    
    for achievement_data in achievements_data:
        existing_achievement = db.query(Achievement).filter(Achievement.achievement_id == achievement_data["achievement_id"]).first()
        if not existing_achievement:
            achievement = Achievement(**achievement_data)
            db.add(achievement)
