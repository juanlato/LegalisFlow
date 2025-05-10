import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Ejecutar la lógica de autenticación estándar
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Puedes lanzar una excepción basada en info o err
    if (err || !user) {
      throw err || new UnauthorizedException('Acceso no autorizado');
    }

    // Inyectar el usuario en la solicitud para su uso posterior
    const request = context.switchToHttp().getRequest();
    request.user = user;
    // Verificar que el tenant del token coincida con el del subdominio

    const tenantIdFromRequest = request['tenant_id'];
    if (user.tenantId !== tenantIdFromRequest) {
      throw new UnauthorizedException(
        'El token no corresponde al tenant solicitado',
      );
    }

    return user;
  }
}
