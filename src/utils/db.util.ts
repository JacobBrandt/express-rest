import * as mongoose from "mongoose";
import * as Q from "q";
// This removes warning from mongoose stating their internal promise library
// is deprecated
(<any>mongoose).Promise = require("q").Promise;

import { log } from "../utils/logging";
import { AppConfig } from "../config/app";
import { ServerConfig } from "../config/server";
import { UserModel } from "../models/user.model";

export function dbConnect(): Q.Promise<any> {
  // Only connect if the readyState is 0 (disconnected)
  if (mongoose.connection.readyState === 0) {
    log.info("Attempting connection to database: " + ServerConfig.getDatabaseUrl());
    mongoose.connection.on("disconnected", () => {
      log.warn("Database connection terminated");
    });
    mongoose.connection.on("connected", () => {
      log.info("Database connected");
    });

    return Q.npost(mongoose, "connect", [ServerConfig.getDatabaseUrl()]);
  } else {
    log.debug("Database already connected");
    return Q.resolve(true);
  }
}

export function dbInitialize(): Q.Promise<{}> {
  log.info("Initializing database...");
  return createAdminUser()
    .catch(log.error.bind(console));
}

export function dbDisconnect(): Q.Promise<any> {
  log.info("Disconnecting from database");
  return Q.resolve(mongoose.connection.close());
}

/**
 * Create the admin user if they don't exist
 */
function createAdminUser(): Q.Promise<any> {
  log.debug("Checking for admin user");
  return Q(UserModel.findOne({ email: AppConfig.adminUserEmail }).exec())
    .then((adminUser) => {
      if (adminUser) {
        log.debug("Admin user already exists");
        return Q.resolve(adminUser);
      } else {
        log.info("Admin user does not exist; creating...");
        const newUser = new UserModel({
          email: AppConfig.adminUserEmail,
          display_name: "Admin",
          enabled: true
        });
        return Q(newUser.save());
      }
    });
}
