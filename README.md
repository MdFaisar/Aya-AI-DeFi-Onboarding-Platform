# Aya-AI-Defi-Onboarding-Platform

**AI-Powered DeFi Onboarding & Risk Management Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## Project Information

**Primary Contact**: Mohammed Faisar A

**Telegram Handle**: @faisar05

**Team**: Matrix

**Project Title**: Aya-AI-Defi-Onboarding-Platform

**Elevator Pitch**: AI-powered DeFi coach that explains complex concepts simply, assesses your risk, and lets you practice safely before real trades.

## Detailed Project Description

Aya DeFi Navigator is a comprehensive AI-powered platform designed to solve the critical problem of DeFi complexity that causes 95% of newcomers to abandon the ecosystem within their first week.

### The Problem
DeFi has a massive accessibility crisis - 95% of newcomers abandon the ecosystem within their first week due to overwhelming complexity, hidden risks, and fear of losing money through mistakes. Traditional DeFi platforms throw users into the deep end without proper guidance, leading to costly errors and widespread adoption barriers.

### Our Solution
Aya DeFi Navigator transforms complex blockchain finance into personalized, safe, and educational experiences. We act as your intelligent DeFi mentor, guiding users from complete beginner to confident participant through:

- **AI-Powered Learning**: Personalized tutorials with Llama (Groq) integration
- **Real-Time Risk Assessment**: Continuous portfolio and protocol monitoring
- **Safe Practice Environment**: Testnet simulations before real transactions
- **Progress Tracking**: Gamified learning with achievements and analytics
- **Multi-Protocol Support**: Integration with Uniswap, Aave, Compound, and more

## Key Features

### Natural Language Onboarding
- **`explain_concept_simply(query)`** - AI explains complex DeFi concepts in simple terms
- Adaptive learning paths based on user experience level
- Interactive quizzes with instant feedback
- Progress tracking with achievements system

### Real-Time Risk Engine
- Protocol vulnerability scanner with live data
- Personal risk tolerance profiling
- Continuous portfolio health monitoring
- Automated warnings and stop-loss recommendations

### Guided Practice & Execution
- Testnet transaction simulator for safe learning
- "One-tap" real transaction executor with safety checks
- Post-trade explanations ("What just happened?")
- Gas fee optimization recommendations

### Analytics & Reporting
- Comprehensive learning metrics dashboard
- Risk score history and trend analysis
- User feedback loop for continuous improvement
- Performance benchmarking against peers

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   MCP Server    │    │   Backend API   │
│   (Next.js)     │◄──►│  (TypeScript)   │◄──►│   (FastAPI)     │
│                 │    │                 │    │                 │
│ • React UI      │    │ • AI Tools      │    │ • REST API      │
│ • Wallet Connect│    │ • Groq LLM      │    │ • PostgreSQL    │
│ • Charts/Viz    │    │ • Risk Engine   │    │ • Redis Cache   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Blockchain    │
                    │   Integration   │
                    │                 │
                    │ • Ethers.js     │
                    │ • Web3 Providers│
                    │ • DeFi Protocols│
                    └─────────────────┘
```

## Installation Steps

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### Step-by-Step Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/aya-defi-navigator.git
cd aya-defi-navigator
```

2. **Install dependencies for all services**
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# MCP Server dependencies
cd mcp-server && npm install && cd ..

# Backend dependencies
cd backend && pip install -r requirements.txt && cd ..
```

3. **Set up environment variables (see Environment Variables section below)**
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your configuration
```

4. **Start all services**
```bash
# Terminal 1 - MCP Server (AI Tools)
cd mcp-server && npm run dev

# Terminal 2 - Backend API
cd backend && uvicorn main:app --reload --port 8000

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **MCP Server**: http://localhost:3001/health

### Development Setup

#### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Manual Setup

```bash
# Terminal 1: Start database services
docker-compose up postgres redis -d

# Terminal 2: Start backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 3: Start MCP server
cd mcp-server
npm install
npm run dev

# Terminal 4: Start frontend
cd frontend
npm install
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MCP Server**: http://localhost:3001

## Implementation Guide

### Core Components

#### 1. MCP Server (`/mcp-server`)
The Model Context Protocol server handles AI interactions:

```typescript
// Example: Explain a DeFi concept
const explanation = await explainConceptSimply({
  concept: "liquidity pools",
  userLevel: "beginner",
  includeExample: true
});
```

**Key Tools:**
- `explain_concept_simply` - Educational content generation
- `assess_risk` - Protocol and portfolio risk analysis
- `simulate_transaction` - Safe transaction testing
- `generate_quiz` - Interactive learning assessments
- `track_progress` - User learning analytics

#### 2. Frontend (`/frontend`)
Next.js application with modern React patterns:

```tsx
// Example: Dashboard component
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <ProgressOverview />
      {/* Other dashboard components */}
    </DashboardLayout>
  )
}
```

**Key Features:**
- Responsive design with Tailwind CSS
- Wallet integration with RainbowKit
- Real-time data with React Query
- Smooth animations with Framer Motion

#### 3. Backend API (`/backend`)
FastAPI server with comprehensive endpoints:

```python
# Example: AI service integration
@router.post("/ai/explain-concept")
async def explain_concept(
    request: ExplainConceptRequest,
    current_user: User = Depends(get_current_user)
):
    ai_service = AIService()
    explanation = await ai_service.explain_concept(
        concept=request.concept,
        user_level=current_user.experience_level
    )
    return explanation
```

**Key Services:**
- AI service with Groq integration
- Risk assessment engine
- User progress tracking
- Protocol data aggregation

### Database Schema

```sql
-- Core user table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    experience_level VARCHAR(20) DEFAULT 'beginner',
    risk_tolerance VARCHAR(20) DEFAULT 'low',
    overall_progress_percentage FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Learning progress tracking
CREATE TABLE user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    lesson_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP,
    score INTEGER
);
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/login` - Wallet-based authentication
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Current user info

#### AI Services
- `POST /api/v1/ai/explain-concept` - Concept explanation
- `POST /api/v1/ai/generate-quiz` - Quiz generation
- `POST /api/v1/ai/chat` - AI assistant chat
- `GET /api/v1/ai/learning-path` - Personalized learning path

#### Risk Assessment
- `POST /api/v1/risk/assess-protocol` - Protocol risk analysis
- `POST /api/v1/risk/assess-portfolio` - Portfolio risk check
- `GET /api/v1/risk/alerts` - Active risk alerts

#### Learning & Progress
- `GET /api/v1/lessons` - Available lessons
- `POST /api/v1/lessons/{id}/complete` - Mark lesson complete
- `GET /api/v1/progress` - User progress overview
- `POST /api/v1/simulations` - Run transaction simulation

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm test

# MCP server tests
cd mcp-server
npm test

# Integration tests
npm run test:integration
```

### Test Coverage

- **Backend**: 85%+ coverage with pytest
- **Frontend**: Component and integration tests with Jest
- **MCP Server**: Tool functionality and error handling
- **E2E**: Critical user flows with Playwright

## Deployment

### Production Environment

1. **Environment Configuration**
```bash
# Production environment variables
ENVIRONMENT=production
DEBUG=false
GROQ_API_KEY=your_production_groq_key
DATABASE_URL=your_production_db_url
REDIS_URL=your_production_redis_url
```

2. **Docker Deployment**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

3. **Database Migration**
```bash
# Run database migrations
cd backend
alembic upgrade head
```

### Monitoring & Observability

- **Health Checks**: `/health` endpoint for service monitoring
- **Metrics**: Prometheus metrics on port 9090
- **Logging**: Structured JSON logging with correlation IDs
- **Error Tracking**: Integration-ready for Sentry/DataDog

## Design System

### Color Palette
- **Primary Orange**: `#f97316` - Main brand color
- **Secondary Blue**: `#3b82f6` - Accent and links
- **Neutral Grey**: `#737373` - Text and borders
- **Success Green**: `#22c55e` - Positive actions
- **Warning Yellow**: `#f59e0b` - Caution states
- **Danger Red**: `#ef4444` - Error states

### Typography
- **Primary Font**: Inter (system fallback)
- **Monospace**: JetBrains Mono for code

### Components
- Consistent spacing with 4px grid
- Rounded corners (8px, 12px, 16px)
- Subtle shadows and hover states
- Mobile-first responsive design

## Success Metrics

### Target KPIs
- **Onboarding Completion Rate**: ≥ 80%
- **Time to First Real Trade**: ≤ 3 days
- **Error Reduction**: ≥ 90% fewer user mistakes
- **User Satisfaction Score**: ≥ 4.5/5

### Analytics Implementation
- User journey tracking with custom events
- Learning progress analytics
- Risk assessment effectiveness metrics
- A/B testing framework for feature optimization

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- 80%+ test coverage for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Groq** for AI/LLM capabilities
- **DeFi Llama** for protocol data
- **Uniswap & Aave** for protocol integrations
- **The DeFi Community** for inspiration and feedback

## Troubleshooting

### Common Issues

#### 1. MCP Server Connection Issues
```bash
# Check if MCP server is running
curl http://localhost:3001/health

# Restart MCP server
cd mcp-server && npm run dev
```

#### 2. Database Connection Problems
```bash
# Check PostgreSQL status
docker-compose ps postgres

# Reset database
docker-compose down postgres
docker-compose up postgres -d
```

#### 3. Frontend Build Errors
```bash
# Clear Next.js cache
cd frontend && rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. AI Service Errors
- Verify `GROQ_API_KEY` is set correctly
- Check API rate limits and quotas
- Ensure Redis is running for caching

### Performance Optimization

#### Database
- Enable connection pooling
- Add database indexes for frequent queries
- Use Redis for caching expensive operations

#### Frontend
- Implement code splitting with Next.js
- Optimize images with next/image
- Use React.memo for expensive components

#### Backend
- Enable FastAPI response caching
- Use async/await for I/O operations
- Implement request rate limiting

## Security Considerations

### Wallet Security
- Never store private keys on the server
- Use secure wallet connection libraries
- Implement proper session management

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration for production

### Data Protection
- Encrypt sensitive user data
- Implement proper access controls
- Regular security audits and updates

## Internationalization

The platform supports multiple languages:

```typescript
// Add new language support
const supportedLocales = ['en', 'es', 'fr', 'de', 'ja', 'ko']

// Language-specific AI responses
await explainConcept({
  concept: "liquidity pools",
  language: "es", // Spanish explanation
  userLevel: "beginner"
})
```

## Roadmap

### Phase 1 (Current) - Core Platform 
- [x] AI-powered explanations
- [x] Risk assessment engine
- [x] Transaction simulation
- [x] Progress tracking
- [x] Multi-protocol support

### Phase 2 - Advanced Features 
- [ ] Automated portfolio rebalancing
- [ ] Advanced risk analytics
- [ ] Social learning features
- [ ] Mobile app development
- [ ] Cross-chain support

### Phase 3 - Ecosystem Expansion 
- [ ] Premium subscription tiers
- [ ] API marketplace for developers
- [ ] Integration with 50+ protocols
- [ ] Institutional features
- [ ] Global expansion

## Support

- **Documentation**: [docs.ayadefi.com](https://docs.ayadefi.com)
- **Discord**: [Join our community](https://discord.gg/ayadefi)
- **Email**: support@ayadefi.com
- **Issues**: [GitHub Issues](https://github.com/your-org/aya-defi-navigator/issues)

---

