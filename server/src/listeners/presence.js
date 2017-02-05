const r = require('../../horizon/server/src/horizon.js').r

const showPresence = (conn) => (err, nametag_presence) => {
  const id = nametag_presence.new_val.id
  r.db('nametag').table('nametags')
    .get(id)
    .update({present: true})
    .run(conn)
  setTimeout(() => r.db('nametag').table('nametag_presence')
      .get(id).run(conn)
      .then((ntp) =>
          ntp.present < Date.now() - 20000 ? r.db('nametag').table('nametags')
            .get(id)
            .update({present: false})
            .run(conn)
          : null
      ), 30000)
}

module.exports = (conn) =>  {
  r.db('nametag').table('nametag_presence').changes().run(conn)
    .then((feed) => feed.each(showPresence(conn)))
}