# Aegis Control Plane Dashboard

A modern, high-performance web dashboard for managing the Aegis API Security Firewall. Built with Next.js 15, Tailwind CSS, and Clerk Authentication, this dashboard provides a real-time, zero-trust control center for managing enterprise API security rules, analyzing web traffic, and configuring threat protection.

## ✨ Features

- **Zero-Trust Authentication:** Powered by Clerk, featuring secure, cryptographic JSON Web Tokens (JWT) for all API requests.
- **Dynamic Workspaces:** Built-in multi-tenancy. Every user is automatically provisioned a secure Organization upon sign-up.
- **Role-Based Access Control (RBAC):** Built-in support for multiple roles (Admin, Viewer) to restrict sensitive actions.
- **Project Management:** Manage multiple API projects and upstreams from a single pane of glass.
- **Real-Time Security Rules:** Toggle and configure security policies (WAF, DLP, Rate Limiting, AI Blocker) instantly.
- **Team Collaboration:** Invite members to your workspace directly from the UI.
- **Beautiful UI:** Designed with modern aesthetics—glassmorphism, subtle gradients, and dark-mode optimization.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Aegis Go Control Plane (Backend) running locally on port 8081

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Clerk API keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open the Dashboard:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

The Aegis Dashboard communicates directly with the Go Control Plane via REST API. It uses React Context (`OrgProvider`) to seamlessly synchronize your Clerk Authentication state with your PostgreSQL database organization.

### Key Technologies
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Authentication:** Clerk Next.js SDK v7
- **Data Visualization:** Recharts (Upcoming Global Analytics Phase)

## 🛡️ Security

This frontend does not store any sensitive data or hardcoded credentials. All authentication is delegated to Clerk, and the Go backend strictly enforces Role-Based Access Control (RBAC) via cryptographically signed JWTs before executing any action.
