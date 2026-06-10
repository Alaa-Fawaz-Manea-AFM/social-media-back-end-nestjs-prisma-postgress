import AppConfigModule from '../config/config.module';
import { AuthController } from './auth.controller';
import AppConfig from '../config/app.config';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AppConfigModule,

    JwtModule.registerAsync({
      global: true,
      imports: [AppConfigModule],
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.jwtExpiresIn as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
