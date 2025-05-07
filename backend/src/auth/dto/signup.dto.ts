import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
