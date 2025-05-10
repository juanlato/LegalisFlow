import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roleId) {
      return false;
    }

    // Get role with permissions directly from repository
    const role = await this.rolesRepo.findOne({
      where: { id: user.roleId, tenant: { id: user.tenantId } },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Get permission codes
    const permissions = role.permissions.map((p) => p.code);

    const hasPermission = requiredPermissions.some((permission) =>
      permissions.includes(permission),
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        `Requiere este permiso: ${requiredPermissions.join(', ')}`,
      );
    }
    // Check if user has any of the required permissions
    return true;
  }
}
