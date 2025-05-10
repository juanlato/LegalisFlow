import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'abogado@bufete.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'passwordSeguro123' })
  @IsString()
  @MinLength(8)
  password: string;
}
