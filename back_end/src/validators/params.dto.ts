import { IsUUID } from 'class-validator';

export default class ParamsDto {
  @IsUUID()
  postId!: string;

  @IsUUID()
  userId!: string;
}
