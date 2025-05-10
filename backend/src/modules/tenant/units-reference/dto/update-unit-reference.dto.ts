import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUnitReferenceDto {
  @ApiProperty({
    example: 'SMMLV',
    description: 'Código de la unidad de referencia',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: 'Salario Mínimo Mensual Legal Vigente',
    description: 'Nombre de la unidad de referencia',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 1160000,
    description: 'Valor monetario de la unidad de referencia',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID de la moneda asociada',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  currencyId?: string;
}
