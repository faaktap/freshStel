<template>
 <v-container fluid>
      Some stuff for werner
      <div v-if="'name' in sel">
          sel = {{ sel }}<br>
          sel.jdocstruc = {{ sel.jdocstructure }}<br>
          sel.jdocstruc[0] = {{ sel.jdocstructure[0] }}<br>
          sel.jdocstruc[1] = {{ sel.jdocstructure[1] }}<br>
          <v-card v-for="(i,j) in sel.jdocstructure" :key="j">
              {{ j}}  {{ i }}
          </v-card>

      </div>
      <v-data-table
       :items="tab"
       :headers="head"
       @dblclick:row="rowDblClick"
      />

      <v-btn x-small @click="addEntry"> add </v-btn>
      <v-card class="ma-2" v-for="i in tab" :key="i.id">
      {{ i }}
      </v-card>
      <hr>
      <v-card class="ma-2" >      {{ sel }} </v-card>
      <v-card class="ma-2" >      {{ head }} </v-card>
      <hr>


<v-dialog v-model="showAdd">
<v-card>
    <v-card-text>
    selselsel = {{ sel }}
    <br>
  <v-row>
  <v-col cols="12" md="6" v-for="i in head" :key="i.id">
    <v-text-field      class="mx-2" solo dense
      v-model="sel[i.text]"
      :label="i.text"
      :readonly="!i.edit"
    />
    {{ i.text }} {{ i.edit}}
  </v-col>
  </v-row>
  </v-card-text>
  <v-card-actions>
  <v-btn @click="showAdd = !showAdd"> close </v-btn>
  <v-spacer />
  <v-btn @click="selListEntryEdited"> save </v-btn>
  </v-card-actions>
 </v-card>
</v-dialog>

 </v-container>
</template>

<script>
import { getters } from "@/api/store";
import { ws } from "./WernerTest.js";
export default {
    name:"WernerTest",
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        tab:[],
        head:[],
        sel:{},             // saved list entry in here for editing
        uniqKeyFld:'id',  // used to find in tab list what was clicked
        selectedKeyIndex:null, // used to store index of what was clicked
        showAdd:false,

    }),
    methods: {
        selListEntryEdited() {
            let index = this.selectedKeyIndex
            let change = false
            if (this.tab[index] == this.sel) {
                ws.localUpdate(this.head, this.sel)
                change = true
            } else {
                alert('we must hae  the wrong entry!!')
            }
            this.showAdd = false
            if (change == true) {
               // we need to force an re-render sometimes...
                 this.tab[index].comment = ''
            }
            this.tableHasChanged()
        },
        rowDblClick(e,{item}) {
          //console.log(e, item, headers)
          this.sel = item
          this.selectedKeyIndex = this.tab.findIndex(e => e[this.uniqKeyFld] == item[this.uniqKeyFld])
          if (this.selectedKeyIndex == -1) {
              alert('we did not find that entry!')
              return
          }
          console.log('selectedKeyindex = ',this.selectedKeyIndex, 'for item id', item[this.uniqKeyFld])
          this.showAdd = true
        },
        addEntry() {
            if (this.tab.length == 0) {
            this.tab = [
                     {id:1,name:'werner',surname:'smit'
                     ,jdocstructure:[{name:'mark1', value:11, type:'text'}
                                    ,{name:'comment', value:'a comment', type:'text'}]},
                     {id:2,name:'anton',surname:'smith'
                     ,jdocstructure:[{name:'mark1', value:12, type:'text'}]}
                       ]
            } else {
                let obj1 = {name:'mark1', value:this.tab.length, type:'number'}
                let obj2 = {name:'comment', value:'sdfrsdsdf', type:'text'}
                let playStruct = [obj1,obj2]
             this.tab.push(
                 {id:this.tab.length+1,
                 name:'add'+this.tab.length,
                 surname:'surname',
                 jdocstructure: playStruct
             })
             // console.log('after adding json', this.tab)
            }
        },
        tableHasChanged() {
            this.tab.forEach(row => {
               ws.addStructure(row)
            })
            // console.log('call fixheader')
            //ws.fixHeader(this.head)
        }
    },
    mounted() {
      this.head = [{text:'id', value:'id', edit:false},
                   {text:'name', value:'name', edit:false},
                   {text:'surname', value:'surname', edit:false}
                  ]
      let obj1 = {name:'mark1', value:'', type:'number', edit:true}
      let obj2 = {name:'comment', value:0, type:'text', edit:true}
      let objArr = [obj1, obj2]
      ws.assignStruct(objArr)
      ws.fixHeader(this.head)
    },
    watch: {
        tab: {
            deep:true,
            handler() {
               console.log('tabwatch : deep is true');
               this.tableHasChanged();
            }
        },
        sel: {
            deep:true,
            handler() {
               console.log('sel was changed : deep is true');
            }

        }

    }
}
</script>