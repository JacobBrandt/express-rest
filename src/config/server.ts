"use strict";

class ServerConfiguration {
  private static config: ServerConfiguration;

  private databaseUrl: string;
  private serverPort: number;
  // Name of Mongo Database.  This is typically your application name.
  private mongoDb: string = "express";

  public static getConfig(): ServerConfiguration {
    if (!this.config) {
      this.config = new ServerConfiguration();
    }
    return this.config;
  }

  constructor() {
    this.configureDatabaseUrl();
    this.configureServerPort();
  }

  private configureDatabaseUrl(): void {
    let connectionString: string = "";
    if (process.env.MONGODB_DEV_PORT) {
      connectionString = process.env.MONGODB_DEV_PORT.replace(/\w+:\/\//, "mongodb://");
      connectionString += "/";
    } else {
      connectionString = "mongodb://mongo:27017/";
    }
    if (process.env.NODE_ENV === "production") {
      connectionString += this.mongoDb;
    } else if (process.env.NODE_ENV === "test") {
      connectionString = "mongodb://localhost:27017/" + this.mongoDb + "_test";
    } else {
      connectionString += this.mongoDb + "_dev";
    }
    this.databaseUrl = connectionString;
  }

  private configureServerPort(): void {
    this.serverPort = 5000;
  }

  public getDatabaseUrl(): string {
    return this.databaseUrl;
  }

  public getServerPort(): number {
    return this.serverPort;
  }
}

const serverConfig: ServerConfiguration = ServerConfiguration.getConfig();

export { serverConfig as ServerConfig };
