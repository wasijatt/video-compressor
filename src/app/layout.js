
import './globals.css';

export const metadata = {
  title: 'Free Video Compressor',
  description: 'make your video vip resolution with lower size',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://apis.google.com/js/api.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
