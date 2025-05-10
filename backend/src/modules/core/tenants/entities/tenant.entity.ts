import { Role } from '../../../tenant/roles/entities/role.entity';
import { User } from '../../../tenant/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UnitReference } from '../../../tenant/units-reference/entities/unit-reference.entity';
import { Currency } from '../../../tenant/currencies/entities/currency.entity';
import { ConversionRate } from '../../../tenant/conversion-rates/entities/conversion-rate.entity';
import { InsolvencyTariff } from '../../../tenant/insolvency-tariffs/entities/insolvency-tariff.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  subdomain: string;

  @Column({ default: true })
  isActive: boolean;

  // Relación 1:N con Users
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  // Relación 1:N con Roles
  @OneToMany(() => Role, (role) => role.tenant)
  roles: Role[];

  @OneToMany(() => Currency, (currency) => currency.tenant)
  currencies: Currency[];

  @OneToMany(() => UnitReference, (unitReference) => unitReference.tenant)
  unitReferences: UnitReference[];

  @OneToMany(
    () => InsolvencyTariff,
    (insolvencyTariff) => insolvencyTariff.tenant,
  )
  insolvencyTariffs: InsolvencyTariff[];

  @OneToMany(() => ConversionRate, (conversionRate) => conversionRate.tenant)
  conversionRates: ConversionRate[];
}
