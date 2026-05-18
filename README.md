# 🚗 Araciniz.com

> **Modern Vehicle Management & Rental Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-99.1%25-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-purple?style=flat-square)](https://araciniz-com.vercel.app)

---

## ✨ Overview

**Araciniz.com** is a comprehensive vehicle management and rental platform built with cutting-edge web technologies. Designed with TypeScript for reliability and Next.js for performance, it provides a seamless experience for users to browse, rent, and manage vehicles online.

### 🎯 Key Highlights

- 🚗 **Comprehensive Vehicle Database** - Browse and filter thousands of vehicles
- 💪 **Type-Safe Development** - 99.1% TypeScript for reliability
- ⚡ **Lightning-Fast Performance** - Next.js 16 with server-side rendering
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS and Framer Motion
- 📱 **Fully Responsive** - Perfect experience on all devices
- 🔐 **Secure Backend** - Supabase authentication and database
- 🌙 **Professional Features** - Smooth animations and form validation

---

## 🚀 Features

### Core Capabilities
- ✅ Vehicle catalog browsing
- ✅ Advanced search and filtering
- ✅ Vehicle rental bookings
- ✅ User account management
- ✅ Booking history tracking
- ✅ Real-time availability updates
- ✅ Payment integration ready

### Advanced Features
- ✅ Supabase authentication (Email, OAuth)
- ✅ Form validation with React Hook Form & Zod
- ✅ Smooth animations with Framer Motion
- ✅ Server-side rendering for SEO
- ✅ Responsive design system
- ✅ Dark mode support

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React framework for production
- **Runtime**: [React 19](https://react.dev/) - UI library
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework

### Forms & Validation
- **Form Management**: [React Hook Form](https://react-hook-form.com/) - Performant form handling
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Resolvers**: [@hookform/resolvers](https://github.com/react-hook-form/resolvers) - Form validation integration

### Backend & Database
- **Backend**: [Supabase](https://supabase.com/) - Open source Firebase alternative
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) - Email & OAuth
- **Real-time**: Supabase Real-time database

### UI & Animations
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- **PostCSS**: [@tailwindcss/postcss](https://tailwindcss.com/) - CSS processing

### Development Tools
- **Linter**: [ESLint 9](https://eslint.org/) - Code quality
- **Type Checking**: TypeScript 5

---

## 📦 Installation

### Prerequisites
- **Node.js 18+**
- **npm or yarn**
- **Supabase Account**

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayvazekin/Araciniz.com.git
   cd Araciniz.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint to check code quality
```

---

## 🏗️ Project Structure

```
Araciniz.com/
├── app/
│   ├── (auth)/                 # Authentication pages
│   ├── (dashboard)/            # Dashboard pages
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── vehicles/              # Vehicle components
│   ├── auth/                  # Authentication components
│   ├── ui/                    # Reusable UI components
│   └── forms/                 # Form components
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── api.ts                # API functions
│   └── utils.ts              # Utility functions
├── types/
│   ├── vehicle.ts            # Vehicle types
│   ├── booking.ts            # Booking types
│   └── user.ts               # User types
├── public/
│   └── images/               # Static images
├── styles/
│   └── globals.css           # Global styles
├── .env.local                # Environment variables
└── next.config.js            # Next.js configuration
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Additional Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Get Supabase credentials:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API to find your URL and keys

---

## 🚀 Deployment

### Deploy to Vercel

Vercel is the recommended hosting platform:

1. Push to GitHub
2. Visit [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

**Live Demo**: https://araciniz-com.vercel.app

### Alternative Deployment Options

- **Docker**: Build with `docker build -t araciniz .`
- **Self-Hosted**: Deploy `dist` folder to any Node.js server
- **Netlify**: Connect repository to Netlify

---

## 💾 Database Schema

### Vehicles Table
```sql
- id (UUID, Primary Key)
- name (String)
- brand (String)
- model (String)
- year (Integer)
- price_per_day (Decimal)
- image_url (String)
- available (Boolean)
- features (JSON)
- created_at (Timestamp)
```

### Bookings Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- vehicle_id (UUID, Foreign Key)
- start_date (Date)
- end_date (Date)
- total_price (Decimal)
- status (String: pending, confirmed, completed, cancelled)
- created_at (Timestamp)
```

### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- full_name (String)
- phone (String)
- address (String)
- created_at (Timestamp)
```

---

## 🎨 Customization

### Theme Configuration
Customize colors and design in:
- `tailwind.config.ts` - Tailwind CSS configuration
- `styles/globals.css` - Global styles
- Component files for individual styling

### Adding New Features

1. **Add New Page**
   ```bash
   mkdir -p app/new-page
   touch app/new-page/page.tsx
   ```

2. **Create Component**
   ```bash
   touch components/new-component.tsx
   ```

3. **Add Type Definitions**
   ```bash
   touch types/new-type.ts
   ```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code structure
- Use ESLint for code quality
- Test your changes before submitting PR

---

## 🐛 Known Issues & Roadmap

### Current Features
- ✅ Vehicle catalog
- ✅ User authentication
- ✅ Booking system

### Coming Soon
- 🚧 Payment gateway integration
- 🚧 Advanced filters & search
- 🚧 User reviews & ratings
- 🚧 Admin dashboard
- 🚧 Email notifications

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ayvek**
- GitHub: [@ayvazekin](https://github.com/ayvazekin)
- Portfolio: Available on GitHub profile

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com/) for hosting
- [Supabase](https://supabase.com/) for backend services
- [Next.js](https://nextjs.org/) team for excellent framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://react.dev/) community

---

## 📞 Support

- 🐛 Found a bug? [Open an issue](https://github.com/ayvazekin/Araciniz.com/issues)
- 💡 Have a suggestion? [Start a discussion](https://github.com/ayvazekin/Araciniz.com/discussions)
- 📧 Need help? Reach out on GitHub

---

## 🔗 Quick Links

- **Live Application**: https://araciniz-com.vercel.app
- **Supabase Dashboard**: https://supabase.com/
- **Documentation**: Check wiki tab
- **Issues**: Report bugs here
- **Discussions**: Share ideas

---

<div align="center">

**Made with ❤️ by Ayvek**

🚗 Find Your Perfect Vehicle 🚗

⭐ If you find this project useful, please consider giving it a star! ⭐

</div>