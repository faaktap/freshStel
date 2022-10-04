<!--
At the moment, pass text for the button, and pass an object to the dropitem
The object only need to have a property called "title"
-->
<template>
    <v-menu
      open-on-hover
      bottom
      offset-y
      nudge-bottom
      transition="fab-transition"
      right
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
         :color="color"
          dense nav shaped
          :small="icon ? true : false"
          :icon="icon!=''"
          v-bind="attrs"
          v-on="on"
          :fab="fab"
          @click="$emit('mainclick',title)"
        >
        <v-icon small v-if="icon"> {{ icon }} </v-icon>
          {{ title }}
        </v-btn>
      </template>
      
      
      <v-list v-if="dropItems && dropItems.length" dense bottom  outlined rounded>
        <v-list-item
          v-for="(mitem, index) in dropItems"
          :key="index"
          @click="$emit('dropclick',mitem.title,mitem)"
        >
         
          <v-list-item-icon v-if="mitem.icon"><v-icon> {{mitem.icon}} </v-icon></v-list-item-icon>

          <v-list-item-title v-if="mitem.title"> {{ mitem.title }} </v-list-item-title>


        </v-list-item>
      </v-list>
      
    </v-menu>
</template>

<script>
  export default {
    name:"hoverButton",
    props:{
           title: {default:"MyTopOne"},
           dropItems: {type:Array
                    , default: function () {
                       return [{ title: 'hello' }]
                     }},  //Important - we need a {title:"menuname"} in this!
            fab: {type:Boolean, default:false},
            icon: {type:String, default:''},
            color: {type:String, default:"orange lighten-2"}
          },
    data: () => ({
    }),
    methods: {
      hallo() {
        if (this.dropItems.length) {
          console.log('start hallo',this.dropItems)
          //Object.keys(this.dropItems).map(function (m, i) {
            //console.log('hallo',this.dropItems[m],i)
          //})
        }
      }
    },
    mounted() {
      //console.log('Start',this.$options.name, this.dropItems)
      //this.hallo()
    }
  }
</script>