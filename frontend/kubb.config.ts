import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginFaker } from '@kubb/plugin-faker'
import { pluginMsw } from '@kubb/plugin-msw'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'

export default defineConfig(() => {
  return {
    root: '.',
    input: {
      path: './openapi.yaml',
    },
    output: {
      path: './src/api/gen',
      clean: true,
    },
    hooks: { done: 'npx prettier --write ./src/api/gen' },
    plugins: [
      pluginOas({ generators: [] }),
      pluginTs(),
      pluginFaker({
        transformers: {
          name(name, type) {
            if (type == 'function') {
              return name + 'FakeData'
            }
            return name
          },
        },
        mapper: {
          image: '"/logo192.png"',
          favoritesCount: 'faker.number.int({max: 20})',
        },
      }),
      pluginMsw({
        parser: 'faker',
        handlers: true,
        baseURL: 'http://localhost:8080',
      }),
      pluginClient({
        baseURL: 'http://localhost:8080',
        importPath: '../../client.ts',
      }),
      pluginReactQuery({
        query: false,
        suspense: false,
      }),
    ],
  }
})
