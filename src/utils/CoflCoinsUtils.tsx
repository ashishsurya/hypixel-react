import { v4 as generateUUID } from 'uuid';
import { CustomEvents } from './CustomEvents';

interface RegisteredCallback {
    uuid: string,
    callback(coflCoins: number)
}

let registeredCallbacks: RegisteredCallback[] = [];
let currentCoflCoins = -1;

/**
 * Calls a callback if the amound of coflcoins changes
 * @param callback The callback that will be called
 * @returns A unsubscribe function
 */
export function subscribeToCoflcoinChange(callback: (n: number) => void): Function {

    let uuid = generateUUID();

    registeredCallbacks.push({
        uuid: uuid,
        callback: callback
    })

    return () => {
        let index = registeredCallbacks.findIndex(registeredCallback => {
            return registeredCallback.uuid === uuid;
        })
        registeredCallbacks.splice(index, 1);
    }
}

export function getCurrentCoflCoins() {
    return currentCoflCoins;
}

/**
 * Registers the Listener, for the coflCoin change
 */
document.addEventListener(CustomEvents.COFLCOIN_UPDATE, function (e) {

    let coflCoins = (e as any).detail?.coflCoins;
    currentCoflCoins = coflCoins;

    registeredCallbacks.forEach(registeredCallback => {
        registeredCallback.callback(coflCoins);
    })
});