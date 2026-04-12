'use client';
import { useState, useRef } from 'react';
import { config } from '../config';

interface Document {
  name: string;
  uploadedAt: string;
}

interface DocumentUploadProps {
  sessionId: string;
  onDocumentsChanged?: (count: number) => void;
}

export default function DocumentUpload({ sessionId, onDocumentsChanged }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);

    try {
      const res = await fetch(`${config.apiUrl}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const newDoc = { name: data.filename, uploadedAt: new Date().toISOString() };
      const updated = [...documents, newDoc];
      setDocuments(updated);
      onDocumentsChanged?.(updated.length);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      await fetch(`${config.apiUrl}/api/documents/${sessionId}/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      const updated = documents.filter(d => d.name !== filename);
      setDocuments(updated);
      onDocumentsChanged?.(updated.length);
    } catch {
      setError('Failed to remove document');
    }
  };

  return (
    <div className="border border-[#E8E4DE] rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-[#F8F7F4] flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs font-semibold text-[#1E2D3D]">Policy Documents</span>
          {documents.length > 0 && (
            <span className="text-xs bg-[#6366F1] text-white px-1.5 py-0.5 rounded-full">{documents.length}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-500">
            Upload HR handbooks or policies to give the AI context during the simulation.
          </p>

          {/* Uploaded docs */}
          {documents.length > 0 && (
            <div className="space-y-1.5">
              {documents.map(doc => (
                <div key={doc.name} className="flex items-center justify-between bg-[#EEF2FF] rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <svg className="w-3.5 h-3.5 text-[#6366F1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs text-[#1E2D3D] truncate">{doc.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.name)}
                    className="text-slate-400 hover:text-red-500 ml-2 flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Upload button */}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-2 border-2 border-dashed border-[#6366F1]/40 rounded-lg text-xs text-[#6366F1] hover:border-[#6366F1] hover:bg-[#EEF2FF] transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload PDF or TXT</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
