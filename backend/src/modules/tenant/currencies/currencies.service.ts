import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { GetCurrenciesDto } from './dto/get-currencies.dto';
import { SetBaseCurrencyDto } from './dto/set-base-currency.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepo: Repository<Currency>,
    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get tenantId(): string {
    return this.request['tenant_id'];
  }

  // CREATE
  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const tenant = await this.tenantsRepo.findOne({
      where: { id: this.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    const existingCurrency = await this.currenciesRepo.findOne({
      where: { code: createCurrencyDto.code, tenant: { id: this.tenantId } },
    });

    if (existingCurrency)
      throw new ConflictException('La moneda ya está registrada');

    const currency = this.currenciesRepo.create({
      ...createCurrencyDto,
      tenant,
    });

    // Si se está creando una moneda base, desactivar la anterior
    if (createCurrencyDto.isCurrencyBase) {
      await this.unsetCurrentBaseCurrency();
    }

    return this.currenciesRepo.save(currency);
  }

  // READ (All)
  async findAll(
    query: GetCurrenciesDto,
  ): Promise<PaginatedResponseDto<Currency>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = query;

    const skip = (page - 1) * limit;

    const where: any = { tenant: { id: this.tenantId } };

    if (search) {
      where.name = Like(`%${search}%`);
      // También buscar en código
      where.code = Like(`%${search}%`);
    }

    const options: FindManyOptions<Currency> = {
      where,
      relations: ['tenant'],
      order: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip,
    };

    const [currencies, total] = await this.currenciesRepo.findAndCount(options);

    return {
      data: currencies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // READ (One)
  async findOne(id: string): Promise<Currency> {
    const currency = await this.currenciesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['tenant'],
    });
    if (!currency) throw new NotFoundException('Moneda no encontrada');
    return currency;
  }

  // UPDATE
  async update(
    id: string,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    const currency = await this.currenciesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
    });
    if (!currency) throw new NotFoundException('Moneda no encontrada');

    // Si se actualiza el código, verificar que no exista
    if (updateCurrencyDto.code && updateCurrencyDto.code !== currency.code) {
      const existingCurrency = await this.currenciesRepo.findOne({
        where: { code: updateCurrencyDto.code, tenant: { id: this.tenantId } },
      });
      if (existingCurrency)
        throw new ConflictException('Ya existe una moneda con ese código');
    }

    // Si está configurando como moneda base
    if (updateCurrencyDto.isCurrencyBase && !currency.isCurrencyBase) {
      await this.unsetCurrentBaseCurrency();
    }

    Object.assign(currency, updateCurrencyDto);

    return this.currenciesRepo.save(currency);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const currency = await this.currenciesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
    });
    if (!currency) throw new NotFoundException('Moneda no encontrada');

    // No permitir eliminar la moneda base
    if (currency.isCurrencyBase) {
      throw new ConflictException('No se puede eliminar la moneda base');
    }

    await this.currenciesRepo.remove(currency);
  }

  // SET BASE CURRENCY
  async setAsBaseCurrency(
    id: string,
  ): Promise<Currency> {
    const currency = await this.currenciesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
    });
    if (!currency) throw new NotFoundException('Moneda no encontrada');

    if (!currency.isCurrencyBase) {
      // Desactivar la moneda base actual
      await this.unsetCurrentBaseCurrency();

      // Establecer esta como moneda base
      currency.isCurrencyBase = true;
      return this.currenciesRepo.save(currency);
    }

    return currency;
  }

  // Helper method to unset current base currency
  private async unsetCurrentBaseCurrency(): Promise<void> {
    const baseCurrency = await this.currenciesRepo.findOne({
      where: { tenant: { id: this.tenantId }, isCurrencyBase: true },
    });

    if (baseCurrency) {
      baseCurrency.isCurrencyBase = false;
      await this.currenciesRepo.save(baseCurrency);
    }
  }
}
