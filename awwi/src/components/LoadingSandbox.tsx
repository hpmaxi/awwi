import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

export const LoadingSandbox = () => {
  return (
    <LoadingSpinner>
      <>
        <h1>Setting up your sandbox...</h1>
        <p>This may take a few moments. Please wait.</p>
      </>
    </LoadingSpinner>
  )
}
