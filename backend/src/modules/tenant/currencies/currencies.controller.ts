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
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { SetBaseCurrencyDto } from './dto/set-base-currency.dto';
import { RolesGuard } from '../../tenant/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../tenant/auth/guards/jwt-auth.guard';
import { Permissions } from '../../tenant/auth/decorators/roles.decorator';
import { Currency } from './entities/currency.entity';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { GetCurrenciesDto } from './dto/get-currencies.dto';

@ApiTags('Currencies')
@ApiHeader({
  name: 'x-tenant-subdomain',
  description: 'Subdominio del tenant',
  required: true,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @Permissions('currencies:create')
  @ApiOperation({ summary: 'Crear una moneda' })
  @ApiBody({ type: CreateCurrencyDto })
  @ApiResponse({
    status: 201,
    type: CurrencyResponseDto,
    description: 'Moneda creada exitosamente',
  })
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @Permissions('currencies:read')
  @ApiOperation({
    summary: 'Listar todas las monedas con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto<Currency>,
  })
  async findAll(@Query() getCurrenciesDto: GetCurrenciesDto) {
    return this.currenciesService.findAll(getCurrenciesDto);
  }

  @Get(':id')
  @Permissions('currencies:read')
  @ApiOperation({ summary: 'Obtener una moneda por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: CurrencyResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('currencies:update')
  @ApiOperation({ summary: 'Actualizar una moneda' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCurrencyDto })
  @ApiResponse({
    status: 200,
    type: CurrencyResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @Permissions('currencies:delete')
  @ApiOperation({ summary: 'Eliminar una moneda' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Moneda eliminada' })
  async remove(@Param('id') id: string) {
    return this.currenciesService.remove(id);
  }

  @Patch(':id/set-base')
  @Permissions('currencies:update')
  @ApiOperation({
    summary: 'Establecer moneda como base',
    description: 'Establece una moneda como moneda base del tenant actual',
  })
  @ApiParam({ name: 'id', description: 'ID de la moneda' })
  @ApiResponse({
    status: 200,
    type: CurrencyResponseDto,
    description: 'Moneda base configurada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Moneda no encontrada' })
  async setAsBaseCurrency(
    @Param('id') id: string
  ) {
    return this.currenciesService.setAsBaseCurrency(id);
  }
}
