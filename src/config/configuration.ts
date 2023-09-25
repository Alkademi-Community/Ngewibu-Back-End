import jwtConfig from './jwt.config'

export default () => ({
  server_port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  dabase_url: process.env.DATABASE_URL || '',
  env: process.env.APP_ENV || 'local',
})

const ExtraConfigLoad = [jwtConfig]
export { ExtraConfigLoad }
