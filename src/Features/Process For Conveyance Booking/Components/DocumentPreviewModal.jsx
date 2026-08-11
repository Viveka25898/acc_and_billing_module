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
          fileLocation = targetDoc.fileUrl || targetDoc.url || targetDoc.path || targetDoc.name || "";
          fileName = targetDoc.name || targetDoc.fileName || "document";
        }

        if (!fileLocation) {
          throw new Error("Invalid document location");
        }

        // Clean relative API URLs
        let cleanPath = fileLocation;
        cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
        cleanPath = cleanPath.replace(/^(\/api\/v1)+/, '/api/v1');

        if (!cleanPath.startsWith('/api/v1') && !cleanPath.startsWith('http')) {
          cleanPath = `/api/v1${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
        }

        const filenameOnly = fileName.split('/').pop();
        const candidateSet = new Set();

        if (filenameOnly) {
          candidateSet.add(`/api/v1/accounts/conveyance/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/accounts/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/accounts/advances/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/conveyance/files/${filenameOnly}`);
          candidateSet.add(`/api/v1/files/${filenameOnly}`);
        }

        if (cleanPath) {
          candidateSet.add(cleanPath);
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
          targetMimeType = rawMimeType.startsWith("image/") ? rawMimeType : (
            lowerName.endsWith(".png") ? "image/png" :
            lowerName.endsWith(".webp") ? "image/webp" :
            lowerName.endsWith(".gif") ? "image/gif" : "image/jpeg"
          );
        } else if (
          rawMimeType.includes("pdf") ||
          /\.pdf$/i.test(lowerName) ||
          /\.pdf$/i.test(lowerLoc)
        ) {
          docType = "pdf";
          targetMimeType = "application/pdf";
        } else if (
          rawMimeType.includes("sheet") ||
          rawMimeType.includes("excel") ||
          /\.(xlsx|xls|csv|ods)$/i.test(lowerName) ||
          /\.(xlsx|xls|csv|ods)$/i.test(lowerLoc)
        ) {
          docType = "excel";
          targetMimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        // Construct clean inline Blob to prevent automatic browser download trigger
        const safeBlob = new Blob([arrayBuffer], { type: targetMimeType });
        createdBlobUrl = URL.createObjectURL(safeBlob);

        if (isMounted) {
          setBlobUrl(createdBlobUrl);
          setFileMeta({
            name: fileName,
            type: docType,
            size: safeBlob.size,
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

  if (!targetDoc) return null;

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-700 to-green-600 text-white">
          <div className="flex items-center gap-2.5">
            {fileMeta.type === "image" && <FiImage size={20} />}
            {fileMeta.type === "pdf" && <FiFileText size={20} />}
            {fileMeta.type === "excel" && <FaFileExcel size={20} className="text-green-300" />}
            {fileMeta.type === "other" && <FiFile size={20} />}
            <div>
              <h3 className="text-base font-bold tracking-wide">{title}</h3>
              <p className="text-xs text-green-100 font-medium truncate max-w-md">
                {fileMeta.name} {fileMeta.size ? `(${formatSize(fileMeta.size)})` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {blobUrl && (
              <a
                href={blobUrl}
                download={fileMeta.name}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                title="Download file"
              >
                <FiDownload size={14} /> Download
              </a>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Close"
            >
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 min-h-[50vh] flex flex-col items-center justify-center relative bg-gray-50/50">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              <span className="text-gray-500 text-xs font-semibold">Loading document preview...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12 px-6 max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-3xl mb-3">⚠️</div>
              <h4 className="text-gray-800 font-bold text-base mb-1">Document Load Error</h4>
              <p className="text-gray-500 text-xs mb-4">{error}</p>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <>
              {/* Image Preview */}
              {fileMeta.type === "image" && (
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    src={blobUrl}
                    alt={title}
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-gray-200"
                  />
                </div>
              )}

              {/* PDF Preview */}
              {fileMeta.type === "pdf" && (
                <iframe
                  src={blobUrl}
                  title={title}
                  className="w-full h-[70vh] rounded-xl border border-gray-200 shadow-sm bg-white"
                />
              )}

              {/* Excel Preview / Spreadsheet Card */}
              {fileMeta.type === "excel" && (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md text-center max-w-md space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto border border-green-100">
                    <FaFileExcel size={36} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{fileMeta.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Excel Spreadsheet Document</p>
                    {fileMeta.size && (
                      <p className="text-xs font-semibold text-green-700 mt-1">
                        Size: {formatSize(fileMeta.size)}
                      </p>
                    )}
                  </div>
                  <a
                    href={blobUrl}
                    download={fileMeta.name}
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                  >
                    <FiDownload size={16} /> Download Excel File
                  </a>
                </div>
              )}

              {/* Other Document Types */}
              {fileMeta.type === "other" && (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md text-center max-w-md space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                    <FiFileText size={36} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{fileMeta.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Document Attachment</p>
                    {fileMeta.size && (
                      <p className="text-xs font-semibold text-blue-700 mt-1">
                        Size: {formatSize(fileMeta.size)}
                      </p>
                    )}
                  </div>
                  <a
                    href={blobUrl}
                    download={fileMeta.name}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm text-sm"
                  >
                    <FiDownload size={16} /> Download File
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-400 font-medium">
            Protected Document Preview
          </span>
          <button
            onClick={onClose}
            className="text-xs px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}