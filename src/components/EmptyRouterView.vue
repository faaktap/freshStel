<template>
 <div>
 <keep-alive>
  <router-view name="dialog"></router-view>
  <router-view></router-view>
 </keep-alive>
 </div>  
</template>

<script>
export default {
  name: 'EmptyRouterView'
}
</script>