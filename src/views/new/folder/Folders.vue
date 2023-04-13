<template>
  <div>

    <v-tabs v-model="tab" class="ma-1 pa-1" height="29">
      <v-tab
        key="DIR1"
        class="text-caption">
        <small>Current Folders</small>
        <v-btn @click="switchColor"
               small
               :title="'no color : ' + noColor"
               text>..
        </v-btn>
      </v-tab>
      <v-tab
         v-if="accessTree != 'student'"
         key="DIR2"
         class="text-caption">
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
                  :color="getFolderColor(f.filename)"
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
              @click="getTreeFolders()"
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
import LoadingBall from '@/views/new/comp/LoadingBall.vue'
import { fol } from '@/views/new/folder/folder.js'
import { getters } from "@/api/store.js";
import { zData } from "@/api/zGetBackgroundData.js"
export default {
  name: 'Folders',
  components: { BaseToolButton, LoadingBall },
  props: {
    directoryDisplayRecords: { type: Array },
    folderLoadUrl: { type: String },
    currentPath: { type: String },
    accessTree: {type: String}
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
    noColor: true,
    treeTraverseTest:[]
  }),
  watch: {
    folderSelected () {
      this.$emit('folderSelected', this.folderSelected)
    }
  },
  mounted() {
     zData.initialData('Load Subject Data')
     this.$cs.l('mounted:', this.$options.name)
  },
  computed: {
  },
  methods: {
    getFolderColor (filename) {
      let color = 'gray lighten-3'
      if (this.noColor) return color;
      let x = -1
      if (this.subjects.length) {
         x = this.subjects.findIndex(e => e.path === filename)
         if (x > -1) {
           color =  this.subjects[x].color
         }
      }
      return color
    },
    switchColor() {
      this.noColor = !this.noColor
    },
    treeClick (ik) {
      // Prevent student access at certain places...
      if (ik.indexOf('TEACHERS') > -1 &&  getters.getState({ object: "gZml" }).login.type == 'student') {
        this.$cs.l('treeClick', ik, ik.indexOf('TEACHERS') )
        return
      }
      this.treeOS.push(ik)
      // get the folder from the tree!!! via href value
      // Remove https://kuiliesonline.co.za  from the value. like "IgnoreDir" and send it back
      const folder = ik.substr('https://kuiliesonline.co.za/Subjects/'.length)
      this.$emit('moreFolder', folder)
    },
    onOpen (e1) {
      this.$cs.l('onopen1', e1)
      // this.$cs.l('onopen2',this.treeActive,this.treeOS)
    },
    onSelected (e1, e2) {
      this.$cs.l('onselected', e1, e2, this.treeActive, this.treeOS)
    },
    passBackFolderOnButton (folder) {
      // this.$cs.l('clicked on button folder', folder, ' emityting.')
      this.$emit('folder', folder)
    },
    passBackFolderOnTree (folder) {
      this.$cs.l('clicked on tree folder', folder, ' emityting.')
      this.$emit('folder', folder)
    },
    getTreeFolders (foldername) {
      // this.$cs.l(this.$options.name, 'getTreeFolders', this.folderLoadUrl, this.currentPath, foldername)
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
      zmlFetch(ts, this.doneTreeFolderLoading, this.errorLoading)
    },
    doneTreeFolderLoading (result) {
      //This database get read ONLY folders and display in tree format
/*
-children []
-depth 0,1,..
-extenstion "Trash"
-file ""
-href "https://kuiliesonline.co.za/Subjects/.Trash"
-name ".Trash"
-sameName ".Trash"
-size
-time
*/
      fol.filterDirectoryResults([])
      // this.$cs.l(this.$options.name, 'doneFolderload', result)
      // let test = fol.filterDirectoryResults(result)
      // this.$cs.l('fol.filterDirectoryResults answer', test, result)
      // this.testTraverse(result)
      // this.$cs.l('testTracerTree . folders = ', this.treeTraverseTest.length)
      this.folderItems = result
      this.loading = false
    },
    // Easier way to traverse a tree, is to only make 2nd level recursive. (i think)
    testTraverse(tree) {
      this.$cs.l('test Traverse', tree.length)
      for (let i = 0; i < tree.length; i++) {
        this.treeTraverseTest.push(tree[i].href)
          if (tree[i].children.length) {
            this.travel1(tree[i].children)
          }
      }
    },
    travel1(subtree) {
      for (let j = 0; j < subtree.length; j++) {
        this.treeTraverseTest.push(subtree[j].href)
        if ('children' in subtree[j] && subtree[j].children.length) {
            this.travel1(subtree[j].children)
        } else {
          this.$cs.l('niks kinders')
        }
      }
    },
    errorLoading (result) {
      this.snack('RealError:' + result)
      this.loading = false
    },
    snack (txt) {
      this.$cs.l(this.$options.name, 'snack', txt)
      // this.$notifier.showMessage({ content: txt, color: 'info' })
    }
  }
}
</script>
