import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import sendResponsive from '../utils/sendResponsive';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async getLiked(userId: string) {
    const liked = await this.prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        post: {
          select: {
            id: true,
            userId: true,
            caption: true,
            imageUrl: true,
          },
        },
      },
    });
    return sendResponsive(liked, 'Get All Liked Successfully');
  }

  async toggleLike(userId: string, postId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      const wasLiked = !!existingLike;
      const isNowLiked = !wasLiked;

      if (wasLiked) {
        await prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
      } else {
        await prisma.like.create({
          data: {
            userId,
            postId,
          },
        });
      }

      await prisma.post.update({
        where: { id: postId },
        data: {
          likeCounts: {
            increment: isNowLiked ? 1 : -1,
          },
        },
      });

      return sendResponsive(
        isNowLiked,
        `Post ${isNowLiked ? 'liked' : 'unliked'} successfully`,
      );
    });
  }
}
