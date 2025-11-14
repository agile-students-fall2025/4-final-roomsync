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

// Chores routes tests
describe('GET /api/rooms/:roomId/chores', () => {
  it('should return all chores for a room', done => {
    request
      .execute(app)
      .get('/api/rooms/1/chores')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.greaterThan(0)
        expect(res.body[0]).to.have.property('id')
        expect(res.body[0]).to.have.property('name')
        expect(res.body[0]).to.have.property('assignedTo')
        expect(res.body[0]).to.have.property('finished')
        expect(res.body[0]).to.have.property('roomId')
        done()
      })
  })
})

describe('GET /api/rooms/:roomId/chores/:id', () => {
  it('should return a specific chore', done => {
    request
      .execute(app)
      .get('/api/rooms/1/chores/1')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('id').that.equals(1)
        expect(res.body).to.have.property('name')
        expect(res.body).to.have.property('assignedTo')
        expect(res.body).to.have.property('finished')
        expect(res.body).to.have.property('roomId')
        done()
      })
  })

  it('should return 404 for non-existing chore', done => {
    request
      .execute(app)
      .get('/api/rooms/1/chores/9999')
      .end((err, res) => {
        expect(res).to.have.status(404)
        expect(res.body).to.have.property('message')
        done()
      })
  })
})

describe('POST /api/rooms/:roomId/chores', () => {
  it('should create a new chore', done => {
    const newChore = {
      name: 'Test Chore',
      assignedTo: 1
    }
    request
      .execute(app)
      .post('/api/rooms/1/chores')
      .send(newChore)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('name').that.equals(newChore.name)
        expect(res.body).to.have.property('assignedTo').that.equals(newChore.assignedTo)
        expect(res.body).to.have.property('finished').that.equals(false)
        expect(res.body).to.have.property('roomId').that.equals(1)
        done()
      })
  })
})

describe('PUT /api/rooms/:roomId/chores/:id', () => {
  it('should update a chore', done => {
    const updates = {
      name: 'Updated Chore Name',
      finished: true
    }
    request
      .execute(app)
      .put('/api/rooms/1/chores/1')
      .send(updates)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('id').that.equals(1)
        expect(res.body).to.have.property('name').that.equals(updates.name)
        expect(res.body).to.have.property('finished').that.equals(true)
        done()
      })
  })

  it('should toggle finished status', done => {
    request
      .execute(app)
      .put('/api/rooms/1/chores/2')
      .send({ finished: true })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('finished').that.equals(true)
        done()
      })
  })
})

describe('DELETE /api/rooms/:roomId/chores/:id', () => {
  it('should delete a chore', done => {
    request
      .execute(app)
      .delete('/api/rooms/1/chores/3')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success').that.equals(true)
        done()
      })
  })
})
