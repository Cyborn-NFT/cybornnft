import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { actions } from '../actions';

function MainListingPage(props) {
  const { getCollections, allCollections, getAllCreators, allCreators } = props;
  console.log(allCollections);
  useEffect(() => {
    getAllCreators();
    getCollections();
  }, []);
  console.log(allCreators);
  return (
    <div className='relative container mx-auto p-6'>
      <div className='justify-between flex mt-10 mb-5'>
        <h2 className='title text-3xl sm:text-5xl gradient-text'>
          Collections
        </h2>
        <button className='button button-primary'>View More</button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4'>
        {allCollections?.map((collection, key) => (
          <div key={key} className='card p-5'>
            <div className='grid grid-cols-3 gap-3 mb-3'>
              <img
                className='rounded-full'
                src={collection.logo.replace('undefined/', '')}
                alt='User'
                title='User'
              />
              <div className='col-span-2 my-auto'>
                <h3 className='text-base'>{collection.name}</h3>
                <span className='text-sm font-light'>
                  by{' '}
                  <a href='#!' className='text-pink-500 hover:text-white'>
                    Miyazaki
                  </a>
                </span>
                <p className='text-sm font-light'>{collection.description}</p>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-3'>
              <img
                className='rounded-xl'
                src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
                alt='Name'
                title='Name'
              />
              <img
                className='rounded-xl'
                src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
                alt='Name'
                title='Name'
              />
              <img
                className='rounded-xl'
                src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
                alt='Name'
                title='Name'
              />
            </div>
          </div>
        ))}

        {/* <div className='card p-5'>
          <div className='grid grid-cols-3 gap-3 mb-3'>
            <img
              className='rounded-full'
              src='./avatar.png'
              alt='User'
              title='User'
            />
            <div className='col-span-2 my-auto'>
              <h3 className='text-base'>The Ghibli Collection</h3>
              <span className='text-sm font-light'>
                by{' '}
                <a href='#!' className='text-pink-500 hover:text-white'>
                  Miyazaki
                </a>
              </span>
              <p className='text-sm font-light'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
                adipiscing eget.
              </p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <img
              className='rounded-xl'
              src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
              alt='Name'
              title='Name'
            />
            <img
              className='rounded-xl'
              src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
              alt='Name'
              title='Name'
            />
            <img
              className='rounded-xl'
              src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
              alt='Name'
              title='Name'
            />
          </div>
        </div> */}
        {/* <div className='card p-5'>
          <div className='grid grid-cols-3 gap-3 mb-3'>
            <img
              className='rounded-full'
              src='./avatar.png'
              alt='User'
              title='User'
            />
            <div className='col-span-2 my-auto'>
              <h3 className='text-base'>The Ghibli Collection</h3>
              <span className='text-sm font-light'>
                by{' '}
                <a href='#!' className='text-pink-500 hover:text-white'>
                  Miyazaki
                </a>
              </span>
              <p className='text-sm font-light'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
                adipiscing eget.
              </p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <img
              className='rounded-xl'
              src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
              alt='Name'
              title='Name'
            />
            <img
              className='rounded-xl'
              src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
              alt='Name'
              title='Name'
            />
            <img
              className='rounded-xl'
              src='https://ipfs.infura.io/ipfs/Qmcf6atjg49wdajjgcLcdFT1z5SjAhAWhWUiMdqwULHVPm'
              alt='Name'
              title='Name'
            />
          </div>
        </div> */}
      </div>
      <div className='justify-between flex mb-5 mt-20'>
        <h2 className='title text-3xl sm:text-5xl gradient-text'>
          Our Creators
        </h2>
        <button className='button button-primary'>View More</button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4'>
        {allCreators?.map((creator, key) => (
          <div key={key} className='card'>
            <div className='px-8'>
              <img
                className='rounded-full mx-auto py-3'
                src={creator.profile?.replace('undefined/', '')}
                alt='User'
                title='User'
              />
              <h3 className='text-base text-center'>{creator.name}</h3>
              <p className='text-base font-light text-center my-3'>
                {creator.bio}
              </p>
              <div className='flex justify-center gap-4 mb-8'>
                <a href='#!' className='text-white hover:text-pink-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    data-icon='facebook'
                    viewBox='0 0 320 512'
                    width='18'
                    height='18'
                  >
                    <path
                      fill='currentColor'
                      d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                    />
                  </svg>
                </a>
                <a href='#!' className='text-white hover:text-pink-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    data-icon='twitter'
                    viewBox='0 0 512 512'
                    width='18'
                    height='18'
                  >
                    <path
                      fill='currentColor'
                      d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                    />
                  </svg>
                </a>
                <a href='#!' className='text-white hover:text-pink-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    data-icon='instagram'
                    viewBox='0 0 448 512'
                    width='18'
                    height='18'
                  >
                    <path
                      fill='currentColor'
                      d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                    />
                  </svg>
                </a>
                <a href='#!' className='text-white hover:text-pink-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    data-icon='youtube'
                    viewBox='0 0 576 512'
                    width='18'
                    height='18'
                  >
                    <path
                      fill='currentColor'
                      d='M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'
                    />
                  </svg>
                </a>
                <a href='#!' className='text-white hover:text-pink-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    data-icon='linkedin'
                    viewBox='0 0 448 512'
                    width='18'
                    height='18'
                  >
                    <path
                      fill='currentColor'
                      d='M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'
                    />
                  </svg>
                </a>
                <a href='#!' className='text-white hover:text-pink-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    data-icon='pinterest'
                    viewBox='0 0 384 512'
                    width='18'
                    height='18'
                  >
                    <path
                      fill='currentColor'
                      d='M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z'
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className='card-link'>
              <button className='button-card py-2'>View Profile</button>
            </div>
          </div>
        ))}
        {/* <div className='card'>
          <div className='px-8'>
            <img
              className='rounded-full mx-auto py-3'
              src='./avatar.png'
              alt='User'
              title='User'
            />
            <h3 className='text-base text-center'>Creator Name</h3>
            <p className='text-base font-light text-center my-3'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
              tellus potenti faucibus facilisis. Id quam cras aliquam ultrices.
            </p>
            <div className='flex justify-center gap-4 mb-8'>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='facebook'
                  viewBox='0 0 320 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='twitter'
                  viewBox='0 0 512 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='instagram'
                  viewBox='0 0 448 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='youtube'
                  viewBox='0 0 576 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='linkedin'
                  viewBox='0 0 448 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='pinterest'
                  viewBox='0 0 384 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z'
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className='card-link'>
            <button className='button-card py-2'>View Profile</button>
          </div>
        </div> */}
        {/* <div className='card'>
          <div className='px-8'>
            <img
              className='rounded-full mx-auto py-3'
              src='./avatar.png'
              alt='User'
              title='User'
            />
            <h3 className='text-base text-center'>Creator Name</h3>
            <p className='text-base font-light text-center my-3'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
              tellus potenti faucibus facilisis. Id quam cras aliquam ultrices.
            </p>
            <div className='flex justify-center gap-4 mb-8'>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='facebook'
                  viewBox='0 0 320 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='twitter'
                  viewBox='0 0 512 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='instagram'
                  viewBox='0 0 448 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='youtube'
                  viewBox='0 0 576 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='linkedin'
                  viewBox='0 0 448 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='pinterest'
                  viewBox='0 0 384 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z'
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className='card-link'>
            <button className='button-card py-2'>View Profile</button>
          </div>
        </div> */}
        {/* <div className='card'>
          <div className='px-8'>
            <img
              className='rounded-full mx-auto py-3'
              src='./avatar.png'
              alt='User'
              title='User'
            />
            <h3 className='text-base text-center'>Creator Name</h3>
            <p className='text-base font-light text-center my-3'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
              tellus potenti faucibus facilisis. Id quam cras aliquam ultrices.
            </p>
            <div className='flex justify-center gap-4 mb-8'>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='facebook'
                  viewBox='0 0 320 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='twitter'
                  viewBox='0 0 512 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='instagram'
                  viewBox='0 0 448 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='youtube'
                  viewBox='0 0 576 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='linkedin'
                  viewBox='0 0 448 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'
                  />
                </svg>
              </a>
              <a href='#!' className='text-white hover:text-pink-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  data-icon='pinterest'
                  viewBox='0 0 384 512'
                  width='18'
                  height='18'
                >
                  <path
                    fill='currentColor'
                    d='M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z'
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className='card-link'>
            <button className='button-card py-2'>View Profile</button>
          </div>
        </div> */}
      </div>
      <div className='justify-between flex mb-5 mt-20'>
        <h2 className='title text-3xl sm:text-5xl gradient-text'>All Works</h2>
        <button className='button button-primary'>View More</button>
      </div>
      <div className='flex-col lg:flex-row lg:justify-between flex gap-3'>
        <div className='flex gap-4 my-auto'>
          <a href='#!' className='text-white font-bold hover:text-pink-500'>
            All
          </a>
          <a href='#!' className='text-white font-light hover:text-pink-500'>
            Art
          </a>
          <a href='#!' className='text-white font-light hover:text-pink-500'>
            Video
          </a>
          <a href='#!' className='text-white font-light hover:text-pink-500'>
            Audio
          </a>
        </div>
        <div className='flex gap-8 my-auto'>
          <div>
            <label htmlFor='input-status' className='mr-3'>
              Status:
            </label>
            <select
              id='input-status'
              className='bg-transparent rounded-md border border-white p-1'
            >
              <option value='all'>All</option>
              <option value='buy'>Buy Now</option>
              <option value='new'>New</option>
              <option value='auction'>On Auction</option>
              <option value='offer'>Has Offers</option>
            </select>
          </div>
          <div>
            <label htmlFor='input-sort' className='mr-3'>
              Sort by:
            </label>
            <select
              id='input-sort'
              className='bg-transparent rounded-md border border-white p-1'
            >
              <option value='latest'>Latest</option>
              <option value='lowest'>Price: Low to High</option>
              <option value='highest'>Price: High to Low</option>
              <option value='ending'>Ending Soon</option>
            </select>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4'>
        <div className='card'>
          <div className='px-5'>
            <div className='flex flex-start my-1'>
              <svg
                className='inline-block mr-2 my-auto fill-pink-500'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
                width='18'
                height='18'
              >
                <path d='M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z' />
              </svg>
              <p className='font-light text-sm inline-block my-auto'>
                Ending Apr 1, 2022
              </p>
            </div>
            <img
              className='rounded-3xl mx-auto'
              src='https://ipfs.infura.io/ipfs/QmUrG5nGQU6eqRtGPkYgouyNnaFJuHqMoo8EhcQddZNm95'
              alt='Title'
              title='Title'
            />
            <div className='flex justify-between mt-1'>
              <h4 className='text-lg font-base my-auto'>Title Here</h4>
              <div className='relative'>
                <button className='button-share text-white hover:text-pink-500'>
                  <svg
                    viewBox='0 0 14 4'
                    fill='none'
                    width='16'
                    height='16'
                    xlmns='http://www.w3.org/2000/svg'
                    className='inline-block'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2ZM8.5 2C8.5 2.82843 7.82843 3.5 7 3.5C6.17157 3.5 5.5 2.82843 5.5 2C5.5 1.17157 6.17157 0.5 7 0.5C7.82843 0.5 8.5 1.17157 8.5 2ZM11.999 3.5C12.8274 3.5 13.499 2.82843 13.499 2C13.499 1.17157 12.8274 0.5 11.999 0.5C11.1706 0.5 10.499 1.17157 10.499 2C10.499 2.82843 11.1706 3.5 11.999 3.5Z'
                      fill='currentColor'
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className='font-light text-sm'>Collection Name</p>
            <div className='flex my-2'>
              <img
                className='rounded-full w-12 mr-3'
                src='./avatar.png'
                alt='User'
                title='User'
              />
              <div className='my-auto'>
                <p className='font-bold'>Created by</p>
                <p className='font-light'>Creator Name</p>
              </div>
            </div>
            <div className='flex justify-between mb-3'>
              <span className='font-bold my-auto'>Current Bid</span>
              <div>
                <img
                  className='w-3 inline-block mr-2'
                  src='/ethereum.svg'
                  alt='ETH'
                  title='ETH'
                />
                <span className='font-light inline-block my-auto'>
                  0.0000245 ETH
                </span>
              </div>
            </div>
          </div>
          <div className='card-link'>
            <button className='button-card py-2'>Bid Now</button>
          </div>
        </div>
        <div className='card'>
          <div className='px-5'>
            <div className='flex flex-start my-1 invisible'>
              <svg
                className='inline-block mr-2 my-auto fill-pink-500'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
                width='18'
                height='18'
              >
                <path d='M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z' />
              </svg>
              <p className='font-light text-sm inline-block my-auto'>-</p>
            </div>
            <img
              className='rounded-3xl mx-auto'
              src='https://ipfs.infura.io/ipfs/QmQEpikr6GhU9FbkRyU46CPaJuj7RzCtQYbr1TjNp6JeUx'
              alt='Title'
              title='Title'
            />
            <div className='flex justify-between mt-1'>
              <h4 className='text-lg font-base my-auto'>Title Here</h4>
              <button className='button-share text-white hover:text-pink-500'>
                <svg
                  viewBox='0 0 14 4'
                  fill='none'
                  width='16'
                  height='16'
                  xlmns='http://www.w3.org/2000/svg'
                  className='inline-block'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.5 2C3.5 2.82843 2.82843 3.5 2 3.5C1.17157 3.5 0.5 2.82843 0.5 2C0.5 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2ZM8.5 2C8.5 2.82843 7.82843 3.5 7 3.5C6.17157 3.5 5.5 2.82843 5.5 2C5.5 1.17157 6.17157 0.5 7 0.5C7.82843 0.5 8.5 1.17157 8.5 2ZM11.999 3.5C12.8274 3.5 13.499 2.82843 13.499 2C13.499 1.17157 12.8274 0.5 11.999 0.5C11.1706 0.5 10.499 1.17157 10.499 2C10.499 2.82843 11.1706 3.5 11.999 3.5Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </button>
            </div>
            <p className='font-light text-sm'>Collection Name</p>
            <div className='flex my-2'>
              <img
                className='rounded-full w-12 mr-3'
                src='./avatar.png'
                alt='User'
                title='User'
              />
              <div className='my-auto'>
                <p className='font-bold'>Created by</p>
                <p className='font-light'>Creator Name</p>
              </div>
            </div>
            <div className='flex justify-between mb-3'>
              <span className='font-bold my-auto'>Price</span>
              <div>
                <img
                  className='w-3 inline-block mr-2'
                  src='/ethereum.svg'
                  alt='ETH'
                  title='ETH'
                />
                <span className='font-light inline-block my-auto'>
                  0.0000245 ETH
                </span>
              </div>
            </div>
          </div>
          <div className='card-link'>
            <button className='button-card py-2'>Buy</button>
          </div>
        </div>
      </div>
      <div className='justify-center flex mb-5 mt-20'>
        <h2 className='title text-3xl sm:text-5xl gradient-text'>
          Explore NFTs
        </h2>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4'>
        <div className='card text-center p-10'>
          <img
            src='./collections-icon.svg'
            className='mx-auto my-5'
            title='Collections'
            alt='Collections'
          />
          <h3 className='my-5'>Collections</h3>
          <p className='font-light mb-8'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus
            nulla amet egestas donec lacus augue luctus.
          </p>
          <button className='button button-primary'>View Collections</button>
        </div>
        <div className='card text-center p-10'>
          <img
            src='./all-works-icon.svg'
            className='mx-auto my-5'
            title='Collections'
            alt='Collections'
          />
          <h3 className='my-5'>All Works</h3>
          <p className='font-light mb-8'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus
            nulla amet egestas donec lacus augue luctus.
          </p>
          <button className='button button-primary'>View Works</button>
        </div>
        <div className='card text-center p-10'>
          <img
            src='./creators-icon.svg'
            className='mx-auto my-5'
            title='Collections'
            alt='Collections'
          />
          <h3 className='my-5'>Creators</h3>
          <p className='font-light mb-8'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus
            nulla amet egestas donec lacus augue luctus.
          </p>
          <button className='button button-primary'>View Creators</button>
        </div>
      </div>
    </div>
  );
}

const mapDipatchToProps = (dispatch) => {
  return {
    getAllCreators: () => dispatch(actions.getAllCreators()),
    getCollections: () => dispatch(actions.getCollections()),
    authLogin: (nonce, signature) =>
      dispatch(actions.authLogin(nonce, signature)),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    getMarketPlaceNFT: (params) => dispatch(actions.getMarketPlaceNFT(params)),
    getMoreMarketPlaceNFT: (params) =>
      dispatch(actions.getMoreMarketPlaceNFT(params)),
    getCategories: () => dispatch(actions.fetchCategories()),
    clearMarketPlaceNFT: () =>
      dispatch({ type: 'FETCHED_MARKETPLACE', data: [] }),
    clearPagination: () => dispatch({ type: 'FETCHED_PAGINATION', data: [] }),
    clearMoreMarketPlaceNFT: () =>
      dispatch({ type: 'FETCHED_MORE_MARKETPLACE', data: [] }),
  };
};
const mapStateToProps = (state) => {
  return {
    allCreators: state.allCreators,
    allCollections: state.allCollections,
    NFTs: state.fetchMarketPlaceNFT,
    pagination: state.fetchPagination,
    moreNFTs: state.fetchMoreMarketPlaceNFT,
    categories: state.fetchCategory,
    nonce: state.fetchNonce,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(MainListingPage);
