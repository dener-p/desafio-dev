import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService, UserType } from '../auth/auth.service';
import { CurrentUser } from '../auth/auth.decorators';
import { Public } from '../auth/auth.guard';
import { db } from '../database/database';
import { eq } from 'drizzle-orm';
import { compareSync } from 'bcrypt';
import { user } from 'src/database/schema';
import { SingupDto } from './dto/singup.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginDto } from './dto/login.dto';
import { AppException } from 'src/app.exception';
import { ZodResponse } from 'nestjs-zod';
import { MeResponseDto } from './dto/me-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ZodResponse({ type: LoginResponseDto })
  async login(
    @Body() body: LoginDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const [userInfo] = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email));

    if (!userInfo || !compareSync(body.password, userInfo.passwordHash)) {
      throw new AppException({
        message: 'Email ou senha invalido.',
        cause: 'AUTHENTICATION',
        status: 401,
      });
    }

    const ip = this.authService.getIp(req);
    const token = await this.authService.login(res, userInfo.id, ip);

    return { token };
  }

  @Public()
  @Post('singup')
  @HttpCode(200)
  async singup(
    @Body() body: SingupDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const [userInfo] = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email));

    if (userInfo) {
      //  dont use this in production, really not good to expose all your users info...
      throw new AppException({
        message: 'Email inválido',
        cause: 'VALIDATION',
      });
    }

    const ip = this.authService.getIp(req);
    await this.authService.singup(res, body, ip);

    return;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    await this.authService.logout(req, res);
    return;
  }

  @Get('me')
  @ZodResponse({ type: MeResponseDto })
  getMe(@CurrentUser() user: UserType) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
