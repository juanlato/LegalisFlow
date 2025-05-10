import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsUUID, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateConversionRateDto {
  @ApiProperty({
    example: 0.85,
    description: 'Valor de la tasa de conversión',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID de la moneda origen',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  currencyOriginId?: string;

  @ApiProperty({
    example: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    description: 'ID de la moneda destino',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  currencyDestinationId?: string;
}
