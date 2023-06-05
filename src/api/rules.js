const minLen = (l) => (v) => (v && v.length >= l) || `min. ${l} Characters`;
const maxLen = (l) => (v) => (v && v.length <= l) || `max. ${l} Characters`;
const required = (msg) => (v) => !!v || msg;
const requiredArray = (msg) => (v) => (Array.isArray(v) && v.length > 1) || msg;
// Rules
export const rules = {
  required: (msg) => required(msg),
  requiredGeneral: required("This detail is required"),
  requiredWerner: required("Some content is required please : coder:WS"),
  requiredEmail: required("E-mail is required"),
  requiredSel: required("Selection is required"),
  requiredSelMult: requiredArray("2 Selections are required"),
  max12: maxLen(12),
  min6: minLen(6),
  validEmail: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
};

//https://stackoverflow.com/questions/33611812/export-const-vs-export-default-in-es6
export default { rules };
