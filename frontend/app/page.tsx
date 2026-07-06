"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentService, questionService } from "@/services/api";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentList from "@/components/DocumentList";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentService.getAll().then((res) => res.data),
  });

  const uploadMutation = useMutation({
    mutationFn: documentService.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="container mx-auto">
        {/* Header with better visibility */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="mr-3">🤖</span>
          AI Document QA System
          <span className="ml-3 text-sm font-normal text-gray-500">v1.0</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Documents */}
          <div className="lg:col-span-1 space-y-4">
            <DocumentUpload onUpload={uploadMutation.mutate} />
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              onSelect={setSelectedDocument}
              selectedId={selectedDocument}
            />
          </div>

          {/* Right Panel - Chat */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <ChatInterface documentId={selectedDocument} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Document
                </h3>
                <p className="text-gray-500">
                  Choose a document from the left panel to start asking
                  questions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
