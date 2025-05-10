import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';

@Entity()
@Index(['email', 'tenant'], { unique: true }) // Índice compuesto único
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @Column()
  @ApiProperty({ example: 'usuario@bufete.com' })
  email: string;

  @Column()
  password: string; // Se omite en Swagger por seguridad

  @Column({ default: true })
  @ApiProperty({ example: true })
  isActive: boolean;

  // Relación N:1 con Role (Un usuario tiene UN rol)
  @ManyToOne(() => Role, (role) => role.users)
  @ApiProperty({ type: () => Role })
  role: Role;

  // Relación N:1 con Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;
}
