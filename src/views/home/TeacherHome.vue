<template>
<div>

<v-toolbar color="primary">
    <v-toolbar-title> 
      <div class="d-flex flex-no-wrap justify-space-between pr-4 ">
       <div>
         Menu functions for  {{ getZml.login.fullname}} / {{ getZml.login.username}}
       </div>
      </div>
    </v-toolbar-title>
</v-toolbar>
 
    <menu-list :list="menuFilterList" 
     /> 
    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='wie'">
       <v-btn href="http://kuiliesonline.co.za/cw-mail/"> Online Mass Mail </v-btn>
    </div>
    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        <v-btn to="/viewfunctions"> only for werner </v-btn>
        <email-list />
    </div>
</div>
</template>

<script>
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList.vue';
import MenuList from '@/components/MenuList.vue';
export default {
    name:"AdminHome",
    components:{EmailList, MenuList},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         cards: ['Today', 'Yesterday'],
    }),
    computed:{
        menuFilterList() {
            if (!this.getZml) return 0;
            return this.getZml.functions.filter(a => function()
            {
                if (a.accesstype == this.getZml.login.type)
                    return 1
                else
                    return 0

                }
            )
        }
    },
    methods:{

    },
    mounted: function() {
        console.log('MOUNT ADMINHME ITEMS=')
    }
}
</script>

