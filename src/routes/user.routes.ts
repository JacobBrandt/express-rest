"use strict";

import * as express from "express";

import { CrudRoutes } from "./routes";
import { UserService } from "../services/user.service";
import { UserModel } from "../models/user.model";
import { PermissionUtil } from "../utils/permission.util";
import { UserRoleType } from "../models/role.model";
import * as rmw from "./route.middleware";

export class UserRoutes extends CrudRoutes<UserService, UserModel> {
  protected getApiName(): string {
    return "users";
  }

  protected getService(): UserService {
    return new UserService();
  }

  protected config(app: express.Application): void {
    super.config(app);

    // User roles
    app.route("/" + this.getApiName() + "/roles/:userid")
      .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.getService().getRolesOnUser(req.params.userid, req, res, next);
      })
      .put((req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.getService().saveRolesOnUser(req.params.userid, req, res, next);
      });

    // Get the user object with references resolved
    app.route("/" + this.getApiName() + "/full/:userid")
      .get((req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.getService().getFullUser(req.params.userid, req, res, next);
      });
  }

  protected canGetAll(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    return [rmw.requireRole(UserRoleType.Admin)];
  }

  protected canCreate(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    // User creation is done through the authorization routes.  Don't allow posts into this collection.
    return [rmw.notImplemented("User creation")];
  }
}
