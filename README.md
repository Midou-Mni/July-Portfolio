# Modern 3D Portfolio Frontend

A modern, responsive portfolio website built with React, featuring 3D animations, dark/light mode, and internationalization support.

## 🚀 Features

- **3D Hero Section**: Interactive Three.js animations with floating particles and geometric shapes
- **Dark/Light Mode**: Persistent theme switching with smooth transitions
- **Internationalization**: Support for English and French languages
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion animations throughout the interface
- **Project Showcase**: Dynamic project cards with filtering and sorting
- **Review System**: Allow visitors to submit reviews for projects
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
   REACT_APP_API_BASE_URL=http://localhost:5000/api
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

- **Projects**: `GET /api/projects`, `GET /api/projects/:id`
- **Reviews**: `GET /api/reviews`, `POST /api/reviews`
- **Certificates**: `GET /api/certificates`

See the `API_REFERENCE.md` file for complete API documentation.

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