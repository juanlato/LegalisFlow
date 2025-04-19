import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({ example: 'cases:manage', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ example: 'Permite gestionar casos', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}