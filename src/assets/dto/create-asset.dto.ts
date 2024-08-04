import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsString()
  readonly asset_name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly coverImage: any;

  @IsArray()
  @IsString({ each: true })
  readonly files: string[];

  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsNotEmpty()
  @IsString()
  readonly price: string;

  @IsNotEmpty()
  @IsString()
  readonly price_type: string;
}
