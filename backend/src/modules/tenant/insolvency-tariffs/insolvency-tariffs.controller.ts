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
import { InsolvencyTariffsService } from './insolvency-tariffs.service';
import { CreateInsolvencyTariffDto } from './dto/create-insolvency-tariff.dto';
import { UpdateInsolvencyTariffDto } from './dto/update-insolvency-tariff.dto';
import { InsolvencyTariffResponseDto } from './dto/insolvency-tariff-response.dto';
import { RolesGuard } from '../../tenant/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../tenant/auth/guards/jwt-auth.guard';
import { Permissions } from '../../tenant/auth/decorators/roles.decorator';
import { InsolvencyTariff } from './entities/insolvency-tariff.entity';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { GetInsolvencyTariffsDto } from './dto/get-insolvency-tariffs.dto';

@ApiTags('Insolvency Tariffs')
@ApiHeader({
  name: 'x-tenant-subdomain',
  description: 'Subdominio del tenant',
  required: true,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('insolvency-tariffs')
export class InsolvencyTariffsController {
  constructor(
    private readonly insolvencyTariffsService: InsolvencyTariffsService,
  ) {}

  @Post()
  @Permissions('insolvency-tariffs:create')
  @ApiOperation({ summary: 'Crear una tarifa de insolvencia' })
  @ApiBody({ type: CreateInsolvencyTariffDto })
  @ApiResponse({
    status: 201,
    type: InsolvencyTariffResponseDto,
    description: 'Tarifa de insolvencia creada exitosamente',
  })
  async create(@Body() createInsolvencyTariffDto: CreateInsolvencyTariffDto) {
    return this.insolvencyTariffsService.create(createInsolvencyTariffDto);
  }

  @Get()
  @Permissions('insolvency-tariffs:read')
  @ApiOperation({
    summary: 'Listar todas las tarifas de insolvencia con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto<InsolvencyTariff>,
  })
  async findAll(@Query() getInsolvencyTariffsDto: GetInsolvencyTariffsDto) {
    return this.insolvencyTariffsService.findAll(getInsolvencyTariffsDto);
  }

  @Get(':id')
  @Permissions('insolvency-tariffs:read')
  @ApiOperation({ summary: 'Obtener una tarifa de insolvencia por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: InsolvencyTariffResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.insolvencyTariffsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('insolvency-tariffs:update')
  @ApiOperation({ summary: 'Actualizar una tarifa de insolvencia' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateInsolvencyTariffDto })
  @ApiResponse({
    status: 200,
    type: InsolvencyTariffResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateInsolvencyTariffDto: UpdateInsolvencyTariffDto,
  ) {
    return this.insolvencyTariffsService.update(id, updateInsolvencyTariffDto);
  }

  @Delete(':id')
  @Permissions('insolvency-tariffs:delete')
  @ApiOperation({ summary: 'Eliminar una tarifa de insolvencia' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Tarifa de insolvencia eliminada' })
  async remove(@Param('id') id: string) {
    return this.insolvencyTariffsService.remove(id);
  }
}
