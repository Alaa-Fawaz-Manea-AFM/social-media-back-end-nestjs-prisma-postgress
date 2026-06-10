import QueryPageDto from '../validators/queryPageDto';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import sendResponsive from '../utils/sendResponsive';

@Injectable()
export class SavedService {
  constructor(private readonly prisma: PrismaService) {}

  async getSaved(query: QueryPageDto, userId: string) {
    const { page = 1, limit = 9 } = query;
    const skip = (page - 1) * limit;
    const where = {
      userId,
    };

    const [saved, totalPage] = await Promise.all([
      await this.prisma.saved.findMany({
        where,
        take: limit,
        skip,
        select: {
          post: {
            select: {
              id: true,
              userId: true,
              caption: true,
              imageUrl: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      await this.prisma.saved.count({
        where,
      }),
    ]);

    return sendResponsive(
      {
        meta: {
          totalPage: Math.ceil(totalPage / limit),
        },
        saved,
      },
      'Get All Saved Suuccessfully',
    );
  }

  async toggleSaved(userId: string, postId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existingSaved = await prisma.saved.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      const wasSaved = !!existingSaved;
      const isNowSaved = !wasSaved;

      if (wasSaved) {
        await prisma.saved.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
      } else {
        await prisma.saved.create({
          data: {
            userId,
            postId,
          },
        });
      }

      return sendResponsive(
        isNowSaved,
        `Post ${isNowSaved ? 'saved' : 'unSaved'} successfully`,
      );
    });
  }
}
