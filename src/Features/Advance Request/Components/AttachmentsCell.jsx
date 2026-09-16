/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
  FaPaperclip,
  FaFilePdf,
  FaFileImage,
  FaFileExcel,
  FaFileAlt,
  FaEye,
  FaDownload,
  FaTimes,
  FaExternalLinkAlt,
  FaSpinner,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import { viewAttachmentInNewTab } from '../services/advanceRequestService'

/**
 * Normalizes input into a consistent array of attachment objects:
 * [{ fileName: string, fileUrl: string, fileSize?: string }]
 */
const normalizeAttachments = (attachments) => {
  if (!attachments) return []
  try {
    let list = attachments
    if (typeof attachments === 'string') {
      try {
        list = JSON.parse(attachments)
      } catch (e) {
        list = [{ fileName: 'Attachment', fileUrl: attachments }]
      }
    }
    if (!Array.isArray(list)) {
      if (typeof list === 'object' && (list.fileUrl || list.url)) {
        list = [list]
      } else {
        return []
      }
    }
    return list
      .map((item, idx) => {
        if (typeof item === 'string') {
          const nameFromUrl = item.split('/').pop() || `File_${idx + 1}`
          return { fileName: nameFromUrl, fileUrl: item, fileSize: '' }
        }
        const url = item.fileUrl || item.url || item.path || ''
        const name = item.fileName || item.name || url.split('/').pop() || `Attachment_${idx + 1}`
        const size = item.fileSize || item.size || ''
        return { fileName: name, fileUrl: url, fileSize: size }
      })
      .filter((item) => Boolean(item.fileUrl))
  } catch (err) {
    console.error('Error normalizing attachments:', err)
    return []
  }
}

/** Helper to pick icon based on file extension */
const getFileIcon = (fileName = '') => {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (['pdf'].includes(ext)) {
    return <FaFilePdf className="text-red-500 shrink-0" title="PDF Document" />
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) {
    return <FaFileImage className="text-blue-500 shrink-0" title="Image File" />
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FaFileExcel className="text-green-600 shrink-0" title="Spreadsheet" />
  }
  return <FaFileAlt className="text-gray-500 shrink-0" title="Document" />
}

const AttachmentsCell = ({ attachments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingFileUrl, setLoadingFileUrl] = useState(null)
  const normalizedList = normalizeAttachments(attachments)

  const handleOpenAttachment = async (fileUrl, fileName) => {
    if (!fileUrl) {
      toast.error('File URL is missing or invalid')
      return
    }
    try {
      setLoadingFileUrl(fileUrl)
      await viewAttachmentInNewTab(fileUrl, fileName)
    } catch (err) {
      console.error('Failed to open attachment:', err)
      toast.error(err?.message || 'Failed to load protected file.')
    } finally {
      setLoadingFileUrl(null)
    }
  }

  // Case 1: No attachments
  if (normalizedList.length === 0) {
    return <span className="text-gray-400 text-xs italic">—</span>
  }

  // Case 2: Single attachment
  if (normalizedList.length === 1) {
    const file = normalizedList[0]
    const isLoadingThis = loadingFileUrl === file.fileUrl

    return (
      <div className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-2 py-1 text-xs max-w-[200px] transition-colors">
        {isLoadingThis ? (
          <FaSpinner className="animate-spin text-indigo-600 shrink-0" />
        ) : (
          getFileIcon(file.fileName)
        )}
        <span
          className="truncate font-medium text-gray-700 select-none cursor-pointer"
          title={`${file.fileName} ${file.fileSize ? `(${file.fileSize})` : ''}`}
          onClick={() => !isLoadingThis && handleOpenAttachment(file.fileUrl, file.fileName)}
        >
          {file.fileName}
        </span>
        {file.fileSize && (
          <span className="text-[10px] text-gray-400 shrink-0 bg-gray-200/60 rounded px-1">
            {file.fileSize}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto shrink-0 pl-1 border-l border-gray-200">
          <button
            type="button"
            disabled={isLoadingThis}
            onClick={() => handleOpenAttachment(file.fileUrl, file.fileName)}
            className="text-indigo-600 hover:text-indigo-800 p-0.5 rounded hover:bg-indigo-50 transition-colors disabled:opacity-50"
            title="Preview attachment"
          >
            {isLoadingThis ? <FaSpinner className="w-3 h-3 animate-spin" /> : <FaEye className="w-3 h-3" />}
          </button>
        </div>
      </div>
    )
  }

  // Case 3: Multiple attachments (>1)
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-medium px-2.5 py-1 rounded-md text-xs transition-colors shadow-sm"
        title="Click to view all attachments"
      >
        <FaPaperclip className="w-3 h-3 text-indigo-600 shrink-0" />
        <span>{normalizedList.length} Files</span>
      </button>

      {/* Multiple Attachments Dialog / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="flex items-center gap-2">
                <FaPaperclip className="text-indigo-400 w-4 h-4" />
                <h3 className="text-sm font-semibold">
                  Attachments ({normalizedList.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content / List */}
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
              {normalizedList.map((file, idx) => {
                const isLoadingThis = loadingFileUrl === file.fileUrl
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-lg text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {isLoadingThis ? (
                        <FaSpinner className="animate-spin text-indigo-600 shrink-0" />
                      ) : (
                        getFileIcon(file.fileName)
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate" title={file.fileName}>
                          {file.fileName}
                        </p>
                        {file.fileSize && (
                          <p className="text-[10px] text-gray-500 font-sans">{file.fileSize}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() => handleOpenAttachment(file.fileUrl, file.fileName)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-indigo-50 border border-gray-300 text-indigo-700 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {isLoadingThis ? (
                          <FaSpinner className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <FaExternalLinkAlt className="w-2.5 h-2.5" />
                        )}
                        <span>{isLoadingThis ? 'Loading...' : 'Open File'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end px-4 py-2.5 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AttachmentsCell
