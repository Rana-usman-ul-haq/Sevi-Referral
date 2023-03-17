import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const stakeButton = document.getElementById('stake')
const unstakeButton = document.getElementById('unstake')
const showAccount = document.getElementById('showAccount')
const stakedisable = document.getElementById('stakeButton')
const dappStatus = document.getElementById('dappStatus')
const showBalance = document.getElementById('showBalance')
const timebutton = document.getElementById('unlockTime')
const aprPer = document.getElementById('lxApr')
const stakeDays = document.getElementById('stakeDays')
const comissionAmount = document.getElementById('getComission')
const rewardsButton = document.getElementById('reward')
const referrallink = document.getElementById('referralLink')
const base_url = window.location.origin;


unstakeButton.onclick = unstake
rewardsButton.onclick = reward

const tokenContract = '0xeC661F39A99606938C1bDE33ADd6103D592844f6'

console.log(ethers)

let preLoader = document.getElementById('preloader')
let notifyMM = document.getElementById('notifyMM')

const addressInput = document.getElementById('address');

connectButton.addEventListener('click', () => {
  getTime()
  connect()
  getComission()
})

stakeButton.addEventListener('click' , function() {
	if (addressInput.value == '') {
		stake();
	} else {
		referralStake();
	}

})

window.onload = function () {
  document.body.style.overflow = 'hidden'
  setTimeout(function () {
    preLoader.style.display = 'none'
    document.body.style.overflow = 'auto'
  })
}

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    let provider = window.ethereum
    const chainid = await provider.request({
      method: 'eth_chainId',
    })

    console.log('This is Chain ID: ', chainid)
    if ((typeof window.ethereum !== 'undefined', chainid === '0x38'|| '0x61')) {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = 'Connected'
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      showAccount.innerHTML = accounts
      stakedisable.style.display = 'flex'
      stakedisable.style.opacity = '1'
     // dappStatus.innerHTML = 'Live!'
      //dappStatus.style.backgroundColor = '#fee440'
      console.log(accounts)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenContract, testAbi, signer)
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        const balance = await contract.balanceOf(accounts.toString())
        showBalance.innerHTML = `${Math.round(ethers.utils.formatUnits(balance))} Sevi tokens`
        console.log(balance)
        console.log('Done!')
        if( timebutton.innerHTML != 'NaN'){
         const refAddress = accounts;
			const referralLink = base_url + '?ref=' + refAddress

			referrallink.innerHTML = referralLink

        }
      } catch (error) {
        console.log(error)
      }
    } else {
      connectButton.innerHTML = 'Please switch to Binance Testnet'
    }
  } else {
    connectButton.innerHTML = 'Please install MetaMask'
  }
}

async function getTime() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      const users = await contract.RQ(accounts.toString())

      let unixTimestamp = parseInt(users.timestamp)
      if (unixTimestamp > 0) {
        let date = new Date(unixTimestamp * 1000)
        const humanDateFormat = date.toLocaleString()

        timebutton.innerHTML = humanDateFormat
        console.log(date)
      } else {
        timebutton.innerHTML = 'NaN'
      }
    } catch (error) {
      console.log(error)
    }
  }
}

async function getComission() {
	if (typeof window.ethereum !== 'undefined') {
	  const provider = new ethers.providers.Web3Provider(window.ethereum)
	  const signer = provider.getSigner()
	  const contract = new ethers.Contract(contractAddress, abi, signer)
	  try {
		const accounts = await ethereum.request({ method: 'eth_accounts' })
		const users = await contract.RQ(accounts.toString())
		const comission = users.stakeComission
		console.log(ethers.utils.formatUnits(comission))
		comissionAmount.innerHTML =`${ethers.utils.formatUnits(comission)} Tokens`
	  } catch (error){
		console.log(error)
	  }
	}
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  //listen for transaction to finish
  //Promise tells only finish this function once resolved
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Completed with ${transactionReciept.confirmations} confirmations`,
      )
      resolve()
    })
  })
}

stakeDays.addEventListener('change', () => {
  if (stakeDays.value <= 30) {
    aprPer.innerHTML = '5%'
    aprPer.setAttribute('data-lx-apr', '5%')
  } else if (stakeDays.value <= 90) {
    aprPer.innerHTML = '15%'
    aprPer.setAttribute('data-lx-apr', '15%')
  } else if (stakeDays.value <= 180) {
    aprPer.innerHTML = '30%'
    aprPer.setAttribute('data-lx-apr', '30%')
  } else if (stakeDays.value <= 365) {
    aprPer.innerHTML = '60%'
    aprPer.setAttribute('data-lx-apr', '60%')
  } else {
    alert('something is happening wrong')
  }
})

async function stake() {
  const amount = document.getElementById('standard').value
  if (amount == 0) {
    alert('Please input amount first')
  }
  if (amount > 50000000000){
   alert("Please put in amount less than 50 Billion Tokens")
   return
  }
  if ((typeof window.ethereum !== 'undefined', amount >= 1)) {
    const new_amount = ethers.utils.parseUnits(amount.toString(), 18)
    const days = stakeDays.options[stakeDays.selectedIndex].value
    console.log('Selected Days', days)
    console.log(`Funding with ${amount}...`)
    console.log('staking...')
    preLoader.style.display = 'block'
    notifyMM.style.display = 'block'
    notifyMM.innerHTML = 'Please wait a few seconds to stake tokens'
    document.body.style.overflow = 'hidden'
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const testTokenContract = new ethers.Contract(
      tokenContract,
      testAbi,
      signer,
    )
    try {
      const tokenContract = testTokenContract.connect(signer)
      const approve = await tokenContract.approve(
        contractAddress,
        new_amount,
      )
      await approve.wait()
      const transactionResponse = await contract.stake(new_amount, days)
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
      preLoader.style.display = 'none'
      notifyMM.style.display = 'none'
      alert('You have staked the tokens Successfully!')
      try{
			const accounts = await ethereum.request({method: 'eth_accounts'})
			const refAddress = accounts;
			const referralLink = base_url + '?ref=' + refAddress

			referrallink.innerHTML = referralLink
			}
		    catch (error) {
				console.log(error)
			}
    } catch (error) {
      preLoader.style.display = 'none'
      notifyMM.style.display = 'none'
      document.body.style.overflow = 'auto'
      console.log(error)
      alert('You have already staked! or insufficient balance')
    }
  }
}

async function referralStake() {
   const amount = document.getElementById('standard').value
   const referralAddress = document.getElementById('address').value;
   if (amount == 0) {
     alert('Please input amount first')
   }
   if (amount > 50000000000){
      alert("Please put in amount less than 50 Billion Tokens")
      return
     }
   if ((typeof window.ethereum !== 'undefined', amount >= 1)) {
     const new_amount = ethers.utils.parseUnits(amount.toString(), 18)
     const days = stakeDays.options[stakeDays.selectedIndex].value
     console.log('Selected Days', days)
     console.log(`Funding with ${amount}...`)
     console.log('Referred staking...')
     preLoader.style.display = 'block'
     notifyMM.style.display = 'block'
     notifyMM.innerHTML = 'Please wait a few seconds to stake tokens'
     document.body.style.overflow = 'hidden'
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new ethers.Contract(contractAddress, abi, signer)
     const testTokenContract = new ethers.Contract(
       tokenContract,
       testAbi,
       signer,
     )
     try {
       const tokenContract = testTokenContract.connect(signer)
       const approve = await tokenContract.approve(
         contractAddress,
         new_amount,
       )
       await approve.wait()
       const transactionResponse = await contract.referredStake(referralAddress, new_amount, days)
       await listenForTransactionMine(transactionResponse, provider)
       console.log('Done!')
       preLoader.style.display = 'none'
       notifyMM.style.display = 'none'
       alert('You have staked the tokens Successfully!')
       try{
			const accounts = await ethereum.request({method: 'eth_accounts'})
			const refAddress = accounts;
			const referralLink = base_url + '?ref=' + refAddress

			referrallink.innerHTML = referralLink
			}
		    catch (error) {
				console.log(error)
			}
     } catch (error) {
       preLoader.style.display = 'none'
       notifyMM.style.display = 'none'
       document.body.style.overflow = 'auto'
       console.log(error)
       alert('You have already staked! or insufficient balance')
     }
   }
 }

async function unstake() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    preLoader.style.display = 'block'
    notifyMM.style.display = 'block'
    document.body.style.overflow = 'hidden'
    notifyMM.innerHTML = 'Please wait a few seconds to unstake tokens'
    try {
      const transactionResponse = await contract.UnStaking({})
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
      preLoader.style.display = 'none'
      notifyMM.style.display = 'none'
      alert('You have unstaked the tokens Successfuly!')
    } catch (error) {
      preLoader.style.display = 'none'
      notifyMM.style.display = 'none'
      document.body.style.overflow = 'auto'
      alert(
        'Please first stake Tokens to unstake. Also wait for time limit if already staked!',
      )
      console.log(error)
    }
  }
}

async function reward() {
   if (typeof window.ethereum !== 'undefined') {
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new ethers.Contract(contractAddress, abi, signer)
     preLoader.style.display = 'block'
     notifyMM.style.display = 'block'
     document.body.style.overflow = 'hidden'
     notifyMM.innerHTML = 'Please wait a few seconds to unstake tokens'
     try {
       const transactionResponse = await contract.claimRewards({})
       await listenForTransactionMine(transactionResponse, provider)
       console.log('Done!')
       preLoader.style.display = 'none'
       notifyMM.style.display = 'none'
       alert('Rewards Sent to your wallet!')
     } catch (error) {
       preLoader.style.display = 'none'
       notifyMM.style.display = 'none'
       document.body.style.overflow = 'auto'
       alert(
         "error"
       )
       console.log(error)
     }
   }
 }

// Disable Developer Tools
/*document.addEventListener('keydown', function () {
  if (event.keyCode == 123) {
    alert("This function has been disabled to view the code!");
    return false;
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
    alert("This function has been disabled to view the code!");
    return false;
  } else if (event.ctrlKey && event.keyCode == 85) {
    alert("This function has been disabled to view the code!");
    return false;
  }
}, false);

if (document.addEventListener) {
  document.addEventListener('contextmenu', function (e) {
    alert("This function has been disabled to view the code!");
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function () {
    alert("This function has been disabled to view the code!");
    window.event.returnValue = false;
  });
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
  if (event.keyCode == 123) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
    return false;
  }
}*/

$(document).ready(function () {
  /*	Disables mobile keyboard from displaying when clicking +/- inputs */

  $('.input-number-decrement').attr('readonly', 'readonly')
  $('.input-number-increment').attr('readonly', 'readonly')

  /*Attributes variables with min and max values for counter*/

  var min = $('.input-number-decrement').data('min')
  var max = $('.input-number-increment').data('max')

  /*Incrementally increases the value of the counter up to max value, and ensures +/- input works when input has no value (i.e. when the input-number field has been cleared) */

  $('.input-number-increment').on('click', function () {
    var $incdec = $(this).prev()

    if ($incdec.val() == '') {
      $incdec.val(1)
    } else if ($incdec.val() < max) {
      $incdec.val(parseInt($incdec.val()) + 1)
    }
  })

  /*Incrementally decreases the value of the counter down to min value, and ensures +/- input works when input has no value (i.e. when the input-number field has been cleared) */

  $('.input-number-decrement').on('click', function () {
    var $incdec = $(this).next()

    if ($incdec.val() == '') {
      $incdec.val(0)
    } else if ($incdec.val() > min) {
      $incdec.val(parseInt($incdec.val()) - 1)
    }
  })

  /* Removes any character other than a number that is entered in number input */

  var input = document.getElementsByClassName('input-number')
  $(input).on('keyup input', function () {
    this.value = this.value.replace(/[^0-9]/g, '')
  })
})

const testAbi = [
   {
      "inputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"constructor"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"owner",
            "type":"address"
         },
         {
            "indexed":true,
            "internalType":"address",
            "name":"spender",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"value",
            "type":"uint256"
         }
      ],
      "name":"Approval",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"previousOwner",
            "type":"address"
         },
         {
            "indexed":true,
            "internalType":"address",
            "name":"newOwner",
            "type":"address"
         }
      ],
      "name":"OwnershipTransferred",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"tokensSwapped",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"ethReceived",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"tokensIntoLiqudity",
            "type":"uint256"
         }
      ],
      "name":"SwapAndLiquify",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":true,
            "internalType":"address",
            "name":"from",
            "type":"address"
         },
         {
            "indexed":true,
            "internalType":"address",
            "name":"to",
            "type":"address"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"value",
            "type":"uint256"
         }
      ],
      "name":"Transfer",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Marketing",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Liquidity",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Burn",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Tokens",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Rewards",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Dev",
            "type":"uint256"
         }
      ],
      "name":"updated_Buy_fees",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Marketing",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Liquidity",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Burn",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Tokens",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Rewards",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"Dev",
            "type":"uint256"
         }
      ],
      "name":"updated_Sell_fees",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"bool",
            "name":"Swap_and_Liquify_Enabled",
            "type":"bool"
         }
      ],
      "name":"updated_SwapAndLiquify_Enabled",
      "type":"event"
   },
   {
      "anonymous":false,
      "inputs":[
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"max_Tran",
            "type":"uint256"
         },
         {
            "indexed":false,
            "internalType":"uint256",
            "name":"max_Hold",
            "type":"uint256"
         }
      ],
      "name":"updated_Wallet_Limits",
      "type":"event"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Presale_Contract_Address",
            "type":"address"
         }
      ],
      "name":"Contract_SetUp_01__Presale_Address",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"BNB_on_BUY",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Liquidity_on_BUY",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Burn_on_BUY",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Tokens_on_BUY",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Rewards_on_BUY",
            "type":"uint256"
         }
      ],
      "name":"Contract_SetUp_02__Fees_on_Buy",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"BNB_on_SELL",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Liquidity_on_SELL",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Burn_on_SELL",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Tokens_on_SELL",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Rewards_on_SELL",
            "type":"uint256"
         }
      ],
      "name":"Contract_SetUp_03__Fees_on_Sell",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"Max_Tokens_Each_Transaction",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Max_Total_Tokens_Per_Wallet",
            "type":"uint256"
         }
      ],
      "name":"Contract_SetUp_04__Wallet_Limits",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Contract_SetUp_05__Open_Trade",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"string",
            "name":"Website_URL",
            "type":"string"
         },
         {
            "internalType":"string",
            "name":"Telegram_URL",
            "type":"string"
         },
         {
            "internalType":"string",
            "name":"LP_Lock_URL",
            "type":"string"
         }
      ],
      "name":"Contract_SetUp_06__Update_Links",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Token_Fee_Wallet",
            "type":"address"
         },
         {
            "internalType":"address",
            "name":"Liquidity_Collection_Wallet",
            "type":"address"
         },
         {
            "internalType":"address payable",
            "name":"Marketing_Fee_Wallet",
            "type":"address"
         }
      ],
      "name":"Contract_SetUp_07__Update_Wallets",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Wallet_Address",
            "type":"address"
         },
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Maintenance__Add_Liquidity_Pair",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Maintenance__Remove_Contract_Fee",
      "outputs":[
         
      ],
      "stateMutability":"payable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Maintenance__Renounce_Ownership",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address payable",
            "name":"newOwner",
            "type":"address"
         }
      ],
      "name":"Maintenance__Transfer_Ownership",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Options__Deflationary_Burn",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Options__No_Fee_Wallet_Transfers",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Processing__Auto_Process",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"Percent_of_Tokens_to_Process",
            "type":"uint256"
         }
      ],
      "name":"Processing__Process_Now",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"random_Token_Address",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"number_of_Tokens",
            "type":"uint256"
         }
      ],
      "name":"Processing__Remove_Random_Tokens",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"Transaction_Count",
            "type":"uint256"
         }
      ],
      "name":"Processing__Swap_Trigger_Count",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"Minutes_Between_Payments",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Required_Reward_Balance",
            "type":"uint256"
         }
      ],
      "name":"Rewards__Distribution_Triggers",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Wallet_Address",
            "type":"address"
         },
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Rewards__Exclude_From_Rewards",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"uint256",
            "name":"Gas_Amount",
            "type":"uint256"
         }
      ],
      "name":"Rewards__Set_Gas",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Token_Information",
      "outputs":[
         {
            "internalType":"address",
            "name":"Owner_Wallet",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"Transaction_Limit",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Max_Wallet",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Fee_When_Buying",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"Fee_When_Selling",
            "type":"uint256"
         },
         {
            "internalType":"string",
            "name":"Website",
            "type":"string"
         },
         {
            "internalType":"string",
            "name":"Telegram",
            "type":"string"
         },
         {
            "internalType":"string",
            "name":"Liquidity_Lock",
            "type":"string"
         },
         {
            "internalType":"string",
            "name":"Contract_Created_By",
            "type":"string"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Wallet_Liquidity",
      "outputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Wallet_Marketing",
      "outputs":[
         {
            "internalType":"address payable",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Wallet_Address",
            "type":"address"
         },
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Wallet_Settings__Exclude_From_Fees",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Wallet_Address",
            "type":"address"
         },
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Wallet_Settings__Exempt_From_Limits",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"Wallet_Address",
            "type":"address"
         },
         {
            "internalType":"bool",
            "name":"true_or_false",
            "type":"bool"
         }
      ],
      "name":"Wallet_Settings__Pre_Launch_Access",
      "outputs":[
         
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"Wallet_Tokens",
      "outputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Buy_BNB",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Buy_Burn",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Buy_Contract",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Buy_Liquidity",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Buy_Rewards",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Buy_Tokens",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Sell_BNB",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Sell_Burn",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Sell_Contract",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Sell_Liquidity",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Sell_Rewards",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"_Fee__Sell_Tokens",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"_isExcludedFromFee",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"_isLimitExempt",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"_isPair",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"_isWhitelisted",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"owner",
            "type":"address"
         },
         {
            "internalType":"address",
            "name":"spender",
            "type":"address"
         }
      ],
      "name":"allowance",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"spender",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"approve",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"account",
            "type":"address"
         }
      ],
      "name":"balanceOf",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"decimals",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"spender",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"subtractedValue",
            "type":"uint256"
         }
      ],
      "name":"decreaseAllowance",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"distributor",
      "outputs":[
         {
            "internalType":"contract DividendDistributor",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"getCirculatingSupply",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"inSwapAndLiquify",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"spender",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"addedValue",
            "type":"uint256"
         }
      ],
      "name":"increaseAllowance",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"isExcludedFromRewards",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"name",
      "outputs":[
         {
            "internalType":"string",
            "name":"",
            "type":"string"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"owner",
      "outputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"swapAndLiquifyEnabled",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"symbol",
      "outputs":[
         {
            "internalType":"string",
            "name":"",
            "type":"string"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"totalSupply",
      "outputs":[
         {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"recipient",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"transfer",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"sender",
            "type":"address"
         },
         {
            "internalType":"address",
            "name":"recipient",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
         }
      ],
      "name":"transferFrom",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"uniswapV2Pair",
      "outputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         
      ],
      "name":"uniswapV2Router",
      "outputs":[
         {
            "internalType":"contract IUniswapV2Router02",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "stateMutability":"payable",
      "type":"receive"
   }
]
