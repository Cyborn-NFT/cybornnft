import { useState, useEffect } from 'react';
import { supabase } from '../client'
import { useRouter } from 'next/router'
import CybornHeader from "/components/CybornHeader"
import CybornFooter from "/components/CybornFooter"
import Image from 'next/image'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const router = useRouter()
  useEffect(() => {
    fetchProfile()
  }, [])
  async function fetchProfile() {
    const profileData = await supabase.auth.user()
    if (!profileData) {
      router.push('/signin')
    } else {
      setProfile(profileData)
    }
  }
  async function signOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  const [fileUrl, setFileUrl] = useState(null)
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }


  if (!profile) return null
  return (
    <div>
    <CybornHeader />
    <hr />
    <br />
    <div className="text-white lg:grid grid-cols-1 gap-4">
    <div className="px-6 flex items-center sm:flex-row flex-wrap">

      <div className="h-32 w-32 mb-4 lg:mb-0 mr-4">
          <img src={fileUrl} alt className="h-full w-full rounded-full overflow-hidden shadow" />
       </div>
       <input name="Asset" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={onChange} type="file" />
    </div>

    <br />

      </div>
    <br/>
    <CybornFooter />
    </div>
  )
}
