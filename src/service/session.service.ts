import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SessionData } from 'src/types/session'

@Injectable()
export class SessionService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Get data from auth token
   * @param {any} token:string|null
   * @returns {any}
   */
  public async getSessionData(token: string | null): Promise<SessionData> {
    if (token === null) return null

    const sessionData: SessionData = (await this.jwtService.decode(
      token,
      this.configService.get('jwt.secret'),
    )) as SessionData

    return sessionData
  }

  /**
   * Get auth token from request header
   * @param {any} headers:Record<string
   * @param {any} string>
   * @returns {any}
   */
  public getAuthToken(headers: Record<string, string>): string | null {
    const { authorization } = headers

    if (authorization === undefined) return null
    return authorization
  }
}
