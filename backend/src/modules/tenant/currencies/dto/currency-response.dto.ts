import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';

export class CurrencyResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'USD' })
  code: string;

  @ApiProperty({ example: 'Dólar Estadounidense' })
  name: string;

  @ApiProperty({ example: '$' })
  symbol?: string;

  @ApiProperty({ example: false })
  isCurrencyBase: boolean;

  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;
}
