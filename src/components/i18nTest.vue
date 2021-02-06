<template>
     <v-container fluid>
      <div class="red--text">
       path: = {{ $router.path }} <br>
       curr: = {{ $router.currentRoute.path}} <br>
       xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
       
       <p v-html="$t('message.hello')"></p>
       <p>{{ $t('message.greeting', { name: 'Werries' }) }}</p>
       <p>{{ $t('message.leeting', ['Werries']) }}</p>
         <p>{{ $t('message.nested.binnein') }}</p>
         <p>{{ $t('message.donner') }}</p>
         
         Buttons: {{ $t('btn.home') }}
         <p> {{ $t('data.greet', { name: 'nickName'} ) }}</p>
       yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
       </div>
     </v-container>    
</template>