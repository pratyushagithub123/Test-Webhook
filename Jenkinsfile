//node projects multibranch pipeline groovey script
pipeline {
 agent { label 'master' }
 
 options {
   disableConcurrentBuilds()
   timeout(time: 15, unit: 'MINUTES')
   buildDiscarder(logRotator(numToKeepStr: '10'))
 } // options
 
 parameters {
 
   string(name: 'SLACK_CHANNEL_2',
 
          description: 'Default Slack channel to send messages to',
          defaultValue: '#/////memory-net-node')
 
 } // parameters
 
 environment {
   // Slack configuration
 
   SLACK_COLOR_DANGER  = '#E01563'
   SLACK_COLOR_INFO    = '#6ECADC'
   SLACK_COLOR_WARNING = '#FFC300'
   SLACK_COLOR_GOOD    = '#3EB991'
 
 } // environment
 
 stages {
 
//Staging
   stage("Deliver for staging") {
     // when {
             // branch 'master'
         // }
 
    steps {
      script {
        //enable remote triggers
        properties([pipelineTriggers([pollSCM('* * * * *')])])
              //zip the source code
              //sh 'zip -r  dev.zip --exclude=*.git* .'
              //copy zip to current directory
              sh 'rsync -zarvh --delete  /var/lib/jenkins/workspace/Memorynet-Node-Staging  ec2-user@35.86.24.40:/home/ec2-user/memory-net-node --exclude .git/ '
              //sh 'rsync -zarvh --delete  /Users/bitcot/.jenkins/workspace/memory-net-stage/  ec2-user@35.86.24.40:/home/ec2-user/memory-net-node --exclude .git/ '  
              sh 'ssh ec2-user@35.86.24.40 "cp /home/ec2-user/credentials/.env.staging /home/ec2-user/memory-net-node && cd /home/ec2-user/memory-net-node && source ~/.nvm/nvm.sh && npm i && npm run dbmigrate:staging && pm2 restart all"'
               // restart pm2
              //sh ''
       } // script
     } // steps
   } // stage
} // stages
 
post {
 
   aborted {
 
     echo "Sending message to Slack"
     slackSend (color: "${env.SLACK_COLOR_WARNING}",
                channel: "${params.SLACK_CHANNEL_2}",
                message: "*ABORTED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID}")
   } // aborted
 
   failure {
 
     echo "Sending message to Slack"
     slackSend (color: "${env.SLACK_COLOR_DANGER}",
                channel: "${params.SLACK_CHANNEL_2}",
                message: "*FAILED:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID}")
   } // failure
 
   success {
     echo "Sending message to Slack"
     slackSend (color: "${env.SLACK_COLOR_GOOD}",
                channel: "${params.SLACK_CHANNEL_2}",
                message: "*SUCCESS:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${env.USER_ID}")
   } // success
 
 } // post
} // pipeline
