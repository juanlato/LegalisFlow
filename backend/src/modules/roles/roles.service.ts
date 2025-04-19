import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, FindManyOptions } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { GetRolesDto } from './dto/get-roles.dto'; 
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepo: Repository<Permission>,
    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
    @Inject(REQUEST) private readonly request: Request
  ) {}


  private get tenantId(): string {
    return this.request['tenant_id'];
  }

  // CREATE
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const tenant = await this.tenantsRepo.findOne({ 
      where: { id: this.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    const existingRole = await this.rolesRepo.findOne({ 
      where: { name: createRoleDto.name, tenant: { id: this.tenantId } }
    });
    
    if (existingRole) throw new NotFoundException('El rol ya está registrado');

    const role = this.rolesRepo.create({
      name: createRoleDto.name,
      tenant,
    });

    if (createRoleDto.permissionIds?.length) {
      role.permissions = await this.permissionsRepo.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
    }

    return this.rolesRepo.save(role);
  }

  // READ (All)
  async findAll(query: GetRolesDto): Promise<PaginatedResponseDto<Role>> {
    const { 
      page = 1, 
      limit = 10, 
      name, 
      permissionId,
      sortBy = 'name', 
      sortOrder = 'ASC' 
    } = query;

    const skip = (page - 1) * limit;

    const where: any = { tenant: { id: this.tenantId } };

    if (name) {
      where.name = Like(`%${name}%`);
    }

    const options: FindManyOptions<Role> = {
      where,
      relations: ['permissions', 'tenant'],
      order: {
        [sortBy]: sortOrder.toUpperCase()
      },
      take: limit,
      skip,
    };

    // Filtro adicional por permissionId
    if (permissionId) {
      options.where = {
        ...options.where,
        permissions: { id: permissionId }
      };
    }

    const [roles, total] = await this.rolesRepo.findAndCount(options);

    

    return {
      data: roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // READ (One)
  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepo.findOne({ 
      where: { id, tenant: { id: this.tenantId } },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  // UPDATE
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.rolesRepo.findOne({ 
      where: { id, tenant: { id: this.tenantId } },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    
    if (updateRoleDto.name) role.name = updateRoleDto.name;

    if (updateRoleDto.permissionIds) {
      role.permissions = await this.permissionsRepo.find({
        where: { id: In(updateRoleDto.permissionIds) },
      });
    }

    return this.rolesRepo.save(role);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    
    const role = await this.rolesRepo.findOne({ 
      where: { id, tenant: { id: this.tenantId } },
      relations: ['permissions'],
    }); 
    if (!role) throw new NotFoundException('Rol no encontrado');
    
    await this.rolesRepo.remove(role);
  }


  async assignPermissions(roleId: string, assignPermissionsDto: AssignPermissionsDto): Promise<Role> {
    // Verificar que el rol exista y pertenezca al tenant
    const role = await this.rolesRepo.findOne({
      where: { 
        id: roleId,
        tenant: { id: this.tenantId } 
      },
      relations: ['permissions']
    });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Verificar que los permisos existan y pertenezcan al tenant (opcional)
    const permissions = await this.permissionsRepo.find({
      where: { 
        id: In(assignPermissionsDto.permissionIds) 
      }
    });

    if (permissions.length !== assignPermissionsDto.permissionIds.length) {
      throw new NotFoundException('Uno o más permisos no encontrados');
    }

    // Asignar los nuevos permisos (reemplazando los existentes)
    role.permissions = permissions;  

    return await this.rolesRepo.save(role);
  }

}