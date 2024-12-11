'use client'

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // 在生产环境中可以将错误发送到错误跟踪服务
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2>很抱歉，出现了一些问题</h2>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => this.setState({ hasError: false })}
          >
            重试
          </button>
        </div>
      )
    }

    return this.props.children
  }
} 