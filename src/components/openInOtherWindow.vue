calling template will look like this - check WindowPortal....<template>
    
</template>
<template>
  <div id="app">
    <img width="25%" src="./assets/logo.png">
    <div>
      This input is used in the header of the opened window. <br />
      Try updating it while the window is open! 
      <br />
      <input v-model="msg" style="width: 25%" />
      <br />
      <input type="checkbox" v-model="open" /> Check me to open a portal!
    </div>
    <WindowPortal v-model="open">
      <HelloWorld :msg="msg" />
    </WindowPortal>
  </div>
</template>
<script>
import HelloWorld from "./components/HelloWorld";
import WindowPortal from './components/WindowPortal';
export default {
  name: "App",
  components: {    HelloWorld,    WindowPortal  },
  data() {
    return {
      msg: 'Hello from another window!',
      open: false,
  }}
};
</script>



-----------------------template start --------------------
<template>
  <div v-if="open">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'window-portal',
  props: {
    open: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      windowRef: null,
    }
  },
  watch: {
    open(newOpen) {
      if(newOpen) {
        this.openPortal();
      } else {
        this.closePortal();
      }
    }
  },
  methods: {
    openPortal() {
      this.windowRef = window.open("", "", "width=600,height=400,left=200,top=200");
      this.windowRef.addEventListener('beforeunload', this.closePortal);
      // magic!
      this.windowRef.document.body.appendChild(this.$el);
    },
    closePortal() {
      if(this.windowRef) {
        this.windowRef.close();
        this.windowRef = null;
        this.$emit('close');
      }
    }
  },
  mounted() {
    if(this.open) {
      this.openPortal();
    }
  },
  beforeDestroy() {
    if (this.windowRef) {
      this.closePortal();
    }
  }
}
</script>