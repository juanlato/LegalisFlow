import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetInsolvencyTariffsDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Filtrar por código' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'ID de la unidad de referencia para filtrar',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @IsOptional()
  unitReferenceId?: string;

  @ApiProperty({
    required: false,
    enum: ['code', 'lowerLimit', 'upperLimit', 'value'],
    default: 'lowerLimit',
  })
  @IsString()
  @IsIn(['code', 'lowerLimit', 'upperLimit', 'value'])
  @IsOptional()
  sortBy?: string = 'lowerLimit';

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: string = 'ASC';
}
