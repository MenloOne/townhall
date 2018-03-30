module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/var/www/menlo-message-board',
      repositoryUrl: 'https://github.com/vulcanize/message_board_reactjs.git',
    },
    staging: {
      key:     '../menlo-infra/menlo-staging-deploy.pem',
      servers: 'deployer@ec2-13-58-70-6.us-east-2.compute.amazonaws.com',
    },
  })
}
