# Modern 3D Portfolio Frontend

A modern, responsive portfolio website built with React, featuring 3D animations, dark/light mode, and internationalization support.

## 🚀 Features

- **3D Hero Section**: Interactive Three.js animations with floating particles and geometric shapes
- **Dark/Light Mode**: Persistent theme switching with smooth transitions
- **Internationalization**: Support for English and French languages
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion animations throughout the interface
- **Project Showcase**: Dynamic project cards with filtering and sorting
- **Image Upload**: Drag and drop or URL input for project and certificate images
- **Multiple Project Images**: Support for multiple images per project with gallery view
- **Review System**: Allow visitors to submit reviews for projects
- **Admin Controls**: Admins can delete reviews and manage multiple project images
- **Modern UI**: Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **Framer Motion** - Animation library for smooth transitions
- **Three.js** - 3D graphics library for interactive visuals
- **React Three Fiber** - React renderer for Three.js
- **i18next** - Internationalization framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and set your API base URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:4000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── 3d/             # Three.js 3D components
│   ├── ui/             # Basic UI components
│   └── Layout.js       # Main layout component
├── contexts/           # React contexts
│   ├── ThemeContext.js # Dark/light mode management
│   └── LanguageContext.js # Internationalization
├── hooks/              # Custom React hooks
│   ├── useProjects.js  # Projects data management
│   └── useReviews.js   # Reviews data management
├── api/                # API service layer
│   ├── index.js        # Axios configuration
│   ├── projects.js     # Projects API
│   ├── reviews.js      # Reviews API
│   └── certificates.js # Certificates API
├── i18n/               # Internationalization
│   ├── index.js        # i18next configuration
│   └── locales/        # Translation files
├── pages/              # Page components
│   ├── Home.js         # Home page with 3D hero
│   ├── Projects.js     # Projects listing page
│   └── ProjectDetail.js # Individual project page
└── App.js              # Main application component
```

## 🌐 API Integration

This frontend connects to a Node.js/Express/MongoDB backend. The API endpoints include:

- **Projects**: `GET /api/projects`, `GET /api/projects/:id`, `POST /api/projects` (with image upload)
- **Reviews**: `GET /api/reviews`, `POST /api/reviews`, `DELETE /api/reviews/:id` (admin only)
- **Certificates**: `GET /api/certificates`, `POST /api/certificates` (with image upload)

See the `API_REFERENCE.md` file for complete API documentation.

## 📸 Image Upload Functionality

The application supports two methods for adding images to projects and certificates:

1. **Drag and Drop**: Directly drag image files into the designated drop area
   - Modern, intuitive interface for uploading multiple files at once
   - Visual feedback with thumbnails and upload progress
   - Ability to remove selected images before uploading
2. **URL Input**: Enter a URL for an external image

Image upload features:
- Supports common image formats (PNG, JPG, GIF)
- Preview images before submission
- File size limit of 10MB
- Automatic image optimization on the server
- Error handling for failed uploads
- Real-time progress and success/error feedback

## 🖼️ Multiple Project Images

Projects can now have multiple images:

- **Main Image**: The primary image shown on project cards and at the top of the project detail page
- **Additional Images**: Up to 10 extra images that can be added to each project
- **Image Gallery**: Interactive gallery with thumbnails on the project detail page
- **Admin Controls**: Admins can add, remove, and manage project images
- **Drag and Drop Upload**: Easy addition of multiple images at once with intuitive UI
- **Thumbnail Management**: Remove individual images directly from the thumbnail view
- **Image Reordering**: Drag and drop interface for reordering additional images
- **Visual Feedback**: Real-time updates and status indicators during reordering

## 👮‍♂️ Admin Features

Admin users have special privileges:

- **Review Management**: Delete inappropriate or spam reviews
- **Project Management**: Create, edit, and delete projects with multiple images
- **Certificate Management**: Create, edit, and delete certificates with images

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... other shades
    900: '#1e3a8a',
  }
}
```

### 3D Animations
Modify `src/components/3d/HeroScene.js` to customize the 3D elements:
- Adjust particle count and colors
- Change geometric shapes and animations
- Modify camera position and controls

### Translations
Add new languages by:
1. Creating a new translation file in `src/i18n/locales/`
2. Adding the language to the `LanguageSelector` component
3. Updating the i18n configuration

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ using React, Three.js, and modern web technologies. 