import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

@Controller('assets')
export class AssetsController {
  constructor(
    private assetService: AssetsService,
    private uploadService: UploadService,
  ) {}

  @Post('/asset')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'files', maxCount: 5 },
    ]),
  )
  async createAsset(
    @Body()
    assetInfo: {
      asset_name: string;
      price: string;
      price_type: string;
      description: string;
      category: string;
    },

    @UploadedFiles()
    chosenFiles: {
      coverImage: Express.Multer.File;
      files: Express.Multer.File[];
    },
  ) {
    try {
      const uploadedCoverImage = await this.uploadService.uploadImage(
        chosenFiles.coverImage[0],
      );

      const uploadedAssetFiles = await this.uploadService.uploadFiles(
        chosenFiles.files,
      );

      return this.assetService.createAsset({
        asset_name: assetInfo.asset_name,
        price: assetInfo.price,
        price_type: assetInfo.price_type,
        coverImage: uploadedCoverImage?.url,
        files: uploadedAssetFiles,
        description: assetInfo.description,
        category: assetInfo.category,
      });
    } catch (error) {
      throw new Error('Error uploading asset');
    }
  }

  @Get('/assets')
  async getAllAssets() {
    return this.assetService.getAllAssets();
  }
}
