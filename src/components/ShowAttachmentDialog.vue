<template>
    <zml-preview :src="image"
                 :type="imagetype"
                 @close="$emit('close')"
                 @askForNext="askForNext"
    />
</template>
<script>
import zmlPreview from '@/components/zmlPreview'

export default {
    name:"ShowAttachmentDialog",
    props:["image","imagetype" ],
    components:{
          zmlPreview
    },
    methods:{
        askForNext(key) {
            this.$emit('askForNext', key)
        }
    },
    mounted() {
       console.log('M:', this.$options.name, this.image, this.imagetype)
    },
    watch: {
       image() {
        //We could log the image request here -to see how many use it?

       }
    }
}
</script>