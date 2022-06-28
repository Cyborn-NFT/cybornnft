import React from "react";

function Edit(){
  return(
    <div className='flex h-full flex-col md:flex-row lg:p-16 lg:mt-8 w-4/6'>

      <div className='p-10 flex-1 flex flex-col justify-center '>
        <div className='flex-col md:items-start'>
          <h1 className="text-blue-400 text-7xl text-extrabold">
            Edit Profile
          </h1>
          <br />
          <p className="font-extralight">Profile Image </p>
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
                <input id="dropzone" type="file" class="hidden" />
            </label>
          </div>
          <br />
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Wallet</p>
          <p> Wallet Address</p>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Display Name</p>
          <input
            placeholder='Display Name'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'

          />
          </div>

          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Email</p>
          <input type="email"
            placeholder='Email'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          />
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Set Password</p>
          <input type="password"
            placeholder='Set Password'
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
          <p>Youtube</p>
          <input type="text" placeholder="Enter Youtube Link"
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
          </input>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>LinkedIn</p>
          <input type="text" placeholder="Enter LinkedIn Link"
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
          </input>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <p>Pinterest</p>
          <input type="text" placeholder="Enter Pinterest Link"
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-transparent border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
          </input>
          </div>
          <br />
          <div className="lg:grid grid-cols-2 gap-4">
          <button
            className='block w-full mb-4 px-12 py-3 text-sm font-medium text-white rounded-md shadow bg-blue-400 sm:w-auto focus:outline-none focus:ring'
          >
            Save changes
          </button>
          <button
            className='block w-full mb-4 px-12 py-3 text-sm font-medium text-white rounded-md bg-transparent border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          >
            Cancel
          </button>

          </div>
        </div>
      </div>

  )
}

export default Edit;
