# Contributing to Aya DeFi Navigator

Thank you for your interest in contributing to Aya DeFi Navigator! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose
- Git
- Basic knowledge of TypeScript, React, and Python

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/your-username/aya-defi-navigator.git
cd aya-defi-navigator
```

2. **Set up your development environment**
```bash
# Copy environment template
cp .env.example .env

# Install dependencies
npm run install:all

# Start development services
docker-compose up -d
```

3. **Verify your setup**
```bash
# Check if all services are running
curl http://localhost:3000  # Frontend
curl http://localhost:8000/health  # Backend
curl http://localhost:3001  # MCP Server
```

## 📋 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/your-org/aya-defi-navigator/issues) to avoid duplicates.

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]
```

### Suggesting Features

We welcome feature suggestions! Please use the [feature request template](https://github.com/your-org/aya-defi-navigator/issues/new?template=feature_request.md).

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow our coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
```bash
# Run all tests
npm run test

# Run linting
npm run lint

# Check TypeScript types
npm run type-check
```

4. **Commit your changes**
```bash
# Use conventional commits
git commit -m "feat: add new risk assessment algorithm"
git commit -m "fix: resolve wallet connection issue"
git commit -m "docs: update API documentation"
```

5. **Push and create a Pull Request**
```bash
git push origin feature/your-feature-name
```

**Pull Request Template:**
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

## 🎨 Coding Standards

### TypeScript/JavaScript

```typescript
// Use TypeScript for type safety
interface UserProgress {
  userId: string;
  completedLessons: number;
  overallProgress: number;
}

// Use descriptive function names
async function calculateUserProgress(userId: string): Promise<UserProgress> {
  // Implementation
}

// Use const assertions for immutable data
const RISK_LEVELS = ['low', 'medium', 'high'] as const;
type RiskLevel = typeof RISK_LEVELS[number];
```

### Python

```python
# Follow PEP 8 style guide
from typing import Dict, List, Optional
import structlog

logger = structlog.get_logger()

class RiskAssessment:
    """Risk assessment service for DeFi protocols."""
    
    def __init__(self, config: Dict[str, Any]) -> None:
        self.config = config
    
    async def assess_protocol_risk(
        self, 
        protocol_name: str,
        user_level: str = "beginner"
    ) -> Dict[str, Any]:
        """Assess risk for a specific DeFi protocol."""
        # Implementation
        pass
```

### React Components

```tsx
// Use functional components with TypeScript
interface ProgressOverviewProps {
  userId: string;
  className?: string;
}

export function ProgressOverview({ userId, className }: ProgressOverviewProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  
  // Use custom hooks for logic
  const { data, loading, error } = useUserProgress(userId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className={clsx('progress-overview', className)}>
      {/* Component content */}
    </div>
  );
}
```

### CSS/Styling

```css
/* Use Tailwind CSS utility classes */
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500;
}

/* Use CSS custom properties for theming */
:root {
  --color-primary: #f97316;
  --color-secondary: #3b82f6;
  --color-neutral: #737373;
}
```

## 🧪 Testing Guidelines

### Frontend Testing

```typescript
// Component tests with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressOverview } from './ProgressOverview';

describe('ProgressOverview', () => {
  it('displays user progress correctly', () => {
    render(<ProgressOverview userId="test-user" />);
    
    expect(screen.getByText('Learning Progress')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('handles loading state', () => {
    render(<ProgressOverview userId="test-user" />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### Backend Testing

```python
# API tests with pytest
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_explain_concept_endpoint():
    response = client.post(
        "/api/v1/ai/explain-concept",
        json={
            "concept": "liquidity pools",
            "user_level": "beginner",
            "include_example": True
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "explanation" in data
    assert "examples" in data
```

### Integration Testing

```typescript
// E2E tests with Playwright
import { test, expect } from '@playwright/test';

test('user can complete onboarding flow', async ({ page }) => {
  await page.goto('/onboarding');
  
  // Connect wallet
  await page.click('[data-testid="connect-wallet"]');
  
  // Complete first lesson
  await page.click('[data-testid="start-lesson"]');
  await page.click('[data-testid="complete-lesson"]');
  
  // Verify progress
  await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
});
```

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Calculates the risk score for a DeFi protocol
 * 
 * @param protocolName - Name of the DeFi protocol
 * @param userLevel - User's experience level (beginner, intermediate, advanced)
 * @returns Promise resolving to risk assessment data
 * 
 * @example
 * ```typescript
 * const risk = await assessProtocolRisk('uniswap', 'beginner');
 * console.log(risk.overallScore); // 25
 * ```
 */
async function assessProtocolRisk(
  protocolName: string,
  userLevel: UserLevel
): Promise<RiskAssessment> {
  // Implementation
}
```

### API Documentation

All API endpoints should be documented with OpenAPI/Swagger:

```python
@router.post("/explain-concept", response_model=ExplainConceptResponse)
async def explain_concept(
    request: ExplainConceptRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Explain a DeFi concept in simple terms using AI.
    
    - **concept**: The DeFi concept to explain
    - **user_level**: User's experience level (beginner, intermediate, advanced)
    - **include_example**: Whether to include practical examples
    
    Returns a detailed explanation adapted to the user's level.
    """
```

## 🏷️ Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and consistent commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ai): add concept explanation with examples
fix(wallet): resolve connection timeout issue
docs(api): update risk assessment endpoint documentation
test(frontend): add tests for dashboard components
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- 🤖 **AI/ML Improvements**: Better risk assessment algorithms
- 🔒 **Security Enhancements**: Wallet security, data protection
- 📱 **Mobile Optimization**: Responsive design improvements
- 🌍 **Internationalization**: Multi-language support

### Medium Priority
- 📊 **Analytics**: User behavior tracking and insights
- 🎨 **UI/UX**: Design improvements and accessibility
- 🧪 **Testing**: Increase test coverage
- 📚 **Documentation**: Tutorials and guides

### Low Priority
- 🔧 **Developer Tools**: Build process improvements
- 📈 **Performance**: Optimization and caching
- 🎮 **Gamification**: Achievement system enhancements

## 💬 Community

- **Discord**: [Join our community](https://discord.gg/ayadefi)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/your-org/aya-defi-navigator/discussions)
- **Twitter**: [@AyaDeFiNav](https://twitter.com/AyaDeFiNav)

## 📄 License

By contributing to Aya DeFi Navigator, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in our:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation posts

Thank you for helping make DeFi more accessible and safe for everyone! 🚀
