<template>
<v-window>

    {{ $route.meta.authentication }}
    <h1>START OF ROUTETEST {{ id }} </h1>
    This is a test starting page for our route practise.
    <br>
    <v-card color="red"> Here are all our current  $route.params = {{ $route.params }} </v-card>

    <v-card v-for="ss in selA" :key="ss"  color="blue">
        {{  ss }}
    <router-link v-if="$route.params.id != ss"
                    :to="{ name: 'Werner' 
                         , params: { id: ss, post: 'Routetest ' + ss }
                         , meta: {layout: 'AppLayoutGray', authentication: 'public'} }"
                >
                Go To werner route <b> {{ ss }} </b>
    </router-link>
    </v-card>


    <hr />



    <h1>BEFORE ROUTERLINK TO LOWER ROUTEs</h1>
    <div v-for="s in selB" :key="s" >
    <router-link 
                    :to="{ name: 'Route1' 
                         , params: { rid: s, rpost: 'hello' + s }
                         , meta: {layout: 'AppLayoutGray', authentication: 'public'} }"
                >
                Go To route {{ s }}
    </router-link>
    </div>

    <hr />
    rv s
    <router-view />
    rv e
</v-window>
</template>

<script>

export default {
  name:'routetest',
  props: [ 'id' ],
  data() { return {
      test:"sfsdfsd",
      selA:[1,2,3,4,77,66,55,333],
      selB:[10,20,30,40,707,606,505,303],
  }
  },
  computed:{
  }
}
</script>