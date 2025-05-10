import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsEmail } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Bufete López',
    description: 'Nombre legal del bufete',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'lopez',
    description: 'Subdominio único (solo letras minúsculas, números y guiones)',
    pattern: '^[a-z0-9-]+$',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  subdomain: string;

  @ApiProperty({ description: 'Correo del usuario administrador' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ example: 'P@ssw0rd!', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
