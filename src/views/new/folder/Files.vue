<template>
<!-- https://thewebdev.info/2020/08/15/vuetify%E2%80%8A-%E2%80%8Atable-footer-and-slots/
     https://thewebdev.info/2020/08/15/vuetify%e2%80%8a-%e2%80%8atable-checkbox-and-filtering/
:footer-props="{showFirstLastPage: true,firstIcon: 'mdi-arrow-collapse-left',lastIcon: 'mdi-arrow-collapse-right',4con: 'mdi-minus',nextIcon: 'mdi-plus'}"

:item-class="itemRowBackground" -> this does not want to work, should pass class back depending on an if statement
https://stackoverflow.com/questions/57961043/how-does-one-style-a-specific-row-on-v-data-table-vuetify
 -->
<div>
 <v-row>
  <v-col cols="12">
    <small class="text-caption gray--text"> {{ localData.filename }} </small>
  </v-col>
  </v-row>

      <!-- <template v-slot:[`item.checkbox`]="{ item }">  -- still need a value
        <v-simple-checkbox v-model="item.size" disabled></v-simple-checkbox>
      </template> -->
      <!-- <template  v-slot:[`body.append`]="{ headers }">
        <tr>
          <td :colspan="headers.length">This is an appended row</td>
        </tr>
      </template> -->

    <v-data-table
      class="style-0"
      :headers="selectedHeaders"
      :items="tableItems"
      :items-per-page="50"
      :loading="loading"
      :custom-sort="customSort"
      mobile-breakpoint="0"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      items-per-page-options="-1"
      hide-default-footer
    >
     <!-- <template v-slot:item="{item, on, attrs}">
       <tr> :class="{active: group && item.id == group.id}">
       <td>  {{ item }} <br> {{ on }} {{ attrs }} </td>
       </tr>
      </template> -->
      <template #[`footer`]>
        <v-select
          v-if="headers"
          class="text-caption caption blue--text"
          v-model="headerValue"
          :items="headers"
          dense
          multiple
          return-object
          deletable-chips
          hide-selected
          small-chips
          filled
        />
      </template>
      <template #[`item.icon`]="{ item }">
        <v-icon
          title="Click on icon to 'play' the file"
          :color="item.color"
          :large="checkSelected(item)"
          @click.stop="clickIcon(item)"
        >
          {{ item.icon }}
        </v-icon>
      </template>
      <template #[`top`] v-if="!$vuetify.breakpoint.smAndDown">
        <base-bread
          v-if="curDir"
          :item="curDir"
          divider="/"
          :ignore-dir="ignoreDir"
          class="mb-1 pb-1"
          @changeFolder="$emit('changeFolder')"
        />
      </template>
      <template #[`no-data`]>
        NO FILES HERE - See folders on lefthand side!
      </template>

    </v-data-table>

  </div>
</template>

<script>
import { feh } from '@/views/new/FolderEdit.js'
import BaseBread from '@/views/new/base/BaseBread.vue'
export default {
  name: 'Files',
  components: {
    BaseBread
  },
  props: ['fileDisplayRecords', 'curDir', 'ignoreDir', 'showFolders', 'moving', 'loading'],
  data: () => ({
    localData: '',
    headerValue: [],
    headers: [
      { text: 'type', value: 'icon', filterable: true },
      { text: 'Name', value: 'filename' },
      { text: 'size', align: 'start', value: 'size' },
      { text: 'date', align: 'start', value: 'modtime' }
      // { text: 'action', value: 'realsize' },
      // { text: 'checkbox' }
      // { text: "Requested", value: "requested", sort: (a, b) => a.localeCompare(b) },
    ],
    selectedHeaders: []

  }),
  computed: {
    tableItems () {
      // console.log('computed - tableItems', this.showFolders, this.fileDisplayRecords)
      let answer = []
      if (this.showFolders) {
        return this.fileDisplayRecords
      } else {
        answer = this.fileDisplayRecords.filter(e => e.dir === false)
      }
      return answer
    },
    comHeaders () {
      return this.headers
    }
  },
  methods: {
    itemRowBackground: function (item) {
      // add this to v-data-table : :item-class="itemRowBackground"
       console.log('itemRowBackground',item)
       return '';  //item.protein > 4.2 ? 'style-1' : 'style-2'
    },
    checkSelected (item) {
      // console.log('check selected')
      // Check if we should highlight or mark this in some other way
      if (this.moving.some(ele => ele.modtime === item.modtime && ele.filename === item.filename)) {
        item.icon = 'mdi-marker-check'
        item.color = 'green'
        item.selected = true
        return true
      }
      if (item.icon === 'mdi-marker-check') {
        [item.icon, item.color] = feh.getExtensionInfo(item.ext)
        // console.log('unsel', item.icon, item.oldIcon)
        item.selected = false
      }
      return false
    },
    rowClick (e) {
      // console.log('click')
      // user clicked on a row, send it back to parent
      this.localData = e
      this.$emit('clickRow', e)
      // we need the hostname as well .. window.open(e.dirpath + '/' + e.filename, '_ddd')
    },
    rowDblClick (e) {
      // console.log('dblclick icon')
      // user dbl clicked on a row, send it back to parent
      this.localData = e.item
      this.$emit('clickDblRow', this.localData,e)
      // we need the hostname as well .. window.open(e.dirpath + '/' + e.filename, '_ddd')
    },

    clickIcon (e) {
      // console.log('click icon')
      // user clicked on a row icon , send it back to parent
      this.$emit('clickIcon', e)
    },
    customSort (items, index, isDesc) {
      // console.log('custom sort')
      // Date sort and size sort should be handled hear. Only datesort now fixed.
      // console.log(items, index, isDesc)
      items.sort((a, b) => {
        if (index === 'modtime') {
          if (!isDesc) {
            return a.realmodtime < b.realmodtime ? -1 : 1
          } else {
            return b.realmodtime < a.realmodtime ? -1 : 1
          }
        } else if (!isDesc) {
          return a[index] < b[index] ? -1 : 1
        } else {
          return b[index] < a[index] ? -1 : 1
        }
      })
      // console.log('custom sort', items)
      return items
    }
  },
  mounted () {
    // console.log('mounted:', this.$options.name, this.headers)
    this.headerValue.push(this.headers[0])
    this.headerValue.push(this.headers[1])
  },
  watch: {
    headerValue (val) {
      // console.log('watch value', this.val)
      this.selectedHeaders = val


    }
  }
}
</script>

<style scoped>

</style>
