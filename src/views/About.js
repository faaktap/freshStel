//import EventBus, { ACTIONS } from '@/api/event-bus';

export const halloWorld = message => {
   alert('Hallo ' + message);
   return true
};

export const strHalloWorld = message => {
    return 'Hallo ' + message
 };
 
export const test = ( p1 , p2 ) => {
   console.log(p1,p2)
   return (p1 + p2)
} 