import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from 'src/modules/tenants/tenants.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantsService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Obtener subdominio de headers (Swagger) o del hostname
    const subdomain = req.headers['x-tenant-subdomain']?.toString() ;
    
     
    if (!subdomain) {
      return res.status(400).json({
        message: 'Subdominio del tenant no proporcionado'
      });
    }

    try {
      const tenant = await this.tenantsService.findActiveBySubdomain(subdomain);
      if (!tenant) {
        return res.status(404).json({
          message: 'Tenant no encontrado'
        });
      }

      // Inyecta el tenant_id en la request
      req['tenant_id'] = tenant.id;
      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Error al procesar el tenant',
        error: error.message
      });
    }
  }
}