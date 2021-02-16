<template>
<v-sheet color="green">
    {{ $route.meta.authentication }}
    <h1> START OF ROUTE  :::::  {{ rid }} {{ id }} </h1> 
     <br>

    $route.params (in route1) = {{ $route.params }}
    (alle params is ) {{ $route.params }}

    <router-link v-for="s in selB" :key="s"
           :to="{ name: 'Route1' 
                , params: { rid: s, rpost: 'another-local-hello' + s }
                , meta: {layout: 'AppLayoutGray', authentication: 'another-local-public'} }"
    >
    choose {{ s }}
    </router-link>
    <h1> END OF ROUTE  1 </h1> 

</v-sheet>    
</template>

<script>
export default {
   props: [ 'rid','id' ],
   data() {
       return {
           selB: [100,200,300,400],
       }
   }
}
</script>