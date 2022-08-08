import { log, setListenerAndReturnUnlistener } from './helpers'
import { useState, useEffect } from "react"
import useInterval from 'use-interval'


/**
* Ethers-based provider
* @returns {Object} provider instance
*/
const { providers } = require( 'ethers' )
export function useProvider() {

	const [ provider, set_provider ] = useState()
	const chain_id = useChainID()
	const connected = useIsConnected()

	useEffect( () => {
		if( !window.ethereum ) return log( `⚙️ No window.ethereum, cannot create provider instance` )
		const new_provider = new providers.Web3Provider( window.ethereum )
		set_provider( new_provider )
	}, [ connected, chain_id ] )

	return provider

}

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
			log( `🦊 🔄 Provider RPC connection status changed from ${ isConnected } to ${ connected }` )
			setIsConnected( connected )
		}
	}, isConnected ? null : 1000 )

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

		if( !window.ethereum ) return
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

