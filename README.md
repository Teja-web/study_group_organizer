# Study Group Organizer

A modern, feature-rich web application for students to create, join, and manage study groups with real-time collaboration features.

## 🚀 Features are
 j
### Core Functionality
- **User Authentication** - Secure login/signup with Firebase Auth
- **Study Group Management** - Create, join, and manage study groups
- **Real-time Chat** - Instant messaging within groups
- **File Sharing** - Upload and share study materials
- **Member Management** - View members and leave groups
- **Subject-based Filtering** - Find groups by subject
- **Search & Sort** - Advanced search and sorting capabilities

### Enhanced UI/UX
- **Modern Design** - Beautiful, responsive interface
- **Mobile-Friendly** - Works perfectly on all devices
- **Real-time Updates** - Live data synchronization
- **Loading States** - Smooth user experience
- **Error Handling** - Comprehensive error management

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Styling**: Custom CSS with utility classes
- **Routing**: React Router DOM
- **State Management**: React Hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-group-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `src/firebase.js` with your Firebase config

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Enable Storage
6. Copy your config to `src/firebase.js`

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 Usage

### For Students
1. **Sign Up/Login** - Create an account or sign in
2. **Browse Groups** - Find study groups by subject or search
3. **Join Groups** - Click "Join" on groups you're interested in
4. **Create Groups** - Start your own study group
5. **Collaborate** - Chat, share files, and study together

### Group Features
- **Group Dashboard** - Overview of group activity
- **Real-time Chat** - Instant messaging with members
- **File Sharing** - Upload and download study materials
- **Member List** - View all group participants
- **Study Schedule** - Set and view study times

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AuthForm.jsx          # Login/Signup form
│   ├── CreateGroup.jsx       # Group creation modal
│   ├── Dashboard.jsx         # Main dashboard
│   ├── GroupCard.jsx         # Individual group display
│   ├── GroupDashboard.jsx    # Group overview page
│   ├── GroupList.jsx         # Groups listing with filters
│   ├── Chat.jsx              # Real-time chat component
│   ├── UploadFile.jsx        # File upload and management
│   ├── MemberList.jsx        # Group members management
│   ├── Notification.jsx      # Toast notifications
│   └── ProtectedRoute.jsx    # Route protection
├── Hooks/
│   └── useAuth.js           # Authentication hook
├── firebase.js              # Firebase configuration
├── App.jsx                  # Main app component
└── index.css               # Global styles
```

## 🎨 UI Components

### Design System
- **Cards** - Consistent container styling
- **Buttons** - Primary, secondary, success, danger variants
- **Forms** - Input fields, selects, textareas
- **Badges** - Status indicators and tags
- **Modals** - Overlay dialogs
- **Loading States** - Spinners and skeleton screens

### Color Scheme
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Neutral**: Gray scale

## 🔒 Security Features

- **Protected Routes** - Authentication required
- **User Validation** - Input sanitization
- **File Size Limits** - 10MB maximum upload
- **Permission Checks** - Users can only delete their own files
- **Secure Storage** - Firebase Security Rules

## 📊 Database Schema

### Groups Collection
```javascript
{
  id: "string",
  name: "string",
  subject: "string",
  description: "string",
  maxMembers: "number",
  schedule: "string",
  tags: ["string"],
  createdBy: "string",
  createdByUid: "string",
  createdAt: "timestamp",
  members: ["string"]
}
```

### Messages Collection
```javascript
{
  id: "string",
  text: "string",
  senderId: "string",
  senderName: "string",
  createdAt: "timestamp"
}
```

### Resources Collection
```javascript
{
  id: "string",
  name: "string",
  url: "string",
  size: "number",
  type: "string",
  uploadedBy: "string",
  uploadedByName: "string",
  uploadedAt: "timestamp"
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@studygrouporganizer.com or create an issue in the repository.

## 🔮 Future Enhancements

- **Video Calls** - Real-time video conferencing
- **Calendar Integration** - Study session scheduling
- **Progress Tracking** - Learning milestones
- **Notifications** - Push notifications for updates
- **Mobile App** - Native iOS/Android apps
- **AI Features** - Smart group recommendations
- **Analytics** - Study progress insights
