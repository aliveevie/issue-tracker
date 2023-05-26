const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('../models/schema')
const idTest = '646f3f2a7e95fb340eef1c72'
const idTest2 = '646f3f327e95fb340eef1c7f'
const idTest3 = '1345edff'
chai.use(chaiHttp);

suite('Functional Tests', function () {
    suite('Post Request', () => {
        test('Create an issue with every field: POST request to /api/issues/{project}', () => {
            chai.request(server)
                .keepOpen()
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'ibi',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)

                })
        })
        test('Create an issue with only required fields: POST request to /api/issues/{project}', () => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'ibi'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.body.issue_title, 'Title')
                    assert.equal(res.body.issue_text, 'text')
                    assert.equal(res.body.created_by, 'ibi')
                   
                })
        })
        test('Create an issue with missing required fields: POST request to /api/issues/{project}', () => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Not',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, '{"error":"required field(s) missing"}')
                   
                })
        })
    })

    suite('Get Request', () => {
        test('View issues on a project: GET request to /api/issues/{project}', () => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isNotEmpty(res.text)
                
                })
        })
        test('Update one filter', () => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isNotEmpty(res.text)
                  
                })
        })
        test('Update multiple fields', () => {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isNotEmpty(res.text)
                  
                })
        })
    })
    suite('Put Request', () => {
        test('Put request on Missing Data Fields', () => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/apitest')
                .send({
                    _id: idTest
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, `{"error":"no update field(s) sent","_id":"${idTest}"}`)
                })
        })
        test('Update one field on an issue:', () => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/apitest')
                .send({
                    _id: idTest,
                    issue_text: 'No update'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, `{"error":"could not update","_id":"${idTest}"}`)
                })
        })
        test('Update multiple fields on an issue', () => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/apitest')
                .send({
                    _id: idTest,
                    issue_title: 'No update',
                    issue_text: 'Yes update',
                    created_by: 'Musa'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, `{"error":"could not update","_id":"${idTest}"}`)
                })
        })
        test('Update an issue with missing _id', () => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'No update',
                    issue_text: 'Yes update',
                    created_by: 'Musa'
                    
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, '{"error":"missing _id"}')
                    
                })
        })

        test('Update an issue with missing _id', () => {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'No update',
                    issue_text: 'Yes update',
                    created_by: 'Musa'
                    
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, '{"error":"missing _id"}')
                    
                })
        })
        
    })
    suite('Delete Request', () => {
        test('Delete an issue:', () => {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/apitest')
                .send({
                    _id: idTest2
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, `{"error":"could not delete","_id":"${idTest2}"}`)
                  
                })
        })
        test('Delete an issue: with an Invalid ID', () => {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/apitest')
                .send({
                    _id: idTest3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, `{"error":"could not delete","_id":"${idTest3}"}`)
                 
                })
        })
        test('Delete an issue: with Missing ID', () => {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/apitest')
                .send({
                    _id: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, `{"error":"missing _id"}`)
                })
        })
    })
    
});
