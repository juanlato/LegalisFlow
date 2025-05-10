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
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { CreateModulePermissionsDto } from './dto/create-module-permissions.dto';
/*
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { Role as RoleEnum } from '../auth/enums/role.enum';
  */

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: '[Desarrollo] Crear un permiso' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({
    status: 201,
    type: PermissionResponseDto,
    description: 'Permiso creado exitosamente',
  })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: '[Desarrollo] Listar todos los permisos' })
  @ApiResponse({
    status: 200,
    type: [PermissionResponseDto],
  })
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Desarrollo] Obtener un permiso por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: PermissionResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Desarrollo] Actualizar un permiso' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({
    status: 200,
    type: PermissionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Desarrollo] Eliminar un permiso' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Permiso eliminado' })
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post('create-by-module')
  @ApiOperation({
    summary: '[Desarrollo] Crear permisos básicos para un módulo',
  })
  @ApiResponse({ status: 201, description: 'Permisos creados exitosamente.' })
  async createPermissionsByModule(
    @Body() dto: CreateModulePermissionsDto,
  ): Promise<void> {
    await this.permissionsService.createPermissionsByModule(dto.moduleName);
  }
}
