<template>
<svg xmlns="http://www.w3.org/2000/svg" 
     version="1.1" 
     class="DekhsLogo"
    :view-box.camel="viewBox" :width="width" :height="height">
 <g id="Layer_x0020_1">
  <metadata id="DKHSLogoMeta" />
  <polygon class="fil0" points="113,1941 52,1941 52,1974 109,1974 109,2017 52,2017 52,2052 113,2052 113,2095 0,2095 0,1897 113,1897 "/>
  <path class="fil0" d="M195 1996c0,8 2,15 4,22 3,7 7,12 12,17 5,5 11,9 18,11 7,3 14,4 21,4 5,0 9,-1 14,-2l-29 -31 49 -6 14 14c6,-9 9,-19 9,-30 0,-8 -1,-15 -4,-22 -3,-7 -7,-12 -12,-17 -5,-5 -11,-9 -18,-11 -7,-3 -14,-4 -21,-4 -8,0 -15,1 -21,4 -7,3 -13,7 -18,11 -5,5 -9,11 -12,17 -3,7 -4,14 -4,22zm-54 0c0,-15 3,-28 8,-41 5,-13 13,-24 23,-33 10,-9 21,-17 35,-22 13,-5 28,-8 44,-8 16,0 31,3 44,8 13,5 25,13 35,22 10,9 17,21 23,33 5,13 8,26 8,41 0,14 -2,26 -7,38 -4,12 -11,22 -19,31l34 35 -47 7 -18 -19c-8,4 -16,6 -25,8 -9,2 -18,3 -27,3 -16,0 -31,-3 -44,-8 -13,-5 -25,-13 -35,-22 -10,-9 -17,-21 -23,-33 -5,-13 -8,-26 -8,-41z"/>
  <path class="fil0" d="M445 1897l0 108c0,6 0,12 1,18 0,6 2,12 4,16 2,5 6,9 10,12 5,3 11,5 20,5 9,0 15,-2 20,-5 5,-3 8,-7 10,-12 2,-5 4,-10 4,-16 0,-6 1,-12 1,-18l0 -108 51 0 0 115c0,31 -7,53 -21,68 -14,14 -36,21 -65,21 -29,0 -51,-7 -65,-21 -14,-14 -21,-37 -21,-68l0 -115 52 0z"/>
  <path class="fil0" d="M709 2022l-23 -66 -23 66 46 0zm14 39l-74 0 -12 34 -55 0 75 -198 56 0 75 198 -55 0 -12 -34z"/>
  <polygon class="fil0" points="863,1897 863,2052 925,2052 925,2095 812,2095 812,1897 "/>
  <polygon class="fil0" points="1003,2095 952,2095 952,1897 1003,1897 "/>
  <polygon class="fil0" points="1120,1941 1120,2095 1069,2095 1069,1941 1026,1941 1026,1897 1162,1897 1162,1941 "/>
  <polygon class="fil0" points="1246,2000 1174,1897 1235,1897 1272,1951 1309,1897 1370,1897 1298,2000 1298,2095 1246,2095 "/>
  <polygon class="fil1" points="279,652 685,495 685,0 482,196 559,403 428,502 156,280 "/>
  <polygon class="fil2" points="1091,652 685,495 685,0 888,196 812,403 942,502 1214,280 "/>
  <path class="fil1" d="M156 759l100 594c7,37 25,70 52,97l377 370 0 -1214 -529 153z"/>
  <path class="fil2" d="M685 606l0 1214 377 -370c27,-26 45,-60 52,-97l100 -594 -529 -153z"/>
  <polygon class="fil3" points="891,897 684,897 684,1009 880,1009 880,1156 684,1156 684,1271 891,1271 891,1419 510,1419 510,749 891,749 "/>
 </g>
</svg>
</template>
<script>
export default {
    name:'DkhsLogo',
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
      vbh: 2108,
   }),   
   computed: {
    viewBox() {
      const {vbx,vby,vbw,vbh} = this.$data;
      return [vbx,vby,vbw,vbh].join(' ');

    },
  }
}
</script>
<style>
    .fil3 {fill:#FEFEFE;fill-rule:nonzero}
    .fil0 {fill:#848688;fill-rule:nonzero}
    .fil1 {fill:#F5863A;fill-rule:nonzero}
    .fil2 {fill:#F37435;fill-rule:nonzero}

.DekhsLogo {
  transform: rotateY(360deg);
  animation: turn 2.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
