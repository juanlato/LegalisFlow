import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepo: Repository<Permission>,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  // CREATE
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionsRepo.findOne({ 
      where: { code: createPermissionDto.code },
    });
    if (existing) throw new ConflictException('El código de permiso ya existe');

    const permission = this.permissionsRepo.create(createPermissionDto);
    console.log('savedPermission', permission);
    const savedPermission = await this.permissionsRepo.save(permission);

    // Asignar el permiso al rol "Admin"
    const admins = await this.rolesRepo.find({
      where: { name: 'Admin' },
      relations: ['permissions'], // Incluye los permisos relacionados
    });

    for (const adminRole of admins) {
      if (adminRole) {
        adminRole.permissions = [...(adminRole.permissions || []), savedPermission];
        await this.rolesRepo.save(adminRole); // Guarda los cambios en el rol
      }
    }
    

    return savedPermission;
  }

  // READ (All)
  async findAll(): Promise<Permission[]> {
    return this.permissionsRepo.find();
  }

  // READ (One)
  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionsRepo.findOne({ 
      where: { id },
      relations: ['roles'], 
    });
    if (!permission) throw new NotFoundException('Permiso no encontrado');
    return permission;
  }

  // UPDATE
  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    return this.permissionsRepo.save(permission);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionsRepo.remove(permission);
  }

  async createPermissionsByModule(moduleName: string): Promise<void> {
    const actions = ['create', 'read', 'update', 'delete']; // Acciones básicas del CRUD

  // Busca el rol "Admin" y sus permisos relacionados
  const adminRole = await this.rolesRepo.findOne({
    where: { name: 'Admin' },
    relations: ['permissions'], // Incluye los permisos relacionados
  });

  if (!adminRole) {
    throw new NotFoundException('El rol "Admin" no existe.');
  }

  for (const action of actions) {
    const code = `${moduleName}:${action}`; // Genera el código del permiso (e.g., "users:create")

    // Verifica si el permiso ya existe
    const existingPermission = await this.permissionsRepo.findOne({ where: { code } });
    if (existingPermission) {
      throw new ConflictException(`El permiso "${code}" ya existe.`);
    }

    // Crea y guarda el permiso
    const permission = this.permissionsRepo.create({
      code,
      description: `Permiso para ${action} en el módulo ${moduleName}`,
    });
    const savedPermission = await this.permissionsRepo.save(permission);

    // Asigna el permiso al rol "Admin"
    adminRole.permissions = [...(adminRole.permissions || []), savedPermission];
  }

  // Guarda los cambios en el rol "Admin"
  await this.rolesRepo.save(adminRole);
  }
}