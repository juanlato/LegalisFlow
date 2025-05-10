import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Not } from 'typeorm';
import { UnitReference } from './entities/unit-reference.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { Currency } from '../currencies/entities/currency.entity';
import { CreateUnitReferenceDto } from './dto/create-unit-reference.dto';
import { UpdateUnitReferenceDto } from './dto/update-unit-reference.dto';
import { GetUnitsReferenceDto } from './dto/get-units-reference.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UnitsReferenceService {
  constructor(
    @InjectRepository(UnitReference)
    private unitReferenceRepo: Repository<UnitReference>,
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
    createUnitReferenceDto: CreateUnitReferenceDto,
  ): Promise<UnitReference> {
    const tenant = await this.tenantsRepo.findOne({
      where: { id: this.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    // Validar moneda
    const currency = await this.currenciesRepo.findOne({
      where: {
        id: createUnitReferenceDto.currencyId,
        tenant: { id: this.tenantId },
      },
    });
    if (!currency) throw new NotFoundException('Moneda no encontrada');

    // Verificar si ya existe una unidad de referencia con el mismo código
    const existingUnitRef = await this.unitReferenceRepo.findOne({
      where: {
        code: createUnitReferenceDto.code,
        tenant: { id: this.tenantId },
      },
    });

    if (existingUnitRef) {
      throw new ConflictException(
        'Ya existe una unidad de referencia con ese código',
      );
    }

    const unitReference = this.unitReferenceRepo.create({
      code: createUnitReferenceDto.code,
      name: createUnitReferenceDto.name,
      value: createUnitReferenceDto.value,
      tenant,
      currency,
    });

    return this.unitReferenceRepo.save(unitReference);
  }

  // READ (All with pagination and filters)
  async findAll(
    query: GetUnitsReferenceDto,
  ): Promise<PaginatedResponseDto<UnitReference>> {
    const {
      page = 1,
      limit = 10,
      search,
      currencyId,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = query;

    const skip = (page - 1) * limit;

    // Base where condition
    const where: any = { tenant: { id: this.tenantId } };

    // Add filters if provided
    if (search) {
      // Search in both name and code
      where.name = Like(`%${search}%`);
      // También buscar en código (usando OR condition)
      where.code = Like(`%${search}%`);
    }

    if (currencyId) {
      where.currency = { id: currencyId };
    }

    const options: FindManyOptions<UnitReference> = {
      where,
      relations: ['tenant', 'currency'],
      order: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip,
    };

    const [unitReferences, total] =
      await this.unitReferenceRepo.findAndCount(options);

    return {
      data: unitReferences,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // READ (One)
  async findOne(id: string): Promise<UnitReference> {
    const unitReference = await this.unitReferenceRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['tenant', 'currency'],
    });
    if (!unitReference)
      throw new NotFoundException('Unidad de referencia no encontrada');
    return unitReference;
  }

  // UPDATE
  async update(
    id: string,
    updateUnitReferenceDto: UpdateUnitReferenceDto,
  ): Promise<UnitReference> {
    const unitReference = await this.unitReferenceRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
    });
    if (!unitReference)
      throw new NotFoundException('Unidad de referencia no encontrada');

    // Si se actualiza el código, verificar que no exista otro con ese código
    if (
      updateUnitReferenceDto.code &&
      updateUnitReferenceDto.code !== unitReference.code
    ) {
      const existingUnitRef = await this.unitReferenceRepo.findOne({
        where: {
          code: updateUnitReferenceDto.code,
          tenant: { id: this.tenantId },
          id: Not(id), // No sea la misma que estamos editando
        },
      });

      if (existingUnitRef) {
        throw new ConflictException(
          'Ya existe una unidad de referencia con ese código',
        );
      }
    }

    // Si se está actualizando la moneda, validarla
    let currency: Currency | null = null;
    if (updateUnitReferenceDto.currencyId) {
      currency = await this.currenciesRepo.findOne({
        where: {
          id: updateUnitReferenceDto.currencyId,
          tenant: { id: this.tenantId },
        },
      });
      if (!currency) throw new NotFoundException('Moneda no encontrada');
    }

    // Actualizar los campos
    if (updateUnitReferenceDto.code) {
      unitReference.code = updateUnitReferenceDto.code;
    }

    if (updateUnitReferenceDto.name) {
      unitReference.name = updateUnitReferenceDto.name;
    }

    if (updateUnitReferenceDto.value !== undefined) {
      unitReference.value = updateUnitReferenceDto.value;
    }

    if (currency) {
      unitReference.currency = currency;
    }

    return this.unitReferenceRepo.save(unitReference);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const unitReference = await this.unitReferenceRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['insolvencyTariffs'],
    });

    if (!unitReference)
      throw new NotFoundException('Unidad de referencia no encontrada');

    // Validar que no tenga tarifas de insolvencia relacionadas
    if (
      unitReference.insolvencyTariffs &&
      unitReference.insolvencyTariffs.length > 0
    ) {
      throw new ConflictException(
        'No se puede eliminar la unidad de referencia porque tiene tarifas de insolvencia asociadas',
      );
    }

    await this.unitReferenceRepo.remove(unitReference);
  }
}
