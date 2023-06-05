<template>
<v-card width="auto">
  <v-layout row wrap>
    <v-card  width="350" class="ma-2 pa-2">
      <v-list nav dense>
        <v-list-item
          v-for="item in $router.options.routes.slice(1)"
          :key="item.name"
          :class="isCurrentPageClass(item)"
          @click="goto(item)"
        >
         <v-list-item-content class="grey--text text--darken-2">
          <v-list-item-title :style="isCurrentPageClass(item)"
                             :title="item.meta">
              {{ item.name }} | {{ item.path }} | {{ item.meta }} | {{ item.params }} |
          </v-list-item-title>
         </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card width="350" class="ma-2 pa-2">
      <small> {{ $router.options.routes }} </small>
    </v-card>
  </v-layout>
  <small class="debcomp"> {{ $options.name }} </small>
</v-card>
</template>

<script>
export default {
    name:"AutoRoute",
    data:() => ({}),
    methods:{
      isCurrentPageClass(item){
    //     let x = `a::after { position: absolute;\
    //      width: 100%;\
    //      height: 3px;\
    //      top: 100%;\
    //      left: 0;\
    //      transition: transform 0.5s;\
    //      transform: scaleX(0);\
    //      transform-origin: right;\
    //      }
    //    }`
       return this.$router.currentRoute.name === item.name ? 'red lighten-5 green--text' : null
       //return this.$router.currentRoute.name === item.name ? x : 'color: red;'
      },
      goto(item){
        this.$router.push(item.path)
        //this.drawer = this.$vuetify.breakpoint.smAndUp
        //if (this.isCurrentPageClass(item) ) this.$router.push(item.path)
      },
    }
}
</script>

