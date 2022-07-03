import React from "react";

function Activity(){
  return(
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
  )
}

export default Activity;
