import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ example: 'Abogado Junior', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissionIds?: string[];
}