import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Simple CRUD task manager built with Next.js, NestJS, and Prisma.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
