import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ProjectLayout =async ({children}) => {

  return (
    <div className='mx-auto px-3'>

        <Suspense fallback={<span>Loading Projects...</span>}>
        {children}
        </Suspense>
    </div>
  )
}

export default ProjectLayout