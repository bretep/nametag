const passwordReset = require('./password-reset')
const emailConfirm = require('./email-confirm')
const badgeRequest = require('./badge-request')
const mention = require('./mention')
const reply = require('./reply')
const announcement = require('./announcement')
const publicRoom = require('./public-room')
const roomApproval = require('./room-approval')
const digest = require('./digest')

module.exports = {
  passwordReset,
  emailConfirm,
  badgeRequest,
  mention,
  reply,
  publicRoom,
  roomApproval,
  announcement,
  digest
}
