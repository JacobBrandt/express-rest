import * as winston from "winston";

import { LoggingConfig } from "../config/logging";

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(LoggingConfig.getOptions())
  ]
});

export { logger as log };
