import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: 'MewLearning',
  description: 'Luyện hội thoại tiếng Anh với phát âm chuẩn và kho từ vựng cá nhân',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /**
     * suppressHydrationWarning is required when using next-themes because the
     * server renders without knowing the user's preferred theme.
     */
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"       // adds/removes "dark" class on <html>
          defaultTheme="system"   // respects OS preference by default
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
