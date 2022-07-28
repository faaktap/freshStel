<!-- Usage:
 <Interval :delay="1000">
      <div of
      cd
      slot-scope="{ ticks }">
        <!-- Updates every second -->
        The time is {{ new Date().toLocaleTimeString() }}
        Ticks: {{ ticks }}
      </div>
    </Interval>
-->    

<script>
export default {  
  props: {
    // Specify how long the interval is
    delay: {
      type: Number,
      required: true,
    }
  },

  data() {
    // Keep track of ticks
    return { ticks: 0 }
  }, 

  mounted() {
    // Set up the interval that increases the tick
    // and emits the event.
    this.timerId = setInterval(() => {
      this.ticks += 1;
      this.$emit('tick');
    }, this.delay);
  },

  beforeDestroy() {
    // We have to make sure to clean up the interval
    // before the component is destroyed
    clearInterval(this.timerId);
  },

  render() {
    return this.$scopedSlots.default({
      ticks: this.ticks,
    });
  }
}
</script>