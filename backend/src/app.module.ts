// src/app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TenantMiddleware } from './shared/middleware/tenant.middleware';
import { TenantsModule } from './modules/core/tenants/tenants.module';
import { PermissionsModule } from './modules/core/permissions/permissions.module';
import { UsersModule } from './modules/tenant/users/users.module';
import { RolesModule } from './modules/tenant/roles/roles.module';
import { AuthModule } from './modules/tenant/auth/auth.module';
import { CurrenciesModule } from './modules/tenant/currencies/currencies.module';
import { ConversionRatesModule } from './modules/tenant/conversion-rates/conversion-rates.module';
import { UnitsReferenceModule } from './modules/tenant/units-reference/units-reference.module';
import { InsolvencyTariffsModule } from './modules/tenant/insolvency-tariffs/insolvency-tariffs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development', // ¡Migraciones en producción!
      logging: false,
    }),

    TenantsModule,
    PermissionsModule,
    AuthModule,

    UsersModule,
    RolesModule,

    CurrenciesModule,
    ConversionRatesModule,
    UnitsReferenceModule,
    InsolvencyTariffsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'tenants', method: RequestMethod.ALL },
        { path: 'tenants/:id', method: RequestMethod.ALL },
        { path: 'tenants/subdomain/:subdomain', method: RequestMethod.GET },

        { path: 'permissions', method: RequestMethod.ALL },
        { path: 'permissions/:id', method: RequestMethod.ALL },
        // Puedes añadir más exclusiones aquí
      )
      .forRoutes('*'); // Aplica a todas las rutas
  }
}
