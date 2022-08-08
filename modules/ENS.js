import { useProvider, useChainID } from "./chain"
import { log } from './helpers'
import { useState, useEffect } from 'react'
import { useAddress } from "./address"

/**
* The ENS of the current address, as reported by the provider
* @returns {String} the ENS if it was able to resolve through the provider 
*/
export function useENS(  ) {

	const address = useAddress()
	const provider = useProvider()
    const chain_id = useChainID()
	const [ ENS, setENS ] = useState(  )

	// Resolve ENS on address changed
	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				if( !provider ) return
				const ens = await provider.lookupAddress( address )
				if( cancelled ) return
				log( `🌐 🔄 Address ${ address } resolved to ${ ens }` )
				setENS( ens )

			} catch( e ) {
				log( `🌐 🚨 Error in useENS: `, e )
			}

		} )( )

		return () => cancelled = true


	}, [ address, provider, chain_id ] )

	return ENS

}

/**
* The ENS avatar
* @returns {String} the ENS avatar uri
*/
export function useAvatar(  ) {

	const provider = useProvider()
    const chain_id = useChainID()
    const [ avatar, set_avatar ] = useState(  )
	const ENS = useENS()

	// Grab ENS resolver on ENS change
	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				if( !provider || !ENS ) return
				const avatar_uri = await provider.getAvatar( ENS )
				if( cancelled ) return
				log( `🌐 got avatar for ${ ENS }` )
				set_avatar( avatar_uri )

			} catch( e ) {
				log( `🌐 🚨 Error in useAvatar: `, e )
			}

		} )( )

		return () => cancelled = true


	}, [ ENS, provider, chain_id ] )

	return avatar

}

/**
* The ENS resolver instance of the current ENS
* @returns {Object} the ENS resolver
*/
export function useResolver(  ) {

	const provider = useProvider()
    const chain_id = useChainID()
    const [ resolver, set_resolver ] = useState(  )
	const ENS = useENS()

	// Grab ENS resolver on ENS change
	useEffect( (  ) => {

		let cancelled = false;

		( async () => {

			try {

				if( !provider || !ENS ) return
				const ens_resolver = await provider.getResolver( ENS )
				if( cancelled ) return
				log( `🌐 got revolver for ${ ENS }` )
				set_resolver( ens_resolver )

			} catch( e ) {
				log( `🌐 🚨 Error in useResolver: `, e )
			}

		} )( )

		return () => cancelled = true


	}, [ ENS, provider, chain_id ] )

	return resolver

}
