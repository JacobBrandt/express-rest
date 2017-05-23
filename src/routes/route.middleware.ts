import * as express from "express";
import { PermissionUtil } from "../utils/permission.util";

export function authenticated(): (req: any, res: express.Response, next: express.NextFunction) => void {
  return function(req: any, res: express.Response, next: express.NextFunction) {
    // TODO: Add your authentication logic here
    return next();
  };
}

export function notImplemented(action: string): (req: any, res: express.Response, next: express.NextFunction) => void {
  return function(req: any, res: express.Response, next: express.NextFunction) {
    next(new Error(action + " not implemented"));
  };
}

export function requireRole(role: any): (req: any, res: express.Response, next: express.NextFunction) => void {
  return function (req: any, res: express.Response, next: express.NextFunction) {
    if (PermissionUtil.userHasRole(req.user, role)) {
      return next();
    }
    return next(new Error(req.user.name + " does not have permission " + role));
  };
}
