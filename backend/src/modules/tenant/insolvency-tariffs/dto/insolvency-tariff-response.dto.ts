import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { UnitReference } from '../../units-reference/entities/unit-reference.entity';

export class InsolvencyTariffResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'TARIFF-001' })
  code: string;

  @ApiProperty({ type: () => UnitReference, required: false })
  unitReference?: UnitReference;

  @ApiProperty({ example: 0 })
  lowerLimit: number;

  @ApiProperty({ example: 50000000 })
  upperLimit: number;

  @ApiProperty({ example: 35000000 })
  value: number;

  @ApiProperty({ example: 40000000 })
  valueMaxLaw: number;

  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;
}
