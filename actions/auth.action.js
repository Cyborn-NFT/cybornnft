import { services } from "../services";

export const authActions = {
  fetchBanners,
  fetcInfo,
  fetcHallFrameInfo,
  fetchDashboardConfig,
  getCreators,
  getMoreCreators,
  getMarketPlaceNFT,
  getMoreMarketPlaceNFT,
  getCollections,
  getCollectionDetails,
  getMoreCollections,
  updateCollection,
  getTopNFT,
  getTopCollection,
  getProfileInfo,
  getHallOfFrameArtist,
  getHallOfFrameArtwork,
  getHallOfFrameCollector,
};

function fetchedData(type, data) {
  return {
    type: type,
    data: data,
  };
}

function fetchBanners() {
  return (dispatch) => {
    const response = services.get(`/admin/banner/list`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_NFT_BANNERS", promise.data.data));
      } else {
        // console.log('error in getBanners actions');
      }
    });
  };
}

function fetcInfo() {
  return (dispatch) => {
    const response = services.get(`/admin/info/list`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_INFO", promise.data.data));
      } else {
        // console.log('error in fetcInfo actions');
      }
    });
  };
}

function fetcHallFrameInfo() {
  return (dispatch) => {
    const response = services.get(`/admin/hall-frame-info/list`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData('FETCHED_HALL_FRAME_INFO', promise.data.data));
      } else {
        // console.log('error in fetcHallFrameInfo actions');
      }
    });
  };
}

function fetchDashboardConfig() {
  return (dispatch) => {
    const response = services.get(`/admin/dashboard/list`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_DASHBOARD", promise.data.data));
      } else {
        // console.log('error in fetchDashboardConfig actions');
      }
    });
  };
}

function getCreators(params={}) {
  return async (dispatch) => {
    const response = services.post(`user/listVerifiefCreator`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_PAGINATION", promise.data.pagination));
        dispatch(fetchedData("FETCHED_CREATORS", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getMoreCreators(params={}) {
  return async (dispatch) => {
    const response = services.post(`user/listVerifiefCreator`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_PAGINATION", promise.data.pagination));
        dispatch(fetchedData("FETCHED_MORE_CREATORS", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getMarketPlaceNFT(params={}) {
  return async (dispatch) => {
    const response = services.post(`nft/listMarketPlace`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_PAGINATION", promise.data.pagination));
        dispatch(fetchedData("FETCHED_MARKETPLACE", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getMoreMarketPlaceNFT(params={}) {
  return async (dispatch) => {
    const response = services.post(`nft/listMarketPlace`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_PAGINATION", promise.data.pagination));
        dispatch(fetchedData("FETCHED_MORE_MARKETPLACE", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getCollections(params={}) {
  return async (dispatch) => {
    const response = services.post(`nft/listCollections`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_PAGINATION", promise.data.pagination));
        dispatch(fetchedData("FETCHED_COLLECTIONS", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getMoreCollections(params={}) {
  return async (dispatch) => {
    const response = services.post(`nft/listCollections`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_PAGINATION", promise.data.pagination));
        dispatch(fetchedData("FETCHED_MORE_COLLECTIONS", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getCollectionDetails(params={}) {
  return async (dispatch) => {
    const response = services.get(`nft/getCollectionInfo/${params.id}`, true);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("FETCHED_COLLECTION_DETAIL", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function updateCollection(params = {}) {
  return async (dispatch) => {
    const response = services.put(`nft/updateCollection/${params.id}`, params);
    response.then((promise) => {
      if (promise.status === 200) {
        dispatch(fetchedData("COLLECTION_UPDATED", promise.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getTopNFT() {
  return (dispatch) => {
    const response = services.get(`/admin/popular/list`, true);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_TOP_NFT", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getTopCollection() {
  return (dispatch) => {
    const response = services.get(`/admin/popularCollection/list`, true);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_TOP_COLLECTION", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getProfileInfo() {
  return (dispatch) => {
    const response = services.get(`/admin/profile-info/list`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_PROFILE_INFO", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getHallOfFrameArtist() {
  return (dispatch) => {
    const response = services.get(`/hallOfFrame/list/artist`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_HALL_OF_FRAMES_ARTIST", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getHallOfFrameArtwork() {
  return (dispatch) => {
    const response = services.get(`/hallOfFrame/list/artwork`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_HALL_OF_FRAMES_ARTWORK", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}

function getHallOfFrameCollector() {
  return (dispatch) => {
    const response = services.get(`/hallOfFrame/list/collector`);
    return response.then((promise) => {
      if (promise.data) {
        dispatch(fetchedData("FETCHED_HALL_OF_FRAMES_COLLECTOR", promise.data.data));
      } else {
        // console.log("error");
      }
    });
  };
}