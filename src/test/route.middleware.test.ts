import * as mocha from "mocha";
import * as chai from "chai";
import * as express from "express";

const expect = chai.expect;
import * as rmw from "../routes/route.middleware";
const config = require("config");
import { UserModel } from "../models/user.model";

class MockExpectResponse {
  expectedRedirect: string;
  constructor() {
  }

  setExpectedRedirect(redirect: string) {
    this.expectedRedirect = redirect;
  }
  redirect(redirect: string) {
    expect(this.expectedRedirect).to.not.equal(null);
    expect(this.expectedRedirect).to.equal(redirect);
  }
}

describe("Route middleware", () => {
  let req: any;
  let res: any;
  let next: any;
  let expectError: any;

  beforeEach(() => {
    req = {};
    res = new MockExpectResponse();
    next = (error: any) => {
      if (expectError) {
        expect(expectError.message).to.equal(error.message);
      } else {
        expect(error).to.equal(undefined);
      }
    }
    expectError = false;
  });

  describe("authenticate", () => {
    it("should set user", (done) => {
      rmw.authenticate()(req, res, next);
      expect(req.user.name).to.equal("Admin");
      done();
    });
  });

  describe("authenticated", () => {
    it("should fail when user not set", (done) => {
      expectError = true;
      res.setExpectedRedirect(config.unauthorizedUrl);
      rmw.authenticated()(req, res, next);
      done();
    });

    it("should succeed when user is set", (done) => {
      req = {user: "testuser"};
      rmw.authenticated()(req, res, next);
      done();
    })
  });

  describe("notImplemented", () => {
    it("should send error to next", (done) => {
      expectError = new Error("Test not implemented");
      rmw.notImplemented("Test")(req, res, next);
      done();
    });
  });

  describe("requireRole", () => {
    it("should fail if user does not have role", (done) => {
      const role = {name: "Test"};
      req = {user: {
          name: "Testuser",
          roles: []
        }
      }
      expectError = new Error(req.user.name + " does not have permission " + role.name);
      rmw.requireRole(role.name)(req, res, next);
      done();
    });

    it("should succeed when user has role", (done) => {
      const role = {name: "Test"};
      req = {user: {
          name: "Testuser",
          roles: [role]
        }
      };
      rmw.requireRole(role.name)(req, res, next);
      done();
    });
  });
});

