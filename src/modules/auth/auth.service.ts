import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    console.log('JwtService:', jwtService); // Debugging line
    console.log(
      'ConfigService JWT_SECRET:',
      this.configService.get<string>('JWT_SECRET'),
    );
  }
  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.userService.findOne(userName);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const { userName, password } = user;
    const userInfo = await this.validateUser(userName, password);

    if (!userInfo) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    console.log('JWT_SECRET:', jwtSecret); // Add this line for debugging
    return {
      access_token: this.jwtService.sign(userInfo),
    };
  }
  async register(
    userName: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create(
      userName,
      email,
      hashedPassword,
      firstName,
      lastName,
    );
  }
}
