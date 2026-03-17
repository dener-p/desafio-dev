import { Injectable } from '@nestjs/common';
import { db } from '../database/database';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // just to make typescript now that can be null.
    return user ?? null;
  }

  async findById(id: number) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const result = await db
      .insert(users)
      .values({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    return result[0];
  }
}
