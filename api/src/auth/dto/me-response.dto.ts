import { userSchemas } from '@desafio-dev/shared/user-schemas';
import { createZodDto } from 'nestjs-zod';

export class MeResponseDto extends createZodDto(userSchemas.me) {}
