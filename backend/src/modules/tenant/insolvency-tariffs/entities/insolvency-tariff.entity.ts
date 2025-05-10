import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UnitReference } from '../../units-reference/entities/unit-reference.entity';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';

@Entity()
export class InsolvencyTariff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @ManyToOne(
    () => UnitReference,
    (unitReference) => unitReference.insolvencyTariffs,
    { nullable: true },
  )
  unitReference?: UnitReference | null;

  @Column('decimal', { precision: 10, scale: 2 })
  lowerLimit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  upperLimit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valueMaxLaw: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.insolvencyTariffs)
  tenant: Tenant;
}
