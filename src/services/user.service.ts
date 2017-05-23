"use strict";

import * as mongoose from "mongoose";
import * as express from "express";
import { UserModel } from "../models/user.model";
import { UserRole } from "../models/user.role";
import { CrudService } from "./service";

export class UserService extends CrudService<UserModel> {
  public static userPopulateFields() {
    return "display_name email";
  }

  public getModel(): mongoose.Model<UserModel> {
    return UserModel;
  }

  public getRolesOnUser(userid: string, req: any, res: express.Response, next: express.NextFunction) {
    this.getModel().find({ _id: userid }, "permissions")
      .populate("roles.authorized_by", UserService.userPopulateFields())
      .exec((err: any, doc: any) => {
        this.handleResponse(err, doc, res, next);
      });
  }

  public getFullUser(userid: string, req: express.Request, res: express.Response, next: express.NextFunction) {
    this.getModel().findById(userid)
      .populate("roles.authorized_by", UserService.userPopulateFields())
      .exec((err: any, doc: any) => {
        this.handleResponse(err, doc, res, next);
      });
  }

  public saveRolesOnUser(userid: string, req: any, res: express.Response, next: express.NextFunction) {
    req.body.forEach((role: UserRole) => {
      role.authorized_by = req.user._id;
    });
    this.getModel().update({ _id: userid }, { permissions: req.body }, { runValidators: true }, (err: any, doc: any) => {
      this.handleResponse(err, doc, res, next);
    });
  }
}
