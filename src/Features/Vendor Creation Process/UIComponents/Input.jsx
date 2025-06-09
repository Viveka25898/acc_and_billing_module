import React from 'react'

const Input = ({name,label, value, onChange,error,type="text"}) => {
  return (
    <div>
        <label className='block text-m font-medium text-gray-700 mb-1'>{label}</label>
        <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
        />
        {error && <p className='text-red-500 text-sm  mt-1'>{error}</p>}
    </div>
  )
}

export default Input