import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../core/permissions/entities/permission.entity';
import { Tenant } from '../../../core/tenants/entities/tenant.entity';

export class RoleResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'Administrador' })
  name: string;

  @ApiProperty({ type: () => Permission, isArray: true })
  permissions: Permission[];

  @ApiProperty({ type: () => Tenant })
  tenant: Tenant;
}
