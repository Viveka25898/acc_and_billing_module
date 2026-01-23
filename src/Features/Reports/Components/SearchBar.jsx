import React, { useState } from 'react'

const SearchBar = ({ placeholder = 'Search reports, accounts, dates...', onSearch }) => {
  const [term, setTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      onSearch && onSearch(term.trim())
    } catch (error) {
      console.error('SearchBar:onSearch error', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full gap-2 items-center">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Search reports"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
