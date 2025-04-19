import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  private get tenantId(): string {
    return this.request['tenant_id'];
  }

  // CREATE
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepo.findOne({ 
      where: { 
        email: createUserDto.email,
        tenant: { id: this.tenantId } 
      },
    });
    if (existingUser) throw new ConflictException('El email ya está registrado');

    const tenant = await this.tenantsRepo.findOne({ 
      where: { id: this.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepo.create({
      ...createUserDto,
      password: hashedPassword,
      tenant,
    });

    return this.usersRepo.save(user);
  }

  async findAll(getUsersDto: GetUsersDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      email, 
      isActive, 
      roleId,
      sortBy = 'email', 
      sortOrder = 'DESC' 
    } = getUsersDto;

    const skip = (page - 1) * limit;

    const where: any = { tenant: { id: this.tenantId } };

    if (email) {
      where.email = Like(`%${email}%`);
    }

    if (typeof isActive !== 'undefined') {
      where.isActive = isActive;
    }

    if (roleId) {
      where.role = { id: roleId };
    }

    const [users, total] = await this.usersRepo.findAndCount({
      where,
      relations: ['role'],
      order: {
        [sortBy]: sortOrder.toUpperCase()
      },
      take: limit,
      skip,
    });

    const userDtos = users.map(user => {
      const dto = new UserResponseDto();
      dto.id = user.id;
      dto.email = user.email;
      dto.isActive = user.isActive;
      dto.role = user.role; 
      return dto;
    });

    return {
      data: userDtos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // READ (One) - Verifica que el usuario pertenezca al tenant
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ 
      where: { 
        id,
        tenant: { id: this.tenantId } 
      },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // READ (By Email) - Verifica tenant
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findOne({ 
      where: { 
        email,
        tenant: { id: this.tenantId } 
      },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // UPDATE - Mantiene las verificaciones de tenant
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Ya verifica tenant
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepo.findOne({
        where: {
          email: updateUserDto.email,
          tenant: { id: this.tenantId }
        }
      });
      if (existingUser) throw new ConflictException('El email ya está en uso');
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepo.save(user);
  }

  // DELETE - Ya verifica tenant a través de findOne
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id); // Verifica tenant
    user.isActive = false; // Cambia el estado a inactivo
    //await this.usersRepo.remove(user);
    await this.usersRepo.save(user);
  }

  // ASIGNAR ROLE - Verifica que el rol pertenezca al tenant
  async assignRole(userId: string, roleId: string): Promise<void> {
    const user = await this.usersRepo.findOne({ 
      where: { 
        id: userId,
        tenant: { id: this.tenantId } 
      },
      relations: ['role'] 
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const role = await this.rolesRepo.findOne({ 
      where: { 
        id: roleId,
        tenant: { id: this.tenantId } 
      } 
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    user.role = role;
    await this.usersRepo.save(user);
  }
}