import { backendServices } from './backend.service';
import { web3Services } from './web3.service';

export const services = { ...backendServices, ...web3Services };
