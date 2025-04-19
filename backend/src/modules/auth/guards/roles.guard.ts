import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.permissions) {
      throw new ForbiddenException('No tienes permisos asignados');
    }

    const hasPermission = requiredPermissions.some(permission => 
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Requiere uno de estos permisos: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}