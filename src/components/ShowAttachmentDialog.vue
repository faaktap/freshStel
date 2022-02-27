<template>
    <zml-preview :src="image"
                 :type="imagetype"
                 @close="closeIt"
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
        closeIt() {
            this.$emit('close')
        }
    },
    mounted() {
        console.log('mounted:', this.$options.name, this.image, this.imagetype)
    }
}
</script>