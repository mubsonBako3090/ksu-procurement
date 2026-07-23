import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import BootstrapClient from '@/components/ui/BootstrapClient/BootstrapClient';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title:       'KSU Procurement System',
  description: 'Digital Procurement Requisition System — Kaduna State University',
  icons:       { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <BootstrapClient />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A2235',
              color:      '#E8EDF5',
              border:     '1px solid #1E2D45',
              fontFamily: 'Sora, sans-serif',
              fontSize:   '13px',
            },
            success: { iconTheme: { primary: '#00C37B', secondary: '#000' } },
            error:   { iconTheme: { primary: '#E84545', secondary: '#fff' } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
