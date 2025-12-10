# AI Finance Tracker

An intelligent personal finance management application with AI-powered expense categorization and insights.

## 🚀 Features

- 📊 Track income and expenses with detailed categorization
- 🤖 AI-powered automatic expense categorization
- 📈 Real-time financial insights and analytics
- 💰 Budget management with overspending alerts
- 📱 Responsive design with beautiful charts
- 🔐 Secure authentication with JWT
- 🎯 Smart financial recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API calls
- Context API for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **OpenAI API** / Hugging Face for AI features

## 📁 Project Structure

```
Ai_finance_tracker/
├─ client/                  # React + Vite frontend
│  ├─ src/
│  │  ├─ components/       # Reusable UI components
│  │  ├─ pages/            # Page components
│  │  ├─ context/          # React Context (Auth)
│  │  ├─ services/         # API service layer
│  │  └─ styles/           # Global styles
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.js
│
├─ server/                  # Node + Express backend
│  └─ src/
│     ├─ models/           # Mongoose schemas
│     ├─ controllers/      # Route controllers
│     ├─ routes/           # API routes
│     ├─ middleware/       # Auth & error handling
│     ├─ utils/            # Helper functions
│     ├─ config/           # Database config
│     └─ index.js          # Server entry point
│
├─ .env.example             # Environment variables template
├─ AI_PROMPTS.md            # AI prompt documentation
├─ GIT_WORKFLOW.md          # Git workflow guide
└─ README.md
```

## 🏃 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key or Hugging Face API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sudharsanv06/Ai_finance_tracker.git
cd Ai_finance_tracker
```

2. **Setup Server**
```bash
cd server
npm install
cp ../.env.example .env
# Edit .env with your configurations
npm run dev
```

3. **Setup Client** (in a new terminal)
```bash
cd client
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the server directory with:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
```

See `.env.example` for complete configuration.

## 📅 Development Progress

- ✅ Day 1: Project setup and structure
- ✅ Database design and models
- ✅ User authentication system
- ✅ Expense CRUD APIs
- ✅ Budget management APIs
- ✅ Frontend UI components
- ✅ AI integration (categorization & insights)
- ⏳ Testing and deployment

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### AI Features
- `POST /api/ai/categorize` - Categorize expense with AI
- `GET /api/ai/insights` - Get AI insights
- `POST /api/ai/insights` - Generate new insight
- `POST /api/ai/ask` - Ask AI about spending

## 🤖 AI Features

The app uses AI for:
1. **Auto-categorization** - Categorizes expenses based on description
2. **Monthly insights** - Analyzes spending patterns
3. **Smart recommendations** - Suggests ways to save money
4. **Q&A** - Answers questions about your spending

See `AI_PROMPTS.md` for detailed prompt templates.

## 📝 License

MIT License

## 👤 Author

**Sudharsan V**
- GitHub: [@Sudharsanv06](https://github.com/Sudharsanv06)

---

**Status:** ✅ Complete Structure | 🚀 Ready for Development
