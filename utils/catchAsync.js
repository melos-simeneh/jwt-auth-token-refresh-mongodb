/**
 * Wraps an async function to catch errors and pass them to Express's error handler
 * @param {Function} fn The async function to wrap
 * @returns {Function} A function that handles errors automatically
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
