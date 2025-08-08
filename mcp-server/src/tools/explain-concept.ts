import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ExplainConceptArgs {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  includeExample?: boolean;
}

export async function explainConceptSimply(args: ExplainConceptArgs) {
  const { concept, userLevel = 'beginner', includeExample = true } = args;

  // Fallback explanations when AI is not available
  const fallbackExplanations: Record<string, any> = {
    'defi': {
      concept: 'DeFi',
      explanation: 'DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks.',
      difficulty: 'beginner',
      examples: ['Uniswap for trading', 'Aave for lending', 'Compound for earning interest'],
      relatedConcepts: ['Smart Contracts', 'Liquidity Pools', 'Yield Farming']
    },
    'liquidity pools': {
      concept: 'Liquidity Pools',
      explanation: 'Liquidity pools are collections of tokens locked in smart contracts that enable decentralized trading.',
      difficulty: 'intermediate',
      examples: ['ETH/USDC pool on Uniswap', 'DAI lending pool on Aave'],
      relatedConcepts: ['AMM', 'Impermanent Loss', 'Yield Farming']
    },
    'yield farming': {
      concept: 'Yield Farming',
      explanation: 'Yield farming is the practice of earning rewards by providing liquidity or staking tokens in DeFi protocols.',
      difficulty: 'intermediate',
      examples: ['Providing liquidity on Uniswap', 'Lending on Aave', 'Staking governance tokens'],
      relatedConcepts: ['Liquidity Pools', 'APY', 'Impermanent Loss']
    }
  };

  const levelPrompts = {
    beginner: 'Explain this like I\'m completely new to DeFi and crypto. Use simple language and avoid jargon.',
    intermediate: 'Explain this assuming I understand basic crypto concepts but am new to DeFi.',
    advanced: 'Provide a detailed technical explanation with nuances and edge cases.',
  };

  const prompt = `
You are an expert DeFi educator helping users understand complex concepts simply.

Task: Explain "${concept}" for a ${userLevel} user.

Guidelines:
- ${levelPrompts[userLevel]}
- Use analogies to real-world concepts when helpful
- Break down complex ideas into digestible parts
- ${includeExample ? 'Include a practical example' : 'Focus on conceptual understanding'}
- Highlight any risks or important considerations
- Keep the explanation engaging and encouraging

Format your response with:
1. Simple Definition
2. How It Works
3. ${includeExample ? 'Practical Example' : 'Key Benefits'}
4. Important Considerations/Risks
5. Next Steps for Learning

Concept to explain: ${concept}
`;

  try {
    // Check if we have a fallback explanation first
    const fallback = fallbackExplanations[concept.toLowerCase()];
    if (fallback) {
      return fallback;
    }

    // Try to use Groq API if available
    if (process.env.GROQ_API_KEY) {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are Aya, a friendly and knowledgeable DeFi educator. Your goal is to make complex DeFi concepts accessible and understandable for everyone.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 1000,
      });

      const explanation = completion.choices[0]?.message?.content;
      if (explanation) {
        return {
          concept: concept,
          explanation: explanation,
          difficulty: userLevel,
          examples: extractExamples(explanation),
          relatedConcepts: extractRelatedConcepts(explanation),
        };
      }
    }

    // Fallback explanation
    return {
      concept: concept,
      explanation: `${concept} is an important concept in DeFi. For detailed explanations, please check our lessons or try asking more specific questions.`,
      difficulty: userLevel,
      examples: [`Example usage of ${concept}`, `Common ${concept} applications`],
      relatedConcepts: ['DeFi', 'Blockchain', 'Smart Contracts'],
    };
  } catch (error) {
    console.error('Error in explainConceptSimply:', error);

    // Fallback to basic explanation
    return {
      concept: concept,
      explanation: `${concept} is an important concept in DeFi. This is a basic explanation as our AI service is currently unavailable.`,
      difficulty: userLevel,
      examples: [],
      relatedConcepts: [],
    };
  }
}

// Helper functions to extract structured information from AI responses
function extractExamples(text: string): string[] {
  const examples: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.toLowerCase().includes('example') && line.includes(':')) {
      const example = line.split(':')[1]?.trim();
      if (example) examples.push(example);
    }
  }

  return examples.length > 0 ? examples : ['Check our practice simulations for hands-on examples'];
}

function extractRelatedConcepts(text: string): string[] {
  const concepts = ['DeFi', 'Liquidity Pools', 'Yield Farming', 'Smart Contracts', 'AMM', 'Staking', 'Lending', 'Borrowing'];
  const found: string[] = [];

  for (const concept of concepts) {
    if (text.toLowerCase().includes(concept.toLowerCase()) && !found.includes(concept)) {
      found.push(concept);
    }
  }

  return found.slice(0, 4); // Limit to 4 related concepts
}

// Helper function to get concept-specific learning resources
export function getConceptResources(concept: string) {
  const resources: Record<string, string[]> = {
    'liquidity pools': [
      'Try providing liquidity on Uniswap testnet',
      'Learn about impermanent loss',
      'Understand AMM mechanics',
    ],
    'yield farming': [
      'Start with single-asset staking',
      'Learn about LP token farming',
      'Understand smart contract risks',
    ],
    'lending': [
      'Try lending on Aave testnet',
      'Learn about collateralization',
      'Understand liquidation risks',
    ],
    'borrowing': [
      'Understand collateral requirements',
      'Learn about interest rates',
      'Practice on testnet first',
    ],
  };

  return resources[concept.toLowerCase()] || [
    'Practice on testnet first',
    'Start with small amounts',
    'Always understand the risks',
  ];
}
