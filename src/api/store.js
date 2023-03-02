// store.js
import Vue from 'vue';

//import { getters } from "@/api/store";
//getZml: getters.getState({ object: "gZml" }),


//getZml.folders = folderid sortorder foldername realfoldername subjectid grade icon create_timestamp update_timestamp
//getZml.subjects = id,name, subjectid,sortorder,shortname,path,description,beskrywing,linksubjectid,picture
const state = Vue.observable({
    gOth: {popi:[],
           atester: false,
           store: {totalItems: 0},
           folders: [],
    },
    gZml: {login: {isAuthenticated: 0
                  , grade:'G12'
                  , class:'12'
                  , gclass:''
                  , lang:'E'
                  , fullname:''
                  , surname:''
                  , firstname:''
                  , username:''
                  , phone:''
                  , email:''
                  , studentid:''
                  , schoolno:0
                  , userid:''
                  , persid:''
                  , menemonic:''
                  , lastdate:''
                  , type:'guest'
                  , login:''},
           grade: '',
           grades:[{id:8 ,text: "G08",name: 'Grade 8'} ,{id:9 ,text: "G09",name: 'Grade 9'}
                  ,{id:10,text: "G10",name: 'Grade 10'},{id:11,text: "G11",name: 'Grade 11'}
                  ,{id:12,text: "G12",name: 'Grade 12'},{id:'INFO',text: "Info",name: 'Info'}
                  ],
           subject: '',
           subjectid: '',
           subjects: [], //subjectid, sortorder, shortname, path, beskrywing description, description beskrywing, linksubjectid, picture, color
           functions: [],
           voteList:[],
           locale: 'af',
           calendar:[],
           meritLevel:[{id:10, back:10, forward: 20, points:0, title:"hllo", description:"jsdfsdf"}],
           persMenemonic:[],   //userid:"144", persid: "144", user_name: "JBRES", "user_fullname": "Me. J. Bresler", "surname": "Bresler", name,title,workemail,"room": "Sport 2", "user_type": "teacher"
           place: [],  //p.placeid, p.name, w.name workarea, p.description,p.ownerid concat(p.name, ' - ',w.name) concatsearch"
           classList: [],   //id, teacher (init + surname),listname, share,jdocstructure,create_timestamp,update_timestamp, grade,ckey,hodsubjectid
           tickList: [],
           thisday: null
          }
    });

const mutations = {
  setState({ object, objectPath, value, upsert = false } = {}) {
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
    if (state[object] === undefined) console.error("getState: Invalid Object.", object, objectPath);
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

const actions = {
  printAllDesert({ commit }, data) {
    commit("PRINT_ALL_DESERTS", data);
  },
};

export { getters, mutations, state, actions };
