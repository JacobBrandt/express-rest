import { UserModel } from "../models/user.model";
import { RoleModel } from "../models/role.model";

export class PermissionUtil {
  public static userHasRole(user: UserModel, role: RoleModel) {
    const found = user.roles.forEach((dbRole: RoleModel) => {
      return role.name === dbRole.name;
    });
    return found !== undefined;
  }
}
