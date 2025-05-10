import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetBaseCurrencyDto {
  @ApiProperty({ example: true, description: 'Establecer como moneda base' })
  @IsBoolean()
  @IsNotEmpty()
  setAsBase: boolean;
}
