<template>
 <div>
  <v-img v-if="name == 'DKBadge40'" src="img/CleanDKHS.png" max-width="40" contain />
  <v-icon v-if="name == 'Hammie'">mdi-hamburger</v-icon>
  <span v-if="name == 'username'"> {{ getZml.login.username }}</span>
  <v-img v-if="name == 'studentphoto'"
              :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=' + id"
              height="height || 100" :title="id || 'no id passed'" contain />
  <v-img v-show="name == 'persphoto'"
              :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&pers=' + id"
              height="height || 50" :title="id || 'no id passed'" contain >
              <!-- {{ 'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&pers=' + id }}
              height = {{ height }} -->
  </v-img>

 </div>
</template>

<script>
import { getters } from "@/api/store"
export default {
  name: 'ZShow',
  props:['name','id','height'],
  components:{},
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
  }),
  mounted() {}
}

</script>