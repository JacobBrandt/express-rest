"use strict";

const config = require("config");

class ServerConfiguration {
  private static config: ServerConfiguration;

  private databaseUrl: string;
  private serverPort: number;

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
    this.databaseUrl = config.mongo.uri + "/" + config.mongo.database;
  }

  private configureServerPort(): void {
    this.serverPort = config.mongo.port;
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
