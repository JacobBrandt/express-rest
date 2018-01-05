import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
import { UserModel } from "../models/user.model";

describe("UserModel", () => {
  it("should be invalid if email, display_name is not set", (done) => {
    const model = new UserModel();
    model.validate((err: any) => {
      expect(err.errors.email).to.not.equal(undefined);
      expect(err.errors.display_name).to.not.equal(undefined);
      done();
    });
  });

  it("should be valid if email, display_name is set", (done) => {
    const model = new UserModel({email: "test@email.com", display_name: "testName"});
    model.validate((err: any) => {
      expect(err).to.equal(null);
      done();
    });
  });
});

