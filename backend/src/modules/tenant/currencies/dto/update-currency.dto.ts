import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCurrencyDto {
  @ApiProperty({
    example: 'USD',
    description: 'Código de la moneda',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: 'Dólar Estadounidense',
    description: 'Nombre de la moneda',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '$',
    description: 'Símbolo de la moneda',
    required: false,
  })
  @IsString()
  @IsOptional()
  symbol?: string;

  @ApiProperty({
    example: false,
    description: 'Indica si es la moneda base',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCurrencyBase?: boolean;
}
