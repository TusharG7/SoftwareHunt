import React from 'react'

const loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-t-transparent border-solid rounded-full animate-spin border-indigo-500 border-8"></div>
    </div>
  )
}

export default loading