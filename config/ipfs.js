//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
// const ipfsApi = require('ipfs-api');
// const ipfs = ipfsApi('ipfs.18.192.53.115.nip.io'); // stagging IPFS server

const ipfsHttpClient = require("ipfs-http-client");
const ipfs = ipfsHttpClient.create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

export default ipfs;
