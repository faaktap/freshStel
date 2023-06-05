<template>
  <!-- TYPICAL-EDIT-FORM
  We pass a schema to this component, and we give it a title and a color
  Example: <typical-edit-form title="Cool typical-edit-form TITLE"
                   :schema="SchemaData"
                   @done="play"
                   color="red lighten-5" />
  then we define a method called play (see @done above) and we wait for user to press save, then we receive a structure with all valid entries.
  schemaData minimum : {companyname: { type: 'text' , label: 'Company Name'}}
  above schemaData will display a text-field and allow user to enter a value
  ps: This form is the middle - it still passes all the values down to quick-form for editing
  pps. We only do validation, and paint some screens here.
  ppps. more validation ideas :https://rmirabelle.medium.com/fixing-vuetifys-form-validation-3a5781ea43fe
-->
  <v-card class="ma-0 pa-0" :color="color || 'transparent'">
    <v-card-title v-if="cardTitle">
      {{ cardTitle }}
    </v-card-title>
    <v-card-actions>
      <!-- <base-button-dialog
        buttonText=""
        title="dev data"
        iconName="mdi-emoticon-cool"
        class="ma-2 pa-2"
        :small="true"
      >
      ready = {{ready }}<br>
      localData =  {{ localData }}<br>
      model = {{ model }}
      </base-button-dialog> -->

      <v-spacer />
      <v-btn small @click="resetValidation" title="Reset Validation ... Hide all the nasty red stuff" class="ma-2 pa-2">
        <v-icon color="green" small> mdi-broom</v-icon>
      </v-btn>
      <v-btn v-if="closeButton" small color="warning" @click="$emit('close')" title="stop" class="ma-2 pa-2">
        <v-icon small > mdi-close</v-icon>
      </v-btn>
      <v-btn small color="primary" @click="checkAndSendBack" title="save your work" class="ma-2 pa-2">
        <v-icon small> mdi-content-save</v-icon>
      </v-btn>


    </v-card-actions>

    <v-card-text>
      <v-form ref="myForm" id="myForm" v-model="formValid" lazy-validation>
        <!-- Ek moes quickform uithaal, want op 4 Apr het die data opgehou om deur te gaan na quickform toe.
       Iets is fout daar dink ek, so ek bypass quickform en gaan direk na v-form-base
       Ons doen in elk geval niks extra daar nie, maar ekwou nie die plek waar validate is, meng met data capture nie
       Moet ook kyk na manier waarop ons click kan trap
       ps. as mens heeltyd data wil sien, soos dit verander, kan jy @blur="somefunc" op die parent sit.
   -->
        <!-- <v-form-base
        v-if="ready"
        autocomplete="off"
        id="quickform"
        :model="localData"
        :schema="localSchema"
        :col=12
        @click="feedback"
        @blur="feedback"
  >
  </v-form-base> -->

        <quick-form
          v-if="ready"
          :mySchema="localSchema"
          :myModel="localData"
          @done="feedback"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn small @click="resetValidation" title="Reset Validation ... Hide all the nasty red stuff"  class="ma-2 pa-2">
        <v-icon color="green" small> mdi-broom</v-icon>
      </v-btn>
      <v-btn v-if="closeButton" small color="warning" @click="$emit('close')" title="stop"  class="ma-2 pa-2">
        <v-icon small > mdi-close</v-icon>
      </v-btn>
      <v-btn small color="primary" @click="checkAndSendBack" title="save your work"  class="ma-2 pa-2">
        <v-icon small> mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
function cl(...args) {console.log('TEFrm' ,...args)}
import QuickForm from "@/components/vfbase/QuickForm.vue";
//import baseButtonDialog from "@/components/base/baseButtonDialog.vue"
export default {
  name: "TypicalEditForm",
  props: {
    schema: { type: Object, required: true },
    model: { type: Object, required: true }, //, default: () => {}
    title: { type: String, required: false },
    color: { type: String, required: false },
    closeButton: { type: Boolean, default: true },
  },
  components: {
      QuickForm
    //, baseButtonDialog
  },
  data: () => ({
    formValid: true,
    localSchema: {},
    localData: {},
    ready: false,
  }),
  methods: {
    feedback(data) {
      cl("feedback received quickform: stop here" + JSON.stringify(data));
      // wait with this ... this.localData = JSON.parse(JSON.stringify(data))
      //Not sure if we should send local data back all he time?
      //If you activate below, you get a JSON loop. Ek dink dis hoekom ek quickform create het in eerste plek
      // this.$emit('blur',this.localData)
    },
    resetValidation() {
      this.$refs.myForm.resetValidation();
    },
    checkAndSendBack() {
      cl("checkAndSendBack()",this.$refs.myForm.validate(),this.formValid);
      if (this.$refs.myForm.validate()) {
        this.$emit("done", this.localData)
      } else {
        cl("validation error-A",this.$refs.myForm.validate(),this.formValid)
        cl("validation error-B", this.$refs.myForm.errorBag)
        cl("validation error-C", this.$refs)
        //Move up to possibly first error - not sure how to pin point where it is...yet
        this.$cs.scrollToTop("myForm") /// myForm
      }
    },
  },
  computed: {
    cardTitle() {
      return this.title || "";
    },
  },
  mounted() {
    cl("Mount : Typical Edit Form",this.$options)
    if (Object.keys(this.schema).length === 0) this.ready = false
    if (Object.keys(this.schema).length > 0) this.ready = true
    this.localSchema = this.schema
    this.localData = this.model
  },
  watch: {
    title() {
      cl("Watch Title", "test for emptiness")
      this.ready = false
      if (Object.keys(this.schema).length === 0) {
        //We have a empty object passed - prevent form display
        this.ready = false
      } else {
        this.localData = this.model
        this.localSchema = this.schema
        this.ready = false
      }
    }
  }
}
</script>
