import { FollowerModule } from './follower/follower.module';
import { PrismaServiceModule } from './prisma.module';
import { HomeController } from './homePage.controller';
import { SavedModule } from './saved/saved.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guard/authGuard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [HomeController],
  imports: [
    PrismaServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    PostModule,
    LikeModule,
    SavedModule,
    FollowerModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
