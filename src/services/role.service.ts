"use strict";

import * as mongoose from "mongoose";
import * as express from "express";
import { RoleModel } from "../models/role.model";
import { CrudService } from "./service";

export class RoleService extends CrudService<RoleModel> {
  public getModel(): mongoose.Model<RoleModel> {
    return RoleModel;
  }
}
