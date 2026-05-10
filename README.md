# Task Manager

A simple, minimal CRUD task manager built with **Next.js** (frontend), **NestJS** (backend), **Prisma** (ORM), and **SQLite** (database). Runs in Docker.

## Features

- ✅ Create tasks with title and description
- ✅ Mark tasks as complete with a checkbox (shows strikethrough)
- ✅ Edit task title and description
- ✅ Delete tasks
- ✅ Simple, clean UI
- ✅ REST API backend
- ✅ Fully containerized with Docker

## Tech Stack

- **Frontend**: Next.js 15 (React 18, TypeScript, Tailwind CSS)
- **Backend**: NestJS (TypeScript, Prisma)
- **Database**: SQLite with Prisma ORM
- **Deployment**: Docker & Docker Compose

## Quick Start

### With Docker (Recommended)

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/tasks

### Without Docker

```bash
npm install
npm run prisma:migrate
npm run dev
```

See `QUICK_START.md` for detailed setup instructions.

## Project Structure

```
task manager/
├── backend/              # NestJS REST API
│   ├── src/tasks/       # Task module (controller, service, DTO)
│   ├── prisma/          # Database schema & migrations
│   └── Dockerfile
├── frontend/            # Next.js App
│   ├── app/            # App router pages
│   └── Dockerfile
├── docker-compose.yml   # Multi-container config
└── docs/               # Documentation
```

## Task Model

```prisma
model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## API Endpoints

### Get all tasks
```http
GET /tasks
```

### Create a task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

### Update a task
```http
PATCH /tasks/1
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

### Delete a task
```http
DELETE /tasks/1
```

## UI Features

- **Add Task Form**: Simple input for title and description
- **Task List**: Shows all tasks with their state
- **Checkbox**: Click to toggle completion (strikethrough effect)
- **Edit Button**: Inline editing of title/description
- **Delete Button**: Remove tasks
- **Empty State**: Helpful message when no tasks exist

## Docker

### Build and Run
```bash
docker compose up --build
```

### View Logs
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop Services
```bash
docker compose down
```

### Reset Database
```bash
docker compose down -v
docker compose up
```

See `DOCKER_GUIDE.md` for comprehensive Docker documentation.

## Development

### Local Setup (without Docker)

```bash
# Install dependencies
npm install

# Setup database
npm run prisma:migrate

# Start development servers
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:3001

### Scripts

**Backend:**
- `npm run build` - Compile TypeScript
- `npm run start` - Run production build
- `npm run start:dev` - Run with hot reload
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Documentation

- **`QUICK_START.md`** - Setup and basic usage guide
- **`DOCKER_GUIDE.md`** - Comprehensive Docker documentation
- **`SIMPLIFICATION.md`** - What changed from the original over-engineered version
- **`BEFORE_AFTER.md`** - Detailed before/after metrics and comparison

## Database

The database uses SQLite stored in a Docker volume for persistence. All data survives container restarts.

**Reset database:**
```bash
docker compose down -v  # Remove volume
docker compose up       # Recreate with fresh schema
```

## Environment Variables

### Backend
- `DATABASE_URL` - SQLite database path (default: `file:/data/dev.db`)
- `FRONTEND_ORIGIN` - CORS origin (default: `http://localhost:3000`)
- `PORT` - Server port (default: `3001`)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3001`)
- `PORT` - Server port (default: `3000`)

## Docker Services

- **backend**: NestJS API on port 3001
- **frontend**: Next.js app on port 3000
- **volume**: `task-data` for SQLite persistence

## Troubleshooting

### Frontend can't reach API
```bash
docker compose logs backend
curl http://localhost:3001/tasks
```

### Port already in use
Edit `docker-compose.yml` port mapping and restart.

### Database errors
```bash
docker compose down -v
docker compose up --build
```

For more troubleshooting, see `DOCKER_GUIDE.md`.

## Performance

- **Frontend Build**: ~30-60 seconds
- **Backend Build**: ~30-60 seconds
- **Total Startup**: ~2-3 minutes (first time with migrations)
- **Bundle Size**: 
  - Backend: ~50-100MB (optimized)
  - Frontend: ~100-150MB (Next.js standalone)

## Production

For production deployment:
1. Set proper environment variables in `docker-compose.yml`
2. Use a managed database (PostgreSQL, MySQL)
3. Use a reverse proxy (Nginx)
4. Implement proper monitoring and logging
5. Set up automated backups

See `DOCKER_GUIDE.md` production section for details.

## License

MIT

## Contributing

This is a personal project. Feel free to fork and modify for your needs.
