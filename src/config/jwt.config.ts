import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION || '24h',
    },
  }
})
