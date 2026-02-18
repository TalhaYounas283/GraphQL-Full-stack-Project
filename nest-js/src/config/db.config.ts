import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.join(__dirname, '..', '..', '..', '.env') });

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient | undefined;
}

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export { prisma };