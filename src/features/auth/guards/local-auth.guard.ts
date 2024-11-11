import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        // Check username/email and password
        const result = (await super.canActivate(context)) as boolean;
        // Initialize the session
        await super.logIn(context.switchToHttp().getRequest());
        return result;
    }
}