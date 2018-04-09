require('dotenv').config()

var deployment_key = process.env.MENLO_DEPLOYMENT_KEY
var deployment_server = process.env.MENLO_DEPLOYMENT_SERVER

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/var/www/menlo-message-board',
      repositoryUrl: 'https://github.com/vulcanize/message_board_reactjs.git',
    },
    staging: {
      key:     deployment_key,
      servers: deployment_server,
    },
  })
}
