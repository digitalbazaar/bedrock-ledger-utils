/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {BedrockError} = bedrock.util;
const find = require('lodash.find');

const api = {};
module.exports = api;

/**
 * Dereferences the service descriptors for the electors listed in electorPool.
 *
 * @param {Object[]} electorPool an array of electors.
 * @param {Object} ledgerNode a LedgerNode instance.
 *
 * @return {Promise<Object>} the service endpoints for the electors.
 * @throws if there is difficulty dereferencing any service descriptors.
 */
api.dereferenceElectorPool = async ({electorPool, ledgerNode}) => {
  const electors = {};

  // FIXME: is type an array or a string?  Value is TBD
  const continuityServiceType = 'Continuity2017Peer';

  for(const e of electorPool) {
    // service may be a string referencing a serviceId contained in a DID
    if(typeof e.service === 'string') {
      // extract the DID from `service` which is a DID followed by a fragment
      const recordId = e.service.substr(0, e.service.indexOf('#'));

      // dereference elector's DID document to locate the service descriptor
      // `records.get` throws NotFoundError on an unknown recordId
      const {record} = await ledgerNode.records.get({recordId});

      const {service: electorService} = record;
      const expectedService = {id: e.service, type: continuityServiceType};
      if(!electorService) {
        throw new BedrockError(
          'The Elector\'s DID document does not contain a service descriptor.',
          'NotFoundError', {elector: record, expectedService});
      }
      const service = find(electorService, expectedService);
      if(!service) {
        throw new BedrockError(
          'The Elector\'s DID document does not contain the expected ' +
          'service descriptor.', 'NotFoundError',
          {elector: record, expectedService});
      }
      electors[e.id] = {
        id: service.serviceEndpoint,
        type: e.type,
      };
    }

    // service may be an embedded service descriptor
    if(typeof e.service === 'object') {
      if(e.service.type === continuityServiceType &&
        e.service.serviceEndpoint) {
        electors[e.id] = {
          id: e.service.serviceEndpoint,
          type: e.type,
        };
      } else {
        // veres-one-validator must ensure that this never occurs
        throw new BedrockError(
          'Invalid service descriptor.', 'InvalidStateError', {elector: e});
      }
    }
  }

  // the current return map allows for correlation of elector DIDs to their
  // service endpoints
  return electors;
};

/**
 * Extracts the location of the elector pool document from ledgerConfiguration,
 * dereferences the elector pool document and returns service endpoints for
 * all the electors specified in the elector pool document.
 *
 * @param {Object} ledgerConfiguration the ledger configuration.
 * @param {Object} ledgerNode a LedgerNode instance.
 *
 * @return {Promise<Object>} the service endpoints for elector pool electors.
 * @throws if there is difficulty dereferencing any service descriptors.
 */
api.getElectorPoolElectors = async ({ledgerConfiguration, ledgerNode}) => {
  const {electorPool: electorPoolDocId} =
    ledgerConfiguration.electorSelectionMethod;
  if(!electorPoolDocId) {
    return {};
  }
  // get the electorPool document. Do not specify a maxBlockHeight because the
  // most recent revision is always required
  let electorPoolDocument;
  try {
    electorPoolDocument = await ledgerNode.records.get(
      {recordId: electorPoolDocId});
  } catch(e) {
    if(e.name === 'NotFoundError') {
      // the electorPool document has not been defined yet.
      return {
        electorPoolDocumentSequence: 0,
        electorPoolElectors: [],
        maximumElectorCount: 0
      };
    }
    throw e;
  }

  const {
    meta: {sequence: electorPoolDocumentSequence},
    record: {electorPool, maximumElectorCount},
  } = electorPoolDocument;

  if(!electorPool) {
    // veres-one-validator must ensure that this does not occur
    throw new BedrockError(
      'Elector pool document does not contain `electorPool`',
      'InvalidStateError', {electorPoolDocument});
  }

  return {
    electorPoolDocumentSequence,
    electorPoolElectors: await api.dereferenceElectorPool(
      {electorPool, ledgerNode}),
    maximumElectorCount,
  };
};
