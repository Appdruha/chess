import { env } from 'node:process'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      env: typeof env
      readonly NODE_ENV: 'development' | 'production'
      readonly PORT: number
    }
  }
}

export default global