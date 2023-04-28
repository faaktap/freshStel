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
                <v-icon class="ma-2 pa=2" @click="showMore(c.id)">mdi-skew-more </v-icon>
              </v-badge>
            </v-hover>
          </v-btn>
        </p>
        A: &#8220;<span v-html="c.model.faqAnswer"></span>&#8221;
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
                class="ma-1 pa-1"
              >
                <v-icon class="ma-1 pa-1">{{ c.icon }} </v-icon>
              </v-badge>
            </v-hover>
          </small>
        </footer>
      </blockquote>
    </template>

    <v-dialog
      v-model="showPic"
      :max-width="900"
      style="position: relative"
      transition="home"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <transition name="fade">
        <v-card color="grey">
          <v-img :src="'https://kuiliesonline.co.za' + faqPic"
            class="ma-2 pa-2"
          />
          <v-btn @click="showPic = false"> close </v-btn>
        </v-card>
      </transition>
    </v-dialog>
    <!-- <v-dialog
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
    </v-dialog> -->
  </v-container>
</template>

<script>
import { zmlFetch } from "@/api/zmlFetch.js";
import HeroSection from "@/views/sections/HeroSection.vue"
import VBack from '@/components/base/VBack.vue'
import { questionSchema } from '@/api/faqFormSchema.js'
export default {
  components: { HeroSection, VBack },
  name: "QandAPage",
  data: () => ({
    faqModel: {},
    faqPic:'',
    showPic: false,
    completedData: {},
    task: { workDone: "", progress: false, action: "", task: "" },
    curRecord: {},
    faqList: {},
    questionSchema
  }),
  methods: {
    showMore(id) {
      let p = this.faqList.find(e => e.id == id)
      if (p && p.model.imgFaq) {
           this.faqPic = p.model.imgFaq
           this.showPic = true
      }
    },
    addNewOne() {
      alert('easiest wat is this....')
       this.$router.push({ name: 'addFaq' , meta: {layout: "AppLayoutDefault" }})
    },
    showForm(id) {
      this.curRecord = this.faqList.find((e) => e.id == id);
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
      this.faqList = []
      if (response && response.length) {
        response.forEach((e) => {
          e.model = JSON.parse(e.jdocstructure);
          e.model.faqAnswer = e.model.faqAnswer.replace(/\n/g, "<br />");
          this.faqList.push(e)
        });
      }
    },
    loadError(e) {
      this.$cs.l("loaderror", e);
    },
  },
  computed: {},
  created() {},
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
