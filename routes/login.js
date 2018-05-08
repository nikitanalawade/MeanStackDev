exports.list = function(req, res){
  res.send('user'+res.body.username);
};