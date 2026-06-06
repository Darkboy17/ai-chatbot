import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata = {
  title: "AI Chatbot",
  description: "",
  icons: {
    icon: [

      { url: '/robot.png', type: 'image/png', sizes: '32x32' },

    ],

  },
};

/**
 * Provides the shared document shell and portal mount for the app.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div id="portal-root"></div>
        {children}
      </body>
    </html>
  );
}
