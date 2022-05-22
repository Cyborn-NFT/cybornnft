import { authActions } from "./auth.action";
import { userActions } from "./user.action";
import { defiActions } from "./defi.action";
import { web3Actions } from "./web3.action";


export const actions = {
    ...authActions,
    ...defiActions,
    ...web3Actions,
    ...userActions,
};