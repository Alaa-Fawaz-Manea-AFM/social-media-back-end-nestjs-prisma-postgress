import QueryPageDto from '../validators/queryPageDto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import sendResponsive from '../utils/sendResponsive';

export const optionLikeAndSaved = (currentUserId?: string) => {
  return currentUserId
    ? {
        likes: {
          where: {
            userId: currentUserId,
          },
          select: {
            id: true,
          },
          take: 1,
        },
        saved: {
          where: {
            userId: currentUserId,
          },
          select: {
            id: true,
          },
          take: 1,
        },
      }
    : {};
};

export const followOption = (userId?: string) =>
  userId && {
    following: {
      where: { OR: [{ followerId: userId }, { followingId: userId }] },
      select: {
        id: true,
      },
    },
  };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(targetUserId: string, currentUserId?: string) {
    const [user, follow, posts] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: targetUserId },
        omit: { email: true, password: true, updatedAt: true },
      }),
      !currentUserId
        ? false
        : this.prisma.follower.findUnique({
            where: {
              followingId_followerId: {
                followerId: currentUserId,
                followingId: targetUserId,
              },
            },
            select: { id: true },
          }),

      this.prisma.post.findMany({
        where: { userId: targetUserId },
        take: 10,
        select: {
          id: true,
          imageUrl: true,
          likeCounts: true,
          ...optionLikeAndSaved(currentUserId),
        },
      }),
    ]);
    const isFollow = !!follow;

    return sendResponsive(
      {
        user: {
          ...user,
          isFollow,
        },
        posts: posts.map((post) => {
          const { likes = [], saved = [], ...reset } = post;
          return {
            ...reset,
            isLiked: likes?.length > 0,
            isSaved: saved?.length > 0,
          };
        }),
      },
      'User retrieved successfully',
    );
  }

  async getAllUsers(query: QueryPageDto, userId?: string) {
    const { limit = 3, page = 1 } = query;

    const skip = (page - 1) * limit;

    const where = userId
      ? {
          id: {
            not: userId,
          },
        }
      : {};

    const [users, totalPage] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          userName: true,

          ...followOption(userId),
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return sendResponsive(
      {
        meta: {
          limit,
          totalPage: Math.ceil(totalPage / limit),
        },
        users: users.map((user) => {
          const { following = [], ...reset } = user;
          return {
            ...reset,
            isFollow: following.length > 0,
          };
        }),
      },
      'Get All Users successfully',
    );
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const data = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );

    await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true },
    });

    return sendResponsive(null, 'User updated successfully');
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return sendResponsive(null, 'User deleted successfully');
  }
}
