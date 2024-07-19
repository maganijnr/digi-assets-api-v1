import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //Get all users
  async getAllUsers(): Promise<{
    statusCode: HttpStatus;
    users: User[];
    message: string;
  }> {
    try {
      const users = await this.prisma.user.findMany();

      return {
        statusCode: HttpStatus.OK,
        users,
        message: 'All users fetched successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unable to fetch all users');
      }
      throw error;
    }
  }
}
