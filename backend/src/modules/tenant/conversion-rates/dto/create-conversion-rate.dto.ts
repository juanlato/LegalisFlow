import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConversionRateDto {
  @ApiProperty({ example: 0.85, description: 'Valor de la tasa de conversión' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID de la moneda origen',
  })
  @IsUUID()
  @IsNotEmpty()
  currencyOriginId: string;

  @ApiProperty({
    example: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    description: 'ID de la moneda destino',
  })
  @IsUUID()
  @IsNotEmpty()
  currencyDestinationId: string;
}
