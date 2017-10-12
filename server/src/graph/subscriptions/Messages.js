const pubsub = require('./pubsub')
const {APIError, errorLog} = require('../../errors')
const {db} = require('../../db')

const MessageSubscription = ({conn, models: {Rooms, Messages}}) => db.table('messages').changes().run(conn)
  .then(feed => {
    feed.each((err, message) => {
      if (err) {
        errorLog(new APIError('Error in message subscription feed'))
        return
      }
      if (!message.old_val) {
        // Send a new room message notification if necessary
        Rooms.notifyOfNewMessage(message.new_val.room)
        if (message.new_val.text.match('developer')) {
        setTimeout(() => {
            Messages.create({
              author:  "9b3177dd-778b-4032-a306-c902fcec20df" ,
              room:  "40bed376-768c-4a03-8e62-285f5a426b13" ,
              text:  "Thanks for joining! I think many of us can relate to that experience."
            })
          }, 5000)
        }
        setTimeout(() => {
            Messages.create({
              author:  "9b3177dd-778b-4032-a306-c902fcec20df" ,
              room:  "40bed376-768c-4a03-8e62-285f5a426b13" ,
              text:  "@David Jay I'd love to invite you to join our member community, we have regular conversations about these issues."
            })
          }, 8000)
        }
      }
      if (!message.new_val) {
        pubsub.publish('messageDeleted', message.old_val)
      } else {
        // Send the message to people in the room
        pubsub.publish('messageAdded', message.new_val)
      }
    })
  })

module.exports = MessageSubscription
