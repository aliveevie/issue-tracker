'use strict';

const { default: mongoose } = require('mongoose');
const IssueModel = require('../models/schema').Issue;
const ProjectModel = require('../models/schema').Project;
const ObjectId = mongoose.Types.ObjectId
require('dotenv').config();

module.exports = async function (app) {
  app.route('/api/issues/:project')

    .get(async function (req, res) {
        let project = req.params.project
        
        /*
        await ProjectModel.findOne({ name: project })
        .then((data) => {
          if (data) {
            if (filterredData) {
              //const filteredData = data.issues.filter(item => item === filter);
              //res.json(filteredData);
              console.log(data.issues.find(filterredData).exec())
            } else {
              res.json(data.issues);
            }
          } else {
            res.status(404).json({ error: 'Project not found' });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Internal server error' });
        });
      */
        let {
          issue_title,
          issue_text,
          created_on,
          updated_on,
          created_by,
          assigned_to,
          open,
          status_text,
          _id
        } = req.query
       ProjectModel.aggregate([
        { $match: { name: project }},
        { $unwind: "$issues" },
        _id != undefined
            ? { $match : { "issues._id": new ObjectId(_id)}}
            : { $match: {} },
        issue_title != undefined
            ? { $match : { "issues.issue_title": issue_title }}
            : { $match: {} },
        issue_text != undefined
            ? { $match : { "issues.issue_text": issue_text }}
            : { $match : {} },
        created_on != undefined
            ? { $match : { "issues.created_on": created_on }}
            : { $match : {} },
        updated_on != undefined
            ? { $match : { "issues.updated_on": updated_on }}
            : { $match : {} },
        created_by != undefined
            ? { $match : { "issues.created_by": created_by }}
            : { $match : {} },
        assigned_to != undefined
            ? { $match : { "issues.assigned_to": assigned_to }}
            : { $match : {} },   
        open != undefined
            ? { $match : { "issues.open": open }}
            : { $match : {} },
        status_text != undefined
            ? { $match : { "issues.status_text": status_text }}
            : { $match : {} }
       ]).exec()
         .then((data) => {
          if(!data){
            res.json([])
          }else{
            let mappedData = data.map((item) => item.issues)
            res.json(mappedData)
          }
         })
        
    })

    .post(async function (req, res) {
    
          const project = req.params.project;
          const { issue_title, issue_text, created_by, 
          assigned_to, status_text } = req.body;
            console.log(req.body)
   
       const newIssue = new IssueModel({
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || ""
        });
       if(newIssue.issue_title === "" || newIssue.issue_text==="" || newIssue.created_on===""){
        res.json({ error: 'required field(s) missing' })
       }
        ProjectModel.findOne({ name: project })
        .then((data) => {
          if (data === null) {
            // Create a new project if it doesn't exist
            const newProject = new ProjectModel({ name: project });
            newProject.issues.push(newIssue);
            
            newProject.save()
              .then((savedData) => {
                const newIssueData = savedData.issues[savedData.issues.length - 1]; // Retrieve the last added issue
                res.json(newIssueData);
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            // Update the existing project with the new issue
            data.issues.push(newIssue);
            data.save()
              .then((savedData) => {
                const newIssueData = savedData.issues[savedData.issues.length - 1]; // Retrieve the last added issue
                res.json(newIssueData);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
      
      
                           
    })

    .put( (req, res) => {
      const projectname = req.params.project;
      
      const _id = req.body._id;
      console.log(_id)
    
      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }
    
      const updateFields = { ...req.body };
      delete updateFields._id;
    
      if (Object.keys(updateFields).length === 0) {
        res.json({ error: 'no update field(s) sent', '_id': _id });
        return;
      }
    
      const currentDate = new Date();
    
      ProjectModel.findOne({ name: projectname })
        .then((data) => {
          let id;
          const issueToUpdate = data.issues.id(_id)
           id = issueToUpdate._id.toString()
        
          if (id !== _id) {
            console.log('No issue to update!')
            res.json({ error: 'could not update', '_id': _id })
            return
          }
    
          Object.assign(issueToUpdate, updateFields);
          issueToUpdate.updated_on = currentDate;
    
          return data.save()
                     .then((updatedData) => {
                      
                    if (!updatedData) {
                    res.json({ error: 'could not update', '_id': _id });
                     } else {
                    res.json({ result: 'successfully updated', '_id': _id });
              }
          })
        })
        
        .catch((error) => {
          res.json({ error: 'could not update', '_id': _id });
        });
    })
    
    .delete(function (req, res) {
      let project = req.params.project;
      const _id = req.body._id
      if (!_id) {
        console.log('Here we are!')
        res.json({ error: 'missing _id' });
        return;
      }
      ProjectModel.findOne({ name: project})
                  .then((data) => {
                    if(!data){
                      res.json({ error: 'could not delete', '_id': _id });
                    }else{
                      const removeData = data.issues.id(_id)
                      if(!removeData){
                        res.json({ error: 'could not delete', '_id': _id });
                        return;
                      }
                     const index = data.issues.indexOf(removeData)
                     if(index !== -1){
                        data.issues.splice(index, 1)
                     }
                      data.save()
                          .then((dataRemoved) => {
                            if(!dataRemoved){
                              res.json({ error: 'could not delete', '_id': _id });
                            }else{
                              res.json({ result: 'successfully deleted', '_id': _id})
                            }
                          })
                        }
                  })             
    });
};