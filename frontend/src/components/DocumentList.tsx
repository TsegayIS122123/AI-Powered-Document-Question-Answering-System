"use client";

interface Document {
  id: number;
  title: string;
  content?: string;
  created_at?: string;
  file_type?: string;
  file_size?: number;
}

interface DocumentListProps {
  documents?: Document[];
  isLoading: boolean;
  onSelect: (id: number) => void;
  selectedId: number | null;
}

export default function DocumentList({
  documents = [],
  isLoading,
  onSelect,
  selectedId,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📚 Your Documents
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-14 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📚</span>
        Your Documents
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({documents.length})
        </span>
      </h2>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-600 font-medium">No documents uploaded yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload your first document above
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc.id)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                selectedId === doc.id
                  ? "bg-blue-50 border-2 border-blue-500 shadow-md"
                  : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{doc.title}</p>
                  {doc.file_type && (
                    <p className="text-xs text-gray-500 mt-1">
                      📄 {doc.file_type} •{" "}
                      {doc.file_size
                        ? `${(doc.file_size / 1024).toFixed(1)} KB`
                        : "Unknown size"}
                    </p>
                  )}
                </div>
                {doc.created_at && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
