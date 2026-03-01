"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PdfUploader from "@/components/pdf/PdfUploader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-950 text-white">

        {/* ================= LEFT PANEL ================= */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col">

          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold tracking-wide">
              Document Workspace
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Upload and manage your PDF documents
            </p>
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