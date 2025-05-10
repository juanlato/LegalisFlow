import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../tenant/roles/entities/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'cases:create' })
  code: string;

  @Column()
  @ApiProperty({ example: 'Crear nuevos casos legales' })
  description: string;

  // Relación N:M con Roles (a través de role_permission)
  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
