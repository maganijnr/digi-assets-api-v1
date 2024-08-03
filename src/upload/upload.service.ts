import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; secure_url: string } | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve({ url: result?.url, secure_url: result?.secure_url });
        })
        .end(file.buffer);
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<any> {
    let setUpFiles = files.map(async (file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) return reject(error);
            resolve(result?.url);
          })
          .end(file.buffer);
      });
    });

    return await Promise.all(setUpFiles);
  }
}
