import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
import { RoleModel } from "../models/role.model";

describe("RoleModel", () => {
  it("should be invalid if name, description is not set ", (done) => {
    const model = new RoleModel();
    model.validate((err: any) => {
      expect(err.errors.name).to.not.equal(undefined);
      expect(err.errors.description).to.not.equal(undefined);
      done();
    });
  });

  it("should be valid if name, description is set", (done) => {
    const model = new RoleModel({name: "Name", description: "description"});
    model.validate((err: any) => {
      expect(err).to.equal(null);
      done();
    });
  });
});
