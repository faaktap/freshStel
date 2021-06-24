<template>
<div>
    <v-btn @click="expandAll('contract')"> contract </v-btn>
    <v-btn @click="expandAll('expand')"> expand </v-btn>
    
   <div v-for="b in buttons" :key="b.id" class="d-flex">
   <v-expansion-panels min-width="150" max-width="250"
                       rounded class="ma-2 pa-2 long-line condensed" 
                       v-model="expandStatus"
                       >
    <v-expansion-panel   >
     <v-expansion-panel-header xdisable-icon-rotate 
                               class="no-uppercase "
                               color="deep-purple lighten-5" 
                               @:blur="blur(b)"
                               >
          {{ b.text }} {{ expandStatus }}
         <template v-slot:actions>
           <v-btn text @click.stop="doSomething" >
           <v-icon color="teal">
              mdi-coffee
           </v-icon></v-btn>
         </template>
     </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-card  min-width="300" 
               min-height="100"
         dense
         class= "ma-2"
         color="deep-purple lighten-3"                  
      >
      <v-card-title> 
         Some Title?
      </v-card-title>        
      <v-card-text>
           {{ b }}   <v-btn small @click="doSomething"> view and shrink expansion (contract) </v-btn>
      </v-card-text>
     </v-card>
    </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>
      </div>
      <v-card color="light-blue" class="ma-2 pa-2">
    {{ expandStatus}} <br>{{ buttons }}
      </v-card>
</div>

</template>
<script>
export default {
    name:"TestExpand",
    components: {},
    data: () => ({
      expandStatus:[],
      buttons:[
          {id:1, name:'name1', text:'whatever 1'},
      ],
    }),    
    computed:{ },
    filters:{ },
    methods: {
        test() {
          alert('test')
        },
        blur(b) {
           if (b.expand) b.expand[0] = false
        },
        doSomething() {
            this.expandStatus = []
        },
        expandAll(value) {
           if (value == 'expand') {
               this.expandStatus = [...Array(this.buttons).keys()].map((k, i) => i)
           } else {
               this.expandStatus = []
           }
        },

    },
    mounted: function () {

    },
    watch: {
    }

}
</script>
<style scoped>
.no-uppercase {
     text-transform: none;
}
.long-line {
    white-space: nowrap ;
    word-break: normal;
    overflow: hidden ;
    text-overflow: ellipsis;
}


.v-expansion-panels.condensed .v-expansion-panel-header {
  padding-top: 2px;
  padding-bottom: 2px;
  min-height: auto;
}
.v-expansion-panels.condensed
  .v-expansion-panel--active
  .v-expansion-panel-header {
  padding-top: 8px;
  padding-bottom: 8px;
}
.v-expansion-panels.condensed .v-expansion-panel--active:not(:first-child),
.v-expansion-panels.condensed .v-expansion-panel--active + .v-expansion-panel {
  margin-top: 4px;
}

</style>