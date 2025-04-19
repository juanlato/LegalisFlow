import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';

export class GetUsersDto extends PaginationParamsDto {
  @ApiPropertyOptional({ description: 'Filtrar por email (búsqueda parcial)' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo/inactivo' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por ID de rol' })
  @IsString()
  @IsOptional()
  roleId?: string;

  @ApiPropertyOptional({ 
    description: 'Campo para ordenar (email, createdAt, etc)',
    example: 'email'
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ 
    description: 'Dirección de ordenamiento (asc o desc)',
    enum: ['asc', 'desc'],
    example: 'asc'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}