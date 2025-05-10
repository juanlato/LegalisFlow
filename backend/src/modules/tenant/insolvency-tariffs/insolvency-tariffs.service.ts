import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Between, Not } from 'typeorm';
import { InsolvencyTariff } from './entities/insolvency-tariff.entity';
import { Tenant } from '../../core/tenants/entities/tenant.entity';
import { UnitReference } from '../units-reference/entities/unit-reference.entity';
import { CreateInsolvencyTariffDto } from './dto/create-insolvency-tariff.dto';
import { UpdateInsolvencyTariffDto } from './dto/update-insolvency-tariff.dto';
import { GetInsolvencyTariffsDto } from './dto/get-insolvency-tariffs.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class InsolvencyTariffsService {
  constructor(
    @InjectRepository(InsolvencyTariff)
    private insolvencyTariffRepo: Repository<InsolvencyTariff>,
    @InjectRepository(UnitReference)
    private unitReferenceRepo: Repository<UnitReference>,
    @InjectRepository(Tenant)
    private tenantsRepo: Repository<Tenant>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get tenantId(): string {
    return this.request['tenant_id'];
  }

  // CREATE
  async create(
    createInsolvencyTariffDto: CreateInsolvencyTariffDto,
  ): Promise<InsolvencyTariff> {
    const tenant = await this.tenantsRepo.findOne({
      where: { id: this.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');

    // Verificar si ya existe una tarifa con el mismo código
    const existingTariff = await this.insolvencyTariffRepo.findOne({
      where: {
        code: createInsolvencyTariffDto.code,
        tenant: { id: this.tenantId },
      },
    });

    if (existingTariff) {
      throw new ConflictException('Ya existe una tarifa con ese código');
    }

    // Validar que los límites sean coherentes
    if (
      createInsolvencyTariffDto.lowerLimit >=
      createInsolvencyTariffDto.upperLimit
    ) {
      throw new ConflictException(
        'El límite inferior debe ser menor que el límite superior',
      );
    }

    // Validar que el valor no supere el valor máximo legal
    if (
      createInsolvencyTariffDto.value > createInsolvencyTariffDto.valueMaxLaw
    ) {
      throw new ConflictException(
        'El valor de la tarifa no puede superar el valor máximo legal',
      );
    }

    // Verificar que no haya solapamiento de rangos
    /*await this.validateRangeOverlap(
      createInsolvencyTariffDto.lowerLimit,
      createInsolvencyTariffDto.upperLimit,
    );
*/
    // Obtener la unidad de referencia si se proporciona
    let unitReference: UnitReference | null = null;
    if (createInsolvencyTariffDto.unitReferenceId) {
      unitReference = await this.unitReferenceRepo.findOne({
        where: {
          id: createInsolvencyTariffDto.unitReferenceId,
          tenant: { id: this.tenantId },
        },
      });

      if (!unitReference) {
        throw new NotFoundException('Unidad de referencia no encontrada');
      }
    }

    const insolvencyTariff = this.insolvencyTariffRepo.create({
      code: createInsolvencyTariffDto.code,
      lowerLimit: createInsolvencyTariffDto.lowerLimit,
      upperLimit: createInsolvencyTariffDto.upperLimit,
      value: createInsolvencyTariffDto.value,
      valueMaxLaw: createInsolvencyTariffDto.valueMaxLaw,
      tenant,
      unitReference: unitReference || undefined,
    });

    return this.insolvencyTariffRepo.save(insolvencyTariff);
  }

  // READ (All with pagination and filters)
  async findAll(
    query: GetInsolvencyTariffsDto,
  ): Promise<PaginatedResponseDto<InsolvencyTariff>> {
    const {
      page = 1,
      limit = 10,
      search,
      unitReferenceId,
      sortBy = 'lowerLimit',
      sortOrder = 'ASC',
    } = query;

    const skip = (page - 1) * limit;

    // Base where condition
    const where: any = { tenant: { id: this.tenantId } };

    // Add filters if provided
    if (search) {
      where.code = Like(`%${search}%`);
    }

    if (unitReferenceId) {
      where.unitReference = { id: unitReferenceId };
    }

    const options: FindManyOptions<InsolvencyTariff> = {
      where,
      relations: ['unitReference'],
      order: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip,
    };

    const [insolvencyTariffs, total] =
      await this.insolvencyTariffRepo.findAndCount(options);

    return {
      data: insolvencyTariffs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // READ (One)
  async findOne(id: string): Promise<InsolvencyTariff> {
    const insolvencyTariff = await this.insolvencyTariffRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['unitReference'],
    });
    if (!insolvencyTariff)
      throw new NotFoundException('Tarifa de insolvencia no encontrada');
    return insolvencyTariff;
  }

  // UPDATE
  async update(
    id: string,
    updateInsolvencyTariffDto: UpdateInsolvencyTariffDto,
  ): Promise<InsolvencyTariff> {
    const insolvencyTariff = await this.insolvencyTariffRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
      relations: ['unitReference'],
    });
    if (!insolvencyTariff)
      throw new NotFoundException('Tarifa de insolvencia no encontrada');

    // Si se actualiza el código, verificar que no exista otro con ese código
    if (
      updateInsolvencyTariffDto.code &&
      updateInsolvencyTariffDto.code !== insolvencyTariff.code
    ) {
      const existingTariff = await this.insolvencyTariffRepo.findOne({
        where: {
          code: updateInsolvencyTariffDto.code,
          tenant: { id: this.tenantId },
          id: Not(id),
        },
      });

      if (existingTariff) {
        throw new ConflictException('Ya existe una tarifa con ese código');
      }
    }

    // Validar límites y valores si están presentes
    const newLowerLimit =
      updateInsolvencyTariffDto.lowerLimit ?? insolvencyTariff.lowerLimit;
    const newUpperLimit =
      updateInsolvencyTariffDto.upperLimit ?? insolvencyTariff.upperLimit;
    const newValue = updateInsolvencyTariffDto.value ?? insolvencyTariff.value;
    const newValueMaxLaw =
      updateInsolvencyTariffDto.valueMaxLaw ?? insolvencyTariff.valueMaxLaw;

    // Validar que los límites sean coherentes
    if (newLowerLimit >= newUpperLimit) {
      throw new ConflictException(
        'El límite inferior debe ser menor que el límite superior',
      );
    }

    // Validar que el valor no supere el valor máximo legal
    if (newValue > newValueMaxLaw) {
      throw new ConflictException(
        'El valor de la tarifa no puede superar el valor máximo legal',
      );
    }

    // Verificar que no haya solapamiento de rangos (solo si cambian los límites)
    if (
      newLowerLimit !== insolvencyTariff.lowerLimit ||
      newUpperLimit !== insolvencyTariff.upperLimit
    ) {
      await this.validateRangeOverlap(newLowerLimit, newUpperLimit, id);
    }

    // Actualizar unidad de referencia si se proporciona
    if (updateInsolvencyTariffDto.unitReferenceId !== undefined) {
      if (updateInsolvencyTariffDto.unitReferenceId === null) {
        insolvencyTariff.unitReference = null;
      } else {
        const unitReference = await this.unitReferenceRepo.findOne({
          where: {
            id: updateInsolvencyTariffDto.unitReferenceId,
            tenant: { id: this.tenantId },
          },
        });

        if (!unitReference) {
          throw new NotFoundException('Unidad de referencia no encontrada');
        }

        insolvencyTariff.unitReference = unitReference;
      }
    }

    // Actualizar los campos
    if (updateInsolvencyTariffDto.code) {
      insolvencyTariff.code = updateInsolvencyTariffDto.code;
    }

    if (updateInsolvencyTariffDto.lowerLimit !== undefined) {
      insolvencyTariff.lowerLimit = updateInsolvencyTariffDto.lowerLimit;
    }

    if (updateInsolvencyTariffDto.upperLimit !== undefined) {
      insolvencyTariff.upperLimit = updateInsolvencyTariffDto.upperLimit;
    }

    if (updateInsolvencyTariffDto.value !== undefined) {
      insolvencyTariff.value = updateInsolvencyTariffDto.value;
    }

    if (updateInsolvencyTariffDto.valueMaxLaw !== undefined) {
      insolvencyTariff.valueMaxLaw = updateInsolvencyTariffDto.valueMaxLaw;
    }

    return this.insolvencyTariffRepo.save(insolvencyTariff);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const insolvencyTariff = await this.insolvencyTariffRepo.findOne({
      where: { id, tenant: { id: this.tenantId } },
    });

    if (!insolvencyTariff)
      throw new NotFoundException('Tarifa de insolvencia no encontrada');

    await this.insolvencyTariffRepo.remove(insolvencyTariff);
  }

  // Utility method to check for range overlaps
  private async validateRangeOverlap(
    lowerLimit: number,
    upperLimit: number,
    excludeId?: string,
  ): Promise<void> {
    const query: any = [
      // Case 1: New range contains an existing range
      {
        tenant: { id: this.tenantId }, lowerLimit: Between(lowerLimit, upperLimit),
      },
      // Case 2: New range is within an existing range
      {
        tenant: { id: this.tenantId }, upperLimit: Between(lowerLimit, upperLimit),
      },
      // Case 3: New lower limit is within an existing range
      {
        tenant: { id: this.tenantId },
        lowerLimit: { lowerLimit: lowerLimit },
        upperLimit: { upperLimit: lowerLimit },
      },
      // Case 4: New upper limit is within an existing range
      {
        tenant: { id: this.tenantId },
        lowerLimit: { lowerLimit: upperLimit },
        upperLimit: { upperLimit: upperLimit },
      },
    ];

    // Exclude the current tariff if we're updating
    if (excludeId) {
      query.id = { $ne: excludeId };
    }

    const overlappingTariff = await this.insolvencyTariffRepo.findOne({
      where: query,
    });

    if (overlappingTariff) {
      throw new ConflictException(
        `El rango de límites se solapa con una tarifa existente (${overlappingTariff.code})`,
      );
    }
  }
}
