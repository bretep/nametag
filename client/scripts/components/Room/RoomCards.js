import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import JoinedRoomCard from './JoinedRoomCard'
import StartRoomForm from './StartRoomForm'
import {track, identify} from '../../utils/analytics'
import {white} from '../../../styles/colors'

class RoomCards extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLogin: false
    }

    this.toggleLogin = () => {
      this.setState({showLogin: !this.state.showLogin})
    }
  }

  componentWillMount () {
    const postAuth = window.sessionStorage.getItem('postAuth')
    if (postAuth) {
      window.sessionStorage.removeItem('postAuth')
      window.location = postAuth
    }
  }

  componentDidUpdate (oldProps) {
    const {data: {loading, me}} = this.props
    if (oldProps.data.loading && !loading) {
      if (me) {
        identify(me.id, {'$name': me.displayNames[0]})
      }
      track('ROOMCARDS_VIEW')
    }
  }

  render () {
    const {
      data: {me, rooms, loading},
      latestMessageUpdatedSubscription,
      search
    } = this.props
    let nametagHash = {}
    if (me) {
      nametagHash = me.nametags.reduce((hash, nametag) => {
        if (!nametag.room) {
          return hash
        }
        hash[nametag.room.id] = nametag
        return hash
      }, {})
    }
    return <div id='roomCards'>
      <Navbar
        me={me}
        toggleLogin={this.toggleLogin} />
      <div style={styles.background}>
        <div style={styles.container}>
          {
            !me || me.nametags.length === 0 &&
            <div style={styles.header}>
              <div style={styles.headerText}>
                Online conversation that feels like an intimate dinner party.
              </div>
            </div>
          }
          {
            !loading && <StartRoomForm loggedIn={!!me && me.nametags.length > 0} />
          }
          {
            !loading &&
            me && me.nametags.length > 0 &&
            <div style={styles.joinedRooms}>
              <h3>Your Conversations</h3>
              <div style={styles.joinedRoomContainer}>
                {
                  me.nametags
                  .filter(nametag => !!nametag.room)
                  .map(nametag => {
                    console.log(nametag.room)
                    return <JoinedRoomCard
                      key={nametag.id}
                      room={nametag.room}
                      latestVisit={nametag.latestVisit} />
                  })
                }
              </div>
            </div>
          }
          <div style={styles.roomCards}>
            {
              !loading &&
              rooms &&
              rooms.length > 0 &&
              rooms
              .filter(room => !nametagHash[room.id])
              .map(room =>
                <RoomCard
                  key={room.id}
                  room={room}
                  me={me} />
              )
            }
          </div>
          <LoginDialog
            showLogin={this.state.showLogin}
            toggleLogin={this.toggleLogin}
            message='Log In or Register' />
        </div>
      </div>
    </div>
  }
}

const {string, arrayOf, shape} = PropTypes

RoomCards.propTypes = {
  data: shape({
    me: shape({
      id: string.isRequired,
      nametags: arrayOf(shape({
        id: string.isRequired,
        room: shape({
          id: string.isRequired,
          title: string.isRequired,
          mod: shape({
            id: string.isRequired,
            image: string,
            name: string.isRequired
          })
        })
      })).isRequired
    }),
    rooms: arrayOf(
      shape({
        id: string.isRequired
      }).isRequired
    )
  })
}

export default RoomCards

const styles = {
  background: {
    background: '#fbfbfb',
    minHeight: '100vh'
  },
  container: {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  joinedRoomContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  roomCards: {
    paddingBottom: 50,
    paddingTop: 50
  },
  header: {
    width: '100%',
    height: window.innerWidth * 494 / 1023,
    background: 'url(http://s3.amazonaws.com/nametag_images/site/nametag-header.jpg)',
    backgroundSize: 'cover',
    marginBottom: 40
  },
  headerText: {
    color: white,
    textAlign: 'center',
    fontSize: 32,
    padding: 10,
    paddingTop: window.innerWidth * 494 / 1023 - 80
  }
}
