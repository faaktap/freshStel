<template>
<div>
  <span v-if="items.length" >
    <v-icon color="teal" class="ml-2 mt-5 float-left"> mdi-bread-slice</v-icon>
    <v-breadcrumbs class="headline text-truncate"
        :items="items">
     <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
      <template v-slot:item="{ item }">
       <v-breadcrumbs-item
        @click="$emit('changeFolder',item.href)"
        :disabled="item.disabled"
        :title="item.href"
       >
       <span class="text-lg-h6 text-sm-caption">
        {{ item.text }}
       </span>
      </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </span>
  <span v-else>
    <v-icon color="teal" class="ml-2 mt-1 float-left"> mdi-home-outline</v-icon>
    <v-card elevation="0" class="headline text-truncate ma-4"> HOME  </v-card>
  </span>

</div>
</template>

<script>
  export default {
    name:'BaseBread',
    props:["item","divider","ignoreDir"],
    data: () => ({
      items: [
      ],
    }),
    methods: {
       breakItUp() {
         this.items.length = 0
         this.items = []

         // zml why do we do this?
         // if (this.item.length < 2) return

         // below two statements are the same - see nullish coalescing
         // const result = (x!== undefined && x!== null) ? x : y;
         // const result = x ?? y ;

         let newItem = this.item
         if (this.ignoreDir && this.item.indexOf(this.ignoreDir) > -1 ) {
             //We have a value in IgnoreDir, and it is part of our given path in this.item
             //so we cut it out to shorten our breadcrumbs
             newItem = this.item.substr(this.ignoreDir.length)
         }
         // zml why do we do this?
         // if (newItem.length < 2) return

         // console.log('ttttttttttttttthe path that we worked out is ', newItem, this.ignoreDir.length+1)

         let obj = {text:'', disable:false, href: this.ignoreDir }
         let curPath = this.ignoreDir || ''
         for (let s of newItem) {
             curPath += s
              // console.log('looping', s,'--',this.divider,'--',obj.text, curPath)
             if (s === this.divider) {
                // console.log('s is eq divider',s,this.divider)
                 if (obj.text.length > 0) {
                   obj.href = curPath
                   this.items.push(obj)
                   obj = {text:'', disable:false, href: curPath}
                 }
             } else {
                // console.log('making text longer',s,obj.text)
                 obj.text += s
             }
         }
         // console.log('answer is : ' , obj.text, this.items)
         if (obj.text) {
           obj.href = curPath
           this.items.push(obj)
         }
       }
    },
    mounted(){
      // console.log(this.$options.name, 'Started with', this.item, this.divider)
      this.breakItUp()
    },
    watch:{
      item() {
        this.breakItUp()
      }
    }
  }

</script>