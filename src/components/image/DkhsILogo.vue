<template>
<svg xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    class="DekhsLogo"
    :view-box.camel="viewBox"
    :width="width"
    :height="height">
  <g id="Layer_x0020_1">
  <metadata id="DKHSLogoMeta" />
  <polygon class="fil0" points="366,720 815,546 815,0 590,216 675,445 531,555 230,309 "/>
  <polygon class="fil1" points="1264,720 815,546 815,0 1039,216 955,445 1099,555 1399,309 "/>
  <path class="fil0" d="M230 839l111 656c8,41 28,78 58,107l416 409 0 -1341 -584 169z"/>
  <path class="fil1" d="M815 669l0 1341 416 -409c30,-29 50,-66 58,-107l111 -656 -584 -169z"/>
  <polygon class="fil2" points="57,2315 0,2315 0,2096 57,2096 "/>
  <polygon class="fil2" points="103,2315 103,2096 160,2096 265,2230 265,2096 322,2096 322,2315 265,2315 160,2181 160,2315 "/>
  <polygon class="fil2" points="451,2144 451,2315 394,2315 394,2144 347,2144 347,2096 497,2096 497,2144 "/>
  <polygon class="fil2" points="647,2144 580,2144 580,2181 644,2181 644,2229 580,2229 580,2267 647,2267 647,2315 523,2315 523,2096 647,2096 "/>
  <path class="fil2" d="M795 2192l113 0c0,12 0,22 -1,32 -1,9 -3,18 -6,26 -4,11 -10,22 -17,30 -7,9 -15,16 -25,22 -9,6 -20,10 -31,14 -11,3 -23,5 -35,5 -17,0 -33,-3 -47,-8 -14,-6 -26,-14 -36,-24 -10,-10 -18,-22 -24,-37 -6,-14 -8,-30 -8,-47 0,-17 3,-33 8,-47 6,-14 13,-26 24,-36 10,-10 22,-18 37,-24 14,-6 30,-8 48,-8 23,0 43,5 60,15 17,10 31,25 41,46l-54 22c-5,-12 -12,-21 -20,-26 -8,-5 -17,-8 -27,-8 -9,0 -16,2 -23,5 -7,3 -13,8 -18,14 -5,6 -9,13 -12,21 -3,8 -4,18 -4,28 0,9 1,18 4,26 2,8 6,15 11,21 5,6 11,10 18,14 7,3 16,5 25,5 6,0 11,-1 16,-2 5,-1 10,-3 14,-6 4,-3 8,-6 10,-11 3,-4 5,-10 6,-16l-47 0 0 -44z"/>
  <path class="fil2" d="M1001 2194l11 0c11,0 20,-2 26,-7 6,-5 9,-11 9,-20 0,-9 -3,-15 -9,-20 -6,-5 -15,-7 -26,-7l-11 0 0 54zm125 121l-71 0 -54 -84 0 84 -57 0 0 -219 89 0c12,0 23,2 32,5 9,4 17,8 23,15 6,6 10,13 13,22 3,8 5,17 5,26 0,17 -4,30 -12,41 -8,10 -20,17 -36,21l69 90z"/>
  <polygon class="fil2" points="1207,2315 1150,2315 1150,2096 1207,2096 "/>
  <polygon class="fil2" points="1336,2144 1336,2315 1279,2315 1279,2144 1232,2144 1232,2096 1383,2096 1383,2144 "/>
  <polygon class="fil2" points="1475,2210 1395,2096 1463,2096 1504,2156 1544,2096 1612,2096 1532,2210 1532,2315 1475,2315 "/>
  <polygon class="fil3" points="948,990 948,828 892,828 700,828 645,828 645,990 700,990 700,1405 645,1405 645,1567 700,1567 892,1567 948,1567 948,1405 892,1405 892,990 "/>
 </g>
</svg>
</template>
<script>
export default {
    name:'DK-I-Logo',
    props: {
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 100
      }
   },
   data: () => ({
      vbx: 0,
      vby: 0,
      vbw: 1370,
      vbh: 2315,
   }),
   computed: {
    viewBox() {
      const {vbx,vby,vbw,vbh} = this.$data;
      return [vbx,vby,vbw,vbh].join(' ');

    },
}
}
</script>
<style scoped>
    .fil3 {fill:#FEFEFE;fill-rule:nonzero}
    .fil2 {fill:#ddbe57;fill-rule:nonzero}
    .fil1 {fill:#009856;fill-rule:nonzero}
    .fil0 {fill:#008052;fill-rule:nonzero}

.DekhsLogo {
  transform: rotateY(360deg);
  animation: turn 1.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
