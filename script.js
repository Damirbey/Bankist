'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2023-09-25T18:49:59.371Z",
    "2023-09-27T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let loggedInUser;
/////////////////////////////////////////////////
// Functions
function createUsernames(accounts){
  accounts.forEach((account)=>{
    account.username = account.owner.split(' ').map(item=>item.toLocaleLowerCase().slice(0,1)).join('').toString();
  })
}

function updateUserInterface(loggedInUser){
  displayMovements(loggedInUser.movements);
  displayBalance(loggedInUser);
  displaySummary(loggedInUser);
  displayWelcomeMessage(loggedInUser);
  labelDate.textContent = formatCurrentDate(loggedInUser.locale);
  //startLogoutTimer();
  showContent();
}

function displayMovements(movements){
  containerMovements.innerHTML= ' '
  movements = sort ? movements.slice().sort((a,b)=>a-b) : movements;

  movements.forEach((movement,index)=> {

    let type = movement > 0 ? 'deposit' : 'withdrawal';

    let html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
      <div class="movements__date">${formatNumberOfDays(loggedInUser.movementsDates[index])}</div>
      <div class="movements__value">${formatCurrency(movement,loggedInUser.locale,loggedInUser.currency)}</div>
    </div>`

    containerMovements.insertAdjacentHTML('afterBegin',html);
  });
}

function displayBalance(loggedInUser){
  labelBalance.innerHTML = ''

  let currentBalance = loggedInUser.movements.reduce((movement,accumulator)=>movement+accumulator,0).toFixed(1);

  labelBalance.innerHTML = formatCurrency(currentBalance,loggedInUser.locale,loggedInUser.currency);
}

function displaySummary(loggedInUser){
  let income = loggedInUser.movements.filter(movement=>movement > 0)
  .reduce((movement,accumulator)=>movement+accumulator,0).toFixed(1);

  let spendings = loggedInUser.movements.filter(movement=>movement < 0)
  .reduce((movement,accumulator)=>movement+accumulator,0).toFixed(1);

  let interest = loggedInUser.movements.filter(movement=>movement > 0)
  .map(movement=>(movement * loggedInUser.interestRate)/100)
  .reduce((interest,accumulator)=>interest+accumulator,0).toFixed(1);

  labelSumIn.innerHTML = formatCurrency(income,loggedInUser.locale,loggedInUser.currency);
  labelSumOut.innerHTML = formatCurrency(Math.abs(spendings),loggedInUser.locale,loggedInUser.currency);
  labelSumInterest.innerHTML = formatCurrency(interest,loggedInUser.locale,loggedInUser.currency);
}

function displayWelcomeMessage(loggedInUser){
  labelWelcome.textContent = `Welcome back, ${loggedInUser.owner}`;
}

function formatCurrentDate(locale){
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(new Date());
}
function formatCurrency(value,locale,currency){
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}
function formatNumberOfDays(date){
  const date1 = new Date();
  const date2 = new Date(date);

  const timeDifference = Math.abs(date1 - date2);

  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if(daysDifference === 0){return 'Today'}
  if(daysDifference === 1){return 'Yesterday'}
  else{
    return `${daysDifference} days ago`;
  }
}

function startLogoutTimer(){

  let time = 5;

  let tick = function(){
    let minutes = Math.trunc(time/60).toString().padStart(2,0);
    let seconds = String(time%60).padStart(2,0);

    labelTimer.textContent = minutes + ':' + seconds;

    time--;

    if(time < 0)
    {
      clearInterval(timer);
      logout();
    }
  };
  
  tick();
  let timer = setInterval(tick,1000);

}

function showContent (){
  containerApp.style.opacity = 1;
}

function hideContent(){
  containerApp.style.opacity = 0;
}

function eraseInputs(){
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
}
function logout(){
  hideContent();
}

function inputIsValid(input){
  return input.value.length > 0
}

function login(e){
  e.preventDefault();

  if(inputIsValid(inputLoginUsername))
  {
    loggedInUser = accounts.find(account=>
      account.username === inputLoginUsername.value && account.pin === Number(inputLoginPin.value)
    );
    loggedInUser && updateUserInterface(loggedInUser);
    eraseInputs();
  }else{
    alert("Please fill in all the fields");
  }
}
let sort = false;
function sortMovements(){
  sort = !sort;
  displayMovements(loggedInUser.movements);
}

createUsernames(accounts);
btnLogin.addEventListener("click",login);
btnSort.addEventListener("click", sortMovements);