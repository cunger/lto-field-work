type Signature = {
  name: string,
  token: string,
  verified: boolean,
};

function Signature(name, token): Signature {
  return {
    name: name,
    token: token,
    verified: false
  }
}

export default Signature;
