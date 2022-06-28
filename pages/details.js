import React from "react";

function details(){
  return(
    <div className="lg:p-32">
      <p className="lg:p-8 font-extralight"> Back to The Marketplace </p>
      <div className="lg:grid grid-cols-2 gap-4">
        <img className="w-5/6" src="/avatar.png" />
        <div>
          <br />
          <p>Futuristic</p>
          <br />
          <h1>Item Title</h1>
          <br />
          <p>Owned By &nbsp;<span className="font-extralight">wallet/author</span></p>
          <br />
          <p className="font-extralight">Clock Icon &nbsp;<span className="font-extralight">Sale ends Apr 1 2022 at 10am WITA</span></p>
          <p className="font-extralight"></p>
          <br />
          <h1>Price</h1>
          <br />
            <br />
          <div>
          <button className='font-extralight lg:w-2/6 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50'>
            Buy Now
          </button>
          </div>
          <br />
          <div>
          <button className='font-extralight lg:w-2/6 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50'>
            Make Offer
          </button>
          </div>
          <br />
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-white">
                <thead class="text-xs text-gray-700 uppercase bg-transparent">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Offers
                        </th>
                        <th scope="col" class="px-6 py-3">
                            About
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Information
                        </th>
                        <th scope="col" class="px-6 py-3">
                            History
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-transparent border-b dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            Price
                        </th>
                        <td class="px-6 py-4">
                            About
                        </td>
                        <td class="px-6 py-4">
                            Info
                        </td>
                        <td class="px-6 py-4">
                            History
                        </td>
                    </tr>
                    <tr class="bg-transparent border-b dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            Price
                        </th>
                        <td class="px-6 py-4">
                            About Details 2
                        </td>
                        <td class="px-6 py-4">
                            Info Details 2
                        </td>
                        <td class="px-6 py-4">
                            History Details 2
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
        <p>Created By &nbsp;<span className="font-extralight">Owner Address</span></p>
        <br />
        <p>About &nbsp;<span className="font-extralight">Collection Name</span></p>
        <br />
        <p className="font-extralight">Some Paragraph go here about the collection and author tags</p>
      </div>
      <br />
      <h6 className="lg:mt-32"> More from this collection </h6>
      <br />
      <div className="lg:grid grid-cols-4 gap-4">
      <div className="max-w-sm card rounded-lg border border-gray-200 shadow-md card dark:border-gray-700">
        <a href="#">
            <img className="rounded-t-lg w-full" src="/avatar.png" alt="" />
        </a>
        <div class="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight">Collection Title</h5>
            <p className="mb-3 font-normal">Some Description</p>
        </div>
      </div>
      </div>
      <br />
      <div className="lg:grid grid-cols-3 gap-4">
      <div>
      </div>
      <button className='font-extralight lg:mt-24 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50'>
        More from this collection
      </button>
      <div>
      </div>
      </div>

      <h6 className="lg:mt-60"> More from this collection </h6>
      <br />
      <div className="lg:grid grid-cols-4 gap-4">
      <div className="max-w-sm card rounded-lg border border-gray-200 shadow-md card dark:border-gray-700">
        <a href="#">
            <img className="rounded-t-lg w-full" src="/avatar.png" alt="" />
        </a>
        <div class="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight">Collection Title</h5>
            <p className="mb-3 font-normal">Some Description</p>
        </div>
      </div>
      </div>
      <div className="lg:grid grid-cols-3 gap-4">
      <div>
      </div>
      <button className='font-extralight lg:mt-24 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50'>
        More from this owner
      </button>
      <div>
      </div>
      </div>
    </div>
  )
}

export default details;
