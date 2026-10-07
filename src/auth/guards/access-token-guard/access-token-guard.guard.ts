import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuardGuard extends AuthGuard('access-token') {

  canActivate(context: ExecutionContext) {
    console.log("GUARD RUNNING");

    return super.canActivate(context);
  }
}