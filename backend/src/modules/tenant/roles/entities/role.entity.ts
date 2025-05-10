import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../core/permissions/entities/permission.entity';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @Column()
  @ApiProperty({ example: 'Abogado Senior' })
  name: string;

  // Relación N:M con Permissions
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ type: () => Permission, isArray: true })
  permissions: Permission[];

  // Relación N:1 con Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.roles)
  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;

  // Relación 1:N con Users (opcional, si los usuarios tienen un solo rol)
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
