// Commands for you to execute in interactive node window
// If you want, you can also deploy it in a simple web app
const Web3 = require('web3')
const mqtt = require('mqtt')

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// Get your contract's deployed address, access that through the link in Remix console.
const address = "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

/********************************************* */
const host = 'test.mosquitto.org'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  username: '',
  password: '',
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})

const topic = 'mytopic/esp32/temp' // Replace topic by yours

/********************************************* */

// Your contract's ABI, from Remix IDE
//const ABI = "{Your contract's ABI info}";

// Get properties regarding the function calls
web3.eth.getTemp
web3.eth.setTemp
// Specify your contract
const myContract = new web3.eth.Contract([ // Change the ABI by yours
	{
		"inputs": [],
		"name": "d",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "data",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTemp",
		"outputs": [
			{
				"internalType": "uint256[3]",
				"name": "",
				"type": "uint256[3]"
			},
			{
				"internalType": "uint256[3][]",
				"name": "",
				"type": "uint256[3][]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_d",
				"type": "uint256"
			}
		],
		"name": "setTemp",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "temperature",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
], address)
// Async call to get the contract's balance, interacting with the contract


client.on('connect', () => {
	console.log('Connected')
	client.subscribe([topic], () => {
	  console.log(`Subscribe to topic '${topic}'`)
	})
  })
  
  client.on('message', (topic, payload) => {
	console.log(parseInt("" + payload))
    
   //Change the adrs according to your account adrs
	myContract.methods.setTemp(parseInt("" + payload)).send({ from: "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", gas: 6721975, gasPrice: '30000000' });
  })
  
