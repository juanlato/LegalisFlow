import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { UnitReference } from '../../units-reference/entities/unit-reference.entity';
import { ConversionRate } from '../../conversion-rates/entities/conversion-rate.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  symbol?: string;

  @Column({ default: false })
  isCurrencyBase: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.currencies)
  tenant: Tenant;

  @OneToMany(() => UnitReference, (unitReference) => unitReference.currency)
  unitReferences: UnitReference[];

  @OneToMany(
    () => ConversionRate,
    (conversionRate) => conversionRate.currencyOrigin,
  )
  originConversionRates: ConversionRate[];

  @OneToMany(
    () => ConversionRate,
    (conversionRate) => conversionRate.currencyDestination,
  )
  destinationConversionRates: ConversionRate[];
}
