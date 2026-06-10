import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QuerySearchDto } from '../validators/query.dto';
import { optionLikeAndSaved } from '../user/user.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaService } from '../prisma.service';
import cloudinary from '../cloudinary/cloudinary';
import CurseDto from '../validators/curse.dto';
import sendResponsive from '../utils/sendResponsive';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(postId: string, postUserId: string, userId?: string) {
    const take = 6;
    const [post, posts] = await Promise.all([
      this.prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          userId: true,
          caption: true,
          imageUrl: true,
          public_id: true,
          likeCounts: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              userName: true,
            },
          },
          ...optionLikeAndSaved(userId),
        },
      }),
      this.prisma.post.findMany({
        where: { userId: postUserId, NOT: { id: postId } },
        take,
        select: {
          id: true,
          userId: true,
          caption: true,
          imageUrl: true,
          likeCounts: true,
          ...optionLikeAndSaved(userId),
        },
      }),
    ]);

    if (!post) throw new NotFoundException('Post not found');
    const { likes = [], saved = [], ...reset } = post;
    return sendResponsive(
      {
        post: {
          ...reset,
          isLiked: likes.length > 0,
          isSaved: saved.length > 0,
        },
        posts: posts.map((post) => {
          const { likes = [], saved = [], ...resetPosts } = post;
          return {
            ...resetPosts,
            isLiked: likes.length > 0,
            isSaved: saved.length > 0,
          };
        }),
      },
      'Post retrieved successfully',
    );
  }

  async getAllPostsAndUsersHomePage(query: CurseDto, currentUserId?: string) {
    const { curseId, targetUserId, limit = 3 } = query;

    const where = targetUserId
      ? {
          id: targetUserId,
        }
      : {};

    const posts = await this.prisma.post.findMany({
      where,
      take: limit,
      ...(curseId && {
        cursor: { id: curseId },
        skip: 1,
      }),

      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        caption: true,
        imageUrl: true,
        likeCounts: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            userName: true,
          },
        },
        ...optionLikeAndSaved(currentUserId),
      },
    });

    return sendResponsive(
      {
        meta: {
          curseId: posts[posts?.length - 1]?.id || null,
        },
        posts: posts.map((post) => {
          const { likes = [], saved = [], ...reset } = post;
          return {
            ...reset,
            isLiked: likes.length > 0,
            isSaved: saved.length > 0,
          };
        }),
      },
      'Posts retrieved successfully',
    );
  }

  async getAllPosts(query: QuerySearchDto, userId?: string) {
    const { page = 1, limit = 3, caption } = query;

    const where = caption
      ? {
          caption: {
            contains: caption,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [posts, totalPage] = await Promise.all([
      this.prisma.post.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          caption: true,
          imageUrl: true,
          likeCounts: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              userName: true,
            },
          },
          ...optionLikeAndSaved(userId),
        },
      }),
      this.prisma.post.count({
        where,
      }),
    ]);

    return sendResponsive(
      {
        meta: {
          totalPage: Math.ceil(totalPage / limit),
        },
        posts: posts.map((post) => {
          const { likes = [], saved = [], ...reset } = post;
          return {
            ...reset,
            isLiked: likes.length > 0,
            isSaved: saved.length > 0,
          };
        }),
      },
      'Posts retrieved successfully',
    );
  }

  async createPost(dataPostsDto: CreatePostDto, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const [newPost] = await Promise.all([
        prisma.post.create({
          data: {
            ...dataPostsDto,
            userId,
          },
        }),

        prisma.user.update({
          where: { id: userId },
          data: {
            postCounts: { increment: 1 },
          },
        }),
      ]);

      return sendResponsive(newPost, 'Post created successfully');
    });
  }

  async updatePost(postId: string, userId: string, data: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id_userId: {
          id: postId,
          userId,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (data.imageUrl && data.public_id) {
      if (post.public_id) {
        try {
          await cloudinary.uploader.destroy(post.public_id);
        } catch {
          throw new InternalServerErrorException('something wrong');
        }
      }
      data.imageUrl = data.imageUrl;
      data.public_id = data.public_id;
    }

    await this.prisma.post.update({
      where: {
        id_userId: {
          id: postId,
          userId,
        },
      },
      data,
    });

    return sendResponsive(null, 'Post updated successfully');
  }

  async deletePost(postId: string, userId: string) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const deletedPost = await prisma.post.delete({
        where: {
          id_userId: { id: postId, userId },
        },
        select: {
          public_id: true,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          postCounts: { decrement: 1 },
        },
      });

      return deletedPost;
    });

    if (result?.public_id) {
      cloudinary.uploader.destroy(result.public_id).catch((err) => {
        console.error('Cloudinary delete failed:', err);
      });
    }

    return sendResponsive(null, 'Post deleted successfully');
  }
}
