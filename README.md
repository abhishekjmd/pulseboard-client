# PulseBoard Frontend ⚡

**Engineering health at a glance.** PulseBoard is a premium dashboard designed for engineering leaders to gain instant visibility into their team's performance via GitHub intelligence.

[**View Live App**](https://pulseboard-six-delta.vercel.app/)

---

## 🚀 Overview

PulseBoard transforms raw GitHub activity into actionable metrics. By simply pasting a public repository URL, users can surface critical health signals without needing to log in or configure complex integrations.

### Key Features
- **Cycle Time Analysis**: Measure the speed of your development lifecycle.
- **PR Throughput**: Track the volume of code being merged.
- **Stale PR Detection**: Identify bottlenecks and abandoned work.
- **Contributor Velocity**: Understand team engagement and distribution of work.
- **Mobile-First Design**: Fully responsive, high-utility interface optimized for any device.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## ⚙️ Local Development

### 1. Prerequisites
- Node.js 20+ 
- npm or pnpm

### 2. Setup
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/pulseboard-client.git
cd pulseboard-client
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> [!IMPORTANT]
> For client-side access in Next.js, all environment variables **must** be prefixed with `NEXT_PUBLIC_`.

### 4. Run the App
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 🚢 Deployment

### Vercel Configuration
When deploying to Vercel, ensure you add the following Environment Variable in the Vercel Dashboard:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Your production backend URL |

---

## 🎨 Design Principles

PulseBoard follows a "Design like Apple, build like Stripe" philosophy:
- **Clarity over Clutter**: Heavy use of whitespace and strong visual hierarchy.
- **Action Oriented**: Clear CTAs and intuitive navigation.
- **Premium Aesthetics**: Harmonious color palettes, modern typography (Geist), and subtle micro-animations.

---

## 📄 License
MIT © [PulseBoard](https://pulseboard-six-delta.vercel.app/)
