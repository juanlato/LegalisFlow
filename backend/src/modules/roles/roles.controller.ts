import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Patch, 
    Delete, 
    UseGuards,
    Query,
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiHeader,
  } from '@nestjs/swagger';
  import { RolesService } from './roles.service';
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRoleDto } from './dto/update-role.dto';
  import { RoleResponseDto } from './dto/role-response.dto';
  import { AssignPermissionsDto } from './dto/assign-permissions.dto';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { Permissions } from '../auth/decorators/roles.decorator';
import { Role } from './entities/role.entity';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { GetRolesDto } from './dto/get-roles.dto';
   

  @ApiTags('Roles')
  @ApiHeader({
      name: 'x-tenant-subdomain',
      description: 'Subdominio del tenant',
      required: true,
  })  
  @ApiBearerAuth() 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('roles')
  
  export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  
    @Post() 
    @Permissions('roles:create')
    @ApiOperation({ summary: 'Crear un rol' })
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({ 
      status: 201, 
      type: RoleResponseDto,
      description: 'Rol creado exitosamente',
    })
    async create(@Body() createRoleDto: CreateRoleDto) {
      return this.rolesService.create(createRoleDto);
    }
  

    @Get()
    @Permissions('roles:read')
    @ApiOperation({ summary: 'Listar todos los roles con paginación y filtros' })
    @ApiResponse({ 
      status: 200, 
      type: PaginatedResponseDto<Role>,
    })
    async findAll(@Query() getRolesDto: GetRolesDto) { 
      return this.rolesService.findAll(getRolesDto);
    }

    
  
    @Get(':id')
    @Permissions('roles:read')
    @ApiOperation({ summary: 'Obtener un rol por ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ 
      status: 200, 
      type: RoleResponseDto,
    })
    async findOne(@Param('id') id: string) {
      return this.rolesService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions('roles:update')
    @ApiOperation({ summary: 'Actualizar un rol' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateRoleDto })
    @ApiResponse({ 
      status: 200, 
      type: RoleResponseDto,
    })
    async update(
      @Param('id') id: string,
      @Body() updateRoleDto: UpdateRoleDto,
    ) {
      return this.rolesService.update(id, updateRoleDto);
    }
  
    @Delete(':id')
    @Permissions('roles:delete')
    @ApiOperation({ summary: 'Eliminar un rol' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 204, description: 'Rol eliminado' })
    async remove(@Param('id') id: string) {
      return this.rolesService.remove(id);
    }

    @Patch(':id/assign-permissions')
    @Permissions('roles:assign-permissions')
    @ApiOperation({ 
      summary: 'Asignar permisos a un rol',
      description: 'Asigna una lista de permisos a un rol específico del tenant actual'
    })
    @ApiParam({ name: 'id', description: 'ID del rol' })
    @ApiBody({ type: AssignPermissionsDto })
    @ApiResponse({ 
      status: 200, 
      type: RoleResponseDto,
      description: 'Permisos asignados correctamente al rol' 
    })
    @ApiResponse({ status: 404, description: 'Rol o permisos no encontrados' })
    async assignPermissions(
      @Param('id') roleId: string,
      @Body() assignPermissionsDto: AssignPermissionsDto
    ) {
      return this.rolesService.assignPermissions(roleId, assignPermissionsDto);
    }
  }