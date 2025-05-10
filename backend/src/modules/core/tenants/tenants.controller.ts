import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // CREATE
  @Post()
  @ApiOperation({ summary: '[Desarrollo] Crear un nuevo tenant' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({
    status: 201,
    description: 'Tenant creado.',
    type: TenantResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 409, description: 'Subdominio ya existe.' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  // READ (All)
  @Get()
  @ApiOperation({ summary: '[Desarrollo] Obtener todos los tenants' })
  @ApiResponse({
    status: 200,
    type: [TenantResponseDto],
  })
  async findAll() {
    return this.tenantsService.findAll();
  }

  // READ (One)
  @Get(':id')
  @ApiOperation({ summary: '[Desarrollo] Obtener tenant por ID' })
  @ApiParam({
    name: 'id',
    type: String,
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    type: TenantResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tenant no encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  @ApiOperation({ summary: '[Desarrollo] Actualizar tenant' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({
    status: 200,
    type: TenantResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tenant no encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  // DELETE
  @Delete(':id')
  @ApiOperation({ summary: '[Desarrollo] Eliminar tenant' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Tenant eliminado.' })
  @ApiResponse({ status: 404, description: 'Tenant no encontrado.' })
  async remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  // GET by Subdomain
  @Get('subdomain/:subdomain')
  @ApiOperation({ summary: 'Obtener tenant por subdominio' })
  @ApiParam({ name: 'subdomain', type: String, example: 'lopez' })
  @ApiResponse({
    status: 200,
    type: TenantResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Subdominio no encontrado.' })
  async findBySubdomain(@Param('subdomain') subdomain: string) {
    return this.tenantsService.findBySubdomain(subdomain);
  }
}
