<template>
 <v-container fluid>
  <v-row >
   <v-col cols="12">
    <h1 v-if="tHeading" class="text-center grey--text"> {{ tHeading }} </h1>
   </v-col>
   <v-col cols="12">
      <!-- {{ $vuetify.breakpoint.lgAndDown }} -->
     <v-layout color="gray--text text--lighten-5" flex-column>
       <v-text-field
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           single-line
           hide-details
           class="ma-2 pa-2"
       >
       </v-text-field>
       <v-card color="blue lighten-4" class="ma-0">
        <v-card-text>
         <v-card v-if="bHeading" class="text-center ma-0 pa-2" color="primary gray--text text--lighten-3"> {{ bHeading }} </v-card>
          <!-- To make this standalone, you can make it a component, and the "emits" will echo back up to "grandparent"
          See: https://stackoverflow.com/questions/74021655/vuejs-3-emit-event-from-grand-child-to-his-grand-parent-component
          And: https://codepen.io/tosite/pen/dKMNxY?editors=1010
          Then the "shell" of the datatable component can be replaced -->
         <v-data-table
           ref="wsTab"
           v-if="tList"
           :headers="compCol"
           :items="tList"
           :items-per-page="itemsPerPage"
           :search="search"
           class="elevation-1"
           color="purple lighten-3"
           multi-sort
           @dblclick:row.stop="dblClick"

         >
         <!-- @click:row="clickOnTableRow" -->
         <!-- @dblclick:row.prevent="doubleClickOnTableRow" -->
         <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
               No data availible - try the refresh button :)
            </v-alert>
         </template>
         <template v-for="(head,i) in compCol" v-slot:[`item.${head.value}`]="{ item }">  <!-- ,header-->
          <div :key="head.value">
            <template v-if="head.value == 'name'">
               {{ item[head.value] }}
            </template>
            <template v-else-if="head.value == 'action!'">
              <v-layout color="gray--text text--lighten-5" flex-row>
              <z-table-btn color="red" title="delete" @click="itemAction('delete',item)"/>
              <z-table-btn title="edit" @click="itemAction('update',item)" />
              </v-layout>
            </template>
            <template v-else>
              <!-- This is a way of testing how you want to display something else... (calling a method and practise there... -->
             <span>
               {{  showFieldValue( item[head.value], i, head.value)  }}
             </span>
            </template>
          </div>
         </template>
          <template v-slot:[`footer.page-text`]>
            <v-btn icon @click="itemAction('insert','')"><v-icon >mdi-table-plus</v-icon></v-btn>
          </template>
         </v-data-table>
        </v-card-text>
        <v-card-actions>
          <slot name="action" >
          </slot>
        </v-card-actions>
       </v-card>
      </v-layout>
    </v-col>
  </v-row>
 </v-container>
</template>


<script>
import ZTableBtn from '@/components/fields/ZTableBtn.vue'
export default {
    name:"BaseTableEdit",
    components:{ZTableBtn},
    props: {
    tList: {type: Array, required: true },
    tHeading: {type: String, default:'table heading'},
    bHeading: {type: String, default:'table B heading'},
    itemsPerPage: {type: Number, default:20},
    },
    data: () => ({
        curItem:{},
        search:null,
        tableLoading:false,
    }),
    computed: {
      compCol() {
       if (!this.tList || this.tList.length == 0) return []
       let tHeader = []
       Object.keys(this.tList[0]).forEach(name => {
            tHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1)
                 , value: name} )
       })
       tHeader.push(  { text:'action', value: 'action!'} )
       return tHeader
      },
    },
    methods:{
      dblClick (evt,item) {
        this.itemAction('update', item.item)
      },
      itemAction(action, item) {
        this.$emit(action, item)
      },
      // eslint-disable-next-line
      showFieldValue( val, i, head) {
        // console.log('showFieldValues A:', val)
        // console.log('showFieldValues B:', i)
        // console.log('showFieldValues C:', head)
        return val
      },
      // clickOnTableRow(item,evt) {
      //   console.log('tablerow',item,evt)
      //   this.$emit('select', item,evt)
      // },
      // doubleClickOnTableRow(p1,p2) {
      //     this.$emit('doubleClick', p1, p2)
      // },
    },
    mounted: function() {
       console.log('mount', this.$options.name)
    },
}
</script>

