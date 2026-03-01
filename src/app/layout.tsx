import "./globals.css";
import ReduxProvider from "@/core/providers/ReduxProvider";
import SessionManager from "@/components/SessionManager";
import ToastProvider from "@/components/ToastProvider"; // ✅ add this

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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