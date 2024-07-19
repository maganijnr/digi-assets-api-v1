import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect()
      .then(() => console.log('Digi asset api is ready to rocket!'))
      .catch((err: any) => console.log(err, 'Got here!'));
  }
}
