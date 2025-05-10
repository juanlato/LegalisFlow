import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'abogado@bufete.com',
      role: 'LAWYER',
    },
    description: 'User information',
  })
  user: {
    id: string;
    email: string;
    role: string;
  };
}
