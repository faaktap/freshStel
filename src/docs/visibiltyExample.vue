<t  emplate>
<div>     
  <!-- Button size based on screen size -->
  <v-btn outlined :small="$vuetify.breakpoint.smAndDown" @click="formerPage">
    <v-icon :small="$vuetify.breakpoint.smAndDown">mdi-chevron-left</v-icon>
  </v-btn>
  
  <!-- Fontsize based on screen size -->
  <span :class="{'text-caption': $vuetify.breakpoint.smAndDown, 'text-md-body-1': $vuetify.breakpoint.mdAndUp}">
  {{ $t('PORTAL_SHOWING_PAGE') }}
  </span>
  
  <!-- grid based on screen size -->
  <v-col cols="12" class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 ">
  
  <!-- Margin based on screen size -->
  <v-flex :class="{'ma-0': $vuetify.breakpoint.smAndDown, 'ma-5': $vuetify.breakpoint.mdAndUp}" />
    <v-card class="ma-0 ma-md-5">{{card.title}}</v-card>
    <!-- visibility based on screen size -->
    <v-row class="hidden-xs-only hidden-sm-and-down">
    </v-row>
    </v-card>
  </v-flex>
</div>
</template>


