import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver.js';

@Module({
  imports: [],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UserModule {}
