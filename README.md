# etherid-js
Javascript API for EtherID


## Installation

### In Node.js through npm

```bash
$ npm install etherid
```


### In the Browser through browserify

Same as in Node.js, you just have to [browserify](https://github.com/substack/js-browserify) the code before serving it. 

### In the Browser through `<script>` tag

Make the [multihashes.min.js](/dist/etherid.min.js) available through your server and load it using a normal `<script>` tag, then you can require('etherid'). See the [Demo HTML](/tests/test.html)  


##Usage

### Initialization of the Web3

The [Web3](https://github.com/ethereum/web3.js) object is needed. This is the proper way to init it, so it will work in the Mist browser.

```javascript
if(typeof web3 === 'undefined')
    web3 = require('web3');     

if( web3.currentProvider == null )
    web3.setProvider( new web3.providers.HttpProvider( ) );   
```

### Initialization of teh EtherID object 
```javascript
var etherid = require('etherid')
```


### Getting total number of registered domains

```javascript
etherid.getNumberOfDomains( web3 )
```
Returns total number of registered domains

### Reading the domain record

To read the domain record you call:

```javascript
etherid.getDomain( web3, {DOMAIN_NAME} )
```
{DOMAIN_NAME} can be a BigNumber, string or hex ( "0xNNNN.." )

The call returns a struct:

```javascript
{
    domain      // Domain name (as BigNumber)
    owner       // Address of the domain owner
    expires     // The Ethereum Blockchin block number of expiration
    price       // Selling Price if any
    transfer    // The address for the domain transer
    next_domain // Next domain name in the linked list
    root_id     // First ID if any
}
```

### Reading the domain ID

```javascript
etherid.getId( web3, {DOMAIN_NAME}, {ID} )
```

Both {DOMAIN_NAME} and {ID} can be a BigNumber, string or hex ( "0xNNNN.." )

The call returns a struct:

```javascript
{
    value       // Value
    next_id     // Next ID in the linked list
    prev_id     // Previous ID in the linked list
}
```


### Reading string ID

```javascript
etherid.getStr( web3, {DOMAIN_NAME}, {ID} )
```
Returns string ID value

### Reading integer ID

```javascript
etherid.getInt( web3, {DOMAIN_NAME}, {ID} )
```
Returns integer ID value

### Reading hash ID

```javascript
etherid.getInt( web3, {DOMAIN_NAME}, {ID} )
```
Returns the ID value interpreted as a [multihash](https://github.com/jbenet/multihash) sha2-512. (Same that is used by [ipfs](https://ipfs.io/)


### Event handler
You can setup a handler that will be called everytime someone changes a domain.

```javascript
etherid.watch( web3, function( error, result ) {
    document.getElementById( "n_domains" ).innerHTML = EID.getNumberOfDomains( web3 )
}) 
```

### Enumerating domains
You can list all the registered domains by using getDomainEnum and getNextDomain


```javascript
DomainEnumerator = etherid.getDomainEnum( web3 )

d = EID.getNextDomain( web3, DomainEnumerator )

while ( d ) {
    document.getElementById( "list_domains" ).innerHTML = "domain #:" + DomainEnumerator.n + " " + d.domainStr
    d = EID.getNextDomain( web3, DomainEnumerator )
}
```
NOTE: The enumerator properly treats the domain with name 0x0 registered in the system. If you implement the loop yourself, do not forget that first 0x0 domain you get is the real domain, and the second is in fact the end of the list.

### Enumerating ID's
You can list all the domain ID's by using getIdEnum and getNextId


```javascript
IdEnumerator = etherid.getIdEnum( web3, "test" )

id = EID.getNextId( web3, IdEnumerator )

while ( id ) {
    document.getElementById( "list_domains" ).innerHTML = "ID #:" + Id.n + " " + id.nameStr
    id = EID.getNextId( web3, IdEnumerator )
}
```
NOTE: The enumerator properly treats the ID with name 0x0 registered in the system. If you implement the loop yourself, do not forget that first 0x0 ID you get might be the real ID, and the second is in fact the end of the list. You should check if the 0x0 ID has value.


## License

Apache 2.0


##Author

Alexandre Naverniouk
@alexna
