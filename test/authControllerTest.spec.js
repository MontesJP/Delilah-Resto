const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const dotenv = require('dotenv');

dotenv.config();
chai.use(chaiHttp);
const url = 'http://localhost:3000/api/v1/users';

describe('User sign up: ', () => {
  it('Should return status code 201', (done) => {
    chai
      .request(url)
      .post('/signup')
      .send({
        name: 'JuanTest',
        username: 'Testing',
        email: 'test@hotmail.com',
        telephone: 8799,
        address: 'Brunnen 111',
        password: 'hola1234',
        // eslint-disable-next-line prettier/prettier
        passwordConfirm: 'hola1234',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it('Should return status code 400', (done) => {
    chai
      .request(url)
      .post('/signup')
      .send({
        name: 'Alfredo Fache',
        username: 'Afache',
        email: 'afa@hotmail.com',
        telephone: 15151,
        address: 'Kolo 222',
        password: 'ppp111',
        // eslint-disable-next-line prettier/prettier
        passwordConfirm: 'iuashfuisah',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
