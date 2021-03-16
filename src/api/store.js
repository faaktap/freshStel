// store.js
import Vue from 'vue';

//import { getters } from "@/api/store";
//getZml: getters.getState({ object: "gZml" }),


//getZml.folders = folderid sortorder foldername realfoldername subjectid grade icon create_timestamp update_timestamp
//getZml.subjects = id,name, subjectid,sortorder,shortname,path,description,beskrywing,linksubjectid,picture
const state = Vue.observable({
    gZml: {login: {isAuthenticated: 0
                  , grade:8, type:'guest'
                  , fullname:'', phone:'', email:''
                  , username:''  , userid:'', persid:''
                  , lastdate:'', login:''},
           store: {totalItems: 0},
           grade: '',
           subject: '',
           subjectid: '',
           subjects: [],
           folders: [],
           functions: [], 
           voteList:[],          
           locale: 'af',
           calendar:[],  
           atester: false,
          }
    });

const mutations = {
  setState({ object, objectPath, value, upsert = false } = {}) {
    console.log("setState args: ", { object, objectPath, value, upsert });
    if (state[object] === undefined || value === undefined)
      console.error("setState: Invalid Object or Value");
    if (objectPath === undefined) state[object] = value;
    if (objectPath && Array.isArray(objectPath) && objectPath.length) {
      let navigate = [object, ...objectPath.slice(0, -1)],
        valueObj = navigate.reduce((obj, prop) => {
          if (typeof obj[prop] !== "object") {
            if (upsert) {
              obj[prop] = {};
            } else {
              console.error(`setState: property '${prop}' doesn't exist`);
            }
          }
          return obj[prop];
        }, state);
      Vue.set(valueObj, objectPath[objectPath.length - 1], value);
    }
  }
  // other specific mutations ...
};

const getters = {
  getState({ object, objectPath } = {}) {
    if (state[object] === undefined) console.error("getState: Invalid Object.");
    if (objectPath === undefined) return state[object];
    if (objectPath && Array.isArray(objectPath) && objectPath.length) {
      let navigate = [object, ...objectPath.slice(0, -1)],
        valueObj = navigate.reduce((obj, prop) => {
          if (obj[prop] === undefined) {
            console.error(`getState: property '${prop}' doesn't exist`);
          }
          return obj[prop];
        }, state),
        value = valueObj[objectPath[objectPath.length - 1]];
      if (value === undefined) console.error(`getState: Invalid object path`);
      return value;
    }
  }
  // other specific getters ...
};

export { getters, mutations, state };
