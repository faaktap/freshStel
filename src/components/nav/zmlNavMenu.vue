<template>
<v-container fluid>
     <v-card>
      <v-card-title v-if="!miniVariant">
       <v-layout>
       <v-badge :value="menuBadgeHover"
                 color="deep-purple accent-4"
                 content="settings"
                 right
                 transition="slide-x-transition">
        <v-hover v-model="menuBadgeHover">
         <v-btn icon  @click.stop="showSettingsDialog = true">
          <v-icon color="gray lighten-1" large>
            mdi-account
           </v-icon>
         </v-btn>
        </v-hover>
       </v-badge>
       <span v-if="!miniVariant" class="mt-2 pl-2 subtitle-2"
             style="white-space: nowrap; text-overflow: ellipsis;overflow: hidden;">
           <z-show name="username" />
       </span>
       <v-spacer />

       <v-btn v-if="!miniVariant" icon @click.stop="localDrawer = !localDrawer">
         <v-icon> mdi-close </v-icon>
       </v-btn>
      </v-layout>
     </v-card-title>
     <v-btn v-else icon  @click.stop="showSettingsDialog = true">
          <v-icon color="gray lighten-1" large>
            mdi-account
           </v-icon>
    </v-btn>
   </v-card>

    <v-card v-if="!miniVariant" class="my-2 pa-2">

       <span> Route : </span>{{ $route.fullPath}}

    </v-card>

    <v-list>
      <v-list-item
          v-for="(item, i) in navItems"
          :key="i"
          @click="gotoItem(item.to)"
      >
          <!-- :to="item.to"
          router
          exact -->

        <v-list-item-action>
         <v-icon class="ma-0 pa-0">
            {{ item.icon }}
         </v-icon>
        </v-list-item-action>
        <v-list-item-content v-if="!miniVariant">
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
</v-container>
</template>

<script>
import ZShow from '@/components/base/ZShow.vue'
export default {
 name:'zmlNavMenu',
 props:['miniVariant', 'drawer'],
 components: {ZShow},
 data () {
    return {
      menuBadgeHover:null,
      showSettingsDialog:false,
      localDrawer:false,
      navItems:[
      { icon: 'mdi-printer-wireless',    title: 'Reports',       to: '/reports'  },
      { icon: 'mdi-percent',    title: 'Devaluation',       to: '/Outline'  },
      { icon: 'mdi-bookshelf',  title: 'Journal',             to: '/Outline'  },
      { icon: 'mdi-warehouse',      title: 'Stock',             to: '/Outline'  },
      ],
    }
  },
  methods: {
    gotoItem(item) {
        this.$router.push({ path: item});
    },
  },
  mounted() {
    this.localDrawer = this.drawer
    console.log('mnt', this.$options.name)
  },
  watch: {
       showSettingsDialog() {
         this.$emit('showSettingsDialog', this.showSettingsDialog)
       },
       localDrawer() {
         this.$emit('drawer', false)
       }
    }
}
</script>