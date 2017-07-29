var funcs = require('../routesFuncs/boss-funcs.js');

var newBoss = funcs.newBoss;
var getBossList = funcs.getBossList;

module.exports = function(router) {
  router.route('/boss')
  .post(function(req, res) {
    newBoss(req.body, function(err, result) {
      if (err)
        return res.json({message: err});

      res.json({message: 'Boss created!', bossId: result.bossId})
    });
  })
  .get(function(req, res) {
    getBossList(function(err, result) {
      if (err)
        return res.json({message: err});

      res.json(result);
    });
  });
}
