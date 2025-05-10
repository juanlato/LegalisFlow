import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'USD', description: 'Código de la moneda' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Dólar Estadounidense',
    description: 'Nombre de la moneda',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
