import * as cheerio from 'cheerio';
import logger from "../../../../utils/logger.js";

let $ = null;

export function loadParser(text) {
  $ = cheerio.load(text);
}

export function parse(crawlContainer, crawlFields, text, url) {
  if (!text) {
    logger.warn({ url }, 'Cannot parse, text was empty for url ');
    return null;
  }

  if (!crawlContainer || !crawlFields) {
    logger.warn({ url }, 'Cannot parse, selector was empty for url ');
    return null;
  }

  const result = [];

  if ($(crawlContainer).length === 0) {
    logger.warn({ url }, 'No elements in crawl container found for url ');
    return null;
  }

  $(crawlContainer).each((_, element) => {
    const container = $(element);
    const parsedObject = {};

    // Parse fields based on crawlFields
    for (const [key, fieldSelector] of Object.entries(crawlFields)) {
      let value;

      try {
        const selector = fieldSelector.includes('|')
          ? fieldSelector.substring(0, fieldSelector.indexOf('|')).trim()
          : fieldSelector;

        if (selector.includes('@')) {
          const [sel, attr] = selector.split('@');
          if (sel.length === 0) {
            value = container.attr(attr.trim());
          } else {
            value = container.find(sel.trim()).attr(attr.trim());
          }
        } else {
          value = container.find(selector.trim()).text();
        }

        // Apply modifiers if specified
        if (fieldSelector.includes('|')) {
          /* eslint-disable no-unused-vars */
          const [_, ...modifiers] = fieldSelector.split('|').map((s) => s.trim());
          /* eslint-disable no-unused-vars */
          value = applyModifiers(value, modifiers);
        }

        parsedObject[key] = value || null;
      } catch (error) {
        logger.error({error},`Error parsing field '${key}' with selector '${fieldSelector}':`);
        parsedObject[key] = null;
      }
    }

    if (parsedObject.id != null) {
      result.push(parsedObject);
    } else {
      logger.warn({ url, parsedObject }, 'Parsed object does not have an id, skipping');
    }
  });

  return result;
}

// Helper function to apply modifiers
function applyModifiers(value, modifiers) {
  if (!value) return value;

  modifiers.forEach((modifier) => {
    switch (modifier) {
      case 'int':
        value = parseInt(value, 10);
        break;
      case 'trim':
        value = value.replace(/\s+/g, ' ').trim();
        break;
      case 'removeNewline':
        value = value.replace(/\n/g, ' ');
        break;
      default:
        logger.warn(`Unknown modifier: ${modifier}`);
    }
  });

  return value;
}
