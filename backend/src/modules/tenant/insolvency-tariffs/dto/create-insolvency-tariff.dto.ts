import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsPositive,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInsolvencyTariffDto {
  @ApiProperty({
    example: 'TARIFF-001',
    description: 'Código de la tarifa de insolvencia',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID de la unidad de referencia asociada',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  unitReferenceId?: string;

  @ApiProperty({
    example: 0,
    description: 'Límite inferior del rango de la tarifa',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  lowerLimit: number;

  @ApiProperty({
    example: 50000000,
    description: 'Límite superior del rango de la tarifa',
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  upperLimit: number;

  @ApiProperty({ example: 35000000, description: 'Valor de la tarifa' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  value: number;

  @ApiProperty({ example: 40000000, description: 'Valor máximo según la ley' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  valueMaxLaw: number;
}
