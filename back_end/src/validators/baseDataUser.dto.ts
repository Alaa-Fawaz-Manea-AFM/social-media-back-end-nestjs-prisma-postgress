import { IsString, MinLength, MaxLength } from 'class-validator';
import EmailAndPassDto from './emailAndpassDto.dto';
import { Trim } from './is-in-set.validator';

export default class BaseDataUserDto extends EmailAndPassDto {
  @Trim()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @Trim()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  userName!: string;

  @Trim()
  @IsString()
  @MaxLength(250)
  bio!: string;
}
