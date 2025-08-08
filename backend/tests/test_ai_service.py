import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from app.services.ai_service import AIService

@pytest.fixture
def ai_service():
    """Create AI service instance for testing"""
    with patch('app.services.ai_service.settings') as mock_settings:
        mock_settings.GROQ_API_KEY = "test-key"
        mock_settings.MODEL_NAME = "test-model"
        mock_settings.MAX_TOKENS = 1000
        mock_settings.TEMPERATURE = 0.7
        return AIService()

@pytest.mark.asyncio
async def test_explain_concept_success(ai_service):
    """Test successful concept explanation"""
    # Mock Groq client response
    mock_completion = Mock()
    mock_completion.choices = [Mock()]
    mock_completion.choices[0].message.content = """
    # Liquidity Pools Explained

    ## Simple Definition
    A liquidity pool is like a shared pot of money that enables trading.

    ## How It Works
    Users deposit tokens into pools, and traders can swap against these pools.

    ## Practical Example
    Alice deposits ETH and USDC into a pool, earning fees from traders.

    ## Important Considerations/Risks
    - Impermanent loss risk
    - Smart contract risk

    ## Next Steps for Learning
    - Practice on testnet
    - Learn about impermanent loss
    """
    
    with patch.object(ai_service.client.chat.completions, 'create', return_value=mock_completion):
        with patch('app.services.ai_service.redis_client') as mock_redis:
            mock_redis.get.return_value = None
            mock_redis.setex = AsyncMock()
            
            result = await ai_service.explain_concept(
                concept="liquidity pools",
                user_level="beginner",
                include_example=True
            )
            
            assert "text" in result
            assert "liquidity pool" in result["text"].lower()
            assert isinstance(result["examples"], list)
            assert isinstance(result["next_steps"], list)

@pytest.mark.asyncio
async def test_explain_concept_cached(ai_service):
    """Test cached concept explanation"""
    cached_result = str({
        "text": "Cached explanation",
        "examples": ["Cached example"],
        "next_steps": ["Cached step"]
    })
    
    with patch('app.services.ai_service.redis_client') as mock_redis:
        mock_redis.get.return_value = cached_result
        
        result = await ai_service.explain_concept("test concept")
        
        assert result["text"] == "Cached explanation"
        mock_redis.get.assert_called_once()

@pytest.mark.asyncio
async def test_generate_quiz_success(ai_service):
    """Test successful quiz generation"""
    mock_completion = Mock()
    mock_completion.choices = [Mock()]
    mock_completion.choices[0].message.content = "Quiz content"
    
    with patch.object(ai_service.client.chat.completions, 'create', return_value=mock_completion):
        with patch('app.services.ai_service.redis_client') as mock_redis:
            mock_redis.get.return_value = None
            mock_redis.setex = AsyncMock()
            
            with patch.object(ai_service, '_parse_quiz_questions') as mock_parse:
                mock_parse.return_value = [
                    {
                        "id": 1,
                        "question": "Test question?",
                        "options": ["A", "B", "C", "D"],
                        "correct_answer": 0,
                        "explanation": "Test explanation"
                    }
                ]
                
                result = await ai_service.generate_quiz(
                    topic="DeFi basics",
                    difficulty="easy",
                    question_count=1
                )
                
                assert result["topic"] == "DeFi basics"
                assert result["difficulty"] == "easy"
                assert len(result["questions"]) == 1
                assert result["total_questions"] == 1

@pytest.mark.asyncio
async def test_chat_success(ai_service):
    """Test successful chat interaction"""
    mock_completion = Mock()
    mock_completion.choices = [Mock()]
    mock_completion.choices[0].message.content = "This is a helpful response about DeFi."
    
    with patch.object(ai_service.client.chat.completions, 'create', return_value=mock_completion):
        result = await ai_service.chat(
            message="What is DeFi?",
            context="User is a beginner"
        )
        
        assert "text" in result
        assert "DeFi" in result["text"]
        assert isinstance(result["suggestions"], list)
        assert isinstance(result["related_topics"], list)

@pytest.mark.asyncio
async def test_generate_learning_path(ai_service):
    """Test learning path generation"""
    result = await ai_service.generate_learning_path(
        user_level="beginner",
        completed_lessons=2,
        risk_tolerance="low",
        progress_percentage=20.0
    )
    
    assert "lessons" in result
    assert "milestone" in result
    assert "estimated_time" in result
    assert "focus_areas" in result
    assert isinstance(result["lessons"], list)
    assert len(result["lessons"]) > 0

@pytest.mark.asyncio
async def test_analyze_transaction(ai_service):
    """Test transaction analysis"""
    transaction_data = {
        "type": "swap",
        "tokenA": "ETH",
        "tokenB": "USDC",
        "amount": "1.0"
    }
    
    result = await ai_service.analyze_transaction(
        transaction_data=transaction_data,
        user_level="beginner"
    )
    
    assert "risk_level" in result
    assert "explanation" in result
    assert "warnings" in result
    assert "recommendations" in result
    assert "educational_notes" in result
    assert isinstance(result["warnings"], list)
    assert isinstance(result["recommendations"], list)

@pytest.mark.asyncio
async def test_explain_concept_error_handling(ai_service):
    """Test error handling in concept explanation"""
    with patch.object(ai_service.client.chat.completions, 'create', side_effect=Exception("API Error")):
        with patch('app.services.ai_service.redis_client') as mock_redis:
            mock_redis.get.return_value = None
            
            result = await ai_service.explain_concept("test concept")
            
            assert "apologize" in result["text"].lower()
            assert isinstance(result["examples"], list)
            assert isinstance(result["next_steps"], list)

@pytest.mark.asyncio
async def test_generate_quiz_fallback(ai_service):
    """Test quiz generation fallback"""
    with patch.object(ai_service.client.chat.completions, 'create', side_effect=Exception("API Error")):
        with patch('app.services.ai_service.redis_client') as mock_redis:
            mock_redis.get.return_value = None
            
            result = await ai_service.generate_quiz("test topic")
            
            assert result["topic"] == "test topic"
            assert len(result["questions"]) > 0
            assert "question" in result["questions"][0]

def test_extract_related_topics(ai_service):
    """Test related topics extraction"""
    topics = ai_service._extract_related_topics("How do I swap tokens?")
    assert isinstance(topics, list)
    
    topics = ai_service._extract_related_topics("I want to lend my tokens")
    assert isinstance(topics, list)

def test_extract_examples(ai_service):
    """Test examples extraction"""
    text = "Here's an example: Using Uniswap to swap ETH for USDC"
    examples = ai_service._extract_examples(text)
    assert isinstance(examples, list)
    assert len(examples) > 0

def test_extract_next_steps(ai_service):
    """Test next steps extraction"""
    text = "Next steps: Practice on testnet, take a quiz"
    steps = ai_service._extract_next_steps(text)
    assert isinstance(steps, list)
    assert len(steps) > 0

def test_get_fallback_quiz(ai_service):
    """Test fallback quiz generation"""
    quiz = ai_service._get_fallback_quiz("DeFi", "easy", 3)
    
    assert quiz["topic"] == "DeFi"
    assert quiz["difficulty"] == "easy"
    assert len(quiz["questions"]) <= 3
    assert "question" in quiz["questions"][0]
    assert "options" in quiz["questions"][0]
    assert "correct_answer" in quiz["questions"][0]
    assert "explanation" in quiz["questions"][0]
