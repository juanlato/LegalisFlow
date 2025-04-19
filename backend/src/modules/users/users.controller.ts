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
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { AssignRolesDto } from './dto/assign-roles.dto';
  import { UserResponseDto } from './dto/user-response.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Permissions } from '../auth/decorators/roles.decorator';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { GetUsersDto } from './dto/get-users.dto';

  @ApiTags('Users')
  @ApiHeader({
    name: 'x-tenant-subdomain',
    description: 'Subdominio del tenant',
    required: true,
  })
  @ApiBearerAuth() 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @Permissions('users:create')
    @ApiOperation({ summary: 'Crear un usuario' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ 
      status: 201, 
      type: UserResponseDto,
      description: 'Usuario creado exitosamente',
    })
    async create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto); 
    }
  
    @Get()
    @Permissions('users:read')
    @ApiOperation({ summary: 'Listar usuarios con paginación y filtros' })
    @ApiResponse({ 
      status: 200, 
      type: PaginatedResponseDto<UserResponseDto>,
    })
    async findAll(@Query() getUsersDto: GetUsersDto) { 
      return this.usersService.findAll(getUsersDto);
    }
  
    @Get(':id')
    @Permissions('users:read')
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ 
      status: 200, 
      type: UserResponseDto,
    })
    async findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions('users:update')
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ 
      status: 200, 
      type: UserResponseDto,
    })
    async update(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.usersService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @Permissions('users:delete')
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 204, description: 'Usuario eliminado' })
    async remove(@Param('id') id: string) {
      return this.usersService.remove(id);
    }
  
    @Patch(':userId/assign-role/:roleId')
    @Permissions('users:assign-role')
    @ApiOperation({ summary: 'Asignar un rol a un usuario' }) 
    @ApiResponse({ status: 200, description: 'Rol asignado exitosamente.' })
    async assignRole(
      @Param('userId') userId: string,
      @Param('roleId') roleId: string,
    ): Promise<void> { 
      await this.usersService.assignRole(userId, roleId);
    }
  }