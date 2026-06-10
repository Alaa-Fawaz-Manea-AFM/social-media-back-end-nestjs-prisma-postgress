import {
  ParseUUIDPipe,
  Controller,
  Delete,
  Param,
  Patch,
  Query,
  Post,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { QuerySearchDto } from '../validators/query.dto';
import AuthDecorator from '../decorator/auth.decorator';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import ParamsDto from '../validators/params.dto';
import CurseDto from '../validators/curse.dto';
import { PostService } from './post.service';
import { RequestType } from '../types/type';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @AuthDecorator()
  @Get('home-page')
  getAllPostsAndUsersHomePage(@Query() query: CurseDto, @Req() req: any) {
    return this.postService.getAllPostsAndUsersHomePage(
      query,

      req.user?.userId,
    );
  }

  @AuthDecorator()
  @Get()
  getAllPosts(@Query() query: QuerySearchDto, @Req() req: any) {
    return this.postService.getAllPosts(query, req.user?.userId);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const { userId } = req.user as RequestType;

    return this.postService.createPost(createPostDto, userId);
  }

  @AuthDecorator()
  @Get(':postId/:userId')
  getPost(@Param() ParamsDto: ParamsDto, @Req() req: any) {
    return this.postService.getPost(
      ParamsDto.postId,
      ParamsDto.userId,
      req.user?.userId,
    );
  }

  @Patch(':postId')
  updatePost(
    @Param('postId', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    return this.postService.updatePost(id, req.user.userId, updatePostDto);
  }

  @Delete(':postId')
  deletePost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req) {
    return this.postService.deletePost(postId, req.user.userId);
  }
}
