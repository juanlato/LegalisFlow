import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request['tenant_id']; // Extrae el tenant_id del middleware
});
