import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, JwtService, UsersService],
})
export class AppModule {}
