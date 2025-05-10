import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { Currency } from './entities/currency.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, Tenant, Role])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
