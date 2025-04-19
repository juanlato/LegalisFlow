import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'cases:delete', required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z-]+:[a-z-]+$/, { 
    message: 'Formato inválido. Usa "resource:action" (ej: cases:read)',
  })
  code: string;

  @ApiProperty({ example: 'Permite eliminar casos legales', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;
}