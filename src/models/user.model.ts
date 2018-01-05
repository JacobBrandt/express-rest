"use strict";

import * as mongoose from "mongoose";
import * as Q from "q";

import { log } from "../utils/logging";
import { Role } from "./role.model";

interface User {
  email: string;
  display_name: string;
  enabled: boolean;
  local?: {
    password: string
  };
  google?: {
    id: string,
    token: string
  };
  roles: Role[];
}

interface UserModel extends User, mongoose.Document { }

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  display_name: {
    type: String,
    required: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Roles
  roles: [{
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    },
    authorized_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }]
});

const UserModel: mongoose.Model<UserModel> = mongoose.model<UserModel>("User", userSchema);

export { UserModel, User };
