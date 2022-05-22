import { useRouter } from 'next/router';
import React from 'react';
function NFTDetails() {
  const router = useRouter();
  const {
    query: { nftDetails },
  } = router;
  console.log(nftDetails);
  return <h1>NFTDetails : {nftDetails}</h1>;
}

export default NFTDetails;
