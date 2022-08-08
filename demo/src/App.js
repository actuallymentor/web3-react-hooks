import './App.css'

import { useAddress, useChainID, useIsConnected, useENS, useAvatar, useResolver } from './module.js'

function App() {

  const connected = useIsConnected()
  const chain_id = useChainID()
  const address = useAddress()
  const ENS = useENS()
  const avatar = useAvatar()
  const resolver = useResolver()

  return <div className="App">
    <header className="App-header">
      { avatar && <img style={ { width: 200, height: 200, borderRadius: '50%' } } src={ avatar } /> }
      <ul style={ { listStyle: 'none', textAlign: 'left', borderLeft: '5px solid white' } }>
        <li>useIsConnected: { `${ connected }` }</li>
        <li>useChainID: { chain_id || "🛑" }</li>
        <li>useAddress: { address || "🛑" }</li>
        <li>useENS: { ENS || "🛑" }</li>
      </ul>
    </header>
  </div>
}

export default App;
