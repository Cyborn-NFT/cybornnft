export default function handler(req, res) {

  const arkhammTokenId = req.query.tokenId;


  res.status(200).json({
    name: "Arkhamm #" + arkhammTokenId,
    description: "Arkhamm NFT",
    image: "https://gateway.pinata.cloud/ipfs/QmNc3XXN7xm4omWwHWXaGGeh5jBJY6vwrWT6dH6K8YGpV7",
  });
}
