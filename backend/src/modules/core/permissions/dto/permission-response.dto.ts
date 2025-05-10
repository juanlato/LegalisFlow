import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'cases:create' })
  code: string;

  @ApiProperty({ example: 'Crear nuevos casos legales' })
  description: string;
}
