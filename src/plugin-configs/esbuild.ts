
export const esBuildConfig = {
  esbuild: {
    bundle: true,
    minify: false,
    sourcemap: true,
    exclude: ['aws-sdk'],
    target: 'node16',
    define: { 'require.resolve': undefined },
    platform: 'node',
    concurrency: 1
  }
}