import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { Permission } from '../../core/permissions/entities/permission.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, Tenant])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
