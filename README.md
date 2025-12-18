<img width="1475" height="675" alt="schedule-life" src="https://github.com/user-attachments/assets/f8b42b4b-044c-4ce8-b5f3-0597f514bf43" />



# Intelligent Scheduling Platform - Schedule Life

Schedule life is a modern, open-source scheduling automation platform designed to streamline appointment booking and meeting management. Built with the latest web technologies, Misso offers a seamless experience for professionals to manage their availability and for clients to book time effortlessly.

## 🚀 Features

- **📅 Smart Scheduling**: Intuitive booking pages for effortless appointment setting.
- **⚡ Real-Time Availability**: Define your working hours and availability with granular control.
- **🔗 Custom Event Types**: Create various meeting types (e.g., 15min Intro, 1hr Consultation) with unique durations and settings.
- **📹 Video Integration**: Seamless integration with video conferencing tools (defaulting to Google Meet).
- **🛡️ Secure Authentication**: Robust user management via GitHub and Google OAuth.
- **🎨 Modern UI/UX**: A responsive and accessible interface built with Tailwind CSS and Radix UI(Shadcn).
- **📧 Calendar Sync**: Two-way calendar synchronization using Nylas.

## 🛠️ Tech Stack

This project leverages a cutting-edge stack for performance, scalability, and developer experience:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Forms**: React Aria Components, Conform, Zod
- **Calendar API**: [Nylas](https://www.nylas.com/)
- **File Uploads**: [Uploadthing](https://uploadthing.com/)
- **Testing**: Jest, React Testing Library

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **pnpm**
- **Docker** (optional, for local DB)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/misso.git
    cd misso
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add the following keys:

    ```env
    # Database (Supabase or Local Postgres)
    DATABASE_URL="postgresql://..."
    DIRECT_URL="postgresql://..."

    # Authentication (NextAuth)
    AUTH_SECRET="your_generated_secret"
    AUTH_GITHUB_ID="your_github_client_id"
    AUTH_GITHUB_SECRET="your_github_client_secret"
    AUTH_GOOGLE_ID="your_google_client_id"
    AUTH_GOOGLE_SECRET="your_google_client_secret"

    # App URL
    NEXT_PUBLIC_URL="http://localhost:3000"

    # Nylas (Calendar Integration)
    NYLAS_API_SECRET_KEY="your_nylas_api_key"
    NYLAS_API_URI="https://api.us.nylas.com"
    NYLAS_CLIENT_ID="your_nylas_client_id"

    # Uploadthing (File Uploads)
    UPLOADTHING_SECRET="your_uploadthing_secret"
    UPLOADTHING_APP_ID="your_uploadthing_app_id"
    ```

4.  **Database Setup**
    Push the Prisma schema to your database:

    ```bash
    npx prisma db push
    ```

5.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Running Tests

To run the test suite:

```bash
npm test
```

## 🐳 Docker Deployment

You can also run the application using Docker:

```bash
docker build -t schedule-life .
docker run -p 3000:3000 schedule-life
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

