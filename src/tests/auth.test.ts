import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { getTestInance } from "./server.instance";
chai.use(chaiHttp);

let app;

describe("POST /auth", () => {
    before(async () => {
        app = await getTestInance();
    })

    describe('Successefully registered user', () => {
        it('registration successeful and return status 201', async (done) => {
            let body = {
                email: 'test@test.com',
                password: "Password1",
                username: "aleksandar"
            }
            const respone = await chai.request(app).post('/auth/register').send(body);
            expect(respone).to.have.status(201);
            expect(respone).to.have.nested.property('accessToken');
            expect(respone).to.have.cookie("jwt");
            done();

        })
    })

    after(async () => {

    })
})
