<template>
    <div>
        <page-text-left v-if="page.type == 1"
               :title="page.detail1"
               :lefttext="page.detail2"
                maintitle=""  
               :image="page.image"
        />

        <page-list-right v-if="page.type == 2"
                 :title="page.detail1"
                 :image="page.image"
                 :diplomaList="page.detail2"
                 :yellowNote="page.extraNote"
        />

        <page-text-left-small-pic v-if="page.type == 3"
               :title="page.detail1"
               :lefttext="page.detail2"
               :maintitle="page.title"  
               :image="page.image"
        />


        <page-right-text  v-if="page.type == 4"
               :title="page.detail1"
               :righttext="page.detail2"
               :image="page.image"
        /> <!-- "https://www.kuiliesonline.co.za/img/CleanDKHS.png" -->

        <page-text-marquee v-if="page.type == 5"    
                       :title="page.detail1"
                       :propPassedString="page.detail2"
                       :image="page.image"
                       @wearebusy="$emit('wearebusy')"
                       @wearedone="$emit('wearedone')"
        />

        <!-- {{ page }}          -->
    </div>
</template>

<script>
import PageTextLeft from '@/components/awards/PageTextLeft.vue'
import PageTextLeftSmallPic from '@/components/awards/PageTextLeftSmallPic.vue'
import PageRightText from '@/components/awards/PageRightText.vue'
import PageListRight from '@/components/awards/PageListRight'
import PageTextMarquee from '@/components/awards/PageTextMarquee'
export default {
    name:'InsideTestRoute',
    components:{ PageTextLeft
               , PageTextLeftSmallPic
               , PageRightText
               , PageListRight
               , PageTextMarquee
               },
    props: {
           page: { type: Object 
                 , required:true
                //  , default: {storyid:101, type:1,  detail1:"detail 1",  detail2:"' detail 2.1", extraNote:"Main Title 1"}
                 }
    },
    data: () => ({
         ourData:''
    }),
    computed: {
    },
    methods: {
    },
    mounted() {
        console.log(this.$options.name, 'Route mounted')
        this.ourData = this.$route.params.item
    },
    watch: {
    '$route' (to, from) {
      console.log(this.$options.name, 'route changed',to, from)
    }
  }
}
</script>