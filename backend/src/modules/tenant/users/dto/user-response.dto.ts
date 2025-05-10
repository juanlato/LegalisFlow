import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';

export class UserResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'usuario@bufete.com' })
  email: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: () => Role, isArray: true })
  role: Role;
}
