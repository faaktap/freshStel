import { uploads } from '@/api/uploads.js'
import { getters } from "@/api/store";
function cl(...args) { console.log('sus',...args) }

export function save(type, record, pcallbackGood, pcallbackBad) {
    if (record.id == 0) {
        cl('savejs sus insert', type ,record)
    } else {
        cl('savejs sus update', type, record)
    }
    // assignExtraVars(type, record)
    let t = {}
    t.task = "Save" + type
    t.action = "saving " +  type + " information"
    t.workDone = "WAIT";

    t.data = record
    t.user = getters.getState({ object: "gZml" }).login
    //test for any new images:
    //let filesToUpload =  findObjName(record.model,'FILE')
    let filesToUpload = uploads.huntForFiles(record.model, filesToUpload)
    cl('savejs elable files afterwards:', filesToUpload)
    zmlFetch(t, pcallbackGood, pcallbackBad);
    return filesToUpload
}

