import { log, setListenerAndReturnUnlistener } from './helpers'
import { useState, useEffect } from "react"
import useInterval from 'use-interval'


/**
* Connection state of the provider
* @returns {Boolean} whether the provider is connected to it's RPC endpint
*/
export function useIsConnected() {

	// Check for initial status
	const [ isConnected, setIsConnected ] = useState( false )

	const update_connected = f => {
		const connected = window.ethereum?.isConnected()
		setIsConnected( connected )
		if( connected ) return log( `🦊 ✅  Provider connected to RPC` )
		log( `🦊 🛑  Provider disconnected from RPC` )
	}

	// Listen to disconnects
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'disconnect', update_connected ), [] )
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'connect', update_connected ), [] )


	// Since the connect event doesn't get triggered when metamask actually connects, we are going to do a SUPER inelegant looped listener
	useInterval( () => {
		const connected = window.ethereum?.isConnected()
		if( connected != isConnected ) {
			log( `🦊 🔄 Wallet connection status changed from ${ isConnected } to ${ connected }` )
			setIsConnected( connected )
		}
	}, isConnected ? null : 1000, true )

	return isConnected

}

/**
* The currencly selected chain ID
* @returns {String} the ID of the currently selected chain 
*/
export function useChainID() {

	const isConnected = useIsConnected()
	const [ chainID, setChainID ] = useState()

	// Listen to chain changes
	useEffect( f => setListenerAndReturnUnlistener( window.ethereum, 'chainChanged', chain_id => {
		log( `⛓ 🔄 Chain ID changed from ${ chainID } to ${ chain_id }` )
		setChainID( chain_id )
	} ), [ isConnected ] )

	// Check for initial chain
	useEffect( (  ) => {

		let cancelled = false;
	
		( async () => {
	
			try {
	
				const chain_id = await window.ethereum.request( { method: 'eth_chainId' } )
				if( cancelled ) return
				log( `⛓ Initial chain id: ${ chain_id }` )
				setChainID( chain_id )
				
			} catch( e ) {
				log( `⛓ 🚨 Error retreiving chain ID: `, e )
			}
	
		} )( )
	
		return () => cancelled = true
	
	}, [] )

	return chainID

}


/**
* The last known selected address as reported by the provider
* @returns {String} The last known address the provider was connected to. This is not a guarantee that the user is currently connected with a specific wallet. Always call ethereum.request({ method: 'eth_accounts' }) before taking actions that require the wallet to be unlocked and connected.
*/
export function useAddress() {

	const [ address, setAddress ] = useState( window.ethereum?.selectedAddress )
	const isConnected = useIsConnected()

	// Keep synced with provider
	useEffect( f => {

		log( `💳 Setting selected address to useAddress state: ${ window.ethereum.selectedAddress }` )
		setAddress( window.ethereum.selectedAddress )

	}, [ isConnected ] )

	// Listen to accountschanged
	useEffect( f => {

		// If not connected, do not listen
		if( !isConnected ) return

		return setListenerAndReturnUnlistener( window.ethereum, 'accountsChanged', addresses => {

				// Get address through listener
				log( `💳 🔄 Selected address ${ window.ethereum.selectedAddress }, all addresses changed to: `, addresses )
				const [ newAddress ] = addresses

				// New address? Set it to state and stop interval
				if( address !== newAddress ) setAddress( newAddress )
				
		} )

	}, [ isConnected ] )
	
	// Since metamask does not trigger "wallet connected" events, add a looping check
	useInterval( () => {

		if( address !== window.ethereum?.selectedAddress ) setAddress( window.ethereum.selectedAddress )

	}, address ? null : 1000, true )


	return address

}

/**
* The ENS of the current address, as reported by the provider
* @returns {String} the ENS if it was able to resolve through the provider 
*/
export function useENS(  ) {

	const address = useAddress()
	const [ ENS, setENS ] = useState(  )

	// Resolve ENS on address changed
	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {


				const ens = await provider.lookupAddress( address )
				if( cancelled ) return
				log( `🌐 🔄 Address ${ address } resolved to ${ ens }` )
				setENS( ens )

			} catch( e ) {
				log( `🌐 🚨 Error in useENS: `, e )
			}

		} )( )

		return () => cancelled = true


	}, [ address ] )

	return ENS

}