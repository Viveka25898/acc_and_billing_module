// File: components/CommentBox.jsx
import React from "react";

export default function CommentBox({ comment, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">Comment / Rejection Reason:</label>
      <textarea
        value={comment}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any remarks here..."
        className="w-full border p-2 rounded"
        rows={3}
      />
    </div>
  );
}
