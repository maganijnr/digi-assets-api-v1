import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, UsersService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
