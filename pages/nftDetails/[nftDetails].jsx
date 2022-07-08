// import { useRouter } from "next/router";
// import React from "react";
import { withRouter } from "next/router";
import React from "react";
// import { useRouter } from "next/router";
import { actions } from "../../actions";
import getContractAddresses from "../../contractData/contractAddress/addresses";
// import { getFileType } from "../../helper/functions";
import { web3 } from "../../web3";
import { getContractInstance } from "../../helper/web3Functions";
import { connect } from "react-redux";
import { route } from "next/dist/server/router";

const saleMethods = {
  disabled: {
    name: null,
    btnName: "Disabled",
    bidDesc: "Price",
    disable: true,
  },
  sold: {
    name: null,
    btnName: "Sold",
    bidDesc: "Sold",
    disable: true,
  },
  buyNow: {
    name: "buyNow",
    btnName: "Buy Now",
    bidDesc: "Price",
    open: 8,
  },
  placeABid: {
    name: "placeBid",
    btnName: "Place a bid",
    bidDesc: "Current bid",
    open: 8,
  },
  makeAnOffer: {
    name: "placeBid",
    btnName: "Place a bid",
    bidDesc: "Current offer",
    open: 8,
  },
  putOnSale: {
    name: null,
    btnName: "Put on sale",
    bidDesc: "Purchased at",
    open: 7,
    checkApproval: true,
  },
  cancelSaleOrder: {
    name: "cancelSaleOrder",
    btnName: "Put on sale",
    bidDesc: "",
    open: 1,
  },
  noButton: {
    name: "",
    btnName: null,
    bidDesc: "Price",
  },
  claimAfterAuction: {
    name: "claimAfterAuction",
    btnName: "Put on sale",
    bidDesc: "Current bid",
    open: 8,
  },
  claimBack: {
    name: "claimBack",
    btnName: "Cancel My Offer",
    bidDesc: "Current Bid",
    open: 1,
    checkApproval: false,
  },
  acceptOffer: {
    name: "acceptOffer",
    btnName: "Accept Offer",
    bidDesc: "Current Offer",
    open: 1,
  },
  burn: {
    name: "burnTokenEdition",
    btnName: "Burn", // <FormattedMessage id="burn" defaultMessage="Burn" />,
    bidDesc: "Current Offer",
    open: 1,
  },
  transfer: {
    name: "transfer",
    btnName: "Accept Offer",
    bidDesc: "Current Offer",
    open: 1,
  },
};

// class NFTDetails extends React.Component {
//   render() {
//     console.log(this.props.router.query.nftDetails);
//     return <div>{9786}</div>;
//   }
// }

// export default withRouter(NFTDetails);

class NFTDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      isOpen4: false,
      isOpen9: false,
      imgClass: "",
      bnbUSDPrice: {},
      bidDetails: {
        currentBidValue: "0",
        bidder: "0x0000000000000000000000000000000000000000",
      },
      ownerActionName: "",
      currentEdition: 0,
      saleMethod: {
        name: "placeBid",
        btnName: "Place a bid",
      },
      showTimer: false,
      loading: false,
      selectedNFTDetails: null,
      isApprovedForAll: false,
      NFTDetails: null,
      ext: null,
      nextMethod: null,
      loader: true,
      magnifyClass: " ",
      accountBalance: 0,
      networkError: false,
    };
  }
  async componentDidUpdate(prevProps, prevState) {
    const { isLiked, web3Data, authData, router } = this.props;

    console.log("this is query", router.query);
    if (router.query.nftDetails && !this.state.NFTDetails) {
      console.log("this,is called");
      this.callSingleNFTDetails();
    }
    if (this.state.currentEdition !== prevState.currentEdition) {
      this.fetchNFTDetails(this.state.currentEdition);
    }
    if (isLiked !== prevProps.isLiked) {
      this.setState({ loading: false });
    }
    if (web3Data.isLoggedIn !== prevProps.web3Data.isLoggedIn) {
      this.checkUserApproval(web3Data);
    }
    if (authData !== prevProps.authData) {
      if (authData && this.state.NFTDetails) {
        this.getEditionNumber(this.state.NFTDetails, 0);
      }
    }

    if (web3Data !== prevProps.web3Data) {
      if (window.web3) {
        const chainID = await web3.eth.getChainId();
        if (chainID === 56 || chainID === "0x38") {
          this.setState({ networkError: false });
        }
      }
    }
  }

  async componentDidMount() {
    console.log("am i called");
    const { web3Data } = this.props;
    if (web3Data.accounts.length) {
      this.checkUserApproval(web3Data);
    }
    console.log("here", this.props.router.query.nftDetails);
    this.callSingleNFTDetails();

    const string =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd%2Ctry";
    await fetch(string)
      .then((resp) => resp.json())
      .then(async (data) => {
        this.setState({ bnbUSDPrice: data.binancecoin });
      });

    if (window.web3) {
      const chainID = await web3.eth.getChainId();
      if (chainID !== 56 && chainID !== "0x38") {
        this.setState({ networkError: true });
      }
    }
  }
  callSingleNFTDetails = async () => {
    if (this.props.router.query.nftDetails) {
      // this.setState({ loader: true });
      // this.props.getSingleNFTDetails(this.props.router.query.nftDetails);

      const NFTDetails = await actions.getSingleNFTDetails(
        this.props.router.query.nftDetails
      );
      // console.log(NFTDetails);
      if (NFTDetails) {
        let ext;
        if (!NFTDetails.image.format) {
          ext = await getFileType(NFTDetails.image.compressed);
        } else {
          ext = NFTDetails.image.format;
        }
        this.setState({ NFTDetails, ext: ext });
        // this.setState({ NFTDetails, ext: ext }, () =>
        //   this.getEditionNumber(NFTDetails, this.state.currentEdition)
        // );
      }
      this.props.getLikesCount(this.props.router.query.nftDetails);
      this.props.getIsLiked(this.props.router.query.nftDetails);
    }
  };
  checkUserApproval = async (web3Data) => {
    const nftContractContractInstance = getContractInstance();
    const { escrowContractAddres } = getContractAddresses();
    const isApprovedForAll = await nftContractContractInstance.methods
      .isApprovedForAll(web3Data.accounts[0], escrowContractAddres)
      .call();
    const accountBalance = Number(
      web3.utils.fromWei(await web3.eth.getBalance(web3Data.accounts[0]))
    );
    this.setState({ isApprovedForAll, accountBalance });
  };
  setNFTBuyMethod = (
    bidDetails,
    isOwner,
    secondHand,
    isOpenForSale,
    saleState,
    price,
    isActive
  ) => {
    const { web3Data } = this.props;
    const NFTDetails = this.state.NFTDetails;
    const isAuction = secondHand
      ? false
      : NFTDetails.auctionEndDate > new Date().getTime() / 1000;
    if (!isActive)
      return this.setState({
        saleMethod: saleMethods.disabled,
      });
    if (secondHand) {
      if (isOwner) {
        if (isOpenForSale) {
          if (saleState === "OFFER" && +bidDetails.bidValue > price) {
            this.setState({
              saleMethod: saleMethods.acceptOffer,
            });
          } else
            this.setState({
              saleMethod: saleMethods.noButton,
            });
        } else {
          this.setState({
            saleMethod: saleMethods.putOnSale,
          });
        }
      } else {
        if (isOpenForSale) {
          if (saleState === "BUY") {
            this.setState({ saleMethod: saleMethods.buyNow });
          } else {
            if (
              +bidDetails.bidValue > 0 &&
              bidDetails.bidder === web3Data.accounts[0] &&
              +bidDetails.timeStamp + 86400 > new Date().getTime() / 1000
            ) {
              this.setState({
                saleMethod: saleMethods.claimBack,
              });
            } else {
              this.setState({
                saleMethod: saleMethods.placeABid,
              });
            }
          }
        } else {
          this.setState({
            saleMethod: saleMethods.sold,
          });
        }
      }
    } else {
      if (isOwner) {
        const method = saleMethods.noButton;
        method.bidDesc = saleState === "BUY" ? "Price" : "Current offer";
        return this.setState({
          saleMethod: method,
        });
      } else {
        if (isAuction) {
          this.setState({
            saleMethod: saleMethods.placeABid,
            showTimer: true,
          });
        } else {
          this.setState({ showTimer: false });
          if (+bidDetails.bidValue > 0) {
            if (bidDetails.bidder === web3Data.accounts[0]) {
              this.setState({
                saleMethod: saleMethods.claimAfterAuction,
              });
            } else
              this.setState({
                saleMethod: saleMethods.sold,
              });
          } else
            this.setState({
              saleMethod: saleMethods.buyNow,
            });
        }
      }
    }
  };

  getEditionNumber = (NFTDetails, currentEdition) => {
    const { authData, web3Data } = this.props;
    if (currentEdition) return this.fetchNFTDetails(currentEdition);
    const { editions, price, edition } = NFTDetails;
    var lowest = Number.POSITIVE_INFINITY;
    let index = 0;
    var tmp;
    // console.log("editions sold", NFTDetails);
    if (NFTDetails.edition === 1) return this.setEditionnumber(1);
    if (editions.length === edition || editions.length === 0)
      return this.setEditionnumber(1);
    if (NFTDetails.auctionEndDate >= new Date().getTime() / 1000)
      return this.setEditionnumber(1);
    for (var i = editions?.length - 1; i >= 0; i--) {
      if (
        !editions[i].isBurned &&
        authData &&
        authData?.data?.id === editions[i].ownerId.id
      )
        return this.setEditionnumber(editions[i].edition);
      if (editions[i].isOpenForSale && !editions[i].isBurned) {
        tmp = editions[i].saleType.price;
        if (tmp < lowest && tmp < NFTDetails.price) {
          lowest = tmp;
          index = editions[i].edition;
        }
      }
    }
    if (!index) {
      for (let k = 0; k < edition; k++) {
        const soldEdition = NFTDetails.editions.find(
          ({ edition }) => edition === k + 1
        );
        if (!soldEdition) {
          index = k + 1;
          break;
        }
      }
    }
    // console.log("index", index);

    this.setEditionnumber(index);
  };
  fetchNFTDetails = async (_edition) => {
    const { authData, web3Data } = this.props;
    const NFTDetails = this.state.NFTDetails;
    const escrowContractInstance = getContractInstance(true);

    const tokenID = NFTDetails.tokenId;
    let newEdition = _edition;
    const bidDetails = await escrowContractInstance.methods
      .bid(+tokenID, newEdition)
      .call();
    const soldEdition = NFTDetails.editions.find(
      ({ edition }) => edition === newEdition
    );
    let selectedNFTDetails;
    // console.log(soldEdition?.transactionId);
    if (soldEdition)
      selectedNFTDetails = {
        bidTimeStamp: bidDetails.timeStamp,
        isOwner:
          soldEdition.transactionId === "0x"
            ? false
            : soldEdition.ownerId.id === authData?.data?.id,
        ownerId: soldEdition.ownerId,
        isOpenForSale: soldEdition.isOpenForSale,
        price: soldEdition.isOpenForSale
          ? soldEdition.saleType.type === "OFFER"
            ? +web3.utils.fromWei(bidDetails.bidValue) > 0
              ? +web3.utils.fromWei(bidDetails.bidValue)
              : soldEdition.saleType.price
            : soldEdition.saleType.price
          : soldEdition.transactionId === "0x"
          ? +web3.utils.fromWei(bidDetails.bidValue) > 0
            ? +web3.utils.fromWei(bidDetails.bidValue)
            : soldEdition.saleType.price
          : soldEdition.price,
        saleState: soldEdition.saleType.type,
        secondHand: soldEdition.transactionId === "0x" ? false : true,
        orderNonce:
          soldEdition.transactionId === "0x"
            ? NFTDetails.nonce
            : soldEdition.nonce,
        isBurned: soldEdition.isBurned,
      };
    else
      selectedNFTDetails = {
        bidTimeStamp: bidDetails.timeStamp,
        isOwner: NFTDetails?.ownerId.id === authData?.data?.id,
        ownerId: NFTDetails.ownerId,
        isOpenForSale: true,
        price:
          NFTDetails.saleState === "AUCTION"
            ? +web3.utils.fromWei(bidDetails.bidValue) > 0
              ? +web3.utils.fromWei(bidDetails.bidValue)
              : NFTDetails.price
            : NFTDetails.price,
        saleState:
          NFTDetails.saleState === "AUCTION"
            ? NFTDetails.auctionEndDate > new Date().getTime() / 1000
              ? "AUCTION"
              : "BUY"
            : "BUY",
        secondHand: false,
        orderNonce: NFTDetails.nonce,
        isBurned: false,
      };

    this.setState({
      bidDetails: {
        currentBidValue: web3.utils.fromWei(bidDetails.bidValue),
        bidder: bidDetails.bidder,
      },
      selectedNFTDetails,
    });
    this.setState({ loader: false });
    this.setNFTBuyMethod(
      bidDetails,
      selectedNFTDetails.isOwner,
      selectedNFTDetails.secondHand,
      selectedNFTDetails.isOpenForSale,
      selectedNFTDetails.saleState,
      selectedNFTDetails.price,
      NFTDetails.isActive
    );
  };
  setEditionnumber = (number) => {
    this.setState({ currentEdition: number });
  };

  closePopUp = () => {
    this.setState({ isOpen4: false });
  };
  changeOwnerActionName = (action, open) => {
    // const { isApprovedForAll } = this.state;

    // if (!isApprovedForAll) return;

    if (open === 7) {
      this.toggle(1);
      this.toggle(open);
    } else {
      this.setState({ ownerActionName: action });
    }
  };

  setOwnerActions = (saleMethod) => {
    const { isApprovedForAll } = this.state;
    if (!isApprovedForAll) {
      this.setState(
        {
          ownerActionName: "setApprovalForAll",
          nextMethod: saleMethod,
        },
        () => this.toggle(1)
      );
    } else
      this.setState({ ownerActionName: saleMethod.name }, () =>
        this.toggle(saleMethod.open)
      );
  };

  userTransactionHandler = () => {
    const { authData } = this.props;
    const { saleMethod, isApprovedForAll } = this.state;
    if (authData) {
      if (
        (saleMethod.checkApproval && !isApprovedForAll) ||
        saleMethod.open === 1
      ) {
        return this.setOwnerActions(saleMethod);
      } else this.toggle(saleMethod.open);
    } else {
      this.toggle(4); // open login pop up
    }
  };

  getNFTDetails = async () => {
    const NFTDetails = await actions.getSingleNFTDetails(
      this.props.router.query.nftDetails
    );
    if (NFTDetails) {
      this.setState({ NFTDetails }, () =>
        this.getEditionNumber(NFTDetails, this.state.currentEdition)
      );
    }
  };

  render() {
    // let id = this.props.router.query.nftDetails;
    // console.log(this.props.router);
    const { query } = this.props.router;
    // console.log(NFTDetails?.image.original);
    const {
      bidDetails,
      bnbUSDPrice,
      currentEdition,
      loading,
      saleMethod,
      showTimer,
      selectedNFTDetails,
      NFTDetails,
      ext,
      loader,
      accountBalance,
      networkError,
    } = this.state;
    const { likesCount, isLiked, authData, web3Data } = this.props;
    // console.log('networkError ? ', networkError)
    let currentCurrenctyPrice =
      this.props.lng === "en" ? bnbUSDPrice.usd : bnbUSDPrice.try;
    // console.log("selected nft details", selectedNFTDetails);
    // if (loader) {
    return (
      <div className="lg:p-32">
        <p className="lg:p-8 font-extralight"> Back to The Marketplace </p>
        <div className="lg:grid grid-cols-2 gap-4">
          <img
            className="w-5/6"
            src={NFTDetails?.image.original.replace("undefined/", "")}
            alt="User"
            title="User"
          />
          <div>
            <br />
            <p>Futuristic</p>
            <br />
            <h1>{NFTDetails?.title ? NFTDetails?.title : ""}</h1>
            <br />
            <p>
              Owned By &nbsp;
              <span className="font-extralight">
                {" "}
                {NFTDetails?.ownerId.username
                  ? `@${NFTDetails.ownerId.username}`
                  : NFTDetails?.ownerId.name}
              </span>
            </p>
            <br />
            <p className="font-extralight">
              Clock Icon &nbsp;
              <span className="font-extralight">
                Sale ends Apr 1 2022 at 10am WITA
              </span>
            </p>
            <p className="font-extralight"></p>
            <br />
            <h1>Price</h1>
            <span>{NFTDetails?.price}</span>
            <br />
            <br />
            <div>
              {/* {saleMethod.btnName ? (
                      <button
                        disabled={saleMethod.disable}
                        onClick={() => {
                          this.userTransactionHandler();
                        }}
                      >
                        {saleMethod.btnName}
                      </button>
                    ) : null} */}
              <button className="font-extralight lg:w-2/6 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                Buy Now
              </button>
            </div>
            <br />
            <div>
              <button className="font-extralight lg:w-2/6 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                Make Offer
              </button>
            </div>
            <br />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs text-gray-700 uppercase bg-transparent">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Offers
                    </th>
                    <th scope="col" className="px-6 py-3">
                      About
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Information
                    </th>
                    <th scope="col" className="px-6 py-3">
                      History
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-transparent border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      Price
                    </th>
                    <td className="px-6 py-4">About</td>
                    <td className="px-6 py-4">Info</td>
                    <td className="px-6 py-4">History</td>
                  </tr>
                  <tr className="bg-transparent border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      Price
                    </th>
                    <td className="px-6 py-4">About Details 2</td>
                    <td className="px-6 py-4">Info Details 2</td>
                    <td className="px-6 py-4">History Details 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p>
            Created By &nbsp;
            <span className="font-extralight">
              {NFTDetails?.ownerId.walletAddress}
            </span>
          </p>
          <br />
          <p>
            About &nbsp;
            <span className="font-extralight">
              {NFTDetails?.collectionId.name}
            </span>
          </p>
          <br />
          <p className="font-extralight">
            {NFTDetails?.collectionId.description}
          </p>
        </div>
        <br />
        <h6 className="lg:mt-32"> More from this collection </h6>
        <br />
        <div className="lg:grid grid-cols-4 gap-4">
          <div className="max-w-sm card rounded-lg border border-gray-200 shadow-md card dark:border-gray-700">
            <a href="#">
              <img className="rounded-t-lg w-full" src="/avatar.png" alt="" />
            </a>
            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight">
                Collection Title
              </h5>
              <p className="mb-3 font-normal">Some Description</p>
            </div>
          </div>
        </div>
        <br />
        <div className="lg:grid grid-cols-3 gap-4">
          <div></div>
          <button className="font-extralight lg:mt-24 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
            More from this collection
          </button>
          <div></div>
        </div>

        <h6 className="lg:mt-60"> More from this collection </h6>
        <br />
        <div className="lg:grid grid-cols-4 gap-4">
          <div className="max-w-sm card rounded-lg border border-gray-200 shadow-md card dark:border-gray-700">
            <a href="#">
              <img className="rounded-t-lg w-full" src="/avatar.png" alt="" />
            </a>
            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight">
                Collection Title
              </h5>
              <p className="mb-3 font-normal">Some Description</p>
            </div>
          </div>
        </div>
        <div className="lg:grid grid-cols-3 gap-4">
          <div></div>
          <button className="font-extralight lg:mt-24 rounded-md px-1 sm:px-16 button button-primary button-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
            More from this owner
          </button>
          <div></div>
        </div>
      </div>
    );
  }
}

const mapDipatchToProps = (dispatch) => {
  return {
    likeToggler: (id) => dispatch(actions.likeToggler(id)),
    // getSingleNFTDetails: (id) => dispatch(actions.getSingleNFTDetails(id)),
    getLikesCount: (id) => dispatch(actions.getLikesCount(id)),
    getIsLiked: (id) => dispatch(actions.getIsLiked(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    NFTDetails: state.fetchSingleNFTDetails,
    likesCount: state.fetchLikesCount,
    likeToggled: state.fetchLikeToggled,
    isLiked: state.fetchIsLiked,
    authData: state.fetchAuthData,
    web3Data: state.fetchWeb3Data,
    lng: state.fetchLanguage,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDipatchToProps)(NFTDetails)
);
