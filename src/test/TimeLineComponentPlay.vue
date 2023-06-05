<template>
<div>
<p><strong>The List:</strong>  {{ history }} </p>
<p><strong>Note:</strong> Here we use the above list, with components embedded, and props embedded - to make a list of components !</p>
  <component
    v-for="item in history"
    :key="item.id"
    :is="item.component"
    v-bind="item.props"
  />
  <hr><br><br><br>
</div>
</template>

<script>
  import { historyArray } from '@/test/Data.json'
  import TimeLineComponent1 from '@/test/TimeLineComponent1.vue'
  import TimeLineComponent2 from '@/test/TimeLineComponent2.vue'

  export default {
    components: {
      TimeLineComponent1,
      TimeLineComponent2,
    },
    /*
    oldcomputed: {
      history () {
        return historyArray.map(historyItem => {
          if (historyItem.isContactItem) {
            // Return a new object that contains a `component`
            // key, an `id` key, and a `props` object
            return {
              id: historyItem.id,
              component: ContactCard,
              props: {
                contact: historyItem,
              },
            }
          } else if (historyItem.isSystemEventItem) {
            return {
              id: historyItem.id,
              component: ContactCard,
              props: {
                event: historyItem,
              },
            }
          }
        })
      },
    },
    */
    computed: {
      history () {
        return historyArray.map(historyItem => {
          if (historyItem.isContactItem) {
            // Return a new object that contains ALL keys
            // from `historyItem` and adds a `component` key
            return {
              ...historyItem,
              component: TimeLineComponent1,
            }
          } else if (historyItem.isSystemEventItem) {
            return {
              ...historyItem,
              component: TimeLineComponent2,
            }
          }
        })
      },
    },
  }
</script>