import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; 
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
        private usersRepo: Repository<User>,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  private get tenantId(): string {
    return this.request['tenant_id'];
  }

  async validateUser(loginDto: LoginDto): Promise<any> {     

    const user = await this.usersRepo.findOne({ 
          where: { 
            email:loginDto.email,
            tenant: { id: this.tenantId } 
          },
          relations: ['role', 'role.permissions', 'tenant'],	
        });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }
    return user;
  }

  async login(user: any) {
    const role = await user.role;
    
    
    const permissions = user.role.permissions || [];
    
    const payload = {
      sub: user.id,
      email: user.email, 
      tenantId: user.tenant.id,
      role: role?.name,
      permissions: permissions.map(p => p.code),
    }; 
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email, 
        role: role?.name,
      },
    };
  }
}