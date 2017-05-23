import { Role } from "./role.model";
import { User } from "./user.model";

export interface UserRole {
  role: Role;
  authorized_by: User;
}
