module.exports.getIp = function (req) {
  // const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  // console.log(req.connection.remoteAddress)
  // console.log(req.connection.remotePort)
  // console.log(req.connection.localAddress)
  // console.log(req.connection.localPort)
  const ip = req.ip;
  return ip === '::1' || !ip ? '127.0.0.1' : ip;
};

module.exports.getHost = function (req) {
  if (req) return `${req.protocol}://${req.get('host')}`;
  return 'http://127.0.0.1/';
};

module.exports.getHostUrl = function (req) {
  if (req) return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  return 'http://127.0.0.1/';
};

module.exports.getUserAgent = function (req) {
  if (request) return request.headers['user-agent'];
  else return 'undefined';
};
