import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'nuevo-email@bufete.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Nuev@P@ss', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
