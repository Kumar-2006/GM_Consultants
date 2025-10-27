# GM Consultants - Full-Stack Web Application

A comprehensive full-stack web application for GM Consultants (Green Minds Consultants), an architectural consultancy firm specializing in building plan approvals, zoning consultations, and statutory compliance assistance.

## 🏗️ Project Structure

```
gm-consultants/
├── frontend/
│   ├── pages/
│   │   ├── index.html          # Home page
│   │   ├── services.html        # Services page
│   │   ├── guidelines.html      # Guidelines page
│   │   ├── consultation.html    # Consultation form
│   │   ├── admin.html          # Admin dashboard
│   │   └── login.html          # Admin login
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   ├── js/
│   │   ├── main.js             # Main JavaScript
│   │   └── api.js              # API utilities
│   └── assets/                 # Images and icons
├── backend/
│   ├── server.js               # Main server file
│   ├── routes/
│   │   ├── serviceRoutes.js    # Service API routes
│   │   ├── guidelineRoutes.js  # Guideline API routes
│   │   ├── consultationRoutes.js # Consultation API routes
│   │   └── authRoutes.js       # Authentication routes
│   ├── models/
│   │   ├── Service.js          # Service model
│   │   ├── Guideline.js        # Guideline model
│   │   ├── Consultation.js     # Consultation model
│   │   └── AdminUser.js        # Admin user model
│   ├── config/
│   │   └── db.js               # Database configuration
│   └── middleware/
│       └── auth.js             # Authentication middleware
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Features

### Public Pages
- **Home Page**: Company introduction, hero section, and service overview
- **Services Page**: Dynamic service cards fetched from database
- **Guidelines Page**: Collapsible accordion with building guidelines
- **Consultation Page**: Contact form with validation

### Admin Dashboard
- **Authentication**: Secure login with JWT tokens
- **Service Management**: CRUD operations for services
- **Guideline Management**: CRUD operations for guidelines
- **Consultation Management**: View submitted consultation requests

### Technical Features
- **Responsive Design**: Mobile-first approach with corporate theme
- **Real-time Data**: Dynamic content loading from MongoDB
- **Form Validation**: Client-side and server-side validation
- **Security**: Password hashing, JWT authentication, CORS protection

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone/Navigate to the project directory**
   ```bash
   cd "C:\Users\Kumar\Documents\Web Technology\Project\gm-consultants"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gm-consultants
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Initialize the database**
   ```bash
   node setup-db.js
   ```

6. **Start the server**
   ```bash
   npm start
   ```

7. **Access the application**
   - Website: http://localhost:3000
   - Admin Login: http://localhost:3000/login

## 🔐 Default Admin Credentials

- **Username**: Chandramohan
- **Password**: 5655

*Note: Change these credentials after first login for security.*

## 📱 Pages Overview

### Public Pages
- **Home** (`/`): Company introduction and service overview
- **Services** (`/services`): List of all available services
- **Guidelines** (`/guidelines`): Building guidelines and regulations
- **Consultation** (`/consultation`): Contact form for consultation requests

### Admin Pages
- **Login** (`/login`): Admin authentication
- **Dashboard** (`/admin`): Protected admin panel

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/services` - Fetch all services
- `GET /api/guidelines` - Fetch all guidelines
- `POST /api/consultations` - Submit consultation form

### Admin Endpoints (Requires Authentication)
- `POST /api/login` - Admin login
- `POST /api/services` - Add new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/guidelines` - Add new guideline
- `PUT /api/guidelines/:id` - Update guideline
- `DELETE /api/guidelines/:id` - Delete guideline
- `GET /api/consultations` - Get all consultation requests

## 🎨 Design Features

### Color Scheme
- **Primary Navy**: #0A2647
- **White**: #FFFFFF
- **Light Gray**: #F5F5F5
- **Green Accent**: #2E8B57

### Typography
- **Headings**: Poppins (Google Fonts)
- **Body Text**: Open Sans (Google Fonts)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Project Structure Notes
- Frontend files are served statically from the `frontend` directory
- API routes are prefixed with `/api`
- Admin routes are protected with JWT middleware
- All forms include client-side validation

## 📝 Database Models

### Service Model
```javascript
{
  title: String,
  description: String,
  imageURL: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Guideline Model
```javascript
{
  title: String,
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Consultation Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  projectType: String,
  message: String,
  createdAt: Date
}
```

### AdminUser Model
```javascript
{
  username: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gm-constructions
JWT_SECRET=your-production-secret-key
PORT=3000
NODE_ENV=production
```

### Production Considerations
- Use MongoDB Atlas for database hosting
- Set up proper CORS policies
- Use environment variables for sensitive data
- Implement rate limiting
- Add input sanitization
- Set up monitoring and logging

## 📞 Support

For technical support or questions about the application, please contact:
- **Email**: info@gmconstructions.com
- **Phone**: +1 (555) 123-4567

## 📄 License

This project is licensed under the MIT License.

---

**GM Consultants** - Building Approvals. Done Right.
