const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { JobApp } = require ("../models/jobapps/jobapp");

const routes = (app) => {
  const router = express.Router();

  router.post("/jobapps", (req, res) => {
    const jobapp = new JobApp({
      text: req.body.text,
      whenApplied: req.body.whenApplied,
      from: req.body.from,
      description: req.body.description,
    });

    jobapp
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });
  router.get("/", (req, res) => {
    JobApp.find({}, { __v: 0 })
      .then((jobapps) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, jobapps);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
