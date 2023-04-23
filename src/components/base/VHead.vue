<template>
  <center>
    <h4
      class="text-xl-h2 text-lg-h4 text-md-h4 text-sm-caption font-weight-light wordbreak text-center pa-2"
      :class="color"
      style="text-align: center"
    >
      {{ title }}
    </h4>
    <slot />
  </center>
</template>

<script>
export default {
  props: ["title", "color"],
  data() {
    return {
      hello: "",
    };
  },
  computed: {
    inp: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
};
</script>
