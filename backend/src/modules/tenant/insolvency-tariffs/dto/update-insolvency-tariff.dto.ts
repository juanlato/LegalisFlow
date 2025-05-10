import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInsolvencyTariffDto {
  @ApiProperty({
    example: 'TARIFF-001',
    description: 'Código de la tarifa de insolvencia',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID de la unidad de referencia asociada',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  unitReferenceId?: string | null;

  @ApiProperty({
    example: 0,
    description: 'Límite inferior del rango de la tarifa',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  lowerLimit?: number;

  @ApiProperty({
    example: 50000000,
    description: 'Límite superior del rango de la tarifa',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  upperLimit?: number;

  @ApiProperty({
    example: 35000000,
    description: 'Valor de la tarifa',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: 40000000,
    description: 'Valor máximo según la ley',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  valueMaxLaw?: number;
}
