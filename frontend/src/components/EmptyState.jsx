import React from 'react'

const EmptyState = ({heading, subheading}) => {
  return (
    <div className='w-full flex items-center h-1/2 flex-col justify-center mt-12'>
        <h1 className='text-3xl font-bold text-slate-600 p-4'>{heading}</h1>
        <h2 className='rexr-xl font-semibold text-slate-500 p-2'>{subheading}</h2>
    </div>
  )
}

export default EmptyState