<template>
<!-- Small buttons in the tables - delete, edit, etc -->

<!-- If you add a title, that is not delete, edit or insert, then you need to supply your own icon
    Button will become an icon if screen is smaller -->

<!-- Example   :   <z-table-btn color="red" title="delete" @click="retrieve('del',item)"/> -->
    <v-btn class="mx-2"
           x-small
           :color="compColor"
           @click="$emit('click')"
           :title="compTitle"
           :icon="!title || $vuetify.breakpoint.lgAndDown ? true : false"
    >
        <v-icon  small
                :color="$vuetify.breakpoint.lgAndDown ? compColor : 'white'"
        >
                {{ compIcon }}
        </v-icon>
        <template v-if="!$vuetify.breakpoint.lgAndDown">
             {{ title }}
        </template>
    </v-btn>

</template>

<script>
export default {
    name:"ZTableBtn",
    props:{
          color: {type:String, default:""}
         ,title: {type:String, default:""}
         ,icon:  {type:String, default:""}
    },
    computed:{
        compTitle() {
            return this.title
        },
        compColor() {
            if (this.color) return this.color
            //If no color is supplied, see if we have a standard button, or other procedure to say what color to display
            switch (this.title) {
            case "edit"  : return "green"
            case "delete": return "red"
            }
            return "gold"

        },
        compIcon() {
            if (this.icon) return this.icon
            //Try to figure out what item to display based on the "tip" supplied.
            switch (this.title) {
                case "edit"  : return "mdi-clipboard-edit-outline"  //pencil"  // mdi-pencil" mdi-file-document-edit-outline   mdi-database-edit
                case "delete": return "mdi-delete-variant"   //mdi-though-bubble-outline
                case "add"   : return "mdi-plus-box-outline"
                default      : return this.icon;
            }
        }
    }
}
</script>