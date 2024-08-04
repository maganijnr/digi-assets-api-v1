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
import { AssetsModule } from './assets/assets.module';
import { AssetsService } from './assets/assets.service';
import { UploadService } from './upload/upload.service';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AssetsModule,
    UploadModule,
  ],
  controllers: [AppController, AuthController, UploadController],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    JwtService,
    UsersService,
    AssetsService,
    UploadService,
  ],
})
export class AppModule {}
