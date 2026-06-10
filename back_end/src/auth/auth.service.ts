import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { PayloadTokenType } from '../types/type';
import { PrismaService } from '../prisma.service';
import { CookieOptions, Response } from 'express';
import AppConfig from '../config/app.config';
import sendResponsive from '../utils/sendResponsive';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: AppConfig,
  ) {}

  secureCookieOptions = (): CookieOptions => {
    if (process.env.NODE_ENV === 'development') return {};
    return {
      httpOnly: true,
      secure: this.config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: this.config.COOKIE_MAX_AGE1,
    };
  };

  async signUp(signUpAuthDto: SignUpAuthDto, res: Response) {
    const { email } = signUpAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    return await this.prisma.$transaction(async (prisma) => {
      const hashedPassword = await hash(signUpAuthDto.password, 10);
      const user = await prisma.user.create({
        data: { ...signUpAuthDto, password: hashedPassword },
      });

      const userId = user.id;
      const payload: PayloadTokenType = {
        userId,
      };

      const accessToken = await this.JWTSign(payload);

      res.cookie('accessToken', accessToken, this.secureCookieOptions());
      return sendResponsive(
        {
          id: userId,
          name: user.name,
          userName: user.userName,
          bio: user.bio,
        },
        'Logged in successfully',
      );
    });
  }

  async login(signInAuthDto: SignInAuthDto, res: Response) {
    const { email, password } = signInAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase() },
      select: {
        id: true,
        name: true,
        userName: true,
        bio: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    let { id: userId } = user;
    const payload: PayloadTokenType = {
      userId,
    };

    const accessToken = await this.JWTSign(payload);
    res.cookie('accessToken', accessToken, this.secureCookieOptions());

    return sendResponsive(
      {
        id: userId,
        name: user.name,
        userName: user.userName,
        bio: user.bio,
      },
      'Logged in successfully',
    );
  }

  async logout(res: Response) {
    res.clearCookie('accessToken').clearCookie('refreshToken');
    return sendResponsive(null, 'Logged out successfully');
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        userName: true,
        bio: true,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    return sendResponsive(user, 'User data successfully');
  }

  async getMeProfile(userId: string) {
    const [user, posts] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          userName: true,
          postCounts: true,
          followerCounts: true,
          followingCounts: true,
          bio: true,
        },
      }),
      this.prisma.post.findMany({
        where: { userId },
        select: {
          id: true,
          userId: true,
          imageUrl: true,
          caption: true,
          likeCounts: true,
          likes: {},
        },

        take: 2,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    if (!user) sendResponsive(null, 'User not found');

    return sendResponsive({ user, posts }, 'User data successfully');
  }

  async JWTSign(payload: PayloadTokenType, refresh: boolean = false) {
    return await this.jwtService.signAsync(payload);
  }
}
