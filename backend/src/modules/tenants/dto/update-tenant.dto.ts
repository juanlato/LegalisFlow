import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTenantDto {
  @ApiProperty({ example: 'Bufete López & Asociados', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}