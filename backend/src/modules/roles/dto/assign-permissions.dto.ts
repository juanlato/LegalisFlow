// src/modules/roles/dto/assign-permissions.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'IDs de los permisos a asignar',
    example: ['permiso1-uuid', 'permiso2-uuid'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissionIds: string[];
}