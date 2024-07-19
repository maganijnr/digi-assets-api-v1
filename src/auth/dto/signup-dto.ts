import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly full_name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  readonly password: string;
}
