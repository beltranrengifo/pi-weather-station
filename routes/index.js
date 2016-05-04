/*
  index.js

  Express routes for our application
*/

'use strict';

const router = require('express').Router();
const os     = require('os');
const path   = require('path');

// DeviceManager provides a platform-independent interface to our hardware devices
// so we can build and run this application on different platforms.
//
const DeviceManager = require('../devices/device-manager.js');
const deviceManager = new DeviceManager();
const viewsRoot     = path.join(__dirname, '../views');

router.get('/', (req, res) =>
  deviceManager.ReadSensors()
    .then(data => renderIndex(res, data))
    .catch(error => renderIndex(res, null, error)));

const renderIndex = (res, data, error) =>
  res.render(path.join(viewsRoot, 'index.ejs'), {
    sensorData     : data,
    error          : error,
    platformUptime : os.uptime(),
    processUptime  : process.uptime()
  });

router.get('/sensors', (req, res) =>
  deviceManager.ReadSensors()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

router.post('/led-on', (req, res) =>
  deviceManager.LEDOn()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

router.post('/led-off', (req, res) =>
  deviceManager.LEDOff()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err)));

module.exports = router;
