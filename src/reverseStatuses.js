const R = require('./ramda')

const statusMap = {
  OK,
  ERR_NOT_OWNER,
  ERR_NO_PATH,
  ERR_NAME_EXISTS,
  ERR_BUSY,
  ERR_NOT_FOUND,
  ERR_NOT_ENOUGH_ENERGY,
  ERR_NOT_ENOUGH_RESOURCES,
  ERR_INVALID_TARGET,
  ERR_FULL,
  ERR_NOT_IN_RANGE,
  ERR_INVALID_ARGS,
  ERR_TIRED,
  ERR_NO_BODYPART,
  ERR_NOT_ENOUGH_EXTENSIONS,
  ERR_RCL_NOT_ENOUGH,
  ERR_GCL_NOT_ENOUGH,
}

module.exports = R.pipe(
  R.toPairs,
  R.map(R.reverse),
  R.fromPairs
)(statusMap)
