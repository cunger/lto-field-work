async function verify(userName: string, userToken: string): Promise<boolean> {
  return Promise.resolve(true);
}

async function persist(data): Promise<boolean> {
  return Promise.resolve(true);
}

module.exports = {
  verify,
  persist
};
