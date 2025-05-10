import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { Currency } from '../../currencies/entities/currency.entity';

export class ConversionRateResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 0.85 })
  value: number;

  @ApiProperty({ example: '2025-04-19T12:00:00Z' })
  fechaActualizacion: Date;

  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;

  @ApiProperty({ type: () => Currency })
  currencyOrigin: Currency;

  @ApiProperty({ type: () => Currency })
  currencyDestination: Currency;
}
