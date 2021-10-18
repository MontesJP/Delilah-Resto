const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
  console.error(err);
});

function makeKey(req) {
  return `${req.method}_${req.baseUrl}`;
}

exports.storeObjectInCache = (req, object) => {
  const key = makeKey(req);
  client.set(key, JSON.stringify(object));
};

exports.cache = (req, res, next) => {
  const key = makeKey(req);
  client.get(key, (error, data) => {
    if (error || !data) {
      next();
    } else {
      const jsonData = JSON.parse(data);
      return res.status(200).json({
        status: 'success',
        results: jsonData.length,
        cacheData: {
          products: jsonData,
        },
      });
    }
  });
};

exports.invalidateCache = (req) => {
  client.DEL(makeKey(req));
};
