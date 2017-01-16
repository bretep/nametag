import React from 'react'
import {List, ListItem} from 'material-ui/List'

const Notifications = ({userNametags, rooms, roomId}) =>
  <div>
    <List>
    {Object.keys(userNametags).map((id) => {
      const room = rooms[id]
      const userNametag = userNametags[id]

      const newMessages = userNametag.latestMessage > userNametag.latestVisit ?
        styles.newMessages : styles.noNewMessages
      return room && roomId !== id && <ListItem innerDivStyle={styles.notification} key={id}>
          <a href={`/rooms/${id}`} style={styles.link}>
            <div>
              <img src={room.image} style={{...styles.roomImage, ...newMessages}}/>
            </div>
            <div style={newMessages}>{room.title}</div>
          </a>
        </ListItem>
    })}
    </List>
  </div>

export default Notifications

const styles = {
  newMessages: {
    color: '#FFF',
  },
  noNewMessages: {
    opacity: 0.5,
  },
  notification: {
    margin: 5,
    padding: 5,
  },
  roomImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    objectFit: 'cover',
    borderRadius: 15,
  },
  link: {
    color: '#FFF',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
  },
}