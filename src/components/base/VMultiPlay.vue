<template>
<!--
    vMultiItems
    List of countries
    When clicked
    show list with country and value to be editied
    return a list with country code, and value added
    we need (1) a list of countries, (2) a list of countries and values
    we also need list(2) pre-filled, if we have done it already (as v-model)
    we display list of countries, or whatever as a drop down, and when you click on one, we add it in data-list below
    the data-list will have two items - country and value, and 2nd one can be changed.
    So, better to first add a component with the list that can be edited?
    -->
<div>
    {{ debug }}
    <span v-if="isDebug">  isDebug is true </span> <span v-else> aaa</span>
    <span v-if="!isDebug">  isDebug is not true </span><span v-else> aaa</span>
    <span v-if="isDebug == false">  isDebug is not true </span><span v-else> aaa</span>
    <span v-if="isDebug == true">  isDebug is true </span><span v-else> aaa</span>
    <span v-if="isDebug == 'true'">  isDebug is true </span><span v-else> aaa</span>
    <span v-if="isDebug == 'false'">  isDebug is Not true </span><span v-else> aaa</span>
    <span v-if="debug">  debug is true </span><span v-else> aaa</span>
    <span v-if="!debug">  debug is false </span><span v-else> aaa</span>
      <v-select
        width="300px"
        max-width="50%"
        :label="label || ''"
        :title="title || ''"
        v-model="mainItem"
        :items="items"
        clearable
        class="ma-2 pa-2"
        v-on:input="dataTableEdit"
        :outlined="theOutlined || false"
       />
      <v-data-table class="elevation-1 ma-2 pa-2"
                 :headers="theListHeaders"
                 :items="theList"
                 :items-per-page="10"
                 hide-default-header
                 hide-default-footer
                 :title="label || '?'"
      >
      <template v-slot:[`top`]>
        <v-dialog v-model="showEditDialog"
                  max-width="500px">
         <v-card>
          <v-card-title>
             {{ label || '' }}
          </v-card-title>

          <v-card-subtitle>
             {{ itemSelected.key }}
          </v-card-subtitle>

          <v-card-text>

            <v-card v-if="debug" dark color="purple">
             <v-card-title> isDebug </v-card-title>
              what is type? :: {{ entryType }}
              <br><pre>
              {{ entryType && entryType.type == 'radio' }}
              {{ entryType && entryType.type == 'multiple-text' }}
              {{ entryType && entryType.type == 'text' }}
              </pre>
            </v-card>

            <v-radio-group v-if="entryType && entryType.type == 'radio'"
                           v-model="itemSelected.value">
                {{ entryType.label || 'Entry' }}
              <v-radio v-for="l in entryType.options" :key="l" :value="l" :label="l" />
            </v-radio-group>

            <template v-else-if="entryType && entryType.type == 'multiple-text'">
              <v-text-field v-for="i in entryType.options" :key="i"
                       v-model="itemSelected[i]"
                       :label="i"
                       :outlined="theOutlined || false"
                       class="ma-2 pa-2"
              />
            </template>

            <template v-else-if="entryType && entryType.type == 'text'">
              <v-text-field
                       v-model="itemSelected.value"
                       :label="entryType.label || 'Entry'"
                       :outlined="theOutlined || false"
                       class="ma-2 pa-2"
              />
            </template>

          </v-card-text>
          <v-card-actions>
            <v-spacer />
           <!-- <v-btn color="primary" text
                 @click="showEditDialog=false">Cancel
           </v-btn> -->
           <v-btn color="primary" small
                 @click="saveItem">Save
           </v-btn>
          </v-card-actions>
         </v-card>
        </v-dialog>
      </template>
      <!-- Here we show the actions column -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="green" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon color="red" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        {{ noDataToDisplayMessage }}
      </template>
      </v-data-table>
      <v-card v-if="debug" color="purple" dark> {{ isDebug }}
      entryType={{ entryType || 'niks' }}
      entryType.Options={{ entryType.Options || 'niks' }}
      value={{ value }}
      items={{ items }}
      label={{ label || 'no label'}}
      value={{ value || 'no values' }}
      </v-card>

</div>
</template>

<script>
import { util } from "@/api/util.js"
export default {
  name:'MultiPlay',
  props: ['debug','items','type','value', 'obj','label', 'color', 'nodata','title', 'entryType', 'outlined'],
  /*
  props: {
    debug: {type:Boolean,default:false},
    items: {default:[]},
    //type: {default:''},
    value: {default:''},
    //obj: {default:''},
    label: {default:''},
    color: {default:''},
    nodata: {default:''},
    title: {default:''},
    entryType: {default:{}},
    outlined: {default:''},
  },
 */
  data () {
    return {
      showEditDialog:false,
      mainItem:'',
      itemSelected:{},
      updatedList: [],
      isDebug:false
    }
  },
  methods:{
    deleteItem(itemSelected) {
       util.cl('vmi', 'deleteItem')
       this.updatedList = this.theList
       let idx = -1
       if (typeof(this.updatedList) == 'object') {
          idx = this.updatedList.findIndex(e => e['key'] == itemSelected['key'] )
          this.updatedList.splice (idx, 1)
          this.$emit('input', this.updatedList )
          //After emit, we should receive new data back from parent - so we can go back to using this.value
          this.updatedList = []
          this.showEditDialog = false
       } else {
        util.cl('vmp updatedList is not an array', typeof(this.updatedList), this.updatedList)
       }

    },
    editItem(itemSelected) {
       util.cl('vmi', 'editItem')
       this.updatedList = this.theList
       util.cl('vmi', 'editItem - updlist is now...', this.updatedList)
       this.itemSelected = itemSelected
       this.showEditDialog = true
    },
    saveItem() {
        util.cl('vmi', 'saveItem')
        util.cl('vmi', 'saveItem - updlist', this.updatedList)
        //we worked on item selected, but now we want to save changes, and value is immutable here.
        //our saved value my be send back
        //let objProp1 = Object.keys(this.itemSelected)[0]
        if (typeof this.updatedList == 'object') {
           this.updatedList.forEach(e => {
            util.cl('searc Key', e['key'] == this.itemSelected['key'])
            if (e['key'] == this.itemSelected['key']) {
                util.cl('Updating : ',e.key)
                e.value = this.itemSelected.value
                util.cl('Update to : ',e.value)
            }
          })
          this.$emit('input', this.updatedList )
          this.updatedList = []
          this.showEditDialog = false

        }
        util.cl('vmi', 'saveItemAfterEdit- ps: we dont remove the actions property - please ignore', this.updatedList)
    },

    dataTableEdit() {
        util.cl('vmi', 'dataTableEdit')
        this.updatedList = this.theList  //Also update with current list, before changes.
        let objProp1 = 'key'
        util.cl('vmi', 'dataTableEdit', objProp1)
        let idx = this.updatedList.findIndex(e => e[objProp1] == this.mainItem)
        if (idx > -1) {
          util.cl('vmi', 'dataTableEdit found it - edit', idx)
          this.itemSelected = this.value[idx]
          this.showEditDialog = true
        } else {
          let obj = {}
           obj[objProp1] = this.mainItem
           if ('options' in this.entryType) {
              this.entryType.options.forEach(e => obj[e] = '')
           } else {
             obj['value'] =''
           }
           obj['actions'] = 'Actions'
          util.cl('vmi', 'dataTableEdit not there - add', obj)
          this.updatedList.push( obj )
          util.cl('vmi', 'dataTableEdit inform parent about new one', obj)
          this.$emit('input', this.updatedList )
          this.itemSelected = this.updatedList[ this.updatedList.length-1]
          util.cl('vmi', 'dataTableEdit item - we will now edit', this.itemSelected)
          this.showEditDialog = true
        }

    },
  },
  computed:{
    noDataToDisplayMessage() {
        return this.nodata || 'we have no data to display'
    },
    theListHeaders() {
        // Build a object, using the "name" of the object the passes, and make frst char uppercase to display atop the v-datalist as header.
        // We might keep the name empty?
        util.cl('theListHeaders()')
        if (this.theList.length == 0) return []
        let tHeader = []
        Object.keys(this.theList[0]).forEach(name => {
           tHeader.push(
             { text:name.charAt(0).toUpperCase() + name.slice(1)
             , type:'text'
             , value: name
             , align:'right'
            })
        })
        return tHeader
    },
    theList() {
        //We need items
        util.cl('theList() 0')

        // //If we have edited some stuff, the new info is in this.updatedList
        // if (this.updatedList.length > 0) return this.updatedList

        util.cl('theList() 1')
        if (!this.value) { /* -- this need to be value - since value is the thing passed to us? But value might not have all detail?
                                 what do we do if we get an array with code and value, and not name and value?
                           -- */
            return []
        }
        util.cl('theList() 2', 'how to check if this array is errorfree? - we ignore at the moment')
        //We need a key and value inside items
        // if (this.value || (typeof this.value != 'array' || !this.value[0].key)) {
        //     return [{key:'Botswana', value:'100ml', actions:''},{key:'Albania', value:'200ml', actions:''},{key:'Kentucky', value:'1000 ml', actions:'Actions'}]
        // }
        util.cl('theList() 3', this.value.length)
        //we need to add actions to our items (we want to edit) - it might be there, after 1st emit - we should/could check
        if (this.value.length == 0) return []
        const newList = this.value.map((element) => ({
             ...element, actions: "Actions"
        }))
        return newList
    },

    theLabel() {
      return this.label || ''
    },
    theColor() {
      return this.color || ''
    },
    theOutlined() {
        if (this.outlined) return true
        return false
    },
  },
  mounted() {
      console.log('vmp mounted')
  },
  watch: {
    debug(n,o) {
        console.log('debug watch new,old:', n,o)
        if (this.debug == true) this.isDebug = true
        this.isDebug = false
    }
  }
}
</script>

<style>
  #form-base-container { background-color: #fcadad56;; border: 1px solid #f71a1a56  }
  #form-base-box  { background-color: #1ba3fd4d; border: 1px dotted #78b5eb56; margin:1rem }
  #form-base-inbox  { background-color: #2cec4c34; border: 1px dotted #9dff4156; margin:1rem }
  .form-base-title { width: 100%; color: rgb(248, 247, 244); background-color: #7e7e7e; padding:6px }
</style>