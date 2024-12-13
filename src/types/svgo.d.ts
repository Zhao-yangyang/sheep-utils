declare module 'svgo' {
  interface OptimizeResult {
    data: string;
  }
  export function optimize(svg: string, config?: { multipass?: boolean; plugins?: string[] }): OptimizeResult;
} 