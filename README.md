# Web3 React Hooks

A set of convenience hooks for `web3` actions in react.

## Usage

Install using `npm` or `yarn`:

```shell
npm i -S web3-react-hooks
```

This module has `react` as a peer dependency, since it provices react hooks 🤷‍♂️

Example usage:

```js
import React from 'react'
import { useAddress, useENS } from 'web3-react-hooks'

export default function UserProfile() {

    const address = useAddress()
    const ens = useENS()

    return <p>Welcome back { address.slice( 0, 10 ) }! { ens ? `Your ENS name ${ ens } looks good!` : `You should get a fancy ENS ;)` }</p>


}
```


## Available hooks

All hooks have `jsdoc` declarations you can use to get more details on what they do.

**Useful frontend hooks**

- useAddress: last known selected address
- useENS: ENS address of currently connected account on currently connected network
- useAvatar: returns uri of the current ENS avatar

**Chain/wallet**

- useIsConnected: whether or not the Ethereum provider is connected to its RPC
- useChainID: chain ID as hex value, e.g. `0x01` is Ethereum Mainnet

**Generic interfaces**

- useProvider: get an `ethers.js` provider instance, see [the ethers provider documentation](https://docs.ethers.io/v5/api/providers/provider/) for what you can do with it
- useResolver: returns the resolver of the current ENS, see [the ethers resolver documentation](https://docs.ethers.io/v5/api/providers/provider/#EnsResolver) for what you can do with it


For a more elaborate demo, run `npm start` inside the `demo` directory.

## Feature requests

Do you need a hook not in this list? [Suggest a feature here](https://github.com/actuallymentor/web3-react-hooks/issues).

## Contributing

Pull requests are welcome! If you want to implement backwards-incompatible changes please check in first.
