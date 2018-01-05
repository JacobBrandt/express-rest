import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as Q from "q";
import * as cors from "cors";

import { log } from "./utils/logging";
import { dbConnect, dbInitialize, dbDisconnect } from "./utils/db.util";
import { ServerConfig } from "./config/server";
import { RoleRoutes } from "./routes/role.routes";
import { UserRoutes } from "./routes/user.routes";
import * as rmw from "./routes/route.middleware";

class Server {
  public app: express.Application;
  private server: http.Server;
  private shuttingDown: boolean = false;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(rmw.authenticate());
    const router = express.Router();
    // placeholder route handler
    router.get("/", (req, res, next) => {
      res.json({
        message: "Hello World!"
      });
    });
    this.app.use("/", router);
  }

  public initialize(): Q.Promise<any> {
    return this.routes().then((routesResult) => {
      return this.config();
    });
  }

  private config(): Q.Promise<{}> {
    return dbConnect()
      .then((connectionResult) => {
        return dbInitialize();
      })
      .then((dbInitResult) => {
        return Q(this.server = this.app.listen(ServerConfig.getServerPort(), () => {
          log.info("Server up and awaiting requests...");
        }));
      })
      .then((listenResult) => {
        return Q(process.on("SIGINT", () => {
          this.shutdown();
        }));
      })
      .then((sigintResult) => {
        return Q(process.on("SIGTERM", () => {
          this.shutdown();
        }));
      })
      .then((sigtermResult) => {
        return Q(process.on("exit", () => {
          this.shutdown();
        }));
      })
      .catch(log.error.bind(console));
  }

  public shutdown(): void {
    if (!this.shuttingDown) {
      this.shuttingDown = true;
      log.info("Shutting down server...");
      if (this.server !== undefined) {
        this.server.close(() => {
          dbDisconnect();
          process.exit(0);
        });
      }
    }
  }

  private routes(): Q.Promise<{}> {
    // Allow Cross origin resource sharing
    return Q(this.app.use(cors()))
      // .then((corsResult) => {
      //   return Q(this.app.use(cors()));
      // })
      .then((corsResult) => {
        return Q(new UserRoutes(this.app));
      })
      .then((userResult) => {
        return Q(new RoleRoutes(this.app));
      })
      .then((roleRoutes) => {
        return Q(this.app.use(this.errorHandler));
      })
      .catch(log.error.bind(console));
  }

  private errorHandler(err: any, req: any, res: express.Response, next: express.NextFunction) {
    log.error(err);
    res.status(500).jsonp({message: String(err)});
  }
}

log.info("Starting server...");
const server: Server = new Server();
server.initialize();
export = server;
