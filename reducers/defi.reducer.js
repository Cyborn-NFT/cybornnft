export function fetchNonce(state = null, action) {
  switch (action.type) {
    case "GENERATE_NONCE":
      return action.data;
    default:
      return state;
  }
}

export function fetchAuthData(state = null, action) {
  switch (action.type) {
    case "AUTH_LOGIN":
      return action.data;
    case "AUTH_LOGIN_ERROR":
      return action.data;
    default:
      return state;
  }
}
export function fetchNewNFTId(state = null, action) {
  switch (action.type) {
    case "ADD_NFT":
      return action.data;
    default:
      return state;
  }
}
export function fetchCategoryList(state = null, action) {
  switch (action.type) {
    case "CATEGORY_LIST":
      return action.data;
    default:
      return state;
  }
}

export function fetchCollectionList(state = null, action) {
  switch (action.type) {
    case "COLLECTION_LIST":
      return action.data;
    default:
      return state;
  }
}

export function fetchUserProfile(state = null, action) {
  switch (action.type) {
    case "FETCHED_USER_PROFILE":
      return action.data;
    default:
      return state;
  }
}

export function fetchResponseFailed(state = null, action) {
  switch (action.type) {
    case "API_FAILED":
      return action.data;
    default:
      return state;
  }
}

export function fetchUpdatedNFTId(state = null, action) {
  switch (action.type) {
    case "UPDATE_NFT":
      return action.data;
    default:
      return state;
  }
}