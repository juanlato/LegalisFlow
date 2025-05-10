import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { InsolvencyTariff } from '../../insolvency-tariffs/entities/insolvency-tariff.entity';

@Entity()
export class UnitReference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.unitReferences)
  tenant: Tenant;

  @ManyToOne(() => Currency, (currency) => currency.unitReferences)
  currency: Currency;

  @OneToMany(
    () => InsolvencyTariff,
    (insolvencyTariff) => insolvencyTariff.unitReference,
  )
  insolvencyTariffs: InsolvencyTariff[];
}
