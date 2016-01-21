/* EtherID JS API */
/* Written by Alexandre Naverniouk */

module.exports = new function() {
    var HEXRE = /^0x[0-9A-Fa-f]+$/
    var ETHERID_CONTRACT = "0x3589d05a1ec4af9f65b0e5554e645707775ee43c"
    var ETHERID_ABI = 
    [{"constant":true,"inputs":[],"name":"root_domain","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"uint256"}],"name":"getDomain","outputs":[{"name":"owner","type":"address"},{"name":"expires","type":"uint256"},{"name":"price","type":"uint256"},{"name":"transfer","type":"address"},{"name":"next_domain","type":"uint256"},{"name":"root_id","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"n_domains","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"uint256"},{"name":"id","type":"uint256"}],"name":"getId","outputs":[{"name":"v","type":"uint256"},{"name":"next_id","type":"uint256"},{"name":"prev_id","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"price","type":"uint256"},{"name":"transfer","type":"address"}],"name":"changeDomain","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"uint256"},{"name":"name","type":"uint256"},{"name":"value","type":"uint256"}],"name":"changeId","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"domain","type":"uint256"},{"indexed":false,"name":"id","type":"uint256"}],"name":"DomainChanged","type":"event"}]
    ;    
    
    var BigNumber = require( "BigNumber" )
    var utf8 = require( "utf8" )
    var MH = require('multihashes')
    var bs58 = require( 'bs58')
    
    this.version = "1.0.0"
    
    this.ether_contract = undefined
    
    this.getContract = function ( web3 ){
        if( this.ether_contract ) return this.ether_contract;
        this.ether_contract = web3.eth.contract( ETHERID_ABI).at(ETHERID_CONTRACT);
//        this.ether_contract.DomainChanged().watch( function( error, result ) {
//
//            if( !batch_is_active )
//            {
//                try 
//                {
//                    $("#stat_domains").text( contract.n_domains() );
//                    updateDomainPage()
//                }
//                catch( x ) {}
//            }
//        });
        return this.ether_contract;
    }    

    this.asciiToHex = function ( arr ) {
        var str ='';
        for(var i = 0; i < arr.length ; i++) {
            var n = arr.charCodeAt(i);
            str += (( n < 16) ? "0":"") + n.toString(16);
        }
        return str;
    } 
    
    this.getDomain = function ( web3, name ) {
        
        domain = name;
        
        if( name instanceof BigNumber ) { domain = name }
        else if( HEXRE.test( name ) )  { domain = new BigNumber( name ) }
        else { //string
            utf = utf8.encode( name ).slice(0, 32);
            hex = "0x" + this.asciiToHex( utf )    
            domain = new BigNumber( hex )
        }
        
        res = this.getContract( web3 ).getDomain( domain );

        r =  
        {
            domain: domain,
            owner: res[0],
            expires: res[1],
            price: res[2],
            transfer: res[3],
            next_domain: res[4],
            root_id: res[5]
        }
        
        return r;
    }

    this.getId = function ( web3, d, i ) {
        
        domain = d;
        if( d instanceof BigNumber ) { domain = d }
        else if( HEXRE.test( d ) )  { domain = new BigNumber( d ) }
        else { //string
            utf = utf8.encode( d ).slice(0, 32);
            hex = "0x" + this.asciiToHex( utf )    
            domain = new BigNumber( hex )
        }
        
        id = i;
        if( i instanceof BigNumber ) { id = i }
        else if( HEXRE.test( i ) )  { id = new BigNumber( i ) }
        else { //string
            utf = utf8.encode( id ).slice(0, 32);
            hex = "0x" + this.asciiToHex( utf )    
            id = new BigNumber( hex )
        }
        
        res = this.getContract( web3 ).getId( domain, id ) 

        r =  
        {
            value: res[0],
            next_id: res[1],
            prev_id: res[2]
        }
        
        return r;
    }

    this.toAscii = function (hex) { //fixed version
    // Find termination
        var str = "";
        var i = 0, l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i+=2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if( code == 0 ) break;        
            str += String.fromCharCode(code);
        }

        return str;
    };    
    
    this.hexToArray = function ( s )
    {
        var r =  [];

        if( s.substr( 0, 2 ) == "0x" ) { s = s.substr( 2 ); }

        if( s.length & 1 ) s = "0" + s;

        for (var i = 0; i < s.length; i += 2) {
            r.push( parseInt( s.substr(i, 2) ,16) );
        }        

        return r;
    }
    
    this.getInt = function ( web3, d, i ) {
        return this.getId( web3, d, i ).value.toNumber()
    }

    this.getStr = function ( web3, d, i ) {
        var val = this.getId( web3, d, i ).value;
    
        return utf8.decode( this.toAscii( web3.toHex( val ) ) ) 
    }
    
    this.getHash = function ( web3, d, i ) {
        var val = this.getId( web3, d, i ).value;
    
        h = web3.toHex( val )
        a = this.hexToArray( h )
            
        while( a.length < 32 ) { a = a.splice( 0, 1, 0) } //make it 32 for sure
        
        mh =  MH.encode( new Buffer( a ), 18, 32 ) 
        return bs58.encode( mh )
    }
    
    
}();


