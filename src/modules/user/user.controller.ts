import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('/create')
  create(
    @Body()
    createUserDto: {
      userName: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.authService.register(
      createUserDto.userName,
      createUserDto.email,
      createUserDto.password,
      createUserDto.firstName,
      createUserDto.lastName,
    );
  }

  @Post('/login')
  login(
    @Body()
    loginUserDto: {
      userName: string;
      password: string;
    },
  ) {
    console.log('In UserController', process.env.JWT_SECRET_KEY);
    return this.authService.login(loginUserDto);
  }
}
