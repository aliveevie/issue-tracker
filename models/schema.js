const { default: mongoose } = require('mongoose');
require('dotenv').config();
const db = mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const IssueSchema = new mongoose.Schema({
  issue_title: {type: String, require: true},
  issue_text: {type: String, require: true},
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String,
});

const Issue = mongoose.model('Issue', IssueSchema)

const ProjectSchema = new mongoose.Schema({
  name: { type: String, require: true},
  issues: [IssueSchema]
});

const Project = mongoose.model("Project", ProjectSchema)


module.exports = {
  db,
  IssueSchema,
  Issue,
  ProjectSchema,
  Project
};

