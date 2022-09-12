<template>
<div>
<v-btn icon="iconName.length>3 ? true : false" @click="show=!show">
<slot>
    xxx
</slot>
    <v-dialog v-model="show">
        <v-card><v-card-title>Some Info </v-card-title>
        <v-card-text> sdfjlk sdajflkasdf lkafsdlkgjsdfg </v-card-text>
        </v-card>
    </v-dialog>
</v-btn>
    <v-icon v-if="iconName.length > 3"> {{ iconName}} </v-icon>
     {{ buttonText }}
     {{ iconName.length > 3 }}

</div>
</template>

<script>
export default {
    name:"tester",
    props:{
        buttonText:{type:String, default:'pressme'},
        iconName:{type:String, default:''},
    },
    data: () => ({
     show:false
    })
}
</script>