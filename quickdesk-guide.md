# QuickDesk - MERN Stack Help Desk System

## Project Overview

QuickDesk is a comprehensive help desk solution built with the MERN stack, featuring role-based access control, ticket management, and real-time notifications. The system supports three user roles: End Users, Support Agents, and Admins.

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (Free Tier)
- **Styling**: TailwindCSS + shadcn/ui
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary (Free Tier)
- **Email Service**: Nodemailer with Gmail SMTP (Free)
- **Deployment**: 
  - Frontend: Vercel/Netlify (Free)
  - Backend: Railway/Render (Free)
  - Database: MongoDB Atlas (Free)

## Project Structure

```
quickdesk/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── toast.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── common/
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   └── forms/
│   │   │       ├── LoginForm.tsx
│   │   │       ├── RegisterForm.tsx
│   │   │       └── TicketForm.tsx
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── TicketList.tsx
│   │   │   │   ├── TicketDetail.tsx
│   │   │   │   └── CreateTicket.tsx
│   │   │   ├── profile/
│   │   │   │   └── Profile.tsx
│   │   │   └── admin/
│   │   │       ├── UserManagement.tsx
│   │   │       └── CategoryManagement.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useTickets.ts
│   │   │   ├── useUsers.ts
│   │   │   └── useCategories.ts
│   │   ├── services/                # API service layer
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── ticketService.ts
│   │   │   ├── userService.ts
│   │   │   └── categoryService.ts
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── utils/                   # Utility functions
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── types/                   # TypeScript types
│   │   │   ├── auth.ts
│   │   │   ├── ticket.ts
│   │   │   ├── user.ts
│   │   │   └── category.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── components.json              # shadcn/ui config
│   └── tsconfig.json
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── controllers/             # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── ticketController.js
│   │   │   ├── userController.js
│   │   │   └── categoryController.js
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── errorHandler.js
│   │   │   ├── upload.js
│   │   │   └── rateLimiter.js
│   │   ├── models/                  # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Ticket.js
│   │   │   ├── Category.js
│   │   │   └── Comment.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── tickets.js
│   │   │   ├── users.js
│   │   │   └── categories.js
│   │   ├── services/                # Business logic
│   │   │   ├── emailService.js
│   │   │   ├── fileService.js
│   │   │   └── notificationService.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── database.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── config/                  # Configuration
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── email.js
│   │   └── app.js                   # Express app setup
│   ├── package.json
│   └── .env.example
├── README.md
├── .gitignore
└── docker-compose.yml               # Optional for local development
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['end_user', 'support_agent', 'admin']),
  profileImage: String (Cloudinary URL),
  category: ObjectId (ref: Category) // For interest/department
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket Collection
```javascript
{
  _id: ObjectId,
  subject: String,
  description: String,
  category: ObjectId (ref: Category),
  status: String (enum: ['open', 'in_progress', 'resolved', 'closed']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  attachments: [String], // Cloudinary URLs
  upvotes: [ObjectId] (ref: User),
  downvotes: [ObjectId] (ref: User),
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date,
  closedAt: Date
}
```

### Comment Collection
```javascript
{
  _id: ObjectId,
  ticket: ObjectId (ref: Ticket),
  author: ObjectId (ref: User),
  content: String,
  attachments: [String],
  isInternal: Boolean, // Internal notes for agents
  createdAt: Date,
  updatedAt: Date
}
```

### Category Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  color: String, // Hex color for UI
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## User Flow

### 1. Authentication Flow
```
1. User visits login page
2. Enters credentials
3. System validates credentials
4. JWT token generated and stored
5. User redirected to dashboard
6. Token validated on protected routes
```

### 2. End User Flow
```
Registration/Login
    ↓
Dashboard (View own tickets, search, filter)
    ↓
Create New Ticket
    ↓
Fill form (subject, description, category, attachments)
    ↓
Ticket submitted (status: Open)
    ↓
Email notification sent
    ↓
Track ticket status and replies
    ↓
Upvote/downvote tickets
    ↓
Profile management
```

### 3. Support Agent Flow
```
Login
    ↓
Agent Dashboard (All tickets, My tickets)
    ↓
View ticket queues (Open, In Progress, etc.)
    ↓
Pick up ticket (assign to self)
    ↓
Update status (Open → In Progress)
    ↓
Add comments/replies
    ↓
Work on resolution
    ↓
Update status (In Progress → Resolved)
    ↓
Close ticket if confirmed resolved
    ↓
Email notifications sent to user
```

### 4. Admin Flow
```
Login
    ↓
Admin Dashboard (Overview, statistics)
    ↓
User Management (Create, edit, deactivate users)
    ↓
Role assignment (End User, Support Agent, Admin)
    ↓
Category Management (Create, edit categories)
    ↓
System monitoring and reports
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Tickets
- `GET /api/tickets` - Get tickets (with filters)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment
- `PUT /api/tickets/:id/vote` - Upvote/downvote
- `PUT /api/tickets/:id/assign` - Assign ticket

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories (Admin only)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Key Features Implementation

### 1. Search & Filtering
```javascript
// Frontend - useTickets hook
const useTickets = () => {
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    assignedTo: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  
  // API call with query parameters
  const fetchTickets = useCallback(async () => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await ticketService.getTickets(`?${queryString}`);
    return response.data;
  }, [filters]);
};

// Backend - ticketController.js
const getTickets = async (req, res) => {
  const { status, category, search, sortBy, sortOrder, page, limit } = req.query;
  
  let query = {};
  
  // Build query based on user role
  if (req.user.role === 'end_user') {
    query.createdBy = req.user.id;
  }
  
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { subject: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const tickets = await Ticket.find(query)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('category', 'name color')
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
  res.json({ tickets, total, page, pages: Math.ceil(total / limit) });
};
```

### 2. Real-time Notifications
```javascript
// Email notification service
const sendTicketNotification = async (ticket, type, recipient) => {
  const templates = {
    created: {
      subject: `New Ticket Created: ${ticket.subject}`,
      html: `<p>A new ticket has been created...</p>`
    },
    updated: {
      subject: `Ticket Updated: ${ticket.subject}`,
      html: `<p>Ticket status has been updated to ${ticket.status}...</p>`
    }
  };
  
  await emailService.sendEmail({
    to: recipient.email,
    subject: templates[type].subject,
    html: templates[type].html
  });
};
```

### 3. File Upload with Cloudinary
```javascript
// Frontend - FileUpload component
const FileUpload = ({ onUpload, maxFiles = 5 }) => {
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpload(response.data.urls);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <input
      type="file"
      multiple
      accept="image/*,.pdf,.doc,.docx"
      onChange={handleFileChange}
      className="hidden"
    />
  );
};

// Backend - upload middleware
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(file.buffer);
  });
};
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdesk
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=QuickDesk <noreply@quickdesk.com>
```

## Getting Started

### 1. Setup MongoDB Atlas
1. Create account at mongodb.com
2. Create new cluster (free tier)
3. Create database user
4. Get connection string

### 2. Setup Cloudinary
1. Create account at cloudinary.com
2. Get cloud name, API key, and secret from dashboard

### 3. Backend Setup
```bash
cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv helmet express-rate-limit multer cloudinary nodemailer express-validator

# Dev dependencies
npm install -D nodemon concurrently

# Start development server
npm run dev
```

### 4. Frontend Setup
```bash
cd client
npx create-react-app . --template typescript
npm install axios react-router-dom react-query @tanstack/react-query

# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select card badge dialog dropdown-menu table toast

# Start development server
npm start
```

### 5. Deployment

#### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy automatically on push

## Security Considerations

1. **Input Validation**: Use express-validator for all inputs
2. **SQL Injection**: Use Mongoose parameterized queries
3. **XSS Protection**: Sanitize user inputs and use Content Security Policy
4. **CSRF Protection**: Use CSRF tokens for sensitive operations
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **Secure Headers**: Use helmet.js for security headers
7. **File Upload Security**: Validate file types and sizes
8. **Password Security**: Use bcrypt with salt rounds >= 12

## Performance Optimization

1. **Database Indexing**: Create indexes on frequently queried fields
2. **Pagination**: Implement proper pagination for large datasets
3. **Caching**: Use React Query for client-side caching
4. **Image Optimization**: Use Cloudinary transformations
5. **Code Splitting**: Implement React lazy loading
6. **Bundle Optimization**: Use webpack bundle analyzer


This comprehensive guide provides everything needed to build QuickDesk from scratch, following best practices and evaluation criteria while using free services throughout.