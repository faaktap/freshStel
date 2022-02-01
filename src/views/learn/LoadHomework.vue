<template>
    <div>
        Hallo World {{ $route.name }} {{ $route.params }}

        {{ getZml.login.menemonic || this.getZml.login.username }}

        <v-btn @click="doSomething"> do something </v-btn>
        <h1> Homework Assigments(main) </h1>
        <p>List of homework assigments as created by teachers...</p>
        <pre>
            ID, Beskrywing, begin en einddatum, teacher, punt
        </pre>

        <h1> Homework Items (hw_items)</h1>
        <p>List of homework items when you click on the table above</p>
        <pre>
            ID, mainID, contentid,editable
        </pre>

        <h1> Homework Students (hw_students)</h1>
        <p>
            Students will be fetched from studentclasslist as linked on hw_main
            when the download files or "touch" them, we will create item entries in here.
            and mark them as busy, also allow them to add a note to teacher
        </p>
        <pre>
            id, studentid, mainid, itemid,busy, nottoteacher
        </pre>

        <h1> Homework Student Items (hw_studentitem)</h1>
        <p>
            The student will upload results, we will store info about them in here.
            this will be stored in content as well....
        </p>
        <pre>
            id, studenthwid,contentid,changes,note
        </pre>

    </div>
</template>
<script>
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
export default {
    name:"LoadHomework",
    components:{
       },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        currentOne:null,
    }),
    methods: {
      doSomething() {
          infoSnackbar('Hallow world')
      }
    },
    mounted() {
        infoSnackbar(this.$route.meta)
        infoSnackbar( this.$route.meta.authentication )
        // this.$router.push({ path: '/login'})
    }
}

</script>
