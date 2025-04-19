import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Datos paginados' })
  data: T[];

  @ApiProperty({ description: 'Total de registros', example: 100 })
  total: number;

  @ApiProperty({ description: 'Página actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Límite por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de páginas', example: 10 })
  totalPages: number;
}