import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { User } from './user.model'
import { UserService } from './user.service'
import { create } from 'domain'
import { Request, Response } from '@nestjs/common'

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  async getUsers(@Req() request: Request, @Res() response: Response): Promise<User[]> {
    const result = await this.userService.getAllUsers()
    return response.status(200).json({
      status: true,
      message: "",
      data: result
    })
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUser(id)
  }

  @Post()
  async createUser(@Body() postData: User): Promise<User> {
    return this.userService.registerUser(postData)
  }

  @Put(':id')
  async updatedUser(@Param('id') id: number, @Body() updateData: User): Promise<User> {
    return this.userService.updateUser(id, updateData)
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(id)
  }
}
