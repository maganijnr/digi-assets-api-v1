import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { UsersModule } from 'src/users/users.module';
import { UploadModule } from 'src/upload/upload.module';
import { UploadService } from 'src/upload/upload.service';
import { Paginate } from 'src/utils/enums/paginate';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, UploadModule, AuthModule, PassportModule],
  providers: [AssetsService, UploadService],
  controllers: [AssetsController],
})
export class AssetsModule {}
