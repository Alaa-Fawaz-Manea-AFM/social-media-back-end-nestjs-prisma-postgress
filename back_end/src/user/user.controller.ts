import {
  Req,
  Get,
  Body,
  Patch,
  Query,
  Delete,
  Param,
  Controller,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import AuthDecorator from '../decorator/auth.decorator';
import QueryPageDto from '../validators/queryPageDto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @AuthDecorator()
  @Get('')
  getAllUsers(@Query() query: QueryPageDto, @Req() req: any) {
    return this.usersService.getAllUsers(query, req.user?.userId);
  }

  @AuthDecorator()
  @Get(':userId')
  getUser(
    @Param('userId', ParseUUIDPipe) targetUserId: string,
    @Req()
    req: any,
  ) {
    return this.usersService.getUserById(targetUserId, req.user?.userId);
  }

  @Patch(':userId')
  updateUserTeacher(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (req.user?.userId !== userId)
      throw new BadRequestException('something wrong');

    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseUUIDPipe) userId: string, @Req() req) {
    if (req.user.userId !== userId)
      throw new BadRequestException('You can not delete other user');
    return this.usersService.deleteUser(req.user.userId);
  }
}
