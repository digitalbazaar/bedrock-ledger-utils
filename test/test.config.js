/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');
const path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));

config.jsonld.strictSSL = false;

// MongoDB
config.mongodb.name = 'bedrock_ledger_utils_test';
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

// enable consensus workers
config.ledger.jobs.scheduleConsensusWork.enabled = false;

// tune consensus to work within the test framework
config['ledger-consensus-continuity'].writer.debounce = 100;
config['ledger-consensus-continuity'].merge.fixedDebounce = 100;
