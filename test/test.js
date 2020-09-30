/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
require('bedrock-https-agent');
require('bedrock-ledger-node');
require('bedrock-mongodb');
require('bedrock-ledger-consensus-continuity');
require('veres-one-validator');
require('veres-one-consensus-continuity-elector-selection');

require('bedrock-test');
bedrock.start();
