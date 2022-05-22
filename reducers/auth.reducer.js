
export function fetchDashboardBanners(state = null, action) {
    switch (action.type) {
      case 'FETCHED_NFT_BANNERS':
        return action.data;
      default:
        return state;
    }
}

export function fetchDashboardInfo(state = null, action) {
  switch (action.type) {
    case 'FETCHED_INFO':
      return action.data;
    default:
      return state;
  }
}

export function fetchDashboardHallFrameInfo(state = null, action) {
  switch (action.type) {
    case 'FETCHED_HALL_FRAME_INFO':
      return action.data;
    default:
      return state;
  }
}

export function fetchDashboard(state = null, action) {
  switch (action.type) {
    case 'FETCHED_DASHBOARD':
      return action.data;
    default:
      return state;
  }
}

export function fetchCreators(state = null, action) {
  switch (action.type) {
    case "FETCHED_CREATORS":
      return action.data;
    default:
      return state;
  }
}

export function fetchPagination(state = null, action) {
  switch (action.type) {
    case "FETCHED_PAGINATION":
      return action.data;
    default:
      return state;
  }
}

export function fetchMoreCreators(state = null, action) {
  switch (action.type) {
    case "FETCHED_MORE_CREATORS":
      return action.data;
    default:
      return state;
  }
}

export function fetchMarketPlaceNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_MARKETPLACE":
      return action.data;
    default:
      return state;
  }
}

export function fetchMoreMarketPlaceNFT(state = null, action) {
  switch (action.type) {
    case "FETCHED_MORE_MARKETPLACE":
      return action.data;
    default:
      return state;
  }
}

export function fetchCollections(state = null, action) {
  switch (action.type) {
    case "FETCHED_COLLECTIONS":
      return action.data;
    default:
      return state;
  }
}

export function fetchMoreCollections(state = null, action) {
  switch (action.type) {
    case "FETCHED_MORE_COLLECTIONS":
      return action.data;
    default:
      return state;
  }
}

export function fetchCollectionDetails(state = null, action) {
  switch (action.type) {
    case "FETCHED_COLLECTION_DETAIL":
      return action.data;
    default:
      return state;
  }
}

export function updateCollection(state = null, action) {
  switch (action.type) {
    case "COLLECTION_UPDATED":
      return action.data;
    default:
      return state;
  }
}

export function fetchTopNFT(state = null, action) {
    switch (action.type) {
      case 'FETCHED_TOP_NFT':
        return action.data;
      default:
        return state;
    }
}

export function fetchTopCollection(state = null, action) {
    switch (action.type) {
      case 'FETCHED_TOP_COLLECTION':
        return action.data;
      default:
        return state;
    }
}

export function fetchProfileInfo(state = null, action) {
    switch (action.type) {
      case 'FETCHED_PROFILE_INFO':
        return action.data;
      default:
        return state;
    }
}

export function fetchHallOfFrameArtist(state = null, action) {
  switch (action.type) {
    case 'FETCHED_HALL_OF_FRAMES_ARTIST':
      return action.data;
    default:
      return state;
  }
}

export function fetchHallOfFrameArtwork(state = null, action) {
  switch (action.type) {
    case 'FETCHED_HALL_OF_FRAMES_ARTWORK':
      return action.data;
    default:
      return state;
  }
}

export function fetchHallOfFrameCollector(state = null, action) {
  switch (action.type) {
    case 'FETCHED_HALL_OF_FRAMES_COLLECTOR':
      return action.data;
    default:
      return state;
  }
}