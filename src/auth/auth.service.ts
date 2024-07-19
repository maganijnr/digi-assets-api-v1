import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup-dto';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async createUser(auth: SignUpDto): Promise<{
    statusCode: any;
    user: User;
    accessToken: string;
  }> {
    const hashedPassword = await argon.hash(auth?.password);

    const user = {
      ...auth,
      password: hashedPassword,
    };

    try {
      //Check if user already exists
      const prevUser = await this.prisma.user.findUnique({
        where: { email: auth?.email },
      });

      if (prevUser) {
        throw new ForbiddenException('Email already in use');
      }

      // Create user
      const newUser = await this.prisma.user.create({
        data: user,
      });

      //Generate access token
      const accessToken = await this.createVerificationToken(newUser?.id);

      return {
        statusCode: HttpStatus.OK,
        user: newUser,
        accessToken,
      };

      // return newUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  //Login a user
  async loginUser(auth: LoginDto): Promise<{
    statusCode: any;
    user: User;
    accessToken: string;
  }> {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: { email: auth?.email },
      });

      if (!userExist) {
        throw new ForbiddenException('User not found');
      }

      const isPasswordValid = await argon.verify(
        userExist.password,
        auth?.password,
      );

      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid login credentials');
      }

      //Generate access token
      const accessToken = await this.createVerificationToken(userExist?.id);

      return {
        statusCode: HttpStatus.OK,
        user: userExist,
        accessToken,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Invalid login credentials');
      }
      throw error;
    }
  }

  async createVerificationToken(userId: string) {
    const token = await this.jwt.signAsync(
      { id: userId },
      {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      },
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    return token;
  }
}
