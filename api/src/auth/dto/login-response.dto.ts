import { userSchemas } from '@desafio-dev/shared/user-schemas';
import { createZodDto } from 'nestjs-zod';

export class LoginResponseDto extends createZodDto(userSchemas.loginResponse) {}
