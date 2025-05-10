import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { Currency } from '../../currencies/entities/currency.entity';

export class UnitReferenceResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'SMMLV' })
  code: string;

  @ApiProperty({ example: 'Salario Mínimo Mensual Legal Vigente' })
  name: string;

  @ApiProperty({ example: 1160000 })
  value: number;

  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;

  @ApiProperty({ type: () => Currency })
  currency: Currency;
}
