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
