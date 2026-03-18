import { userSchemas } from '@desafio-dev/shared/user-schemas';
import { createZodDto } from 'nestjs-zod';

export class SingupDto extends createZodDto(userSchemas.createUser) {}
