import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import AuthMessage from 'src/constants/auth.constant'
import { ConfigService } from '@nestjs/config'

/**
 * To verify the given token and make sure the given token is a valid jwt token and make sure user is authenticated
 * @returns {any}
 */
@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(private configService: ConfigService) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const jwt = new JwtService()

    const authToken: string | null | undefined = request?.headers?.authorization
    const authTokenIsEmpty: boolean =
      [null, undefined].includes(authToken) || authToken?.length === 0

    if (authTokenIsEmpty) {
      throw new UnauthorizedException(AuthMessage.MISSING_AUTH_TOKEN)
    }

    try {
      jwt.verify(authToken, {
        secret: this.configService.get('jwt.secret'),
      })

      return true
    } catch (e) {
      throw new UnauthorizedException(AuthMessage.TOKEN_INVALID)
    }
  }
}
