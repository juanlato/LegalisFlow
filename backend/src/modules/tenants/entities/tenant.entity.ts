import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
}