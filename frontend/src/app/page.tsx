// frontend/src/app/page.tsx
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

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentService.getAll().then((res) => res.data),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: documentService.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">AI Document QA System</h1>

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
            <div className="text-center text-gray-500 mt-20">
              Select a document to start asking questions
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
