import { ApiProperty } from '@nestjs/swagger';

export class TenantResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'Bufete López' })
  name: string;

  @ApiProperty({ example: 'lopez' })
  subdomain: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}
