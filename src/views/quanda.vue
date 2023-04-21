<template>
  <v-container fluid>

    <v-btn
      icon
      class="float-right"
      @click="load()"
      title="refresh (load new data)"
    >
      <v-icon color="success"> mdi-refresh </v-icon></v-btn
    >

    <h1  > title="Frequently asked Questions" </h1>

    <template v-if="faqList">
      <blockquote
        v-for="c in faqList"
        :key="c.id"
        class="blockquote"
        style="background-color: #f1f3f4"
      >
        <p>
          <b>Q: {{ c.name }}?</b>
          <v-btn
            color="info"
            class="float-right"
            icon
            small
            @click="showForm(c.id)"
          >
            <v-hover v-slot:default="{ hover }">
              <v-badge
                :value="hover"
                color="info"
                :content="`changed on ${c.changedate} by ${c.station}`"
                left
                transition="slide-x-transition"
              >
                <v-icon>mdi-fountain-pen-tip </v-icon>
              </v-badge>
            </v-hover>
          </v-btn>
        </p>
        A: &#8220; {{ c.model.faqAnswer }} &#8221;
        <footer>
          <small>
            <em>&mdash;{{ c.model.faqOriginator }}</em>
            <v-hover v-slot:default="{ hover }">
              <v-badge
                color="info"
                :value="hover"
                right
                :content="`created on ${c.createdate}`"
                transition="slide-x-transition"
              >
                <v-icon>{{ c.icon }} </v-icon>
              </v-badge>
            </v-hover>
          </small>
        </footer>
      </blockquote>
    </template>

    <v-dialog
      v-model="showSchema"
      :max-width="900"
      style="position: relative"
      transition="home"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <transition name="fade">
        <v-card color="black" dark>
          <typical-edit-form
            class="ma-2 pa-2"
            :schema="faqSchema"
            :model="faqModel"
            @done="getData"
            @close="showSchema = false"
          />
        </v-card>
      </transition>
    </v-dialog>
  </v-container>
</template>

<script>
import { zmlFetch } from "@/api/zmlFetch.js";
import { faqSchema } from "@/api/faqFormSchema.js";
export default {
  components: { },
  name: "QandAPage",
  data: () => ({
    faqSchema: {},
    faqModel: {},
    completedData: {},
    task: { workDone: "", progress: false, action: "", task: "" },
    showSchema: false,
    currentRecord: {},
    faqList: {},
  }),
  methods: {
    getData(msg) {
      this.completedData = msg;
      if (JSON.stringify(this.completedData) != JSON.stringify(msg)) {
        cl("faq a change occuired - must still work on this");
      } else {
        cl("faq no change occured - must still work on this");
      }
      this.save();
    },
    addNewOne() {
      this.faqModel = {};
      this.faqSchema = faqSchema;
      cl("bra before add data model,schema", this.faqModel, this.faqSchema);
      this.currentRecord.id = 0;
      this.currentRecord.model = this.faqModel;
      this.currentRecord.model.faqOriginator = this.$g.zml.login.fullname;
      this.currentRecord.schema = this.faqSchema;
      this.showSchema = true;
    },
    showForm(id) {
      this.currentRecord = this.faqList.find((e) => e.id == id);
      if (this.currentRecord.userid == 0) this.currentRecord.userid = 1234;
      this.faqModel = this.currentRecord.model;
      this.faqSchema = faqSchema;
      this.showSchema = true;
    },
    save() {
      let t = this.task;
      t.task = "SaveFaq";
      t.action = "trying to save faq information";
      t.workDone = "WAIT";
      t.data = this.currentRecord;
      t.data.name = this.currentRecord.model.faqName;
      t.user = this.$g.zml.login;
      zmlF.ZQR(t, this.afterwards, this.loadError);
    },
    load() {
      let t = this.task;
      t.task = "GetFaq";
      t.action = "loading faqs information";
      t.workDone = "WAIT";
      zmlFetch(t, this.loadData, this.loadError);
    },
    loadData(response) {
      this.faqList = response;
      cl("bra list", this.faqList);
      if (this.faqList && this.faqList.length) {
        this.faqList.forEach((element) => {
          element.model = JSON.parse(element.jdocstructure);
        });
      }
      this.$g.zml.faqs = this.faqList;
    },
    afterwards(response) {
      if (this.task.progress)
        console.error(
          "bra after",
          "Progress should be set as false when we get here!"
        );
      cl("bra after", response);
      //this.myModel = JSON.parse( response[0].jdocstructure )
      //this.myModelBackup = JSON.parse( response[0].jdocstructure )
      this.showSchema = false;
    },
    loadError(e) {
      if (this.task.progress)
        console.error(
          "bra error",
          "Progress should be set as false when we get here!"
        );
      cl("bra error", e);
    },
  },
  computed: {
  },
  created() {
    init(this, "qanda");
    this.user = 'werner'
  },
  mounted() {
    cl("faq mount");
    this.load();
  },
};
</script>
<style>
.home-enter-active,
.home-leave-active {
  transition: opacity 0.5s;
}
.home-enter,
.home-leave-active {
  opacity: 0;
}
.svg-logo {
  height: 180px;
}
</style>
