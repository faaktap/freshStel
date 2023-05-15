const PROJECT_NAME = "dkLearn"
const PROJECT_VERSION = "54.5c"
const PROJECT_ID = PROJECT_NAME + PROJECT_VERSION
const MEASUREMENT_ID = "Z-ZML"+PROJECT_VERSION
const DEFAULT_LAYOUT = "AppLayoutDefault"
const MAX_UPLOAD_SIZE = 90 * 1024 * 1024

/*
  apiPath:    "https://kuiliesonline.co.za/api/candid/candidates.php",
  apiUpload:  "http://localhost:81/api/fileUpload/fileUpload.php",
  apiDKHS:    "http://localhost:81/api/dkhs/dkhs.php",
*/

/*
  apiPath:    "https://kuiliesonline.co.za/api/candid/candidates.php",
  apiUpload:  "https://kuiliesonline.co.za/api/fileUpload/fileUpload.php",
  apiDKHS:    "https://kuiliesonline.co.za/api/dkhs/dkhs.php",
*/

export const zmlConfig = {
  apiPath:    "https://kuiliesonline.co.za/api/candid/candidates.php",
  apiUpload:  "https://kuiliesonline.co.za/api/fileUpload/fileUpload.php",
  apiUploadCR:  "https://kuiliesonline.co.za/api/crfile/fileUpload.php",
  apiDKHS:    "https://kuiliesonline.co.za/api/dkhs/dkhs.php",
  localPath:  "https://kuiliesonline.co.za/qrsite",
  videoPath:  "https://kuiliesonline.co.za/",
  emailPath:  "https://kuiliesonline.co.za/api/swiftmailer/genMailer.php",
  filesRootFolder:'/api/crfile/files/',
  maxUploadSize: MAX_UPLOAD_SIZE,
  projectID: PROJECT_ID,
  projectName: PROJECT_NAME,
  reportBlurb: `DKVS:${PROJECT_VERSION}`,
  measurementID: MEASUREMENT_ID,
  defaultLayout: DEFAULT_LAYOUT,
  // eslint-disable-next-line
  cl: function (...args) {
     console.info(...args);
  },
  randomColor: function() {return Math.floor(Math.random()*16777215).toString(16)},
  copyToClipboard : function(text) {navigator.clipboard.writeText(text)},
  randomNumberInRange : function(min = 0, max = 100) { return Math.floor(Math.random() * (max - min + 1)) + min},
  randomBoolean : function() { return Math.random() >= 0.5;},
  goToTop : function() {window.scrollTo(0, 0)},
  //date or calendar functions
  daysBetween : function(date1, date2) {return Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000)},
  isWeekday : function(date) {return date.getDay() % 6 !== 0},
  timeFromDate : function(date) {return date.toTimeString().slice(0, 8)},
  dayOfYear : function (date) { return  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)},
  isDateValid : function (...val) {return !Number.isNaN(new Date(...val).valueOf())},
  stripHtml : function(html) { return (new DOMParser().parseFromString(html, 'text/html')).body.textContent || ''},
  stringReverse : function (str) {return str.split("").reverse().join("")},
  capitalize : function(str) {return str.charAt(0).toUpperCase() + str.slice(1)},
  round : function(n, d) {return Number(Math.round(n + "e" + d) + "e-" + d)},   //round(1.005, 2) //1.01
  shuffleArray : function(arr) {return arr.sort(() => 0.5 - Math.random())},
  isDarkMode : function() {return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches},
  average : function(arr) {return arr.reduce((a, b) => a + b) / arr.length},
  touchSupported : function() { return ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)},
  getCookie : function(name) {return `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();},
  randomArrayItem : function(arr) {return arr[Math.floor(Math.random() * arr.length)]},
  removeDuplicates : function(arr) {return [...new Set(arr)]},
}

export const promiseTimeout = function(ms, promise){
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in '+ ms + 'ms.')
    }, ms)
  })
  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
}

/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
export const getContrast = function (hexcolor){

	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}

	// If a three-character hexcode, make six-character
	if (hexcolor.length === 3) {
		hexcolor = hexcolor.split('').map(function (hex) {
			return hex + hex;
		}).join('');
	}

	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);

	// Get YIQ ratio
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Check contrast
	return (yiq >= 128) ? 'black' : 'white';

};
//------------------------------------------
//Anyplace you want to use my zmlConfig.cl.
//------------------------------------------
//import { zmlConfig } from '@/api/constants';
//zmlConfig.cl('mount : ', this.$options.name , 'c=',this.$children.length);
