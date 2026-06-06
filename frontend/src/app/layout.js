import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata = {
  title: "AI Chatbot",
  description: "",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" }
    ]
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
