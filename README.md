# QuickDesk - Help Desk System

A comprehensive help desk solution built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for efficient ticket management and support workflows.

## Features

### Role-Based Access Control
- **End Users**: Create tickets, view their own tickets, add comments, vote on tickets
- **Support Agents**: View assigned tickets, update ticket status, assign tickets, create their own tickets
- **Admins**: Full system access, user management, category management

### Ticket Management
- Create, view, update, and delete tickets
- Status workflow: Open → In Progress → Resolved → Closed
- Priority levels: Low, Medium, High, Urgent
- Category-based organization
- File attachments support
- Voting system (upvote/downvote)
- Comment system with role-based permissions

### Dashboard Features
- **End User Dashboard**: Filters, search, pagination, sorting for personal tickets
- **Support Agent Dashboard**: Multiple ticket queues (My Tickets, All Tickets) with statistics
- **Admin Dashboard**: User management, category management, system overview

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickdesk
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cd ../server
   cp env.example .env
   
   # Edit .env with your configuration
   # Required: MONGODB_URI, JWT_SECRET
   # Optional: EMAIL_*, CLOUDINARY_* for full functionality
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if using local)
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Create Test Users**
   ```bash
   # Create admin user
   npm run create-admin
   
   # Create support agent
   npm run create-support
   ```

6. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev
   
   # Start client (from client directory)
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/upgrade-request` - Request role upgrade

### Tickets
- `GET /api/tickets` - Get tickets (with filters)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment
- `PUT /api/tickets/:id/vote` - Vote on ticket
- `PUT /api/tickets/:id/assign` - Assign ticket

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Update user status

### Categories (Admin Only)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Troubleshooting

### Common Issues

1. **Email Timeout Error**
   - **Issue**: `connect ETIMEDOUT 64.233.170.108:587`
   - **Solution**: This is an email configuration issue. The system will continue to work without email notifications. To fix:
     - Configure proper SMTP settings in `.env`
     - For Gmail, use App Password instead of regular password
     - Or disable email notifications by commenting out email service calls

2. **Tickets Not Showing in "My Tickets"**
   - **Issue**: Support agent tickets not appearing in assigned queue
   - **Solution**: Tickets created by support agents are now auto-assigned to themselves. Check that:
     - The ticket was created successfully
     - The support agent is viewing the "My Tickets" tab
     - The ticket has the correct `assignedTo` field

3. **Missing Status/Assignment Dropdowns**
   - **Issue**: Support agents can't see status update controls
   - **Solution**: Ensure you're logged in as a support agent or admin. The dropdowns only appear for these roles.

4. **Category Validation Error**
   - **Issue**: "Invalid category" when creating tickets
   - **Solution**: Categories are now handled by name instead of ObjectId. Ensure:
     - Categories exist in the database
     - Category names are sent as strings, not ObjectIds

### Environment Variables

Required:
```env
MONGODB_URI=mongodb://localhost:27017/quickdesk
JWT_SECRET=your_secret_key_here
```

Optional (for full functionality):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Development

### Project Structure
```
quickdesk/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── ...
│   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── ...
│   └── ...
└── ...
```

### Available Scripts

**Server:**
- `npm run dev` - Start development server
- `npm run create-admin` - Create admin user
- `npm run create-support` - Create support agent

**Client:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 