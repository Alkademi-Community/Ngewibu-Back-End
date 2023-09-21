import { Controller, Get } from '@nestjs/common'
import { User } from './user.model'
import { UserService } from './user.service'

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getAllUsers()
  }
}
