import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum.js';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    console.log('Role Guard id Running');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    console.log('requiredRoles : ', requiredRoles);
    console.log('userRole', user.role);

    if (!requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('Forbbiden Request');
    }

    return true;
  }
}
