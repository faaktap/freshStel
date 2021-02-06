zmlrekenaars...
----------------------------------------------------------------------------

I've been building a new framework.
1. Want to get i18n(translate) to work easily
2. Want to have a "task launcher" tied to buttons, so you can easily add new buttons. (and assoc tasks to them)
3. Toast messages (snackbar)
4. Confirm Message - this.$root.$confirm(this.Delete, this.AreYouSure, { color: 'red' })

----------------------------------------------------------------------------
Currently translate.js contain all the translations,
  still to do - make it easier to edit this, also eventually - json file in localstorage
----------------------------------------------------------------------------  
buttons.js contain all the buttons, and if you add some, you can add the stuff to translate.js too.
----------------------------------------------------------------------------
toast messages - also called v-snackbar
Think I sorted it out with globalActions.js 
  import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';  
For red and green messages - must still get close button neater.
  
----------------------------------------------------------------------------
Confirm message
  import confirm from "@/api/DialogConfirm";
  in app vue, then in mount() this.$root.$confirm = this.$refs.confirm.open
  
  then anywhere you want to call it...
this.$root.$confirm(this.Delete, this.AreYouSure, { color: 'red' })
           .then((confirm) => {
                               if (confirm) { 
                                 infoSnackbar('Jy het confirm! Baie mooi!')
                               } else {
                                 errorSnackbar('Hoekom nie?')
                               }
                 })  
                 
Where this.Delete is a computed field for translate. 
----------------------------------------------------------------------------
 
  
Always use a v-card if you want color

  