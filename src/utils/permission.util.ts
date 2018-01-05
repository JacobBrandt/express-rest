import { UserModel } from "../models/user.model";
import { RoleModel } from "../models/role.model";

export class PermissionUtil {
  public static userHasRole(user: UserModel, role: string) {
    const found = user.roles.find((dbRole: RoleModel) => {
      return role === dbRole.name;
    });
    return found !== undefined;
  }
}
