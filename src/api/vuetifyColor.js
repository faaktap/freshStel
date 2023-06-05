import colors from 'vuetify/lib/util/colors'

/* ----------------
     hex = vuetifyColor.hexColor('red ligten-2')
     hex = vuetifyColor.hexColor('primary')  -- won't work
     appheight = this.$vuetify.presets.framework.breakpoint.height
     appwidth = this.$vuetify.presets.framework.breakpoint.width
     this.$cs.l('vue',this.$vue)
     textcolor = vuetifyColor.textColor( vuetifyColor.hexColor('red darken-2'))
     getBestColor = vuetifyColor.getBestColor('blue')
   ----------------*/
export const vuetifyColor = {
  hexColor: (name) => {
    const [nameFamily, nameModifier] = name.split(' ')
    const shades = ['black', 'white', 'transparent']
    const util = {family: null, modifier: null}
    if (shades.find(shade => shade === nameFamily)){
      util.family = 'shades'
      util.modifier = nameFamily
    } else {
      const [firstWord, secondWord] = nameFamily.split('-')
      util.family = `${ firstWord }${ secondWord
        ? secondWord.charAt(0).toUpperCase() + secondWord.slice(1)
        : '' }`
      util.modifier = nameModifier 
        ? nameModifier.replace('-', '') 
        : 'base'
    }
    let answer = ''
    try {
      answer = colors[util.family][util.modifier]
    } catch (e) {
      console.log('we could not find the color : ', name)  
    }
    return answer // colors[util.family][util.modifier]
  },
  textColor: (passedHexValue) => {
    return getContrast (passedHexValue)
  },
  getBestColor: (colorDescription) => {
    return getContrast ( vuetifyColor.hexColor(colorDescription)  )
  }
}


/*!
 * Get the contrasting color for any hex color
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
function getContrast (hexcolor){

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
	let r = parseInt(hexcolor.substr(0,2),16);
	let g = parseInt(hexcolor.substr(2,2),16);
	let b = parseInt(hexcolor.substr(4,2),16);

	// Get YIQ ratio
	let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Check contrast
	return (yiq >= 128) ? 'black' : 'white';

}