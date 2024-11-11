import { Controller, Get, HttpCode, Post, Request, Res, Session, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as RequestType, response, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import * as session from 'express-session';
import { SessionAuthGuard } from './guards/session-auth.guard';
import passport from 'passport';

@Controller('auth')
export class AuthController {
    constructor(
        protected authService:AuthService
    ){}

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Request() req: RequestType,
        //@Res({passthrough:true}) res:Response,
        @Session() session: any
    )
    {
        return session.passport.user;
    }
    
    @UseGuards(SessionAuthGuard)
    @Get('user')
    async getUser(
        @Session() session: any
    ){
     return  session.passport.user;
    }

}
