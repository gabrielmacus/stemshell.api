import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserSerializer } from '../user/user.serializer';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET!,
      signOptions:{
        expiresIn:process.env.JWT_EXPIRATION!,
        issuer:process.env.JWT_ISSUER,
        audience:process.env.JWT_AUDIENCE
      }
    })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserSerializer
  ],
  controllers: [AuthController]
})
export class AuthModule {}
