import AuthProvider from './provider';
import './globals.css';

export const metadata = {
  title: 'Assignment Submission Portal',
  description: 'Assignment Submission Portal for Programming Hero',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}