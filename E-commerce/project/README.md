# StyleShop E-commerce Application

A modern full-stack e-commerce application built with React and Flask.

## Features

- User authentication (register, login, profile management)
- Product catalog with filtering and search
- Shopping cart functionality with persistent storage
- Checkout process with address and payment collection
- Order management and history
- Responsive design for all devices

## Technology Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Flask Python framework
- SQLAlchemy for database ORM
- JWT for authentication
- SQLite for development database

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/styleshop.git
cd styleshop
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

## Running the Application

1. Start the backend server
```bash
npm run backend
```

2. In a new terminal, start the frontend development server
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
styleshop/
├── backend/               # Flask backend
│   ├── app.py             # Main Flask application
│   └── requirements.txt   # Python dependencies
├── public/                # Static files
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API service files
│   ├── store/             # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Entry point
└── package.json           # Node dependencies and scripts
```

## License

This project is licensed under the MIT License.