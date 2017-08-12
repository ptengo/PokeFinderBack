var funcs = require('../routesFuncs/messages-funcs.js');

var getMessages = funcs.getMessages;

module.exports = function(router) {
  router.route('/messages')
  .get(function(req, res) {
    getMessages(function(err, result) {
      if (err)
        return res.json({message: err});

      res.json(result);
    });
  });
}
