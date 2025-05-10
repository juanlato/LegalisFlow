import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversionRatesController } from './conversion-rates.controller';
import { ConversionRatesService } from './conversion-rates.service';
import { ConversionRate } from './entities/conversion-rate.entity';
import { Currency } from '../currencies/entities/currency.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversionRate, Currency, Tenant, Role])],
  controllers: [ConversionRatesController],
  providers: [ConversionRatesService],
  exports: [ConversionRatesService],
})
export class ConversionRatesModule {}
