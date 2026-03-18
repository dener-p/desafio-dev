import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Session() session: UserSession) {
    return session.user;
  }
}
