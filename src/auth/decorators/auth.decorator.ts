import { AuthGuard } from '@nestjs/passport';
import { applyDecorators, UseGuards } from '@nestjs/common';

import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export const Auth = (...roles: ValidRoles[]) => {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
};
