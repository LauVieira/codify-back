const { stripHtml } = require('string-strip-html');

<<<<<<< HEAD
function sanitiseObj(obj) {
=======
function sanitiseObj (obj) {
>>>>>>> main
  if (obj === null || typeof (obj) !== 'object') return;
  const newObj = Array.isArray(obj) ? [] : {};

  const objEntries = Object.entries(obj);
  objEntries.forEach((entry) => {
    const [key, value] = entry;
    if (typeof (value) === 'string') {
      const sanitisedString = stripHtml(value).result;
      newObj[key] = sanitisedString;
    } else if (typeof (value) === 'object') {
      newObj[key] = sanitiseObj(value);
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}

module.exports = { sanitiseObj };
