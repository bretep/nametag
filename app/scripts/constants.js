export const dragTypes = {
  certificate: 'certificate',
}

export default {

  // Actions
  ADD_ROOM: 'ADD_ROOM',
  SET_ROOM_NT_COUNT: 'SET_ROOM_NT_COUNT',
  ADD_NAMETAG: 'ADD_NAMETAG',
  ADD_USER_NT_CERT: 'ADD_USER_NT_CERT',
  REMOVE_USER_NT_CERT: 'REMOVE_USER_NT_CERT',
  UPDATE_USER_NAMETAG: 'UPDATE_USER_NAMETAG',
  ADD_USER_NAMETAG: 'ADD_USER_NAMETAG',
  ADD_USER: 'ADD_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  ADD_CERTIFICATE: 'ADD_CERTIFICATE',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_ROOM_PROP: 'SET_ROOM_PROP',
  ADD_ROOM_MESSAGE: 'ADD_ROOM_MESSAGE',
  ADD_REACTION: 'ADD_REACTION',
  USER_SETTING: 'USER_SETTING',
  UPDATE_USER_ARRAY: 'UPDATE_USER_ARRAY',

  // Timers
  ANIMATION_LONG: 400,

  // URLs
  RESIZE_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_resize',
  IMAGE_URL_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image',
}
