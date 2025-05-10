// src/modules/roles/dto/get-roles.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';

export class GetRolesDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Límite de resultados por página',
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    example: 'name',
    description: 'Campo por el cual ordenar',
  })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'asc',
    enum: ['asc', 'desc'],
    description: 'Dirección del ordenamiento',
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 'Administrador',
    description: 'Filtrar por nombre de rol',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar por estado (si aplica)',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Filtrar por ID de permiso',
  })
  @IsOptional()
  @IsUUID()
  permissionId?: string;
}
