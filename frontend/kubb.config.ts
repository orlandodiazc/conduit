import { defineConfig } from '@kubb/core'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginClient } from '@kubb/plugin-client'

export default defineConfig(() => {
  return {
    root: '.',
    input: {
      path: './openapi.yml',
    },
    output: {
      path: './src/api/gen',
      clean: true,
    },
    hooks: { done: 'pnpm format' },
    plugins: [
      pluginOas({ generators: [] }),
      pluginTs(),
      pluginClient({ baseURL: 'http://localhost:8080' }),
      pluginReactQuery({
        output: { path: 'domain' },
        group: {
          type: 'tag',
          name({ group }) {
            return group
          },
        },
        query: false,
        suspense: false,
      }),
    ],
  }
})
