async function verify(userName, userToken) {
  return Promise.resolve(true);
}

async function persist(data) {
  return Promise.resolve(true);
}

module.exports = {
  verify,
  persist
};
