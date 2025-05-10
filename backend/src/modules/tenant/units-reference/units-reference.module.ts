import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitsReferenceController } from './units-reference.controller';
import { UnitsReferenceService } from './units-reference.service';
import { UnitReference } from './entities/unit-reference.entity';
import { Currency } from '../currencies/entities/currency.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitReference, Currency, Tenant, Role])],
  controllers: [UnitsReferenceController],
  providers: [UnitsReferenceService],
  exports: [UnitsReferenceService],
})
export class UnitsReferenceModule {}
