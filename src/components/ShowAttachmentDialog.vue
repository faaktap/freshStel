<template>
          <zml-preview :src="image"   
                      :type="imagetype"  
                      >
          <zml-close-button @btn-click="$emit('close')" />
         </zml-preview>
</template>
<script>
import zmlPreview from '@/components/zmlPreview'
import zmlCloseButton from '@/components/zmlCloseButton'
export default {
    name:"ShowAttachmentDialog",
    props:["image","imagetype" ],
    components:{
          zmlPreview
        , zmlCloseButton
    }
}
</script>