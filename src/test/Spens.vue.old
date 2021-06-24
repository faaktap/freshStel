<template>
<v-window>

    {{ $route.meta.authentication }}
    <h1>START OF ROUTETEST {{ id }} </h1>
    This is a test starting page for our route practise.
    <br>
    <v-card color="red"> Here are all our current  $route.params = {{ $route.params }} </v-card>

    <router-link :to="{ name: 'Route1' 
                      , params: { id:2, rid: 'ddddd', rpost: 'hello'  }
                      , meta: {layout: 'AppLayoutGray', authentication: 'public'} }"
                >  Go To route Route1
    </router-link>
    <router-link :to="{ name: 'StudentList' 
                      , meta: {layout: 'AppLayoutGray', authentication: 'teacher'} }"
                >  Go To route StudentList
    </router-link>

    <h1> Router View </h1>
    <router-view />
    
</v-window>
</template>

<script>

export default {
  name:'routetest',
  props: [ 'id' ],
    data: () => ({
     spensRoutes: [ {route:'/game' , params: 'game'} ],
     item: [{ "contentid": "419"
            , "sortorder": "22"
            , "name": "TERM 1 / KWARTAAL 1"
            , "description": "TERM 1 / KWARTAAL 1"
            , "type": "folder"
            , "subjectid": "17"
            , "grade": "8"
            , "icon": "mdi-folder", "folder": "TERM 1 / KWARTAAL 1"
            , "accesstype": "student"
            , "persid": null, "create_timestamp": "2021-03-08 09:46:46"
            , "update_timestamp": "2021-03-08 09:46:46"
            , "days": "78", "img": "", "expand": false }
            ,
            { "contentid": "1191"
            , "sortorder": "90"
            , "name": "5.7 Rek vergelyking met opsomming.mp4"
            , "description": "load:/Subjects/GR08/Accounting_Rekeningkunde/WIEGAND/5.7 Rek vergelyking met opsomming.mp4", "type": "file", "subjectid": "17", "grade": "8", "icon": "mdi-movie", "folder": "WIEGAND", "accesstype": "student", "persid": "38", "create_timestamp": "2021-05-17 10:00:36", "update_timestamp": "2021-05-17 10:00:36", "days": "8", "img": "https://www.kuiliesonline.co.za//Subjects/GR08/Accounting_Rekeningkunde/WIEGAND/5.7 Rek vergelyking met opsomming.mp4"
            , "expand": false }
            
            ]
  }),
  computed:{
  },
  mounted() {
      console.log('we came in with ', this.$route.params);
  }
}
</script>