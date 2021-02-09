<template>
<!-- //https://medium.com/javascript-in-plain-english/vuetify-dropdown-slots-588f683d52f7 -->
  <v-container>
    <v-row>
      <v-col col="12">
        <v-select v-model="value" :items="items" label="Select Item" multiple>
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption">(+{{ value.length - 1 }} others)</span>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",
  data: () => ({
    items: ["apple", "orange", "pear"],
    value: [],
  }),
};
</script>


---------------------------------------------------------------------------------------
<template>
  <v-container>
    <v-row>
      <v-col col="12">
        <v-select v-model="selectedFruits" :items="fruits" label="Favorite Fruits" multiple>
          <template v-slot:prepend-item>
            <v-list-item ripple @click="toggle">
              <v-list-item-action>
                <v-icon :color="selectedFruits.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Select All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
          <template v-slot:append-item>
            <v-divider class="mb-2"></v-divider>
            <v-list-item disabled>
              <v-list-item-avatar color="grey lighten-3">
                <v-icon>mdi-food-apple</v-icon>
              </v-list-item-avatar>
<v-list-item-content v-if="likesAllFruit">
                <v-list-item-title>all selected</v-list-item-title>
              </v-list-item-content>
<v-list-item-content v-else-if="likesSomeFruit">
                <v-list-item-title>{{ selectedFruits.length }} selected</v-list-item-title>
              </v-list-item-content>
<v-list-item-content v-else>
                <v-list-item-title>no fruit selected</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "HelloWorld",
  data: () => ({
    fruits: ["apple", "orange", "pear"],
    selectedFruits: [],
  }),
  computed: {
    likesAllFruit() {
      return this.selectedFruits.length === this.fruits.length;
    },
    likesSomeFruit() {
      return this.selectedFruits.length > 0 && !this.likesAllFruit;
    },
    icon() {
      if (this.likesAllFruit) return "mdi-close-box";
      if (this.likesSomeFruit) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  methods: {
    toggle() {
      if (this.likesAllFruit) {
        this.selectedFruits = [];
      } else {
        this.selectedFruits = [...this.fruits];
      }
    },
  },
};
</script>