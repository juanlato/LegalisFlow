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
import { UnitsReferenceService } from './units-reference.service';
import { CreateUnitReferenceDto } from './dto/create-unit-reference.dto';
import { UpdateUnitReferenceDto } from './dto/update-unit-reference.dto';
import { UnitReferenceResponseDto } from './dto/unit-reference-response.dto';
import { RolesGuard } from '../../tenant/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../tenant/auth/guards/jwt-auth.guard';
import { Permissions } from '../../tenant/auth/decorators/roles.decorator';
import { UnitReference } from './entities/unit-reference.entity';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { GetUnitsReferenceDto } from './dto/get-units-reference.dto';

@ApiTags('Units Reference')
@ApiHeader({
  name: 'x-tenant-subdomain',
  description: 'Subdominio del tenant',
  required: true,
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units-reference')
export class UnitsReferenceController {
  constructor(private readonly unitsReferenceService: UnitsReferenceService) {}

  @Post()
  @Permissions('units-reference:create')
  @ApiOperation({ summary: 'Crear una unidad de referencia' })
  @ApiBody({ type: CreateUnitReferenceDto })
  @ApiResponse({
    status: 201,
    type: UnitReferenceResponseDto,
    description: 'Unidad de referencia creada exitosamente',
  })
  async create(@Body() createUnitReferenceDto: CreateUnitReferenceDto) {
    return this.unitsReferenceService.create(createUnitReferenceDto);
  }

  @Get()
  @Permissions('units-reference:read')
  @ApiOperation({
    summary: 'Listar todas las unidades de referencia con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto<UnitReference>,
  })
  async findAll(@Query() getUnitsReferenceDto: GetUnitsReferenceDto) {
    return this.unitsReferenceService.findAll(getUnitsReferenceDto);
  }

  @Get(':id')
  @Permissions('units-reference:read')
  @ApiOperation({ summary: 'Obtener una unidad de referencia por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: UnitReferenceResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.unitsReferenceService.findOne(id);
  }

  @Patch(':id')
  @Permissions('units-reference:update')
  @ApiOperation({ summary: 'Actualizar una unidad de referencia' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUnitReferenceDto })
  @ApiResponse({
    status: 200,
    type: UnitReferenceResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUnitReferenceDto: UpdateUnitReferenceDto,
  ) {
    return this.unitsReferenceService.update(id, updateUnitReferenceDto);
  }

  @Delete(':id')
  @Permissions('units-reference:delete')
  @ApiOperation({ summary: 'Eliminar una unidad de referencia' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Unidad de referencia eliminada' })
  async remove(@Param('id') id: string) {
    return this.unitsReferenceService.remove(id);
  }
}
