import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsolvencyTariffsController } from './insolvency-tariffs.controller';
import { InsolvencyTariffsService } from './insolvency-tariffs.service';
import { InsolvencyTariff } from './entities/insolvency-tariff.entity';
import { UnitReference } from '../units-reference/entities/unit-reference.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsolvencyTariff, UnitReference, Tenant, Role]),
  ],
  controllers: [InsolvencyTariffsController],
  providers: [InsolvencyTariffsService],
  exports: [InsolvencyTariffsService],
})
export class InsolvencyTariffsModule {}
