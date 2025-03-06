# Project Management Dashboard

This project is a project management dashboard built with Next.js, Tailwind CSS, and Supabase for authentication.

## Features

- User authentication with Supabase
- Dashboard layout with sidebar and header
- Page routes for main navigation items

## Getting Started

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd flowstate-catalyst
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**

    Create a `.env.local` file in the project root and add your Supabase URL and Anon Key:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

    Replace `your-project-url` and `your-anon-key` with your actual Supabase project credentials.

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.