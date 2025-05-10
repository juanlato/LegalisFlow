import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { Currency } from '../../currencies/entities/currency.entity';

@Entity()
export class ConversionRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 6 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.conversionRates)
  tenant: Tenant;

  @ManyToOne(() => Currency, (currency) => currency.originConversionRates)
  currencyOrigin: Currency;

  @ManyToOne(() => Currency, (currency) => currency.destinationConversionRates)
  currencyDestination: Currency;
}
