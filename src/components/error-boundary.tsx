'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="text-xl font-bold">出错了</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
        onClick={reset}
      >
        重试
      </button>
    </div>
  )
} 