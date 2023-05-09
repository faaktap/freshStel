<template>
<v-card v-if="list.length">
    <v-btn class="ma-2 pa-2" small color="primary" v-for="l in list" :key="l.thefunc" :to="l.thefunc"> {{ l.functionname }} </v-btn>
    <span class="ma-2 pa-2 text-caption float-right"> Your most used functions. </span>
</v-card>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch'
import { ls } from '@/api/localStorage.js'
import { getters } from "@/api/store.js"
export default {
    name:"MostUsedFunctions",
    data:() => ({
       getZml: getters.getState({ object: "gZml" }),
       list: []
    }),
    methods: {
       loadIt() {
        // let sql = `SELECT * FROM v_useraccess \
        //    WHERE user = '${this.getZml.login.username}' \
        //      AND function like 'route'\
        //      AND thefunc not in('/admin','/','/test7','/folder')\
        //      AND cnt > 19\
        //    ORDER BY cnt DESC`
        let sql = `SELECT v.* , ifnull(f.functionname, thefunc) functionname \
         FROM v_useraccess v\
         LEFT JOIN dkhs_lfunction f ON LOWER(f.payload) = LOWER(thefunc)\
         WHERE user = '${this.getZml.login.username}' \
           AND function like 'route'\
           AND thefunc not in('/admin','/','/test7','/folder')\
           AND cnt > 10\
         ORDER BY cnt DESC LIMIT 10`
          zmlFetch({task:'PlainSql', sql:sql}, this.getData, this.loadError)
       },
       getData(response) {
        if (!response.error) {
          this.list = response
        }
       },
       loadError(err) {
         this.$cs.l(err)
        this.list = []
       }

    },
    mounted() {
       if (ls.test(this.$options.name)) this.list = ls.load(this.$options.name)
       if (this.list.length == 0) {
          this.loadIt()
       }
    }
}
</script>