<template>
          <zml-preview :src="image"   
                      :type="imagetype"  
                      @close="closeIt"
                      >
          
         </zml-preview>
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
    }
}
</script>