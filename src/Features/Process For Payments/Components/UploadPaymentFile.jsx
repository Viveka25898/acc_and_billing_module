import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls']

const UploadPaymentFile = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    if (!file) return false
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      toast.error('Only Excel files (.xlsx, .xls) are accepted.')
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10 MB.')
      return false
    }
    return true
  }

  const handleFile = (file) => {
    if (!validateFile(file)) return
    setSelectedFileName(file.name)
    onFileUpload(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    // reset so same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 px-4 py-6 flex flex-col items-center justify-center gap-2 text-center select-none ${
        isDragging
          ? 'border-green-500 bg-green-50 scale-[1.01]'
          : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="text-3xl">📂</div>
      {selectedFileName ? (
        <>
          <p className="text-sm font-semibold text-green-700">{selectedFileName}</p>
          <p className="text-xs text-gray-400">Click or drag to replace</p>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-gray-600">
            Drag &amp; drop or <span className="text-green-600 underline">browse</span>
          </p>
          <p className="text-xs text-gray-400">Excel files only (.xlsx, .xls) · max 10 MB</p>
        </>
      )}
    </div>
  )
}

export default UploadPaymentFile
