import { log, setListenerAndReturnUnlistener } from './helpers'
import { useState, useEffect, useRef } from "react"
import useInterval from 'use-interval'


// Connection state (is metamask connected to RPC)
export function useIsConnected() {

	// Check for initial status
	const [ isConnected, setIsConnected ] = useState( false )
	const ID = useRef( `${ Math.random() }`.slice( 2, 8 ) ).current

	const update_connected = f => {
		const connected = window.ethereum?.isConnected()
		setIsConnected( connected )
		if( connected ) return log( `${ ID } 💡 Wallet connected` )
		log( `${ ID } 🔌 Wallet disconnected` )
	}

	// Listen to disconnects
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'disconnect', update_connected ), [] )
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'connect', update_connected ), [] )


	// Since the connect event doesn't get triggered when metamask actually connects, we are going to do a SUPER inelegant looped listener
	useInterval( () => {
		const connected = window.ethereum?.isConnected()
		if( connected != isConnected ) {
			log( `💡 Wallet connection status changed from ${ isConnected } to ${ connected }` )
			setIsConnected( connected )
		}
	}, isConnected ? null : 1000, true )

	return isConnected

}

// Chain ID
export function useChainID( defaultChain='0x1' ) {

	const isConnected = useIsConnected()
	const [ chainID, setChainID ] = useState( defaultChain )

	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'chainChanged', setChainID ), [ isConnected ] )

	return chainID

}



// Address hook
export function useAddress() {

	const [ address, setAddress ] = useState( window.ethereum?.selectedAddress )
	const isConnected = useIsConnected()
	const ID = useRef( `${ Math.random() }`.slice( 2, 8 ) ).current

	// Keep synced with provider
	useEffect( f => {

		log( `💳 Setting selected address to useAddress state: `, window.ethereum.selectedAddress )
		setAddress( window.ethereum.selectedAddress )

	}, [ isConnected ] )

	// Listen to accountschanged
	useEffect( f => {

		// If not connected, do not listen
		if( !isConnected ) return

		const unsubscribe = setListenerAndReturnUnlistener( window.ethereum, 'accountsChanged', addresses => {

				// Get address through listener
				log( `${ ID } ♻️ Selected address ${ window.ethereum.selectedAddress }, all addresses changed to `, addresses )
				const [ newAddress ] = addresses

				// New address? Set it to state and stop interval
				if( address !== newAddress ) setAddress( newAddress )
				
		} )

		return () => {
			log( `${ ID } Stop address listener...` )
			unsubscribe()
		}

	}, [ isConnected ] )
	
	// Since metamask does not trigger reliable connect events, add a listener
	useInterval( () => {

		if( address !== window.ethereum?.selectedAddress ) setAddress( window.ethereum.selectedAddress )

	}, address ? null : 1000, true )


	log( `${ ID } useAddress: `, address )
	return address

}

/* ///////////////////////////////
// ENS
// /////////////////////////////*/
export function useENS(  ) {

	const address = useAddress()
	const [ ENS, setENS ] = useState(  )

	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				const ens = await ens_from_address( address )
				if( cancelled ) return
				log( `ENS changed to `, ens )
				setENS( ens )

			} catch( e ) {
				log( `Error in useENS: `, e )
			}

		} )( )

		return () => cancelled = true


	}, [ address ] )

	return ENS

}