'use client'
export default function NotFound() {
  return (
    <div className="mx-20 xl:mx-36 min-h-screen bg-platinum flex items-center justify-center rounded-4xl mb-6 my-2">
      <div className="max-w-md w-full text-center">
        {/* Large 404 number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo mb-2">404</h1>
          <div className="w-24 h-1 bg-magenta mx-auto"></div>
        </div>
        
        {/* Main heading */}
        <h2 className="text-3xl font-bold text-black mb-4">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The Page you're looking for doesn't exist or may have been moved to a different location.
        </p>
        
        {/* Action buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-indigo text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full border-2 border-magenta text-magenta font-semibold py-3 px-6 rounded-lg hover:bg-magenta hover:text-white transition-all duration-200"
          >
            Return Home
          </button>
        </div>
        
        {/* Decorative element */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-indigo rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-magenta rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-indigo rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  )
}