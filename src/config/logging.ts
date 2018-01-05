"use strict";

const config = require("config");

class LoggingConfiguration {
  private static config: LoggingConfiguration;

  public static getConfig(): LoggingConfiguration {
    if (!this.config) {
      this.config = new LoggingConfiguration();
    }
    return this.config;
  }

  constructor() { }

  public getOptions(): Object {
    let loggingLevel = "debug";
    if (process.env.NODE_ENV === "production") {
      loggingLevel = "info";
    }
    if (process.env.EXPRESS_LOG_LEVEL !== undefined && process.env.EXPRESS_LOG_LEVEL !== "") {
      loggingLevel = process.env.EXPRESS_LOG_LEVEL;
    }

    return {
      "timestamp": true,
      "colorize": true,
      "level": config.loggingLevel
    };
  }
}

const loggingConfig: LoggingConfiguration = LoggingConfiguration.getConfig();

export { loggingConfig as LoggingConfig };
