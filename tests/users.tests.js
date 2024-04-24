const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzEzNDczMzUxLCJleHAiOjE3MTM1NTk3NTF9.mh-TkvxJFwvvpTrwYD9bXBuok6dpp1aJPpMS5YSXf8E";

describe("User API service", () => {
  it("should GET a logged in user's unique id, username, and password", (done) => {
    const expected = [
      {
        id: 2,
        username: "admin2",
        email: "admin2@example.com",
      },
    ];

    chai
      .request("http://localhost:3000")
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .end((err, resp) => {
        expect(resp.body).to.eql(expected);
        done();
      });
  });

  // run one time then skip once working
  //   it.skip("should PUT updated credentials for a logged in user", (done) => {
  //     const updatedUser = {
  //       username: "unitTest",
  //       password: "password",
  //       email: "unitTestUpdate@example.com",
  //     };
  //     const expected = { msg: "Updated succesfully!" };

  //     chai
  //       .request("http://localhost:3000")
  //       .put("/api/user/update")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send(updatedUser)
  //       .end((err, resp) => {
  //         expect(resp.body).to.eql(expected);
  //         done();
  //       });
  //   });

  //   it("should PUT updated credentials for a logged in user", (done) => {
  //     const updatedUser = {
  //       username: "unitTest",
  //       password: "password",
  //       email: "unitTestUpdate@example.com",
  //     };
  //     const expected = { msg: "Nothing to update..." };

  //     chai
  //       .request("http://localhost:3000")
  //       .put("/api/user/update")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send(updatedUser)
  //       .end((err, resp) => {
  //         expect(resp.body).to.eql(expected);
  //         done();
  //       });
  //   });

  it("should DELETE a user", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/api/user/delete")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(Object.keys(res.body).length).to.equal(1);
        done();
      });
  });
});
