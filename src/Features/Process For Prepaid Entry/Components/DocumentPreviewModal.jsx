import React, { useState, useEffect } from "react";
import { FiX, FiDownload, FiFileText, FiImage, FiFile } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";

export default function DocumentPreviewModal({ url, document, onClose, title = "Document" }) {
  const targetDoc = url || document;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [fileMeta, setFileMeta] = useState({
    name: "document",
    type: "unknown",
    size: null,
  });

  useEffect(() => {
    if (!targetDoc) return;

    let isMounted = true;
    let createdBlobUrl = null;

    const resolveAndFetch = async () => {
      setLoading(true);
      setError(null);

      try {
        let fileLocation = "";
        let fileName = "document";

        if (typeof targetDoc === "string") {
          fileLocation = targetDoc;
          const parts = targetDoc.split("/");
          fileName = parts[parts.length - 1] || "document";
        } else if (typeof targetDoc === "object") {
          fileLocation = targetDoc.url || targetDoc.fileUrl || targetDoc.path || "";
          fileName = targetDoc.name || targetDoc.fileName || "document";

          if (!fileLocation && (targetDoc.url === null || targetDoc.fileUrl === null)) {
            throw new Error("Document URL is null on the backend server.");
          }
        }

        if (!fileLocation && !fileName) {
          throw new Error("Invalid document location");
        }

        let cleanPath = fileLocation ? fileLocation.replace(/^https?:\/\/[^\/]+/, '') : '';

        const filenameOnly = fileName.split('/').pop() || (fileLocation ? fileLocation.split('/').pop() : '');
        const candidateSet = new Set();

        if (cleanPath) {
          if (cleanPath.startsWith('/')) {
            candidateSet.add(cleanPath);
            if (!cleanPath.startsWith('/api/v1')) {
              candidateSet.add(`/api/v1${cleanPath}`);
            }
          } else {
            candidateSet.add(`/${cleanPath}`);
            candidateSet.add(`/smarterp-accounts/${cleanPath}`);
            candidateSet.add(`/smarterp-accounts/conveyance/${cleanPath}`);
            candidateSet.add(`/api/v1/${cleanPath}`);
            candidateSet.add(`/uploads/${cleanPath}`);
            candidateSet.add(`/uploads/conveyance/${cleanPath}`);
          }
        }

        if (fileLocation && fileLocation.startsWith('http')) {
          candidateSet.add(fileLocation);
        }

        if (filenameOnly) {
          candidateSet.add(`/smarterp-accounts/conveyance/${filenameOnly}`);
          candidateSet.add(`/smarterp-accounts/${filenameOnly}`);
          candidateSet.add(`/uploads/conveyance/${filenameOnly}`);
          candidateSet.add(`/uploads/reliever/${filenameOnly}`);
          candidateSet.add(`/uploads/reports/${filenameOnly}`);
          candidateSet.add(`/uploads/receipts/${filenameOnly}`);
          candidateSet.add(`/uploads/${filenameOnly}`);
          candidateSet.add(`/api/v1/uploads/conveyance/${filenameOnly}`);
          candidateSet.add(`/api/v1/uploads/reliever/${filenameOnly}`);
          candidateSet.add(`/api/v1/uploads/${filenameOnly}`);
          candidateSet.add(`/api/v1/accounts/conveyance/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/accounts/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/accounts/advances/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/conveyance/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/files/${filenameOnly}`);
        }

        const candidatePaths = Array.from(candidateSet);

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        let response = null;
        for (const candidate of candidatePaths) {
          try {
            const res = await fetch(candidate, { headers });
            if (res.ok) {
              response = res;
              break;
            }
          } catch (err) {
            // Silently ignore candidate fetch errors
          }
        }

        if (!response || !response.ok) {
          throw new Error("File not found on server (404)");
        }

        const arrayBuffer = await response.arrayBuffer();
        const rawMimeType = response.headers.get("content-type") || "";
        const lowerName = fileName.toLowerCase();
        const lowerLoc = fileLocation.toLowerCase();

        let docType = "other";
        let targetMimeType = "application/octet-stream";

        if (
          rawMimeType.startsWith("image/") ||
          /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(lowerName) ||
          /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(lowerLoc)
        ) {
          docType = "image";
          targetMimeType = rawMimeType.startsWith("image/")
            ? rawMimeType
            : lowerName.endsWith(".png")
            ? "image/png"
            : lowerName.endsWith(".webp")
            ? "image/webp"
            : lowerName.endsWith(".gif")
            ? "image/gif"
            : "image/jpeg";
        } else if (
          rawMimeType === "application/pdf" ||
          lowerName.endsWith(".pdf") ||
          lowerLoc.endsWith(".pdf")
        ) {
          docType = "pdf";
          targetMimeType = "application/pdf";
        } else if (
          rawMimeType.includes("spreadsheet") ||
          rawMimeType.includes("excel") ||
          /\.(xlsx|xls|csv)$/i.test(lowerName) ||
          /\.(xlsx|xls|csv)$/i.test(lowerLoc)
        ) {
          docType = "excel";
          targetMimeType = rawMimeType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        const blob = new Blob([arrayBuffer], { type: targetMimeType });
        createdBlobUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setBlobUrl(createdBlobUrl);
          setFileMeta({
            name: fileName,
            type: docType,
            size: arrayBuffer.byteLength,
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load document");
          setLoading(false);
        }
      }
    };

    resolveAndFetch();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [targetDoc]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileMeta.name || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderIcon = () => {
    switch (fileMeta.type) {
      case "image":
        return <FiImage className="w-5 h-5 text-emerald-500" />;
      case "pdf":
        return <FiFileText className="w-5 h-5 text-red-500" />;
      case "excel":
        return <FaFileExcel className="w-5 h-5 text-green-600" />;
      default:
        return <FiFile className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              {renderIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{title}</h3>
              <p className="text-xs text-emerald-100 font-mono truncate max-w-md">
                {fileMeta.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {blobUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition"
                title="Download document"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center min-h-[400px]">
          {loading && (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-500">Loading document preview...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ⚠️
              </div>
              <h4 className="text-base font-semibold text-gray-800 mb-1">Document Load Error</h4>
              <p className="text-xs text-gray-500 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
              >
                Close Window
              </button>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <div className="w-full h-full flex items-center justify-center">
              {fileMeta.type === "image" && (
                <img
                  src={blobUrl}
                  alt={fileMeta.name}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md"
                />
              )}

              {fileMeta.type === "pdf" && (
                <iframe
                  src={blobUrl}
                  title={fileMeta.name}
                  className="w-full h-[70vh] rounded-lg border border-gray-200 shadow-sm"
                />
              )}

              {fileMeta.type === "excel" && (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                  <FaFileExcel className="w-16 h-16 text-green-600 mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-gray-800 mb-1">Spreadsheet Document</h4>
                  <p className="text-xs text-gray-500 mb-4">Preview not available for Excel files directly in browser.</p>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-2 mx-auto"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download Excel File</span>
                  </button>
                </div>
              )}

              {fileMeta.type === "other" && (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                  <FiFile className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-gray-800 mb-1">Binary Document</h4>
                  <p className="text-xs text-gray-500 mb-4">Binary file format cannot be rendered inline.</p>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-2 mx-auto"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download File</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Protected Document Preview</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
