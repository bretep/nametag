import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let certificateSubscriptions = {}

export const addBadge = (certificate, id) => {
  return {
    type: constants.ADD_CERTIFICATE,
    certificate,
    id
  }
}

export const updateBadge = (id, property, value) => {
  return {
    type: constants.UPDATE_CERTIFICATE,
    id,
    property,
    value
  }
}

/*
* Fetches to a badges
*
* @params
*    none
*
* @returns
*    Promise resolving to certificate
*/
export function fetchBadge (certificateId) {
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      certificateSubscriptions[certificateId] = hz('badges')
        .find(certificateId).fetch().subscribe(
          (certificate) => {
            if (certificate) {
              resolve(dispatch(addBadge(certificate, certificateId)))
            } else {
              reject('Badge not found')
            }
          },
          (err) => {
            reject(err)
          })
    })
    .catch(errorLog('Error subscribing to certificate ' + certificateId + ': '))
  }
}

/*
* Creates a certificate
*
* @params
*    creator: User id of the person creating this certificate. This violates the
*        no-user-ids principle, and will be replaced with an organization id in the future.
*    decription: A description of the certificate.
*    granter: The name of the granting organization.
*    icon: The (optional) icon for this certificate.
*    name: The name appearing on this certificate.
*    note: An initial note for this certificate
*    granted: Optional, denotes whether the certificate has been granted
*
* @returns
*    Promise resolving to the newly created certificate
*/
export function createBadge (
  creator,
  descriptionArray,
  granter,
  iconArray,
  name,
  notes,
  granted) {
  return (dispatch) => {
    const certificate = {
      creator,
      description_array: descriptionArray,
      granter,
      icon_array: iconArray,
      name,
      notes,
      granted
    }
    return new Promise((resolve, reject) => {
      hz('badges').insert(certificate).subscribe((cert) => {
        dispatch(addBadge({...certificate, id: cert.id}, cert.id))
        resolve(cert)
      }, reject)
    })
    .catch(errorLog('Error creating a certificate: '))
  }
}

/*
* Marks a certificate as granted
*
* Note: This is faking an action which will later be handled with cryptography,
* badges should not be mutable!
*
* @params
*    id: The id of the certificate being granted.
*
* @returns
*    Promise resolving to the response from the certificate creation process.
*/

export function grantBadge (id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('badges').update({id, granted: true}).subscribe((result) => {
        dispatch(updateBadge(id, 'granted', true))
        resolve(result)
      }, reject)
    })
    .catch(errorLog('Error granting certificate ' + id + ': '))
  }
}