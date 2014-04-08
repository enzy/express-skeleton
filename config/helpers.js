var _ = require('lodash');

/**
 * Format date helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

exports.formatDate = function (date) {
  date = new Date(date)
  var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
  return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
}

/**
 * Format date time helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

exports.formatDatetime = function (date) {
  date = new Date(date)
  var hour = date.getHours();
  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes().toString()
    : date.getMinutes();

  return exports.formatDate(date) + ' ' + hour + ':' + minutes;
};

exports.formatDatetimeLocal = function (date) {
  date = new Date(date);
  // YYYY-MM-DDTHH:mm:ss.sssZ with removed .sssZ
  return date.toISOString().replace(/\.\d+Z/, '');
};

/**
 * Strip script tags
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.stripScript = function (str) {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

/**
 * Gets the size of the collection by returning collection.length for arrays and array-like objects or the number of own enumerable properties for objects.
 *
 * @param  {Object|Array|string} collection The collection to inspect.
 * @return {number} Returns collection.length or number of own enumerable properties.
 */
exports.size = function(collection) {
  return _.size(collection);
};

/**
 * Replace http:// with https://
 *
 * @param {String} str
 * @return {String}
 */

exports.https = function (str) {
  return str.replace('http://', 'https://');
};

/**
 * Encode url parameter
 *
 * @param  {String} str
 * @return {String}
 */
exports.urlParam = function(str) {
  return encodeURIComponent(str);
};