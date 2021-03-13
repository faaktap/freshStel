<template>
 <div>
  <v-row>
     <v-card v-for="(c,i) in baseColors" :key="i">
         <v-col cols=12>
        <!--v-card min-width=10 min-height=10 :color="c">
                     {{c}}
        </v-card-->
        <div v-for="(t,j) in tint" :key="j">
         <v-row>           
           <div v-for="(v,k) in variant" :key="k" class="ma-2 pa-0">
              <v-card min-width=60 
                     :color="c + ' ' + t + '-' + v" 
                     @click="colorSelected(c + ' ' + t + '-' + v)"
                     class="ma-0 pa-1 text-center"
                     >
                  {{c.substr(0,2) + t.substr(0,1) + v}}
              </v-card>
               
           </div>
        </v-row>               
        </div>
       </v-col>
     </v-card>
  </v-row>
 </div>
</template>


<script>
export default {
   name:"TextColorPicker",
   props:[],
   data: () => ({
      loading:false,
      baseColors:['red','green','blue','yellow','pink','purple','indigo','teal','lime','orange','brown','amber'],
      tint:['darken','lighten','accent'],
      variant:[1,2,3,4]
   }),
   methods:{
       colorSelected(color) {
          alert(color)
          this.$emit('colorSelected', color)
       }
   },
}
</script>