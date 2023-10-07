import { registerAs } from '@nestjs/config'
import * as dotenv from 'dotenv';
dotenv.config();

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION || '24h',
    },
  }
})
