<template>
<div>

{{ getZml.login}}
When we get here, and want to load studenthub (sh), we need to 
1. See what our language are - and chage subject n studentDisplauShort to show afr names
2. load current grade, so we can use it in sh
3. we might look for "newest" update in subhects, and serve that up for user.
OR - we might show latest changes here for their grade? Or otherwise just show
the blank screen? And maybe button for homework assignments and messages?

<s-hub> </s-hub>

</div>
</template>

<script>
import { getters } from "@/api/store"
//import { zmlConfig } from '@/api/constants.js'
//import { zmlFetch } from '@/api/zmlFetch.js'
//import { zmlLog } from '@/api/zmlLog.js'
//import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions'
import sHub from '@/views/learn/sh.vue'
export default {
    name: "StudentHub",
    components: {sHub},
    props: {  },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
    }),
    activated: function () {
    },
    methods:{
    },
    filters: {
    },
    computed: {
    },
    mounted: function () {
       console.log('Mount',this.$options.name)
    }
  }
</script>  
<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>