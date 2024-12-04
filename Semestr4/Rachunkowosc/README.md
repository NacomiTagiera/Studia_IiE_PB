# Accounting Management System

A web application for managing accounting operations and generating balance sheets. Live demo available at: [projekt-rk-iie.vercel.app](https://projekt-rk-iie.vercel.app/)

## Features

- Managing accounting operations across multiple accounts
- Setting initial account balances
- Recording transactions with:
  - Transaction date
  - Amount
  - Operation number
  - Source and destination accounts
- Viewing account history with debit and credit sides
- Generating balance sheets for any selected date
- Real-time balance calculations
- Data persistence using local storage

## Technology Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **State Management**: Zustand
- **UI Components**: Material UI
- **Date Handling**: Day.js
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
