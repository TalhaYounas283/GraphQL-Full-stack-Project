import { Resolver, Query } from '@nestjs/graphql';
import { User } from './user.schema.js';

@Resolver(()=> User)
export class UserResolver {
  @Query(()=> [User])
  getAllUsers() {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
