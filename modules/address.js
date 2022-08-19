import { useIsConnected } from "./chain"
import { log, setListenerAndReturnUnlistener } from './helpers'
import { useState, useEffect } from 'react'
import useInterval from "use-interval"

/**
* The last known selected address as reported by the provider
* @returns {String} The last known address the provider was connected to. This is not a guarantee that the user is currently connected with a specific wallet. Always call ethereum.request({ method: 'eth_accounts' }) before taking actions that require the wallet to be unlocked and connected.
*/
export function useAddress() {

	const [ address, setAddress ] = useState()
	const isConnected = useIsConnected()

	// On hook mount, load current address
	useEffect( () => {
		log( `💳 🎬 useAddress mounted, getting state from window.ethereum` )
		if( window.ethereum?.selectedAddress) setAddress( window.ethereum?.selectedAddress )
	}, [] )

	// Keep synced with provider
	useEffect( f => {

		if( !window.ethereum ) return
		log( `💳 Setting selected address to useAddress state: ${ window.ethereum.selectedAddress }` )
		setAddress( window.ethereum.selectedAddress )

	}, [ isConnected ] )

	// Listen to accountschanged
	useEffect( f => {

		// If not connected, do not listen
		if( !isConnected ) return

		return setListenerAndReturnUnlistener( window.ethereum, 'accountsChanged', addresses => {

				// Get address through listener
				log( `💳 🔄 accountsChanged - Current state ${ address }, selected address ${ window.ethereum.selectedAddress }, all addresses changed to: `, addresses )
				const [ newAddress ] = addresses

				// New address? Set it to state and stop interval
				setAddress( newAddress )
				
		} )

	}, [ isConnected ] )
	
	// Since metamask does not trigger "wallet connected" events, add a looping check
	useInterval( () => {

		if( address !== window.ethereum?.selectedAddress ) setAddress( window.ethereum.selectedAddress )

	}, address ? null : 1000, true )


	return address

}