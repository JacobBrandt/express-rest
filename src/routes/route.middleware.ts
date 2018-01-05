import * as express from "express";
import { PermissionUtil } from "../utils/permission.util";
const config = require("config");

export function authenticate(): (req: any, res: express.Response, next: express.NextFunction) => void {
  return function (req: any, res: express.Response, next: express.NextFunction) {
    // Place authentication logic here
    req.user = {name: "Admin", roles: [{name: "admin"}]};
    next();
  };
}

export function authenticated(): (req: any, res: express.Response, next: express.NextFunction) => void {
  return function(req: any, res: express.Response, next: express.NextFunction) {
    if (req.user) {
      return next();
    }
    res.redirect(config.unauthorizedUrl);
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
