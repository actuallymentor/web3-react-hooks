# Web3 React Hooks

A set of convenience hooks for `web3` actions in react.

## Usage

Install using `npm` or `yarn`:

```shell
npm i -S web3-react-hooks
```

This module has `react` as a peer dependency, since it provices react hooks 🤷‍♂️


Available hooks:

- useIsConnected
- useChainID
- useAddress
- useENS

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

## Feature requests

Do you need a hook not in this list? [Suggest a feature here](https://github.com/actuallymentor/web3-react-hooks/issues).

## Contributing

Pull requests are welcome! If you want to implement backwards-incompatible changes please check in first.