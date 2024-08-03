import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Paginate } from 'src/utils/enums/paginate';

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    // private paginate: Paginate,
  ) {}

  async createAsset(
    asset: CreateAssetDto,
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
          userId: 'clysmlrhn0000ux7rrtkgy4aw',
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
}
