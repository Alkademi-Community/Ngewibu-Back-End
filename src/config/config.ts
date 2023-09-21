import * as dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const CONFIG = {
  SERVER_PORT: process.env.SERVER_PORT ?? 8000,
}

export default CONFIG
