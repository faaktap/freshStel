<template>
<v-container fluid>

  <v-row style="background-color:LightSalmon;" class="pa-4 ma-4">
   <p> base-button-dialog</p>
   <base-button-dialog class="ma-2" iconName="mdi-printer"  buttonText="ZAPME" />
   <base-button-dialog class="ma-2" buttonText="ZAPME2" />
   <base-button-dialog class="ma-2" iconName="mdi-printer"  buttonText="" />
   <base-button-dialog class="ma-2"
                       iconName="mdi-information"
                       buttonText=""
                       color="info"
                       infoText="Some info we need to tell client about"
                       infoTitle="Help"
   />
   <hr />
   <p> base-search</p>
   <base-search v-model="testString" />
  </v-row>

  <v-row style="background-color:Lavender;" class="pa-4 ma-4">
   <p>Show-col-size</p> <show-col-size :hide="true" />
  </v-row>

  <v-row style="background-color:Silver;" class="pa-4 ma-4">
    <v-col cols="12">
 <base-tool :toolList="[{name:'Button1', color:'secondary', icon:'mdi-coffee'},{icon:'mdi-waze'},{name:'button3'},{color:'black',icon:'mdi-printer'}]"
            toolbarName="Name of Toolbar a bit longer than usual"
            :loading="loading"
            @toolClick="listenToToolbar"/>
 <base-search v-model="testString" @clear="testString=''" />
 <v-btn @click="loading = !loading"> loading </v-btn> {{loading}}
 <base-tool :toolList="[{name:'Merit Approval', color:'accent', icon:'mdi-trophy', badge:2},{icon:'mdi-waze', color:'accent'},{name:'button3', color:'accent'},{color:'accent',icon:'mdi-printer', color:'white'}]"
            toolbarName="Name of Toolbar a bit longer than usual"
            :loading="loading"
            @toolClick="listenToToolbar"/>

 <base-tool :toolList="[]"
            toolbarName="This is my tooblar vlanky"
            :loading="loading"
            background="true">
            sdfwsdfsdfsdf
 </base-tool>

    </v-col>

  </v-row>
  <v-row style="background-color:LightGreen;" class="pa-4 ma-4">
  </v-row>

  <v-row style="background-color:Wheat;" class="pa-4 ma-4">
  </v-row>

  <v-row style="background-color:LightCyan;" class="pa-4 ma-4">
  </v-row>

  <v-row style="background-color:LightSteelBlue;" class="pa-4 ma-4">
  </v-row>


<v-row>
 <v-col cols="12">
  <p> test printing , edit and delete.. with builtin v-dialog</p>
  <v-card class="ma-2" id="printMe">
   <v-card-title class="noprint"> {{ userHeader }}</v-card-title>
    <v-card v-html="printHeader(userHeader)" class="hide"></v-card>
    <v-data-table :headers="headers" :items="desserts"
                 sort-by="calories" class="elevation-1"
                 :disable-items-per-page="true"
                 page-text="Sdfsdfsdf"
                 :disable-pagination="dPg"
                 :hide-default-footer="hDF">
    <template v-slot:top>
      <v-toolbar flat color="white" class="noprint">
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
           <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2 noprint" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small class="noprint" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
    <template v-slot:[`body.append`]="{ headers }">
        <tr class="noprint">
          <td :colspan="headers.length">This is an appended row</td>
        </tr>
    </template>
    <template  v-slot:footer>
        <div class="text-center">This is a footer</div>
    </template>
  </v-data-table>
</v-card>

  <v-btn @click="printIt" class="ma-2 noprint"><v-icon>mdi-print</v-icon> print </v-btn>
  <v-btn @click="testprint" class="ma-2 noprint"><v-icon>mdi-print</v-icon> print api </v-btn>
  <base-button-dialog class="ma-2" iconName="mdi-testtube"  buttonText="fdgesdfsdf" />
  <v-switch v-model="small" label="small" class="noprint" />
  </v-col>
</v-row>
{{ getZml.persMenemonic }}


 </v-container>
</template>

<script>
import { getters } from "@/api/store";

import { printHeader, printPage, printJSON } from "@/api/zmlPrint.js"
import baseButtonDialog from "@/components/base/baseButtonDialog.vue"
import baseSearch from "@/components/base/baseSearch.vue"
import ShowColSize from "@/components/base/ShowColSize.vue"
import baseTool from "@/components/base/baseTool.vue"
export default {
  name: "HelloWorld",
  components:{
     baseButtonDialog
    ,baseSearch
    ,ShowColSize
    ,baseTool
  },
  data: () => ({
    getZml: getters.getState({ object: "gZml" }),

    printHeader: printHeader,
    userHeader: "This abour page test my User Print module",
    dPg: false, hDF: false,

    testString: '',
    loading: false,
    togVar: false,

    small: true,
    dialog: false,
    headers: [
      { text: "Dessert (100g serving)",align: "start",sortable: false,value: "name"},
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Actions", value: "actions", sortable: false }],
    desserts: [],
    editedIndex: -1,
    editedItem: {name: "",calories: 0,fat: 0,carbs: 0,protein: 0},
    defaultItem: {name: "",calories: 0,fat: 0,carbs: 0,protein: 0},
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    listenToToolbar(e1,e2) {
      console.log(e1,e2)
    },
    listenToToggle(e1,e2) {
      console.log(e1,e2)
    },

    testprint() {
      printJSON(this.desserts, this.headers, this.userHeader)
    },
    async printIt() {
        await this.tableFooterHide(true)
        printPage('printMe', this.small)
        this.$emit('printed')
        this.tableFooterHide(false)

    },
    async tableFooterHide(action) {
        this.dPg = action
        this.hDF = action
        await this.$nextTick();
    },

    initialize() {
      this.desserts = [ {name: "Frozen Yogurt",calories: 159,fat: 6.0},
        { name: "Ice cream sandwich", calories: 237, fat: 9.0 },
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},        { name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},{ name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},{ name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},{ name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},{ name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},{ name: "Eclair", calories: 262, fat: 16.0},
        { name: "Eclair", calories: 262, fat: 16.0},{ name: "Eclair", calories: 262, fat: 16.0},
        { name: "Ice cream sandwich", calories: 237, fat: 9.0 },{ name: "Ice cream sandwich", calories: 237, fat: 9.0 },
        { name: "Ice cream sandwich", calories: 237, fat: 9.0 },{ name: "Ice cream sandwich", calories: 237, fat: 9.0 },
        { name: "Ice cream sandwich", calories: 237, fat: 9.0 },{ name: "Ice cream sandwich", calories: 237, fat: 9.0 },
        { name: "Ice cream sandwich", calories: 237, fat: 9.0 },{ name: "Ice cream sandwich", calories: 237, fat: 9.0 },]
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

