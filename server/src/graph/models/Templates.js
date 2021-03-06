const {db} = require('../../db')
// const errors = require('../../errors')

const templatesTable = db.table('templates')

/**
 * Returns a badge template from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => id ? templatesTable.get(id).run(conn) : Promise.resolve(null)

/**
 * Returns an array of badge templates from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the ids of the badges to be retrieved
 *
 */

const getAll = ({conn}, ids) => templatesTable.getAll(...ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Returns an array of badge templates for a particular badge granter.
 *
 * @param {Object} context     graph context
 * @param {String} granterId   the id of the badge granter
 *
 */

const getGranterTemplates = ({conn}, granterId) => templatesTable.getAll(granterId, {index: 'granter'}).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a badge template
 *
 * @param {Object} context     graph context
 * @param {Object} template   the badge template to be created
 *
 **/

const create = ({conn}, template) => {
  const templateObj = Object.assign({}, template, {createdAt: new Date(), updatedAt: new Date()})
  return templatesTable.insert(templateObj).run(conn)
    .then(res => Object.assign({}, templateObj, {id: res.generated_keys[0]}))
}

/**
 * Creates and automatically grants a badge template to the currently logged in user
 *
 * @param {Object} context     graph context
 * @param {Object} template   the badge template to be created
 * @param {String} note   a note to be appended when the badge is granted
 * @param {String} email (optional) the e-mail address of the person other than
 *            the currently logged in user who should recieve this badge.
 *
 * Note: the email parameter should only be used when creating an administrator
 * for a new badge granting organization.
 **/

const createAndGrant = (context, template, note, email) => {
  const {user, models: {Nametags, Users}} = context
  const createPromise = name => create(context, template)
    .then(templ => Promise.all([
      templ,
      Nametags.create({
        name,
        bio: templ.description,
        template: templ.id
      }, email)
    ]))

  if (email) {
    return Users.getByEmail(email)
      .then(({displayNames}) => createPromise(displayNames[0]))
  }
  return createPromise(user.displayNames[0])
}

module.exports = (context) => ({
  Templates: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getGranterTemplates: (granterId) => getGranterTemplates(context, granterId),
    create: badge => create(context, badge),
    createAndGrant: (template, note, email) => createAndGrant(context, template, note, email)
  }
})
