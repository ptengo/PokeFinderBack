var funcs = require('../routesFuncs/raids-funcs.js');

var newRaid = funcs.newRaid;
var getRaidList = funcs.getRaidList;
var getRaidById = funcs.getRaidById;
var updateRaid = funcs.updateRaid;
var removeRaid = funcs.removeRaid;
var addMessageToRaid = funcs.addMessageToRaid;

module.exports = function(router) {

  router.route('/raids')
  .post(function(req, res) {
    newRaid(req.body, function(err, result) {
      if (err)
        return res.send({message: err});

      res.json({message: 'Raid created!', storeId: result.raidId})
    });
  })
  .get(function(req, res) {
    getRaidList(function(err, result) {
      if (err)
        return res.json({message: err});

      res.json(result);
    });
  });

  router.route('/raids/:raid_id')
  .get(function(req, res) {
    getRaidById(req.params.raid_id, function(err, result) {
      if (err)
        return res.json({message: err});

      res.json(result);
    });
  })
  .put(function(req, res) {
    updateRaid(req.params.raid_id, {boss: req.body.boss, location: req.body.location}, function(err, result) {
      if (err)
        return res.json({message: err});

      res.json({message: 'Raid updated!'});
    });
  })
  .delete(function(req, res) {
    removeRaid(req.params.raid_id, function(err) {
      if (err)
        return res.json({message: err});

      res.json({message: 'Raid successfully deleted'});
    });
  });

  router.route('/raids/:raid_id/message')
  .put(function(req, res) {
    addMessageToRaid(req.params.raid_id, req.body, function(err, result) {
      if (err)
        return res.json({message: err});

      res.json({message: 'Message successfully added'});
    });
  });
}
