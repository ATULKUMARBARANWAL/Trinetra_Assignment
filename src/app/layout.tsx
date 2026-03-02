import "./globals.css";
import ReduxProvider from "@/core/providers/ReduxProvider";
import SessionManager from "@/components/SessionManager";
import ToastProvider from "@/components/ToastProvider";

/* =========================================
   Metadata (IMPORTANT)
========================================= */
export const metadata = {
  title: "AI Document Chat System",
  description:
    "High-performance AI document chat system with secure session management and PDF processing",
};

/* =========================================
   Root Layout
========================================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <ReduxProvider>
          <SessionManager>
            {children}
            <ToastProvider />
          </SessionManager>
        </ReduxProvider>
      </body>
    </html>
  );
}