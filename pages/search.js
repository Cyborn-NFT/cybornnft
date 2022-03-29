import React, {useState, useEffect} from "react";
import axios from "axios";

function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('https://api.studio.thegraph.com/query/24428/cybornnft-rinkeby/v0.0.1')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p className="text-white">Loading...</p>
  if (!data) return <p className="text-white">No profile data</p>

  return (
    <div>
      <h1 className="text-white">{data.marketItemCreateds.id}</h1>
      <p className="text-white">{data.marketItemCreateds.seller}</p>
    </div>
  )
}

export default Profile;
