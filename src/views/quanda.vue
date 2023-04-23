<template>
  <v-container fluid>

    <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall109.jpg"
              title="Kuiliesonline FAQ "
              text=""
              breakup1="100"
              breakup2="20"
    />

<v-toolbar  dense  row  wrap>
   Also known as .. Frequently asked Questions
    <v-spacer/>

    <v-btn icon @click="load()" title="refresh (load new data)">
      <v-icon color="success"> mdi-refresh </v-icon>
    </v-btn>
    <v-btn icon @click="addNewOne()" title="Ask a Question">
      <v-icon color="primary"> mdi-plus </v-icon>
    </v-btn>
    <v-back class="float-right" />
</v-toolbar>

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
        <v-card color="grey">
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
    <!-- {{ faqList }} -->
  </v-container>
</template>

<script>
import { zmlFetch } from "@/api/zmlFetch.js";
import { faqSchema } from "@/api/faqFormSchema.js";
import TypicalEditForm from "@/components/vfbase/TypicalEditForm.vue"
import HeroSection from "@/views/sections/HeroSection.vue"
import VBack from '@/components/base/VBack.vue'
export default {
  components: { TypicalEditForm, HeroSection, VBack },
  name: "QandAPage",
  data: () => ({
    faqSchema: {},
    faqModel: {},
    completedData: {},
    task: { workDone: "", progress: false, action: "", task: "" },
    showSchema: false,
    curRecord: {},
    faqList: {},
  }),
  methods: {
    getData(msg) {
      this.completedData = msg;
      this.save();
    },
    addNewOne() {
      this.faqModel = {};
      this.faqSchema = faqSchema;
      this.curRecord.id = 0;
      this.curRecord.model = this.faqModel;
      this.curRecord.model.faqOriginator = this.$super.fullname;
      this.curRecord.schema = this.faqSchema;
      this.showSchema = true;
    },
    showForm(id) {
      this.curRecord = this.faqList.find((e) => e.id == id);
      alert(JSON.stringify(this.curRecord))
      if (this.curRecord.userid == 0) this.curRecord.userid = this.$super.user;
      this.faqModel = this.curRecord.model;
      alert(JSON.stringify(this.curRecord.model))
      this.faqSchema = faqSchema;
      alert(JSON.stringify(faqSchema))
      this.showSchema = true;
    },
    save() {
      let t = this.task;
      t.task = "SaveFaq";
      t.action = "trying to save faq information";
      t.workDone = "WAIT";
      t.data = this.curRecord;
      t.data.name = this.curRecord.model.name;
      t.user = {'fullname': this.$super.fullname, 'userid': this.$super.userid}
      zmlFetch(t, this.afterSave, this.loadError);
    },
    load() {
      let t = this.task;
      t.task = "GetFaq";
      t.action = "loading faqs information";
      t.workDone = "WAIT";
      zmlFetch(t, this.loadData, this.loadError);
    },
    loadData(response) {
      if ('error' in response && response.error.includes('We did not find any')) {
        alert(response.error)
        this.addNewOne()
        return
      }
      this.faqList = JSON.parse(JSON.stringify(response))
      this.$cs.l("bra list1", response);
      this.$cs.l("bra list2", this.faqList);
      this.faqList = []
      if (response && response.length) {
        response.forEach((e) => {
          this.$cs.l("bra list3", e);
          e.model = JSON.parse(e.jdocstructure);
          this.faqList.push(e)
          this.$cs.l("bra list4", this.faqList);
        });
      }
      this.$cs.l("bra list5", this.faqList);
    },
    afterSave(response) {
      if (this.task.progress)
        console.error(
          "bra after",
          "Progress should be set as false when we get here!"
        );
      this.$cs.l("bra after", response);
      //this.myModel = JSON.parse( response[0].jdocstructure )
      //this.myModelBackup = JSON.parse( response[0].jdocstructure )
      this.showSchema = false;
      this.load()
    },
    loadError(e) {
      if (this.task.progress)
        console.error(
          "bra error",
          "Progress should be set as false when we get here!"
        );
      this.$cs.l("bra error", e);
    },
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.$cs.l("faq mount");
    this.user = this.$super.fullname
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
