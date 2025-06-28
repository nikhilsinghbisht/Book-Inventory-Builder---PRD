# Book Inventory Builder

A modern web application for educators and librarians to digitize book collections by photographing books and using AI to automatically extract book details. The application uses Google's Gemini Vision LLM to extract book information from cover images and stores it in a MongoDB database.

## 🚦 How to Run

### Start the Server
```bash
cd server
npm install
node index.js
```

### Start the Client
```bash
cd client
npm install
npm start
```

The client will run at http://localhost:3000 and the server at http://localhost:5000 by default.

## 🚀 Features

### Core Functionality
- **AI-Powered Book Extraction**: Upload book cover photos and automatically extract title, author, grade level, subject, series, and more using Google Gemini Vision API
- **Manual Editing**: Review and edit AI-suggested details before saving
- **Image Processing**: Support for common image formats (JPG, PNG, GIF, BMP) with automatic optimization
- **Inventory Management**: Grid and list views with search and filtering capabilities

### User Experience
- **Modern UI**: Clean, responsive design built with React and Tailwind CSS
- **Drag & Drop**: Easy image upload with drag-and-drop functionality
- **Real-time Search**: Search books by title, author, subject, or series
- **Advanced Filtering**: Filter by grade level, subject, and series
- **Pagination**: Efficient browsing of large book collections

### Technical Features
- **RESTful API**: Node.js/Express backend with comprehensive CRUD operations
- **Database**: MongoDB Atlas integration with text search capabilities
- **Security**: Rate limiting, input validation, and secure file handling
- **Performance**: Image optimization and efficient database queries

## 🛠️ Recent Fixes & Updates
- Fixed duplicate `app` declaration in `server/index.js`
- Corrected Gemini Vision API usage for image+prompt extraction
- Improved error handling and logging for AI extraction
- Updated CORS and Helmet configuration for image access

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Google Gemini API Key** - Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **MongoDB Atlas Account** - Free tier available at [MongoDB Atlas](https://www.mongodb.com/atlas)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-inventory-builder.git
cd book-inventory-builder
```

### 2. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/book_inventory?retryWrites=true&w=majority

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security
JWT_SECRET=your_jwt_secret_here
```

### 4. Database Setup

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Get your connection string and add it to the `.env` file
5. The application will automatically create the necessary collections

### 5. Start the Application

```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📸 Screenshots

### Dashboard View
<img src="screenshots/Screenshot%202025-06-28%20121705.png" alt="Dashboard" width="600"/>
<p align="center"><i>Main dashboard showing book grid with search and filter options</i></p>

### Add Book Page
<img src="screenshots/Screenshot%202025-06-28%20121620.png" alt="Add Book" width="600"/>
<p align="center"><i>Upload book cover and AI extraction interface</i></p>

### Book Details
<img src="screenshots/Screenshot%202025-06-28%20121751.png" alt="Book Details" width="600"/>
<p align="center"><i>Individual book detail view with editing capabilities</i></p>

### Settings Page
![Settings](screenshots/settings.png)
*API configuration and system settings*

## 🐞 Troubleshooting
- **Cannot redeclare block-scoped variable 'app'.**
  - Remove duplicate `const app = express();` in `server/index.js`.
- **AI extraction not working:**
  - Ensure you are using the correct Gemini Vision model (e.g., `gemini-pro-vision` or `gemini-1.5-flash` for image extraction).
  - Make sure your Gemini API key is set in `.env`.
  - Check server logs for detailed error messages.
- **Image not showing after upload:**
  - Confirm CORS and static file serving are configured as shown in `server/index.js`.

## 📦 Project Structure

```
book-inventory-builder/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── index.js           # Server entry point
├── uploads/               # Uploaded images
├── screenshots/           # Project screenshots
├── package.json
├── env.example
└── README.md
```

## 🧪 Testing

### Manual Testing
1. **API Connection Test**: Use the Settings page to test Gemini API and database connections
2. **Image Upload**: Try uploading different image formats and sizes
3. **AI Extraction**: Test with various book cover images to verify extraction accuracy
4. **Search & Filter**: Test search functionality and filtering options

### Sample Data
You can test the application with sample book cover images. The AI will attempt to extract:
- Book title
- Author name
- Grade level (if applicable)
- Subject area (if applicable)
- Series name (if applicable)
- ISBN (if visible)
- Publisher (if visible)
- Publication year (if visible)
- Number of pages (if visible)

## 🚀 Deployment

### Backend Deployment (Heroku/Netlify)
1. Set up environment variables in your hosting platform
2. Deploy the server code
3. Ensure MongoDB Atlas is accessible from your deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder
3. Update API endpoints to point to your deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI vision capabilities
- **MongoDB Atlas** for cloud database hosting
- **React** and **Node.js** communities for excellent documentation
- **Tailwind CSS** for the beautiful UI framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/book-inventory-builder/issues) page
2. Create a new issue with detailed information
3. Include screenshots and error messages when possible

---

**Note**: This application requires an active internet connection for AI processing and database operations. The Gemini API has usage limits based on your Google Cloud account tier. 