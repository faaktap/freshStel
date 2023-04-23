<!--style>
  #quickform { background-color: #fcadad56;; border: 1px solid #f71a1a56  }
  .type-quickform-companyGroup-text { width: 100%; color: rgb(248, 247, 244); background-color: #7e7e7e; padding:6px }
  #type-quickform-companyGroup-text { width: 100%; color: rgb(248, 247, 244); background-color: #7e7e7e; padding:6px }
</style-->

<template>
  <!-- QUICK-FORM
  This is just a last stop before we use VFormBase to display our fields defined in schema
  I still have not easy way of catching clicks that happens on icons. But this is not a worry at the moment.
  If you look at test() it is the way I plan on handling it.
  Also, we do not send data all the time to our parent - only if we loose focus on a field.
  ps. I'm a litte worried about refreshing if schema changes. Must still do some tests

  See https://wotamann.gitbook.io/vuetify-form-base/schema/css for styling options - good luck
-->
  <div>
    <v-form-base
      v-if="mySchema"
      autocomplete="off"
      id="quickform"
      :model="myModel"
      :schema="mySchema"
      :col="12"
      @click="test"
      @blur="blurtest"
      @input="inputHandler"
    >
    <!-- #slot-['top'|'bottom'|'item']-type-[formbase ID]-[type of control]={obj,id,index} -->
    <template #slot-top-type-quickform-fileTest1="{obj,id,index}">
      <h4 class="slot">
         TOP Slot at Top of Type 'fileinpit' - {{obj.value}} {{ id}} {{ index }}
      </h4>
    </template>
    <template #slot-bottom-quickform-imgTest1="{obj}">
      BOTTOM {{ obj }}
    </template>
    </v-form-base>
  </div>
</template>

<script>
import VFormBase from "@/components/vfbase/VFormBase.vue";
export default {
  name: "QuickForm",
  components: { VFormBase },
  props: {
    mySchema: { type: Object, required: true }, //default: () => {}
    myModel: { type: Object, required: true }, //default: () => {}
  },
  data: () => ({
    myLocalModel: {},
  }),
  methods: {
    inputHandler(e1,e2) {
      this.$cs.l("qf inputHandler", e1,e2);
    },
    test(e) {
      //If someone click on a icon, we might want something to happen
      this.$cs.l("qf", "test click on form - send on blur", e);
      //let { on, key, obj, params } = e
      if (e.key.indexOf("file") > -1) {
        alert("we touched a file");
      }
      if (e.key.indexOf("werner") > -1) {
        this.$cs.l(
          "qfb",
          "We Clicked on field icon where fieldname has word werner inside it - we can emit this if we want: e.params.text",
          e.params.text,
          e
        );
        //cl('qfb','on, key, obj, params = ', on, key, obj, params)
        //Or we can emit all clicks? - but how to get the data back?
      } else {
        //cl('qfb clicked','on, key, obj, params = ', on, key, obj, params)
      }
    },
    blurtest() {
      this.$emit("done", this.myLocalModel);
    },
  },
  mounted() {
    this.$cs.l("qf", "start : quickform");
  },
  watch: {
    myModel() {
      this.myLocalModel = this.myModel;
    },
    /* mySchema: {
        handler(newValue, oldValue) {
            this.$cs.l('Our watch say something has changed!!!', newValue, oldValue)
        },
        deep: true
      }*/
  },
};
</script>
