import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Tenant])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Para usar en AuthModule
})
export class UsersModule {}
