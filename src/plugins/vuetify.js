import Vue from 'vue';
//import Vuetify from 'vuetify/lib/framework';
<<<<<<< HEAD
import Vuetify, { VTextField,VLayout, VCheckbox, VSelect,VTextarea,VAutocomplete, VCombobox, VSwitch } from "vuetify/lib";
import { Ripple, Intersect, Touch, Resize } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
    components: { VTextField,VLayout, VCheckbox, VSelect,VTextarea,VAutocomplete, VCombobox,VSwitch},
=======
import Vuetify, { VLayout, VCheckbox, VTextField,VSelect,VTextarea,VAutocomplete, VCombobox } from "vuetify/lib";
import { Ripple, Intersect, Touch, Resize } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
    components: { VLayout, VCheckbox, VSelect,VTextField,VTextarea,VAutocomplete, VCombobox },
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
    directives: { Ripple, Intersect, Touch, Resize }
});


//export default new Vuetify({});

export default new Vuetify({
    theme: {
      themes: {
        light: {
          primary: "#2196F3", //"#14C6FF",
          secondary: '#2E7D32',//"#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          smalltoolbargray: "#F1F3F4",
          lightblue: "#14c6FF",
          yellow: "#FFCF00",
          pink: "#FF1976",
          orange: "#FF8657",
          magenta: "#C33AFC",
          darkblue: "#1E2D56",
          gray: "#909090",
          neutralgray: "#9BA6C1",
          green: "#2ED47A",
          red: "#FF5c4E",
          darkblueshade: "#308DC2",
          lightgray: "#BDBDBD",
          lightpink: "#FFCFE3",
          white: "#FFFFFF",
<<<<<<< HEAD
          gold: "#b99c31",
          stellenbergblou:"#008D83",
          stelgray:"#B4B4B4",
          stelred: "#852028",
=======
          whitesmoke: "#f5f5f5",
          linen: "#faf0e6",
          gold: "#b99c31",
          browsergold: "#ffd700",
          Cornsilk: "#fff8dc",
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
        }
      }
    }
  });