import { IsOptional, IsString, IsUUID } from 'class-validator';
import QueryPageDto from './queryPageDto';
import { Transform } from 'class-transformer';
import { Trim } from './is-in-set.validator';

export default class QueryDto {
  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class QuerySearchDto extends QueryPageDto {
  @IsOptional()
  @Trim()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  caption?: string;
}
