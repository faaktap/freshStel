<template>
<!-- https://thewebdev.info/2020/08/15/vuetify%E2%80%8A-%E2%80%8Atable-footer-and-slots/
     https://thewebdev.info/2020/08/15/vuetify%e2%80%8a-%e2%80%8atable-checkbox-and-filtering/
:footer-props="{showFirstLastPage: true,firstIcon: 'mdi-arrow-collapse-left',lastIcon: 'mdi-arrow-collapse-right',prevIcon: 'mdi-minus',nextIcon: 'mdi-plus'}"

:item-class="itemRowBackground" -> this does not want to work, should pass class back depending on an if statement
https://stackoverflow.com/questions/57961043/how-does-one-style-a-specific-row-on-v-data-table-vuetify
 -->
  <div>
    <v-select
      class="text-caption caption"
      v-model="value"
      :items="headers"
      label="Select Item"
      multiple
      return-object
    >
      <template #selection="{ item, index }">
        <v-chip v-if="index === 0">
          <span class="text-caption">{{ item.text }}</span>
        </v-chip>
        <span
          v-if="index === 1"
          class="grey--text caption"
        >(+{{ value.length - 1 }} others)</span>
      </template>
    </v-select>
    <small class="text-caption"> {{ localData.filename }} </small>

    <v-data-table
      class="style-0"
      :headers="selectedHeaders"
      :items="tableItems"
      :items-per-page="50"
      :loading="loading"
      :custom-sort="customSort"
      mobile-breakpoint="0"
      @click:row="rowClick"
      items-per-page-options="-1"
      items-per-page-text="sss"
    >
      <!-- <template v-slot:[`item.checkbox`]="{ item }">  -- still need a value
        <v-simple-checkbox v-model="item.size" disabled></v-simple-checkbox>
      </template>      -->
      <!-- <template #items="props">
      </template> -->
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

      <!-- <template  v-slot:[`body.append`]="{ headers }">
        <tr>
          <td :colspan="headers.length">This is an appended row</td>
        </tr>
      </template>       -->
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
    value: [],
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
      if (this.showFolders) {
        return this.fileDisplayRecords
      } else {
        return this.fileDisplayRecords.filter(e => e.dir === false)
      }
    },
    comHeaders () {
      return this.headers
    }
  },
  methods: {
    checkSelected (item) {
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
      // user clicked on a row, send it back to parent
      this.$emit('clickRow', e)
      this.localData = e
      // we need the hostname as well .. window.open(e.dirpath + '/' + e.filename, '_ddd')
    },
    clickIcon (e) {
      // user clicked on a row icon , send it back to parent
      this.$emit('clickIcon', e)
    },
    customSort (items, index, isDesc) {
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
      return items
    }
  },
  mounted () {
    // this.selectedHeaders.push(this.headers[0])
    // this.selectedHeaders.push(this.headers[1])
    this.value.push(this.headers[0])
    this.value.push(this.headers[1])
  },
  watch: {
    value (val) {
      this.selectedHeaders = val
    }
  }
}
</script>

<style scoped>
</style>
