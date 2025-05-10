import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUnitReferenceDto {
  @ApiProperty({
    example: 'SMMLV',
    description: 'Código de la unidad de referencia',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Salario Mínimo Mensual Legal Vigente',
    description: 'Nombre de la unidad de referencia',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1160000,
    description: 'Valor monetario de la unidad de referencia',
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID de la moneda asociada',
  })
  @IsUUID()
  @IsNotEmpty()
  currencyId: string;
}
