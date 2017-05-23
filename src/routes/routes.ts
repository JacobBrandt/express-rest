"use strict";

import * as express from "express";
import * as mongoose from "mongoose";

import * as rmw from "./route.middleware";
import { CrudService } from "../services/service";

export abstract class CrudRoutes<T extends CrudService<S>, S extends mongoose.Document> {
  protected service: T;
  constructor(app: express.Application) {
    this.config(app);
    this.service = this.getService();
  }

  protected config(app: express.Application): void {
    app.route("/" + this.getApiName())
      .get(this.canGetAll(), (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.service.all(req, res, next);
      })
      .post(this.canCreate(), (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.service.create(req, res, next, req.body as S);
      });
    app.route("/" + this.getApiName() + "/:id")
      .get(this.canGet(), (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.service.read(req, res, next, req.params.id);
      })
      .put(this.canUpdate(), (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.service.update(req, res, next, req.params.id, req.body as S);
      })
      .delete(this.canDelete(), (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.service.delete(req, res, next, req.params.id);
      });
  }

  // Default behaviour for all middleware CRUD routes is to be authenticated.  Override as you need.
  protected canGetAll(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    return [rmw.authenticated()];
  }
  protected canGet(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    return [rmw.authenticated()];
  }
  protected canCreate(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    return [rmw.authenticated()];
  }
  protected canUpdate(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    return [rmw.authenticated()];
  }
  protected canDelete(): ((req: any, res: express.Response, next: express.NextFunction) => void)[] {
    return [rmw.authenticated()];
  }

  protected abstract getApiName(): string;
  protected abstract getService(): T;

}
