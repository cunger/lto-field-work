type Signature = {
  name: string,
  email: string,
  token: string,
  verified: boolean,
};

function Signature(name, email, token): Signature {
  return {
    name: name,
    email: email,
    token: token,
    verified: false
  }
}

export default Signature;
