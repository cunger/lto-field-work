type Signature = {
  name?: string,
  email?: string,
  token?: string,
  verified: boolean,
};

function Signature(name: string | undefined, email: string | undefined, token: string | undefined): Signature {
  return {
    name: name,
    email: email,
    token: token,
    verified: false
  }
}

export default Signature;
