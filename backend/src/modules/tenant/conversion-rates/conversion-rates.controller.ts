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
import { ConversionRatesService } from './conversion-rates.service';
import { CreateConversionRateDto } from './dto/create-conversion-rate.dto';
import { UpdateConversionRateDto } from './dto/update-conversion-rate.dto';
import { ConversionRateResponseDto } from './dto/conversion-rate-response.dto';
import { Permissions } from '../../tenant/auth/decorators/roles.decorator';
import { ConversionRate } from './entities/conversion-rate.entity';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { GetConversionRatesDto } from './dto/get-conversion-rates.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Conversion Rates')
@ApiHeader({
  name: 'x-tenant-subdomain',
  description: 'Subdominio del tenant',
  required: true,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conversion-rates')
export class ConversionRatesController {
  constructor(
    private readonly conversionRatesService: ConversionRatesService,
  ) {}

  @Post()
  @Permissions('conversion-rates:create')
  @ApiOperation({ summary: 'Crear una tasa de conversión' })
  @ApiBody({ type: CreateConversionRateDto })
  @ApiResponse({
    status: 201,
    type: ConversionRateResponseDto,
    description: 'Tasa de conversión creada exitosamente',
  })
  async create(@Body() createConversionRateDto: CreateConversionRateDto) {
    return this.conversionRatesService.create(createConversionRateDto);
  }

  @Get()
  @Permissions('conversion-rates:read')
  @ApiOperation({
    summary: 'Listar todas las tasas de conversión con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto<ConversionRate>,
  })
  async findAll(@Query() getConversionRatesDto: GetConversionRatesDto) {
    return this.conversionRatesService.findAll(getConversionRatesDto);
  }

  @Get(':id')
  @Permissions('conversion-rates:read')
  @ApiOperation({ summary: 'Obtener una tasa de conversión por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: ConversionRateResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.conversionRatesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('conversion-rates:update')
  @ApiOperation({ summary: 'Actualizar una tasa de conversión' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateConversionRateDto })
  @ApiResponse({
    status: 200,
    type: ConversionRateResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateConversionRateDto: UpdateConversionRateDto,
  ) {
    return this.conversionRatesService.update(id, updateConversionRateDto);
  }

  @Delete(':id')
  @Permissions('conversion-rates:delete')
  @ApiOperation({ summary: 'Eliminar una tasa de conversión' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Tasa de conversión eliminada' })
  async remove(@Param('id') id: string) {
    return this.conversionRatesService.remove(id);
  }
}
