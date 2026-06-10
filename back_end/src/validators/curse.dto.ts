import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export default class CurseDto {
  @IsOptional()
  @IsUUID()
  curseId?: string;

  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'limit must be an integer' })
  @Min(1)
  @Max(100)
  limit?: number;
}
