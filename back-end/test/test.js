import { use, expect } from 'chai'
import { default as chaiHttp, request } from 'chai-http'
import app from '../app.js'

use(chaiHttp)

describe('POST /api/submit', () => {

  it('should return success with submitted data', done => {
    const testName = 'John Doe'
    const testEmail = 'john@example.com'
    const testAgree = 'true' // as string, which is how it would be received on back-end via HTTP POST

    request
      .execute(app)
      .post('/api/submit')
      .type('application/x-www-form-urlencoded')
      .send({ your_name: testName, your_email: testEmail, agree: testAgree }) // send the mock data with the POST request
      .end((err, res) => {
        expect(err).to.be.null // not null
        expect(res).to.have.status(200) // HTTP response status code
        expect(res).to.be.json // HTTP content type header
        // check content of response object
        expect(res.body)
          .to.have.property('status')
          .that.equals('amazing success!')
        // check subfields of response object
        expect(res.body.your_data).to.have.property('name').that.equals(testName)
        expect(res.body.your_data)
          .to.have.property('email')
          .that.equals(testEmail)
        expect(res.body.your_data)
          .to.have.property('agree')
          .that.equals(testAgree)
        done()
      })
  })
})

// User routes tests
describe('GET /api/rooms/:roomId/users', () => {
  it('should return users for a room', done => {
    request
      .execute(app)
      .get('/api/rooms/1/users')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        done()
      })
  })
})

describe('POST /api/rooms/:roomId/users', () => {
  it('should create a new user', done => {
    request
      .execute(app)
      .post('/api/rooms/1/users')
      .send({ name: 'Test User' })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('name')
        expect(res.body).to.have.property('email')
        expect(res.body).to.have.property('roomId')
        done()
      })
  })
})

describe('DELETE /api/rooms/:roomId/users/:id', () => {
  it('should delete a user', done => {
    request
      .execute(app)
      .delete('/api/rooms/1/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success')
        done()
      })
  })
})

describe('POST /api/users/:userId/assign-room', () => {
  it('should assign user to a room', done => {
    request
      .execute(app)
      .post('/api/users/2/assign-room')
      .send({ roomId: 2 })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success')
        done()
      })
  })
})


//test get user by email
describe('GET /api/users/email/:email', () => {
  it('should return user when email exists', done => {
    request
      .execute(app)
      .get('/api/users/email/eslem@agile.com')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('email').that.equals('eslem@agile.com')
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('name')
        expect(res.body).to.have.property('roomId')
        done()
      })
  })

  it('should return 404 when email does not exist', done => {
    request
      .execute(app)
      .get('/api/users/email/nonexistent@example.com')
      .end((err, res) => {
        expect(res).to.have.status(404)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('success').that.equals(false)
        expect(res.body).to.have.property('message').that.equals('User not found')
        done()
      })
  })
})
