import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { User } from './../../entities/user.entity';
import { META_ROLES } from './../../decorators/role-protected.decorator';
import { ValidRoles } from './../../interfaces/valid-roles.interface';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: ValidRoles[] = this.reflector.get<ValidRoles[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req: Request = context.switchToHttp().getRequest();
    const user = req['user'] as User;

    if (!user) throw new BadRequestException('User not found');

    const hasRole = user.roles.some((role) =>
      validRoles.includes(role as ValidRoles),
    );

    if (hasRole) return true;

    throw new ForbiddenException(
      `User '${user.userName}' need a valid role [${validRoles.join(', ')}]`,
    );
  }
}
