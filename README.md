# Personal Finance Tracker

A full-stack web application for tracking personal finances, managing budgets, and visualizing spending patterns.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration
- **Transaction Management**: Full CRUD operations for income/expenses
- **Category System**: Pre-defined and custom categories
- **Budget Tracking**: Monthly budget limits with visual progress bars
- **Budget Alerts**: Automatic warnings when approaching/exceeding limits
- **Analytics Dashboard**: Interactive charts (Pie, Bar, Line) with Chart.js
- **Monthly Trends**: 6-month spending and income trend analysis
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live dashboard with recent transactions and alerts

## 🛠️ Tech Stack

**Frontend:**
- React 18+
- React Router for navigation
- Chart.js for data visualization
- Axios for API calls
- CSS3 with responsive design

**Backend:**
- Node.js with Express.js
- SQLite database
- JWT authentication
- bcryptjs for password hashing
- Express validator for input validation

## 📋 Prerequisites

- Node.js 16+
- npm or yarn

## 🚀 Quick Start

### Option 1: One-Command Start (Recommended)
```bash
git clone <your-repo-url>
cd finance-tracker
npm run install-all
npm run dev
```

### Option 2: Manual Setup

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd finance-tracker
```

#### 2. Install All Dependencies
```bash
npm run install-all
```

#### 3. Start Both Servers
```bash
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Windows Users
Double-click `start.bat` to automatically install dependencies and start both servers.

## 📁 Project Structure

```
finance-tracker/
├── backend/                 # Express.js API
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── database.js         # SQLite setup
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React Context
│   │   └── services/       # API services
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add custom category

### Budgets
- `GET /api/budgets` - Get budgets for month
- `POST /api/budgets` - Set budget
- `GET /api/budgets/alerts` - Get budget alerts

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar for process management
3. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Input validation on all endpoints
- CORS enabled for frontend communication

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for better financial management**