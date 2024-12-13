declare module '@svgr/core' {
  export function transform(
    code: string,
    config?: {
      plugins?: string[];
      svgoConfig?: {
        plugins?: Array<{
          name: string;
          params?: {
            overrides?: Record<string, boolean>;
          };
        }>;
      };
    },
    options?: {
      componentName?: string;
    }
  ): Promise<string>;
} 