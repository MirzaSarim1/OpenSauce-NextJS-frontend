# 🍝 Open Sauce

A modern **Recipe Sharing and Management Platform** built with Next.js 16, featuring user authentication, recipe CRUD operations, ratings, reviews, and social features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

## ✨ Features

### Current Features (Implemented)

- ✅ **User Authentication**
  - Email/password registration with automatic login
  - Secure JWT-based authentication using NextAuth v5
  - Password hashing with bcrypt
  - Protected routes with Next.js 16 proxy middleware
  - Session management (30-day expiry)

- ✅ **User Profile Management**
  - View profile with user stats (recipes, favorites, reviews, followers)
  - Edit profile (name, bio, profile image)
  - Account information display

- ✅ **Dashboard**
  - User statistics overview
  - Quick action links

### Planned Features

- 🔄 **Recipe Management**
  - Create, read, update, delete recipes
  - Recipe images upload (Cloudinary integration)
  - Ingredients and instructions management
  - Prep time, cook time, and difficulty levels
  - Recipe categories and tags (dietary, cuisine types)

- 🔄 **Search & Discovery**
  - Search recipes by name, ingredients, or tags
  - Filter by categories, dietary restrictions, difficulty
  - Browse popular and recent recipes

- 🔄 **Social Features**
  - Recipe ratings (1-5 stars)
  - Recipe reviews and comments
  - Favorite recipes
  - Follow other users
  - User notifications

- 🔄 **Advanced Features**
  - Social media sharing
  - Cooking timer
  - Recipe collections
  - User activity feed

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Font Awesome** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js v5** - Authentication solution
- **Prisma 7.2.0** - Database ORM
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - PostgreSQL containerization
- **Adminer** - Database management (port 8080)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (via Docker or local installation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd open-sauce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=open_sauce
   DB_PORT=5432

   # Database URL for Prisma
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/open_sauce?schema=public"

   # NextAuth Configuration
   NEXTAUTH_SECRET="your-generated-secret-here"  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Management

- **Adminer UI**: [http://localhost:8080](http://localhost:8080)
  - Server: `postgres`
  - Username: `postgres`
  - Password: `postgres`
  - Database: `open_sauce`

## 📁 Project Structure

```
open-sauce/
├── app/                          # Next.js 16 App Router
│   ├── api/
│   │   └── auth/[...nextauth]/  # NextAuth API routes
│   ├── dashboard/               # Protected dashboard page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── profile/                 # User profile pages
│   │   ├── page.js             # View profile
│   │   └── edit/               # Edit profile
│   ├── layout.js               # Root layout
│   ├── page.js                 # Home page
│   └── globals.css             # Global styles
├── lib/
│   ├── auth.js                 # NextAuth configuration
│   ├── prisma.js               # Prisma client singleton
│   └── actions/                # Server actions
│       ├── auth.js             # Authentication actions
│       └── profile.js          # Profile actions
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.js                 # Database seeding
├── public/                     # Static assets
├── proxy.js                    # Next.js 16 middleware (route protection)
├── docker-compose.yml          # Docker configuration
├── .env                        # Environment variables (not in git)
└── package.json               # Dependencies
```

## 🗄️ Database Schema

### Core Models

- **User** - User accounts with authentication
- **Recipe** - Recipe details and metadata
- **Ingredient** - Ingredient catalog
- **RecipeIngredient** - Recipe-ingredient relationship with quantities
- **Category** - Recipe categories (Breakfast, Lunch, Dinner, etc.)
- **Tag** - Recipe tags (Dietary, Generic)
- **Review** - Recipe ratings and comments
- **Favorite** - User's favorite recipes
- **Follow** - User following relationships
- **Notification** - User notifications

### Enums

- **Role**: `USER`, `ADMIN`
- **Difficulty**: `EASY`, `MEDIUM`, `HARD`
- **TagType**: `DIETARY`, `GENERIC`

## 🔐 Authentication

### Implementation Details

- **Strategy**: JWT (JSON Web Tokens)
- **Session Duration**: 30 days
- **Password Hashing**: bcrypt with salt rounds = 12
- **Protected Routes**: Automatic redirect to `/login` for unauthenticated users

### Authentication Flow

1. **Registration**:
   - User submits registration form
   - Password is hashed with bcrypt
   - User account created in database
   - User is automatically logged in
   - Redirected to `/dashboard`

2. **Login**:
   - User submits credentials
   - Email converted to lowercase (case-insensitive)
   - Password verified against hash
   - JWT token generated
   - Redirected to `/dashboard`

3. **Protected Routes**:
   - Proxy middleware checks authentication
   - Unauthenticated requests redirected to `/login`
   - Session data available in server components

### Protected Routes

- `/dashboard/*`
- `/profile/*`
- `/recipes/create`
- `/recipes/:id/edit`
- `/favorites/*`

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `open_sauce` |
| `DB_PORT` | Database port | `5432` |

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma migrate dev         # Create and apply migrations
npx prisma generate           # Generate Prisma Client
npx prisma studio             # Open Prisma Studio (DB GUI)
npx prisma db seed            # Seed the database

# Code Quality
npm run lint         # Run ESLint

# Docker
docker-compose up -d           # Start PostgreSQL
docker-compose down            # Stop PostgreSQL
docker-compose logs -f         # View logs
```

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema design
- [x] Authentication system
- [x] User profile management

### Phase 2: Recipe Management 🔄
- [ ] Recipe CRUD operations
- [ ] Image upload (Cloudinary)
- [ ] Ingredients management
- [ ] Categories and tags

### Phase 3: Discovery & Search
- [ ] Recipe search functionality
- [ ] Filter and sort options
- [ ] Popular/recent recipes
- [ ] Recipe detail page

### Phase 4: Social Features
- [ ] Rating system
- [ ] Reviews and comments
- [ ] Favorites
- [ ] Follow users
- [ ] Notifications

### Phase 5: Advanced Features
- [ ] Social media sharing
- [ ] Cooking timer
- [ ] Recipe collections
- [ ] Activity feed
- [ ] Email notifications

### Phase 6: Polish & Deploy
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Testing (Unit, Integration, E2E)
- [ ] Production deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Your Name - [GitHub Profile]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- NextAuth.js team for authentication solution
- Vercel for hosting and deployment platform

---

**Happy Coding! 🚀**
