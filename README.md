# QuickDesk - Help Desk System

A comprehensive help desk solution built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring role-based access control, ticket management, and real-time notifications.

## Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (End User, Support Agent, Admin)
- Profile management with role upgrade requests

### 🎫 Ticket Management
- Create, view, update, and delete tickets
- File attachments support
- Ticket status tracking (Open → In Progress → Resolved → Closed)
- Priority levels (Low, Medium, High, Urgent)
- Category-based organization

### 🔍 Search & Filtering
- Advanced search functionality
- Filter by status, category, and priority
- Sort by creation date, updates, votes, and views
- Pagination support

### 💬 Communication
- Comment system with threaded conversations
- Internal notes for support agents
- Email notifications for ticket updates
- Public shareable links

### 👍 Voting System
- Upvote and downvote tickets
- Vote tracking and display

### 📊 Dashboard
- Role-specific dashboards
- Real-time statistics
- Quick actions and shortcuts

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud file storage
- **Nodemailer** - Email service

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickdesk
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdesk
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration (Gmail SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=QuickDesk <noreply@quickdesk.com>

   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Create a MongoDB database (local or Atlas)
   - Update the `MONGODB_URI` in your `.env` file

5. **Cloudinary Setup**
   - Create a Cloudinary account
   - Get your cloud name, API key, and secret
   - Update the Cloudinary configuration in your `.env` file

6. **Email Setup**
   - Configure Gmail SMTP or another email service
   - Update the email configuration in your `.env` file

## Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client**
   ```bash
   cd client
   npm start
   ```

3. **Or run both simultaneously**
   ```bash
   # From the root directory
   npm run dev
   ```

### Production Mode

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/upgrade-request` - Request role upgrade

### Tickets
- `GET /api/tickets` - Get tickets (with filters)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment
- `PUT /api/tickets/:id/vote` - Upvote/downvote
- `PUT /api/tickets/:id/assign` - Assign ticket

## User Roles

### End User
- Create and manage their own tickets
- View ticket status and updates
- Vote on tickets
- Request role upgrades
- Update profile information

### Support Agent
- View and respond to all tickets
- Assign tickets to themselves
- Update ticket status
- Add internal notes
- Create tickets like end users

### Admin
- All Support Agent permissions
- User management
- Category management
- System monitoring and reports
- Approve/reject upgrade requests

## Project Structure

```
quickdesk/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API service layer
│   │   ├── context/                 # React Context
│   │   └── ...
│   └── package.json
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── controllers/             # Route controllers
│   │   ├── middleware/              # Express middleware
│   │   ├── models/                  # MongoDB models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   └── ...
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/quickdesk/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icons 