var http = require('http')
const webhookSecret = process.env.WEBHOOK_SECRET
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: webhookSecret })
const slackHook = process.env.HOOK_URL
const Slack = require('slack-node');
slack = new Slack();
slack.setWebhook(slackHook);



http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)


handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('issues', function (event) {
  if(event.payload.action == 'labeled'){
    var teamsToChannel = _teamsMap();
    var channelName = teamsToChannel.get(event.payload.label.name);
    if(channelName) {
      slack.webhook({
        channel: channelName,
        username: "Badnews",
        text: `Rapazeada, tem issue nova -> https://github.com/involvestecnologia/agilepromoterissues/issues/${event.payload.issue.number} \nTítulo: \`${event.payload.issue.title}\``
      }, function(err, response) {
        console.log(response);
      });
    }
  }

  function _teamsMap() {
    var teamsMap = new Map;
    teamsMap.set('time:infra', "#iat");
    teamsMap.set('equipe:iOS', "#ios-issues");
    teamsMap.set('equipe:Business Empowerment Team', "#boleteam-issues");
    teamsMap.set('equipe:SCOUTeam', "#scouteam-issues");
    teamsMap.set('equipe:ExD-Team', '#exd-issues');
    teamsMap.set('equipe:FronTeam', '#fronteam-issues');
    return teamsMap;
  }
})
