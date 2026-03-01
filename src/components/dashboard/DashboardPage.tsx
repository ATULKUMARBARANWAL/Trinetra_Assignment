"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PdfUploader from "@/components/pdf/PdfUploader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { resetDocuments } from "@/features/document/documentSlice";
import { resetChat } from "@/features/chat/chatSlice";
import { setAllChats } from "@/features/chat/chatSlice";
import { logout } from "@/features/auth/authSlice";
import { loadChat } from "@/lib/chatStorage";
export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();


useEffect(() => {
  const storedChat = loadChat();

  console.log("Rehydrating chat:", storedChat); // debug

  if (storedChat && Object.keys(storedChat).length > 0) {
    dispatch(setAllChats(storedChat));
  }
}, [dispatch]);
  const handleLogout = () => {
    // ✅ Clear Redux auth state
    dispatch(logout());
dispatch(resetDocuments());
    dispatch(resetChat());

    // ✅ Clear localStorage (if using persist)
    localStorage.clear();

    // ✅ Redirect to login
    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-950 text-white relative">

        {/* ================= LEFT PANEL ================= */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col">

          {/* Header */}
          <div className="p-6 border-b border-gray-800 relative">
            <h1 className="text-2xl font-bold tracking-wide">
              Document Workspace
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Upload and manage your PDF documents
            </p>

            {/* 🔥 Logout Button */}
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition"
            >
              Logout
            </button>
          </div>

          {/* PDF Upload Area */}
          <div className="flex-1 overflow-auto p-6">
            <PdfUploader />
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-1/2 flex flex-col">

          {/* Chat Header */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold">
              AI Assistant
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Ask questions about your selected document
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto px-4 py-6">
            <MessageList />
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-800 p-4">
            <ChatInput />
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}