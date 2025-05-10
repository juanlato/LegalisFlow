import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    default: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Límite de resultados por página',
    default: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
