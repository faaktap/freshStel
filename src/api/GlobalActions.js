import EventBus, { ACTIONS } from '@/api/event-bus';

export const errorSnackbar = message => {
  console.log('GA:errorSnackbar', message, "red accent-4")
  EventBus.$emit(ACTIONS.SNACKBAR, message, "red accent-4");
};

export const infoSnackbar = (message,kleur="green") =>  {
  console.log('GA:infoSnackbar', message, kleur)
  EventBus.$emit(ACTIONS.SNACKBAR, message, kleur);
};