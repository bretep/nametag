import React, {PropTypes} from 'react'
import NavBar from '../utils/NavBar'
import GranterInfo from './GranterInfo'
import BadgeRequest from '../Badge/BadgeRequest'
import Templates from '../Badge/Templates'
import CircularProgress from 'material-ui/CircularProgress'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

const Granter = ({data: {granter, me, loading}, createBadge, updateBadgeRequestStatus, addNote}) =>
  loading
    ? <CircularProgress style={styles.spinner} />
    : <div>
      <NavBar me={me} />
      <div id='granterDetail' style={styles.granterDetail}>
        <GranterInfo granter={granter} />
        <ReactCSSTransitionGroup
          transitionName='fade'
          style={styles.badgeRequests}
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={1500}>
          {
            granter.badgeRequests.map(badgeRequest =>
              <div
                key={badgeRequest.id}>
                <BadgeRequest
                  badgeRequest={badgeRequest}
                  createBadge={createBadge}
                  updateBadgeRequestStatus={updateBadgeRequestStatus} />
              </div>
            )
          }
        </ReactCSSTransitionGroup>
        <Templates
          addNote={addNote}
          templates={granter.templates}
          granterCode={granter.urlCode} />
      </div>
    </div>

const {shape, string, cool, object, arrayOf, func, bool} = PropTypes

Granter.propTypes = {
  data: shape({
    loading: bool.isRequired,
    granter: shape({
      badgeRequests: arrayOf(object.isRequired).isRequired,
      templates: arrayOf(object.isRequired).isRequired
    }),
    me: shape({
      id: string.isRequired
    })
  }).isRequired,
  createBadge: func.isRequired,
  addNote: func.isRequired,
  updateBadgeRequestStatus: func.isRequired
}

export default radium(Granter)

const styles = {
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  },
  badgeRequests: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  granterDetail: {
    paddingLeft: '20%',
    paddingRight: '20%',
    [mobile]: {
      paddingLeft: '5%',
      paddingRight: '5%'
    }
  }
}