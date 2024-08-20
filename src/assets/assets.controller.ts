import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

@Controller('assets')
export class AssetsController {
  constructor(
    private assetService: AssetsService,
    private uploadService: UploadService,
  ) {}

  @Post('/asset')
  @UseGuards(AuthGuard('jwt'))
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

    @Request()
    req: { user: User },
  ) {
    const currentUser = req.user;
    const response =
      await this.assetService.checkIfCurrentUserIsOwner(currentUser);

    if (response.statusCode === HttpStatus.OK) {
      const uploadedCoverImage = await this.uploadService.uploadImage(
        chosenFiles.coverImage[0],
      );

      const uploadedAssetFiles = await this.uploadService.uploadFiles(
        chosenFiles.files,
      );

      return this.assetService.createAsset(
        {
          asset_name: assetInfo.asset_name,
          price: assetInfo.price,
          price_type: assetInfo.price_type,
          coverImage: uploadedCoverImage?.url,
          files: uploadedAssetFiles,
          description: assetInfo.description,
          category: assetInfo.category,
        },
        currentUser,
      );
    }
  }

  //Delete an asset
  @Delete('/asset/:assetId')
  @UseGuards(AuthGuard('jwt'))
  async deleteAsset(
    @Request()
    req: { user: User },
    @Param('assetId') assetId: string,
  ) {
    const currentUser = req.user;

    return this.assetService.deleteAssetById(assetId, currentUser);
  }

  //Update an asset
  @Patch('/asset/:assetId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'coverImage' }]))
  async updateAsset(
    @Body()
    updateData: {
      asset_name?: string;
      description?: string;
      price?: string;
      category?: string;
      price_type?: string;
    },

    // @UploadedFiles()
    // chosenFiles: {
    //   coverImage?: Express.Multer.File;
    // },

    @Request()
    req: { user: User },
    @Param('assetId') assetId: string,
  ) {
    // console.log(chosenFiles.coverImage);
    const currentUser = req.user;

    return this.assetService.updateAssetById(updateData, assetId, currentUser);
  }

  @Get('/all')
  async getAllAssets() {
    return this.assetService.getAllAssets();
  }
}
