"use strict";

import * as mongoose from "mongoose";

interface Role {
  name: string;
  description: string;
}

enum UserRoleType {
  Admin = <any>"admin",
  User = <any>"user",
}

interface RoleModel extends Role, mongoose.Document { }

const RoleSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const RoleModel: mongoose.Model<RoleModel> = mongoose.model<RoleModel>("Role", RoleSchema);

export { RoleModel, Role, UserRoleType };
