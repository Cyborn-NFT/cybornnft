export function fetchCategory(state = null, action) {
  switch (action.type) {
    case "FETCHED_CATEGORIES":
      return action.data;
    default:
      return state;
  }
}

export function updateProfile(state = null, action) {
  switch (action.type) {
    case "PROFILE_UPDATED":
      return action.data;
    default:
      return state;
  }
}
export function fetchNewCollection(state = null, action) {
  switch (action.type) {
    case "CREATE_COLLECTION":
      return action.data;
    default:
      return state;
  }
}

export function fetchUserNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_USER_NFT":
      return action.data;
    default:
      return state;
  }
}

export function fetchUserDraftNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_USER_DRAFT_NFT":
      return action.data;
    default:
      return state;
  }
}
export function fetchSingleNFTDetails(state = null, action) {
  switch (action.type) {
    case "FETCHED_SINGLE_NFT_DETAILS":
      return action.data;
    default:
      return state;
  }
}

export function fetchProfile(state = null, action) {
  switch (action.type) {
    case "FETCHED_PROFILE":
      return action.data;
    default:
      return state;
  }
}
export function fetchLikesCount(state = { count: 0 }, action) {
  switch (action.type) {
    case "FETCHED_LIKES_COUNT":
      return action.data;
    default:
      return state;
  }
}
export function fetchLikeToggled(state = null, action) {
  switch (action.type) {
    case "FETCHED_LIKE_TOGGLED":
      return action.data;
    default:
      return state;
  }
}
export function fetchIsLiked(state = { isFollowed: false }, action) {
  switch (action.type) {
    case "FETCHED_IS_LIKED":
      return action.data;
    default:
      return state;
  }
}
export function fetchIsFollow(state = { isFollowed: false }, action) {
  switch (action.type) {
    case "FETCHED_IS_FOLLOW":
      return action.data;
    default:
      return state;
  }
}

export function fetchLikedNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_LIKED_NFT":
      return action.data;
    default:
      return state;
  }
}

export function fetchCollectedNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_COLLECTED_NFT":
      return action.data;
    default:
      return state;
  }
}

export function fetchCollectionNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_COLLECTION_NFT":
      return action.data;
    default:
      return state;
  }
}

export function fetchNFTEditionHistory(state = null, action) {
  switch (action.type) {
    case "FETCHED_NFT_EDITION_HISTORY":
      return action.data;
    default:
      return state;
  }
}

export function fetchNotifications(state = null, action) {
  switch (action.type) {
    case "FETCHED_NOTIFICATIONS":
      return action.data;
    default:
      return state;
  }
}

export function fetchProfileBanner(state = null, action) {
  switch (action.type) {
    case "FETCHED_PROFILE_BANNERS":
      return action.data;
    default:
      return state;
  }
}
export function fetchLanguage(state = "en", action) {
  switch (action.type) {
    case "SET_LANGUAGE":
      return action.data;
    default:
      return state;
  }
}

export function verified_by_instagram(state = null, action) {
  switch (action.type) {
    case "VERIFIED_BY_INSTAGRAM":
      return action.data;
    default:
      return state;
  }
}

export function fetch_twitter_access_token(state = null, action) {
  switch (action.type) {
    case "TWITTER_ACCESS_TOKEN":
      return action.data;
    default:
      return state;
  }
}

export function verified_by_twitter(state = null, action) {
  switch (action.type) {
    case "VERIFIED_BY_TWITTER":
      return action.data;
    default:
      return state;
  }
}