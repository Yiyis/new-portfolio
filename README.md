# Fluid Portfolio

A modern, fluid portfolio website showcasing UI/UX and frontend development work. Built with React, TypeScript, and featuring smooth animations, WebGL effects, and a custom cursor experience.

## ✨ Features

- **Animated Splash Loader** - Lottie animation with smooth transitions
- **Custom Cursor** - Interactive cursor that responds to hover states
- **WebGL Distortions** - Fluid blob animations using Three.js and React Three Fiber
- **Project Showcase** - Dynamic project gallery with smooth carousel navigation
- **Project Detail Pages** - Rich content pages with Portable Text from Sanity CMS
- **Password Protection** - Optional password protection for selected projects
- **Responsive Design** - Fully responsive across all device sizes
- **SEO Optimized** - Meta tags, Open Graph, and Twitter Card support
- **Accessibility** - WCAG compliant with proper ARIA labels and semantic HTML

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **3D/WebGL**: Three.js + React Three Fiber + Drei
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Lottie React

## 📋 Prerequisites

- Node.js 22+ (see `.nvmrc`)
- npm or yarn
- Sanity project ID and dataset (optional, for production)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fluid-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SANITY_PROJECT_ID=your_sanity_project_id
   VITE_SANITY_DATASET=production
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🏗️ Project Structure

```
fluid-portfolio/
├── components/
│   ├── About/          # About page component
│   ├── Home/           # Home page components (BlobProject, Carousel, etc.)
│   ├── Project/        # Project detail components
│   └── ui/             # Reusable UI components (Cursor, SplashLoader, etc.)
├── services/
│   └── sanityService.ts # Sanity CMS integration
├── public/
│   ├── images/         # Static images
│   └── icons/          # Favicons and app icons
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🎨 Key Components

### SplashLoader
Animated splash screen with Lottie animation that plays on initial page load.

### CustomCursor
Custom cursor that follows mouse movement and responds to interactive elements.

### BlobProject
WebGL-distorted image component that creates fluid blob animations for project images.

### ProjectDetail
Dynamic project detail pages with rich content from Sanity CMS, including:
- Hero images with smooth transitions
- Portable Text content rendering
- External project links
- Password protection support

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SANITY_PROJECT_ID` | Your Sanity project ID | Yes (for production) |
| `VITE_SANITY_DATASET` | Your Sanity dataset name | No (defaults to 'production') |

## 🚢 Deployment

The project is configured for deployment on Vercel. The build output is in the `dist/` directory.

### Vercel Configuration

The project includes:
- `vercel.json` - Vercel deployment configuration
- `.github/workflows/` - GitHub Actions workflow for CI/CD (if configured)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎯 Performance

- Lazy loading for animations and heavy components
- Optimized image handling via Sanity CDN
- Code splitting with React Router
- SEO optimizations for fast indexing

## 📄 License

Private project - All rights reserved

## 👤 Author

**Yiyi Shao**
- Design-Driven Full-Stack Developer
- Portfolio: [Your Portfolio URL]

---

Built with ❤️ using React, TypeScript, and modern web technologies.
