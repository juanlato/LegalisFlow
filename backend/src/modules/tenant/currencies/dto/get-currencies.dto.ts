import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCurrenciesDto {
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

  @ApiProperty({ required: false, description: 'Filtrar por nombre o código' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    enum: ['name', 'code', 'isCurrencyBase'],
    default: 'name',
  })
  @IsString()
  @IsIn(['name', 'code', 'isCurrencyBase'])
  @IsOptional()
  sortBy?: string = 'name';

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: string = 'ASC';
}
