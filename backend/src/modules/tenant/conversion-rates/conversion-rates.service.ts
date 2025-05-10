import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, Not } from 'typeorm';
import { ConversionRate } from './entities/conversion-rate.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { Currency } from '../currencies/entities/currency.entity';
import { CreateConversionRateDto } from './dto/create-conversion-rate.dto';
import { UpdateConversionRateDto } from './dto/update-conversion-rate.dto';
import { GetConversionRatesDto } from './dto/get-conversion-rates.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ConversionRatesService {
  constructor(
    @InjectRepository(ConversionRate)
    private conversionRatesRepo: Repository<ConversionRate>,
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
  async create(
    createConversionRateDto: CreateConversionRateDto,
  ): Promise<ConversionRate> {
    const tenant = await this.tenantsRepo.findOne({
      where: { id: this.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    // Validar monedas
    const currencyOrigin = await this.currenciesRepo.findOne({
      where: {
        id: createConversionRateDto.currencyOriginId,
        tenant: { id: this.tenantId },
      },
    });
    if (!currencyOrigin)
      throw new NotFoundException('Moneda origen no encontrada');

    const currencyDestination = await this.currenciesRepo.findOne({
      where: {
        id: createConversionRateDto.currencyDestinationId,
        tenant: { id: this.tenantId },
      },
    });
    if (!currencyDestination)
      throw new NotFoundException('Moneda destino no encontrada');

    // Validar que no sean la misma moneda
    if (currencyOrigin.id === currencyDestination.id) {
      throw new ConflictException(
        'No se puede crear una tasa de conversión entre la misma moneda',
      );
    }

    // Verificar si ya existe una tasa de conversión entre estas monedas
    const existingRate = await this.conversionRatesRepo.findOne({
      where: {
        tenant: { id: this.tenantId },
        currencyOrigin: { id: currencyOrigin.id },
        currencyDestination: { id: currencyDestination.id },
      },
    });

    if (existingRate) {
      throw new ConflictException(
        'Ya existe una tasa de conversión entre estas monedas',
      );
    }

    const conversionRate = this.conversionRatesRepo.create({
      value: createConversionRateDto.value,
      tenant,
      currencyOrigin,
      currencyDestination,
      fechaActualizacion: new Date(),
    });

    return this.conversionRatesRepo.save(conversionRate);
  }

  // READ (All with pagination and filters)
  async findAll(
    query: GetConversionRatesDto,
  ): Promise<PaginatedResponseDto<ConversionRate>> {
    const {
      page = 1,
      limit = 10,
      currencyOriginId,
      currencyDestinationId,
      sortBy = 'fechaActualizacion',
      sortOrder = 'DESC',
    } = query;

    const skip = (page - 1) * limit;

    // Base where condition
    const where: FindOptionsWhere<ConversionRate> = {
      tenant: { id: this.tenantId },
    };

    // Add filters if provided
    if (currencyOriginId) {
      where.currencyOrigin = { id: currencyOriginId };
    }

    if (currencyDestinationId) {
      where.currencyDestination = { id: currencyDestinationId };
    }

    const options: FindManyOptions<ConversionRate> = {
      where,
      relations: ['currencyOrigin', 'currencyDestination'],
      order: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip,
    };

    const [conversionRates, total] =
      await this.conversionRatesRepo.findAndCount(options);

    return {
      data: conversionRates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // READ (One)
  async findOne(id: string): Promise<ConversionRate> {
    const conversionRate = await this.conversionRatesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['tenant', 'currencyOrigin', 'currencyDestination'],
    });
    if (!conversionRate)
      throw new NotFoundException('Tasa de conversión no encontrada');
    return conversionRate;
  }

  // UPDATE
  async update(
    id: string,
    updateConversionRateDto: UpdateConversionRateDto,
  ): Promise<ConversionRate> {
    const conversionRate = await this.conversionRatesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['currencyOrigin', 'currencyDestination'],
    });
    if (!conversionRate)
      throw new NotFoundException('Tasa de conversión no encontrada');

    let currencyOrigin = conversionRate.currencyOrigin;
    let currencyDestination = conversionRate.currencyDestination;
    let needsValidation = false;

    // Si se está actualizando alguna moneda, cargarlas
    if (updateConversionRateDto.currencyOriginId) {
      const foundCurrencyOrigin = await this.currenciesRepo.findOne({
        where: {
          id: updateConversionRateDto.currencyOriginId,
          tenant: { id: this.tenantId },
        },
      });

      if (!foundCurrencyOrigin)
        throw new NotFoundException('Moneda origen no encontrada');

      currencyOrigin = foundCurrencyOrigin;
      needsValidation = true;
    }

    if (updateConversionRateDto.currencyDestinationId) {
      const foundCurrencyDestination = await this.currenciesRepo.findOne({
        where: {
          id: updateConversionRateDto.currencyDestinationId,
          tenant: { id: this.tenantId },
        },
      });

      if (!foundCurrencyDestination)
        throw new NotFoundException('Moneda destino no encontrada');

      currencyDestination = foundCurrencyDestination;
      needsValidation = true;
    }

    // Validar que no sean la misma moneda
    if (currencyOrigin.id === currencyDestination.id) {
      throw new ConflictException(
        'No se puede crear una tasa de conversión entre la misma moneda',
      );
    }

    // Verificar si ya existe otra tasa de conversión con las mismas monedas (pero que no sea la que estamos editando)
    if (needsValidation) {
      const existingRate = await this.conversionRatesRepo.findOne({
        where: {
          tenant: { id: this.tenantId },
          currencyOrigin: { id: currencyOrigin.id },
          currencyDestination: { id: currencyDestination.id },
          id: Not(id), // Excluir la tasa actual
        },
      });

      if (existingRate) {
        throw new ConflictException(
          'Ya existe una tasa de conversión entre estas monedas',
        );
      }
    }

    // Actualizar las propiedades
    if (updateConversionRateDto.value !== undefined) {
      conversionRate.value = updateConversionRateDto.value;
    }

    if (updateConversionRateDto.currencyOriginId) {
      conversionRate.currencyOrigin = currencyOrigin;
    }

    if (updateConversionRateDto.currencyDestinationId) {
      conversionRate.currencyDestination = currencyDestination;
    }

    // Actualizar la fecha
    conversionRate.fechaActualizacion = new Date();

    return this.conversionRatesRepo.save(conversionRate);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const conversionRate = await this.conversionRatesRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
    });
    if (!conversionRate)
      throw new NotFoundException('Tasa de conversión no encontrada');

    await this.conversionRatesRepo.remove(conversionRate);
  }
}
