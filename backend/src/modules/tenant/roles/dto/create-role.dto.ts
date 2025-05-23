import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Asistente Legal', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: [
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    ],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}
