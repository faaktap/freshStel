<docs>
The idea is to create a button, that will show a dialog when pressed.
Eventually the text could be read from the database?
Like helptext.
</docs>

<template>
<v-btn :color="color" :icon="(iconName.length > 3 && buttonText.length == 0) ? true : false" @click="show=!show" :title="infoTitle">
 <v-icon v-if="iconName.length > 3"> {{ iconName }} </v-icon>
 {{ buttonText }}
    <v-dialog v-model="show" max-width="400" style="position:relative">
     <v-card max-width="400">
      <v-card-title>
        <span> {{ infoTitle }} </span>
        <v-spacer />
        <v-menu>
         <template v-slot:activator="{ on, attrs }">
           <v-btn icon v-bind="attrs" v-on="on" @click="show = false"><v-icon>mdi-close</v-icon></v-btn>
         </template>
        </v-menu>
      </v-card-title>
      <v-card-text> <slot>{{ infoText }}</slot> </v-card-text>
     </v-card>
    </v-dialog>
</v-btn>
 </template>

<script>
export default {
    name:"BaseButtonDialog",
    props:{
        buttonText:{type:String, default:'pressme'},
        iconName:{type:String, default:''},
        infoText:{type:String, default:'Please supply some text'},
        infoTitle:{type:String, default:'Please supply a title'},
        color:{type: String, default: ''}
    },
    data: () => ({
     show:false
    })
}
</script>