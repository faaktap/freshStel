<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab key="DIR1" class="text-caption">
        <small>Current Folders</small>
        <v-btn @click="noColor = !noColor" small text>..</v-btn>
      </v-tab>
      <v-tab key="DIR2" class="text-caption">
        <small>
          All Folders<loading-ball :loading="loading" />
        </small>
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item key="DIR1">
          <v-card
            v-if="directoryDisplayRecords.length"
            class="ma-2 pa-2"
          >
            <v-row>
              <v-col
                v-for="f in directoryDisplayRecords"
                :key="f.filename"
                class="d-flex flex-nowrap py-3"
              >
                <v-btn
                  class="text-caption mr-2 pl-2"
                  :color="getFolderColor(f)"
                  @click="passBackFolderOnButton(f.filename)"
                >
                  <v-icon left small :color="f.color">
                    mdi-folder
                  </v-icon>
                  {{ f.filename }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
          <v-card v-else class="ma-2 pa-2">
            No more folders
          </v-card>
        </v-tab-item>
        <v-tab-item key="DIR2">
          <v-card :loading="loading">
            <base-tool-button
              small
              @click="getFolders()"
            >
              refresh
            </base-tool-button>
            <v-card-text v-if="folderItems.length">
              <v-treeview
                :loading="loading"
                :items="folderItems"
                item-key="href"
                dense
                hoverable
                rounded
                selection-type="independent"
                :open.sync="treeOS"
                :active="treeActive"
                xxopen-on-click
                @update:open="onOpen"
                @input="onSelected"
                @click="passBackFolderOnTree"
              >
                <!-- <template v-slot:prepend="{ open }"><v-icon :color="open ? 'green' : 'gray'">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon></template> -->
                <template #label="{ item,open }">
                  <span @click="treeClick(item.href)">
                    <v-icon :color="open ? 'green' : 'gray'">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    {{ item.name }}
                  </span>
                </template>
              </v-treeview>
               <!-- {{ folderSelected }} and  <br>TreeOS{{ treeOS }} <br>TreeAct{{treeActive}}<br>{{ tree }} -->
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import LoadingBall from '@//views/new/comp/LoadingBall.vue'
import { getters } from "@/api/store";
import { zData } from "@/api/zGetBackgroundData.js"
export default {
  name: 'Folders',
  components: { BaseToolButton, LoadingBall },
  props: {
    directoryDisplayRecords: { type: Array },
    folderLoadUrl: { type: String },
    currentPath: { type: String }
  },
  data: () => ({
    subjects: getters.getState({ object: "gZml" }).subjects,
    tab: '',
    tree: [],
    folderItems: [],
    folderSelected: [],
    treeActive: [],
    treeOS: [],
    loading: false,
    noColor: true
  }),
  watch: {
    folderSelected () {
      this.$emit('folderSelected', this.folderSelected)
    }
  },
  mounted() {
     zData.initialData('Load Subject Data')
  },
  methods: {
    getFolderColor (fObj) {
      let color = 'gray lighten-3'
      if (this.noColor) return color;
      let x = -1
      if (this.subjects.length) {
         x = this.subjects.findIndex(e => e.path === fObj.filename)
         if (x > -1) {
           color =  this.subjects[x].color
         }
      }
      console.log(fObj.filename,x,color, fObj)
      return color
    },
    treeClick (ik) {
      console.log('treeClick', ik)
      this.treeOS.push(ik)
      // get the folder from the tree!!! via href value
      // Remove https://kuiliesonline.co.za  from the value. like "IgnoreDir" and send it back
      const folder = ik.substr('https://kuiliesonline.co.za/Subjects/'.length)
      this.$emit('moreFolder', folder)
    },
    onOpen (e1) {
      console.log('onopen1', e1)
      // console.log('onopen2',this.treeActive,this.treeOS)
    },
    onSelected (e1, e2) {
      console.log('onselected', e1, e2, this.treeActive, this.treeOS)
    },
    passBackFolderOnButton (folder) {
      // console.log('clicked on button folder', folder, ' emityting.')
      this.$emit('folder', folder)
    },
    passBackFolderOnTree (folder) {
      // console.log('clicked on tree folder', folder, ' emityting.')
      this.$emit('folder', folder)
    },
    getFolders (foldername) {
      // console.log(this.$options.name, 'getFolders', this.folderLoadUrl, this.currentPath, foldername)
      let path = ''
      if (foldername) {
        path = foldername
      } else {
        path = '' // this.curDir
      }
      const ts = {}
      ts.api = this.folderLoadUrl
      ts.method = 'readOnlyFolder'
      ts.data = {}
      ts.data.path = path
      ts.data.folder = path
      this.loading = true
      zmlFetch(ts, this.doneFolderLoading, this.errorLoading)
    },
    doneFolderLoading (result) {
      console.log(this.$options.name, 'doneFolderload', result)
      this.folderItems = result
      this.loading = false
    },
    errorLoading (result) {
      this.snack('RealError:' + result)
      this.loading = false
    },
    snack (txt) {
      console.log(this.$options.name, 'snack', txt)
      this.$notifier.showMessage({ content: txt, color: 'info' })
    }
  }
}
</script>
