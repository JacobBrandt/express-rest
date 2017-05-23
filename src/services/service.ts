"use strict";
import * as mongoose from "mongoose";
import * as express from "express";

import { log } from "../utils/logging";

export abstract class CrudService<T extends mongoose.Document> {
    public create(req: express.Request, res: express.Response, next: express.NextFunction, doc: T) {
      this.getModel().create(doc, (err: any, resDoc: T) => {
        this.handleResponse(err, resDoc, res, next);
      });
    }
    public read(req: express.Request, res: express.Response, next: express.NextFunction, id: any) {
      this.getModel().findById(id, (err: any, resDoc: T) => {
        this.handleResponse(err, resDoc, res, next);
      });
    }
    public update(req: express.Request, res: express.Response, next: express.NextFunction, id: number, doc: T) {
      // For security reasons make sure id is not changing
      delete doc._id;
      // Pass option new: true to get the updated record back
      this.getModel().findByIdAndUpdate(id, doc, { new: true }, (err: any, resDoc: T) => {
        this.handleResponse(err, resDoc, res, next);
      });
    }
    public delete(req: express.Request, res: express.Response, next: express.NextFunction, id: number) {
      this.getModel().findByIdAndRemove(id, (err: any, resDoc: T) => {
        this.handleResponse(err, resDoc, res, next);
      });
    }
    public all(req: express.Request, res: express.Response, next: express.NextFunction) {
      this.getModel().find({}, (err: any, docs: T[]) => {
        this.handleError(err, res, next);
        res.jsonp(docs);
      });
    }

    protected handleResponse(err: any, doc: any, res: express.Response, next: express.NextFunction) {
      if (err) {
        return next(err);
      } else if (doc === null) {
        res.status(404).send();
      } else {
        res.status(200);
        if (doc) {
          res.jsonp(doc);
        } else {
          res.send();
        }
      }
    }

    private handleError(err: any, res: express.Response, next: express.NextFunction) {
      if (err) {
        next(err);
      }
      res.status(200);
    }
    public abstract getModel(): mongoose.Model<T>;
}
