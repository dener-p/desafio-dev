import { userSchemas } from '@desafio-dev/shared/user-schemas';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(userSchemas.login) {}
