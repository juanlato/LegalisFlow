import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant,User,Role,Permission])],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],  // Para usar el servicio en otros módulos (ej: middleware)
})
export class TenantsModule {}