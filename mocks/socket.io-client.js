const callbacks = {};

export const emit = (event, payload) => {
  callbacks[event](payload);
};

export const on = jest.fn((event, cb) => {
  callbacks[event] = cb;
});

export default (url, options) => ({
  url,
  options,
  on,
  disconnect: jest.fn(),
  removeAllListeners: jest.fn(),
  connect: jest.fn(),
  io: {
    opts: {
      query: {},
    },
  },
});
