<!--
   This is a grouping together of actions. If vertical is true, it will build them in a line via buttons.
   If vertical is false, we build a list.
   If prop vertical is false, it will built the in a vertical list. via list items
   If btn.optional is 1, then we do not display it in toolbar.
   If btn.optional is 0, then we do not display it in dropdown. 
   Therefore - IT IS USED IN TWO PLACES!
   We call doStuff to execute any action, expect i18n translate is done in here.
-->
<template>
 <div>
    <template v-if="vertical">
      <v-btn v-for="btn in buttons[buttonType]" 
            :key="btn.btn" 
            class="ma-2"
            :title="btnTip(btn)" 
            @click="doTask(btn.func)" 
            v-show="!btn.optional == 1"> 

        <v-icon>{{ btn.icon }}</v-icon>
        <div v-if="!$vuetify.breakpoint.smAndDown">
          {{ btnText(btn.btn) }}
        </div>

      </v-btn>

    </template>

    <template v-else>
     <v-list color="primary">

      <v-subheader> 
        {{ buttonType }}
      </v-subheader>

      <v-list-item-group>      
       <v-list-item v-for="btn in buttons[buttonType]" 
                 :key="btn.btn"
                 v-show="btn.optional == 1">  
        <v-list-item-icon>
         <v-icon>
          {{ btn.icon }}
         </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
         <v-list-item-title :title="btnTip(btn)" 
                          @click="doTask(btn.func)">
          {{ btnText(btn.btn) }}
         </v-list-item-title>
       </v-list-item-content>
      </v-list-item>   
     </v-list-item-group>

     </v-list>
    </template>
 </div>
</template>

<script>
//
// button names, function and doStuff to execute them...
//
import { doStuff,buttons } from '@/api/buttons'
import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';
export default {
 name: "toolBarButtons",
 props:{ vertical: {default:false, type:Boolean}, 
         buttonType: {default:"tool", type:String},
       },
 components: {},
 data: () => ({
   buttons: buttons,
 }),
 methods: {
   btnText(p1) { return this.$t('btn.' + p1) },
   btnTip(p1) { return this.$t('btn.tip'+p1.btn) },  
   doTask(task) {
     /* Boring tasks about router, done in buttons.js */
     if (!doStuff(this.$router,task)) {
        /* If doStuff above cannot handle the task, we switch to local tasks */
        switch (task) {
          case "testConfirm":
             infoSnackbar('Hello from snackbar!');
             this.$root.$confirm(this.Delete, this.AreYouSure, { color: 'red' })
                               .then((confirm) => {
                                                  if (confirm) { 
                                                    infoSnackbar('Jy het confirm! Baie mooi!')
                                                  } else {
                                                    errorSnackbar('Hoekom nie?')
                                                  }
                                 })
             break
          case "switchLocale": 
            return this.switchLocale ()
          default:      
            alert('we do not understand : ' + task)
        }
     }
   },
   switchLocale () {
     if (this.$i18n.locale === 'af') {
         this.$i18n.locale = 'en'
     } else {
         this.$i18n.locale = 'af'
     }
     localStorage.setItem('currentLocale',this.$i18n.locale)
   }
 },
 computed: {
   AreYouSure()    { return this.$t('message.AreYouSure') },
   Delete()        { return this.$t('message.Delete') },
   displayLocale() {
      let other = 'af'
      if (this.$i18n.locale === 'af') {
        other = 'en'
      }
      return other
   }
 },
 mounted: function () {
   console.log('mounting :', this.$options.name
                           , 'c=', this.$children.length
                           , this.vertical
                           , this.buttonType
              )
 }
}
</script>

