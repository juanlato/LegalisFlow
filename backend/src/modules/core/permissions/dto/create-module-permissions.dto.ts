import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateModulePermissionsDto {
  @ApiProperty({
    example: 'users',
    description: 'Nombre del módulo para el que se crearán los permisos',
  })
  @IsString()
  @IsNotEmpty()
  moduleName: string;
}
