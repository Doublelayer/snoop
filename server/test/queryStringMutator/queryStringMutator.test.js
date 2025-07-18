import fs from 'fs';
import { expect } from 'chai';
import { readFile } from 'fs/promises';
import mutator from '../../services/runtime/queryStringMutator.js';
import queryString from 'query-string';

const data = await readFile(new URL('./testData.json', import.meta.url));

const testData = JSON.parse(data);

let _provider = await Promise.all(
  fs.readdirSync('./provider/').filter(file => file.endsWith('.js') && file !== 'index.js').map(async (integPath) => await import(`../../provider/${integPath}`)),
);

/**
 * Test test might look a bit weird at first, but listen stranger...
 * It's not wise to compare 2 urls, as this means all url params must be in the expected order. This is however not
 * guaranteed, as params (and their order) are totally variable.
 */
describe('queryStringMutator', () => {
  it('should fix all urls', () => {
    for (let test of testData) {
      const provider = _provider.find((p) => p.metaInformation.id === test.id);
      if (provider == null) {
        throw new Error(`Cannot find provider for given id: ${test.id}`);
      }
      const fixedUrl = mutator(test.url, provider.config.sortByDateParam, provider.config.urlParamsToRemove);
      const expectedParams = queryString.parseUrl(test.shouldBecome);
      const actualParams = queryString.parseUrl(fixedUrl);
      //check if all new params are existing
      expect(Object.keys(expectedParams.query)).to.include.members(
        Object.keys(actualParams.query),
        `Failed for test id: ${test.id} – URL: ${test.url}`
      );

      expect(Object.values(expectedParams.query)).to.include.members(
        Object.values(actualParams.query),
        `Failed for test id: ${test.id} – URL: ${test.url}`
      );
    }
  });
});
