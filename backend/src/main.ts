import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TenantsModule } from './modules/core/tenants/tenants.module';
import { TenantsService } from './modules/core/tenants/tenants.service';

const config = new DocumentBuilder()
  .setTitle('SaaS Legal API')
  .setDescription('API multi-tenant para bufetes de abogados')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tenantsService = app
    .select(TenantsModule)
    .get(TenantsService, { strict: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita la transformación automática
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos implícitamente
      },
    }),
  ); // ¡Habilita la validación!

  // Configuración CORS para desarrollo
  app.enableCors({
    origin: async (origin, callback) => {
      // 1. Permitir solicitudes sin origen (aplicaciones móviles, Postman, etc.)
      if (!origin) return callback(null, true);

      // 2. Permitir localhost en desarrollo

      if (
        process.env.NODE_ENV === 'development' &&
        (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/\w+\.localhost(:\d+)?$/.test(origin))
      ) {
        return callback(null, true);
      }
      // 3. Extraer subdominio del origen
      const domainPattern =
        /^https?:\/\/(?:([^\.]+)\.)?midominio\.com(?:\.\w+)?(:\d+)?$/;
      //const domainPattern = /^http?:\/\/(?:([^\.]+)\.)?localhost(:\d+)?$/;

      const matches = origin.match(domainPattern);

      if (!matches) {
        return callback(new Error('Dominio no permitido'), false);
      }

      try {
        const subdomain = matches[1] || 'www'; // Si no hay subdominio, usar 'www'

        // 4. Validar el tenant con el servicio
        const tenant =
          await tenantsService.findActiveBySubdomainCors(subdomain);
        console.error(tenant);
        if (tenant) {
          return callback(null, true);
        }
      } catch (error) {
        console.error('Error validando tenant:', error);
      }

      // 5. Rechazar si no pasa las validaciones
      return callback(new Error('Tenant no encontrado'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-subdomain',
      'X-Requested-With',
      'Accept',
    ],
    exposedHeaders: ['Authorization', 'x-tenant-subdomain'],
    maxAge: 86400, // Cache de CORS por 24 horas
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
