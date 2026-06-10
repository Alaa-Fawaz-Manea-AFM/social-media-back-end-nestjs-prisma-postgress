import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import sendResponsive from '../utils/sendResponsive';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async toggleFollowUser(currentUserId: string, targetUserId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
      });

      if (!targetUser) throw new NotFoundException('User not found');

      const existingFollow = await prisma.follower.findUnique({
        where: {
          followingId_followerId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });

      const wasFollowing = !!existingFollow;
      const isNowFollowing = !wasFollowing;

      if (wasFollowing) {
        await prisma.follower.delete({
          where: {
            followingId_followerId: {
              followerId: currentUserId,
              followingId: targetUserId,
            },
          },
        });
      } else {
        await prisma.follower.create({
          data: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        });
      }

      await Promise.all([
        prisma.user.update({
          where: { id: targetUserId },
          data: {
            followerCounts: {
              increment: isNowFollowing ? 1 : -1,
            },
          },
        }),
        prisma.user.update({
          where: { id: currentUserId },
          data: {
            followingCounts: {
              increment: isNowFollowing ? 1 : -1,
            },
          },
        }),
      ]);

      return sendResponsive(
        isNowFollowing,
        `User ${isNowFollowing ? 'followed' : 'unfollowed'} successfully`,
      );
    });
  }
}
