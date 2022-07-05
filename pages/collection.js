import React from "react";
import {useEffect, useState} from "react";

function Collection({collection}){


  const [collectionState, setcollectionState] = useState([]);
  const [image, setImage] = useState(null);
  const [collectionName, setcollectionName] = useState("")
  const [url, seturl] = useState("")
  const [description, setdescription] = useState("")
  const [creatorEarning, setcreatorEarning] = useState("");
  const [blockchain, setblockchain] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setcollectionState(collection);
    setImage(collection);
    setcollectionName(collection);
    seturl(collection);
    setdescription(collection);
    setcreatorEarning(collection);
    setblockchain(collection);
  }, [collection]);

  let submitcollection = async(e) => {
    setLoading(true);
    e.preventDefault();
    let res = await fetch("http://localhost:3000/api/collection", {
      method: "POST",
      body: JSON.stringify({
        image: image,
        collectionName: collectionName,
        url: url,
        description: description,
        creatorEarning: creatorEarning,
        blockchain: blockchain,
      }),
    });

    res = await res.json();
    setcollectionState([...collectionState, res]);
    setImage(e.target.files);
    setWalletAddress("");
    setcollectionName("");
    seturl("");
    setdescription("");
    setcreatorEarning("");
    setblockchain("");
    setLoading(false);
  };


  return(
    <div className='flex h-full flex-col md:flex-row lg:p-16 lg:mt-8 w-4/6'>
      <form onSubmit={submitcollection}>
      <div className='p-10 flex-1 flex flex-col justify-center '>
        <div className='flex-col md:items-start'>
          <h1 className="text-blue-400 text-7xl text-extrabold">
            Edit collection
          </h1>
          <br />
          <p className="font-extralight">collection Image </p>
          <br />
          <p className="font-extralight">File types supported: JPG, PNG. Recommended: 300 x 300 px. Max Size: 10MB</p>
          <br />
          <br />
          <div class="flex text-center">
            <label for="dropzone" class="flex flex-col justify-center items-center w-3/5 bg-transparent rounded-full border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-white/25 dark:bg-transparent hover:bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone" onChange={(e)=>setImage(e.target.file)} type="file" class="hidden" />
            </label>
          </div>
          <br />
          <br />

          <div className="lg:grid grid-cols-2 gap-4">
          <p>Collection Name</p>
          <input
            placeholder='Collection Name'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            name="collectionName"
            onChange={(e)=> setcollectionName(e.target.value) }
            value={collectionName}
          />
          </div>

          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>URL</p>
          <input
            placeholder='URL'
            name="url"
            value={url}
            onChange={(e)=> seturl(e.target.value)}
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          />
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Description</p>
          <input
            placeholder='Description'
            name="description"
            value={description}
            onChange = {(e)=> setdescription(e.target.value)}
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          />
          </div>
          <br />
          <p>Socials</p>
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Facebook</p>
          <button
            className='block w-full px-12 py-3 text-sm font-medium text-white rounded-full bg-transparent border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
            Connect Facebook
          </button>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Twitter</p>
          <button
            className='block w-full px-12 py-3 text-sm font-medium text-white rounded-full bg-transparent border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
            Connect Twitter
          </button>
          </div>
          </div>
          <br />
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Creator Earnings</p>
          <input placeholder="Percentage Fee" name="creatorEarning" value={creatorEarning} onChange={(e)=>setcreatorEarning(e.target.value)}
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
          </input>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Blockchain</p>
          <input placeholder="Select Blockchain" name="blockchain" value={blockchain} onChange={(e)=>setblockchain(e.target.value)}
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
          </input>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <button type="submit"
            disabled = {loading ? true : false}
            className='block w-full mb-4 px-12 py-3 text-sm font-medium text-white rounded-md shadow bg-blue-400 sm:w-auto focus:outline-none focus:ring'
          >
            Submit changes
          </button>
          <button
            className='block w-full mb-4 px-12 py-3 text-sm font-medium text-white rounded-md bg-transparent border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
            Cancel
          </button>

          </div>
        </div>
        </form>
      </div>

  )
}

export default Collection;
