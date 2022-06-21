<template>
<div>
<h1>Sel Multi </h1>
               <!-- @blur="passItemText"
                    @click:append-outer="emitChoosy"
                    @input="updateValue"
                    :search-input.sync="searchInput"
                    item-value="grade"
                    item-text="grade"                    
                    @click:append="msValue1 = ''"
                -->
          <v-autocomplete
                v-model="msValue1"
                :label="msLabel1"
                :items="multiSelGrade"
                item-value="grade"
                item-text="grade"                    
                prepend-inner-icon="mdi-sitemap"
                append-icon="mdi-close"
                append-outer-icon="mdi-magnify"
                @click:append="msValue1 = ''"
              >
        </v-autocomplete>
        <v-autocomplete
                v-model="msValue2"
                :label="msLabel2"
                :items="multiSelSubject"
                item-value="subject"
                item-text="subject"                    
                prepend-inner-icon="mdi-sitemap"
                append-icon="mdi-close"
                append-outer-icon="mdi-magnify"
                @click:append="msValue2 = ''"
                @click:append-outer="emitChoosy"
                @input="emitChoosy"
              >
        </v-autocomplete>

</div>
</template>

<script>
export default {
name: "MultiSel",
props:{},
components: {},
data: () => ({
    multiSel: [{'grade': 'g1', 'subject': 'op1'}
              ,{'grade': 'g1', 'subject': 'op2'}
              ,{'grade': 'g1', 'subject': 'op2'}
              ,{'grade': 'g1', 'subject': 'op3'}
              ,{'grade': 'g2', 'subject': 'op1'}
              ,{'grade': 'g2', 'subject': 'op4'}
              ,{'grade': 'g2', 'subject': 'op5'}
              ,{'grade': 'g3', 'subject': 'op5'}],
    msValue1: null,
    msLabel1: "msLabel1",
    msValue2: null,
    msLabel2: "msLabel2",
    whywhite: "dsddsdsd"
}),
computed: {
  multiSelSubject() {
    let x = this.multiSel.filter(e => e.grade == this.msValue1)
    let z = []
    x.forEach(e => z.push({subject: e.subject}))
    return z
  },
  multiSelGrade() {
    let z = []
    Array.from( new Set( this.multiSel.map(e => e.grade))).forEach( element => z.push({grade:element}) )
    return z

/*
Also see https://stackoverflow.com/questions/42974735/create-object-from-array#42974762 for creating objects from array
    let x = this.multiSel.map(e => e.grade)
    console.log(x)
    let y = new Set(x)
    console.log(y)
    let z = []
    Array.from(y).forEach( element => z.push({grade:element}) )
    console.log(z)
    return z
*/    
  },

},
methods: { 
    emitChoosy() {
        console.log('value',{grade: this.msValue1, subject:this.msValue2})
        this.$emit('value',{grade: this.msValue1, subject:this.msValue2})
    }
},
mounted: function() {
}

}
</script>

