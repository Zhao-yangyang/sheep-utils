declare module 'svgo-browser/lib/svgo' {
  interface SvgoConfig {
    plugins: Array<{
      name: string;
      params?: {
        overrides?: Record<string, boolean>;
      };
    }>;
  }
  
  const svgoBrowser: {
    optimize: (svg: string, config: SvgoConfig) => { data: string };
  };
  
  export default svgoBrowser;
} 