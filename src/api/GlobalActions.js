import EventBus, { ACTIONS } from '@/api/event-bus';

export const errorSnackbar = message => {
  console.log('GA:errorSnackbar', message, "red accent-4")
  EventBus.$emit(ACTIONS.SNACKBAR, message, "red accent-4");
};

export const infoSnackbar = (message,kleur="green") =>  {
  console.log('GA:infoSnackbar', message, kleur)
  EventBus.$emit(ACTIONS.SNACKBAR, message, kleur);
};

export const timeoutPromise = (message, interval) => {
  console.info('Starting wait',interval, message)
  return new Promise((resolve, reject) => {
    if (message === '' || typeof message !== 'string') {
      reject('Message is empty or not a string');
    } else if (interval < 0 || typeof interval !== 'number') {
      reject('Interval is negative or not a number');
    } else {
      setTimeout(function(){
        console.log(message, interval , ' is resolved')
        resolve(message);
      }, interval);
    }
  });
};