/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const brLedgerUtils = require('bedrock-ledger-utils');
const {expect} = global.chai;
const helpers = require('./helpers');
const mockData = require('./mock-data');

let ledgerNode;
let electorPoolDocument;
describe('Elector Selection APIs', () => {
  describe('_getElectorPoolElectors API', () => {
    it('returns empty object if electorPool is not defined', async () => {
      const ledgerConfiguration = mockData.ledgerConfiguration.alpha;
      const r = await brLedgerUtils.getElectorPoolElectors(
        {ledgerConfiguration, ledgerNode});
      expect(r).to.eql({});
    });
    describe('Dereferenced service descriptions', () => {
      it('extracts one elector from an electorPool document', async function() {
        this.timeout(60000);
        const electorCount = 1;
        try {
          const r = await helpers.initializeLedger({electorCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.keys(r).should.have.same.members(
          electorPoolDocument.electorPool.map(e => e.elector));
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, electorCount));
      });
      it('extracts three electors from an electorPool doc', async function() {
        this.timeout(60000);
        const electorCount = 3;
        try {
          const r = await helpers.initializeLedger({electorCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, electorCount));
      });
    }); // end Dereferenced service descriptions
    describe('Dereferenced service descriptions', () => {
      it('extracts one elector from an electorPool document', async function() {
        this.timeout(60000);
        const electorCount = 0;
        const embeddedServiceCount = 1;
        try {
          const r = await helpers.initializeLedger(
            {electorCount, embeddedServiceCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, embeddedServiceCount + electorCount));
      });
      it('extracts three electors from an electorPool doc', async function() {
        this.timeout(60000);
        const electorCount = 0;
        const embeddedServiceCount = 3;
        try {
          const r = await helpers.initializeLedger(
            {electorCount, embeddedServiceCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, embeddedServiceCount + electorCount));
      });
    }); // end Dereferenced service descriptions

    describe('Mixed dereferenced/embedded service descriptions', () => {
      it('one dereferenced and one embedded', async function() {
        this.timeout(60000);
        const electorCount = 1;
        const embeddedServiceCount = 1;
        try {
          const r = await helpers.initializeLedger(
            {electorCount, embeddedServiceCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, embeddedServiceCount + electorCount));
      });
      it('one dereferenced and two embedded', async function() {
        this.timeout(60000);
        const electorCount = 1;
        const embeddedServiceCount = 2;
        try {
          const r = await helpers.initializeLedger(
            {electorCount, embeddedServiceCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, embeddedServiceCount + electorCount));
      });
      it('two dereferenced and one embedded', async function() {
        this.timeout(60000);
        const electorCount = 2;
        const embeddedServiceCount = 1;
        try {
          const r = await helpers.initializeLedger(
            {electorCount, embeddedServiceCount, mockData});
          ledgerNode = r.ledgerNode;
          electorPoolDocument = r.electorPoolDocument;
        } catch(err) {
          assertNoError(err);
        }
        const ledgerConfiguration = mockData.ledgerConfiguration.beta;
        const r = await brLedgerUtils.getElectorPoolElectors(
          {ledgerConfiguration, ledgerNode});
        Object.values(r).map(e => e.id).should.have.same.members(
          mockData.endpoint.slice(0, embeddedServiceCount + electorCount));
      });
    }); // Mixed dereferenced/embedded service descriptions
  });
});