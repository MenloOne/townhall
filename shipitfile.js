require('dotenv').config()


module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/var/www/menlo-message-board',
      repositoryUrl: 'https://github.com/vulcanize/message_board_reactjs.git',
    },
    staging: {
      key:     process.env.MENLO_DEPLOYMENT_STAGING_KEY,
      servers: process.env.MENLO_DEPLOYMENT_STAGING_SERVER,
    },
  })
}
