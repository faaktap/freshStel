<template>
 <!-- <hover-icon text="some text on slide" icon="mdi-fountain-pen" /> -->
 <v-hover v-slot:default="{ hover }">
    <v-badge
     :value="hover"
     color="deep-purple accent-4"
     :content="text"
     right
     transition="slide-x-transition"
    >
        <v-icon>{{ icon }}</v-icon>
    </v-badge>
 </v-hover>
</template>

<script>
export default {
  name: 'HoverIcon',
  props: {
    text:       {      type: String  , default: "Fill in text to hover over here"  },
    icon:       {      type: String  , default: "mdi-kettle"  },
    backgroundColor:{      type: String    },
    color:          {      type: String    },
  },
  mounted () { },
  methods: { }
}
</script>
