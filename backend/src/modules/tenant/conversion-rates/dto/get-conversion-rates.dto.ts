import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetConversionRatesDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: 'ID de la moneda origen para filtrar',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @IsOptional()
  currencyOriginId?: string;

  @ApiProperty({
    required: false,
    description: 'ID de la moneda destino para filtrar',
    example: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
  })
  @IsUUID()
  @IsOptional()
  currencyDestinationId?: string;

  @ApiProperty({
    required: false,
    enum: ['value', 'fechaActualizacion'],
    default: 'fechaActualizacion',
  })
  @IsString()
  @IsIn(['value', 'fechaActualizacion'])
  @IsOptional()
  sortBy?: string = 'fechaActualizacion';

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: string = 'DESC';
}
