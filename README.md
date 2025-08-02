# QuickDesk - Help Desk Management System

A comprehensive help desk solution built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that provides efficient ticket management, user support, and administrative capabilities.

## 🌟 Features

### 🔐 Authentication & User Management
- **Role-based Access Control**: Support for `end_user`, `support_agent`, and `admin` roles
- **Secure Authentication**: JWT-based authentication with password hashing
- **Profile Management**: Users can update profiles and request role upgrades
- **Admin Controls**: Admins can manage user roles and status

### 🎫 Ticket Management
- **Create & Track Tickets**: Users can create tickets with attachments
- **Status Workflow**: Open → In Progress → Resolved → Closed
- **Priority Levels**: Low, Medium, High, Critical
- **Categories**: Technical, Billing, General, Feature Request, Bug Report
- **File Attachments**: Support for multiple file uploads via Cloudinary
- **Voting System**: Users can upvote/downvote tickets and comments

### 💬 Communication & Collaboration
- **Comments System**: Threaded conversations on tickets
- **Reply Feature**: Users can reply to specific comments
- **Voting on Comments**: Upvote/downvote comments with visual feedback
- **Real-time Updates**: Live status updates and notifications

### 📊 Dashboard & Analytics
- **Role-based Dashboards**: Different views for users, agents, and admins
- **Data Visualization**: Charts showing ticket status and priority distribution
- **Filtering & Search**: Advanced filtering by status, priority, category
- **Statistics**: Real-time metrics and insights

### 🔔 Notification System
- **Real-time Notifications**: Bell icon with unread count
- **Email Notifications**: Automatic email alerts for ticket updates
- **Mark as Read**: Users can mark notifications as read
- **Reply Notifications**: Notifications for comment replies

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **TailwindCSS**: Modern, clean styling
- **Colorful Dropdowns**: Enhanced dropdowns with role labels
- **Loading States**: Smooth loading animations
- **Toast Notifications**: User-friendly feedback messages

## 🚀 Live Demo

- **Frontend**: [https://quickdesk-livid.vercel.app](https://quickdesk-livid.vercel.app)
- **Backend**: [https://quickdesk-3fme.onrender.com](https://quickdesk-3fme.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Chart.js** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Cloud storage
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub Actions** - CI/CD and backend pinging

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account
- Gmail account (for email notifications)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd odoo
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**

   Create `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quickdesk
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   DISABLE_EMAIL_NOTIFICATIONS=false
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Create admin user**
   ```bash
   cd server
   npm run create-admin
   ```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure the Service**
   - **Name**: `quickdesk-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdesk
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=10000
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   DISABLE_EMAIL_NOTIFICATIONS=false
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Frontend Deployment (Vercel)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure the Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### GitHub Workflow Setup

1. **Add Repository Secret**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - **Name**: `RENDER_BACKEND_URL`
   - **Value**: `https://your-backend-url.onrender.com`
   - Click "Add secret"

2. **Enable GitHub Actions**
   - The workflow will automatically run every 14 minutes
   - This keeps your Render backend awake on the free tier

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/upgrade-request` - Request role upgrade
- `PUT /api/auth/change-password` - Change password

### Tickets
- `GET /api/tickets` - Get all tickets (with filters)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment
- `PUT /api/tickets/:id/vote` - Vote on ticket
- `PUT /api/tickets/:id/comments/:commentId/vote` - Vote on comment
- `POST /api/tickets/:id/comments/:commentId/reply` - Reply to comment
- `PUT /api/tickets/:id/assign` - Assign ticket

### Users (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Update user role
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/status` - Update user status

### Categories (Admin)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

### File Upload
- `POST /api/upload` - Upload files

### Health Check
- `GET /api/health` - Backend health status

## 🎯 Usage

### For End Users
1. **Register/Login**: Create an account or sign in
2. **Create Tickets**: Submit support requests with details and attachments
3. **Track Progress**: Monitor ticket status and updates
4. **Vote & Comment**: Participate in discussions and vote on tickets
5. **View Dashboard**: See your ticket statistics and charts

### For Support Agents
1. **View Assigned Tickets**: See tickets assigned to you
2. **Update Status**: Change ticket status and priority
3. **Add Comments**: Provide updates and solutions
4. **Assign Tickets**: Reassign tickets to other agents
5. **Manage Queue**: Handle incoming support requests

### For Administrators
1. **User Management**: Manage user roles and status
2. **Category Management**: Create and manage ticket categories
3. **System Overview**: View comprehensive system statistics
4. **Upgrade Requests**: Handle user role upgrade requests
5. **System Monitoring**: Monitor overall system health

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Authorization**: Granular access control
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against abuse
- **Helmet Security**: HTTP headers security

## 📊 Performance Features

- **React Query**: Efficient data fetching and caching
- **Compression**: Gzip compression for faster responses
- **Image Optimization**: Cloudinary for optimized file storage
- **Lazy Loading**: Code splitting for better performance
- **Caching**: Strategic caching for improved speed

## 🐛 Troubleshooting

### Common Issues

1. **Backend Not Responding**
   - Check Render logs for errors
   - Verify environment variables are set correctly
   - Ensure MongoDB connection string is valid

2. **Frontend Can't Connect to Backend**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check CORS configuration
   - Ensure backend is deployed and running

3. **GitHub Workflow Failing**
   - Verify `RENDER_BACKEND_URL` secret is set correctly
   - Check if the backend URL is accessible
   - Review workflow logs for specific errors

4. **File Upload Issues**
   - Verify Cloudinary credentials are correct
   - Check file size limits
   - Ensure proper file types are allowed

5. **Email Notifications Not Working**
   - Verify Gmail credentials are correct
   - Check if 2FA is enabled and app password is used
   - Ensure `DISABLE_EMAIL_NOTIFICATIONS` is set to `false`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MERN Stack**: MongoDB, Express.js, React.js, Node.js
- **TailwindCSS**: For the beautiful UI components
- **Vercel & Render**: For hosting services
- **Cloudinary**: For file storage and optimization
- **MongoDB Atlas**: For cloud database hosting

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the deployment logs in Vercel/Render dashboards
3. Check GitHub Actions for workflow issues
4. Create an issue in the GitHub repository

---

**QuickDesk** - Making help desk management simple and efficient! 🚀 