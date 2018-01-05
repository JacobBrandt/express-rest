import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;

import { PermissionUtil } from "./../utils/permission.util";

describe("PermissionUtil", () => {
  let user: any;

  beforeEach(() => {
    user = {
      roles: []
    };
  });

  it("userHasRole should return false when not found", () => {
    expect(PermissionUtil.userHasRole(user, "Test")).to.equal(false);
  });

  it("userHasRole should return true if found", () => {
    user = {roles: [{name: "Test"}]};
    expect(PermissionUtil.userHasRole(user, "Test")).to.equal(true);
  });
});
