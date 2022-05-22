import { useRouter } from 'next/router';
import React from 'react';
function CollectionDetails() {
  const router = useRouter();
  const {
    query: { collectionDetails },
  } = router;
  console.log(collectionDetails, router);
  return <h1>collectionDetails : {collectionDetails}</h1>;
}

export default CollectionDetails;
