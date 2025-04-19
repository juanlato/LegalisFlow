import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateUserDto } from '../users/dto/create-user.dto'; 
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity'; 
import { Permission } from '../permissions/entities/permission.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Permission)
    private permissionsRepo: Repository<Permission>,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,

    private readonly dataSource: DataSource

  ) {}

  // CREATE
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {

    // Validar que el subdominio no exista
    const existing = await this.tenantsRepo.findOne({ 
      where: { subdomain: createTenantDto.subdomain },
    });
    if (existing) throw new ConflictException('El subdominio ya está en uso.');

     

    await this.dataSource.transaction(async (manager) => {
      // 1. Crear el tenant    

      const tenant = this.tenantsRepo.create(createTenantDto);
      
      await manager.save(Tenant, tenant);

      // 2. Crear el rol de administrador 
      const adminRole = this.rolesRepo.create({
        name: 'Admin',
        tenant,
      });

      // 3. Asignar todos los permisos al rol de administrador     

      const allPermissions = await this.permissionsRepo.find(); // Obtiene todos los permisos      
      const permissions = await this.permissionsRepo.findByIds(allPermissions.map(p => p.id)); 

      adminRole.permissions = permissions;
      await manager.save(Role, adminRole);
      
      // 4. Crear el usuario administrador      
      
      const hashedPassword = await bcrypt.hash(createTenantDto.password, 10);
      const user = this.usersRepo.create({
        email: createTenantDto.adminEmail,
        password: hashedPassword,
        tenant: tenant,
        role: adminRole,
      });
       

      await manager.save(User, user); 
    });

    const tenant = await this.tenantsRepo.findOne({ 
      where: { subdomain: createTenantDto.subdomain },
      relations: ['users','roles', 'users.role'],
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');
    return tenant;
  }

  // READ (All)
  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepo.find();
  }

  // READ (One)
  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');
    return tenant;
  }

  // READ (By Subdomain)
  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantsRepo.findOne({ where: { subdomain } });
    if (!tenant) throw new NotFoundException('Subdominio no encontrado');
    return tenant;
  }

  async findActiveBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantsRepo.findOne({ where: { subdomain ,isActive:true} });
    if (!tenant) throw new NotFoundException('Subdominio no encontrado');
    return tenant;
  }

  async findActiveBySubdomainCors(subdomain: string): Promise<Tenant | null> {
    const tenant = await this.tenantsRepo.findOne({ where: { subdomain ,isActive:true} }); 
    return tenant;
  }
  // UPDATE
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    Object.assign(tenant, updateTenantDto);
    return this.tenantsRepo.save(tenant);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    tenant.isActive = false; // Marcar como inactivo en lugar de eliminar
    await this.tenantsRepo.save(tenant);
  }
}