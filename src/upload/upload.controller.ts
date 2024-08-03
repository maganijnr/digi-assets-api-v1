import { UploadService } from './upload.service';
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const response = this.uploadService.uploadImage(file);
      return response;
    } catch (error) {
      throw new Error('Error uploading file');
    }
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    const response = this.uploadService.uploadFiles(files);

    // return response;
  }
}
