import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class DefaultResponseDto extends createZodDto(
  z.object({ msg: z.string() }),
) {}
