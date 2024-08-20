import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async createAsset(
    asset: CreateAssetDto,
    user: User,
  ): Promise<{ statusCode: HttpStatus; asset: Asset; message: string }> {
    try {
      const newAsset = await this.prisma.asset.create({
        data: {
          asset_name: asset?.asset_name,
          description: asset?.description,
          coverImage: asset?.coverImage,
          files: asset?.files,
          category: asset?.category,
          price: asset?.price,
          price_type: asset?.price_type,
          userId: user?.id,
        },
      });

      if (newAsset) {
        return {
          statusCode: HttpStatus.CREATED,
          asset: newAsset,
          message: 'Asset created successfully',
        };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unable to create asset');
      }
      throw error;
    }
  }

  //Get all assets
  async getAllAssets(): Promise<{
    statusCode: HttpStatus;
    data: {
      assets: Asset[];
      pagination: any;
    };
    message: string;
  }> {
    try {
      const assets = await this.prisma.asset.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (assets) {
        const count = await this.prisma.asset.count();

        // let pagination = this.paginate.paginate(count, 1, 10);
        return {
          statusCode: HttpStatus.OK,
          data: {
            assets,
            pagination: null,
          },
          message: 'All assets fetched successfully',
        };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unable to fetch all assets');
      }
      throw error;
    }
  }

  //Delete an asset by a creator
  async deleteAssetById(assetId: string, user: User) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Asset not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      //Check if the user is the creator of the asset
      if (asset.userId !== user.id) {
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'You are not the creator of this asset',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      //Delete the asset
      await this.prisma.asset.delete({ where: { id: assetId } });

      return {
        statusCode: HttpStatus.OK,
        message: 'Asset deleted successfully',
      };
    } catch (error) {
      throw new Error('Unable to delete asset');
    }
  }

  //Update an asset
  async updateAssetById(
    assetData: {
      asset_name?: string;
      description?: string;
      price?: string;
      category?: string;
      price_type?: string;
      coverImage?: string;
    },
    assetId: string,
    user: User,
  ) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Asset not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedAsset = await this.prisma.asset.update({
      where: { id: assetId },
      data: { ...assetData },
    });

    if (updatedAsset) {
      return {
        statusCode: HttpStatus.OK,
        asset: updatedAsset,
        message: 'Asset updated successfully',
      };
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.FAILED_DEPENDENCY,
        message: 'Unable to update asset',
      },
      HttpStatus.FAILED_DEPENDENCY,
    );
  }

  async checkIfCurrentUserIsOwner(
    currentUser: User,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    if (currentUser.role === 'USER') {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You are not a creator.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'You are a creator.',
    };
  }
}
