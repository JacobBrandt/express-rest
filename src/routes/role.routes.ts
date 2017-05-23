"use strict";

import { CrudRoutes } from "./routes";
import { RoleService } from "../services/role.service";
import { RoleModel, UserRoleType } from "../models/role.model";
import { PermissionUtil } from "../utils/permission.util";

import * as rmw from "./route.middleware";

import * as express from "express";

export class RoleRoutes extends CrudRoutes<RoleService, RoleModel> {
  protected getApiName(): string {
    return "roles";
  }

  protected getService(): RoleService {
    return new RoleService();
  }

  protected config(app: express.Application) {
    super.config(app);
  }

  protected canUpdate() {
    return [rmw.requireRole(UserRoleType.Admin)];
  }

  protected canCreate() {
    return [rmw.notImplemented("Creating roles")];
  }

  protected canDelete() {
    return [rmw.notImplemented("Deleting roles")];
  }
}
