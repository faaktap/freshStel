<template>
 <v-container fluid>
      <h1> ---------------- WERNER TEST in tmp/W Folder --------------</h1>

      <ol><li v-for="(c,i) in tcem" :key="i">
            {{ c.menu }}  {{ c.type }}
            <ol><li v-for="(l,j) in c.level" :key="j">
                 {{ l.level }}
                </li>
            </ol>
         </li>
      </ol>


      <div v-if="'name' in sel">
          sel = {{ sel }}<br>
          sel.jdocstruc = {{ sel.jdocstructure }}<br>
          sel.jdocstruc[0] = {{ sel.jdocstructure[0] }}<br>
          sel.jdocstruc[1] = {{ sel.jdocstructure[1] }}<br>
          <v-card v-for="(i,j) in sel.jdocstructure" :key="j">
              {{ j}}  {{ i }}
          </v-card>

      </div>
      <v-data-table
       :items="tab"
       :headers="head"
       @dblclick:row="rowDblClick"
      />

      <v-btn x-small @click="addEntry"> add </v-btn>
      <v-card class="ma-2" v-for="i in tab" :key="i.id">
      {{ i }}
      </v-card>
      <hr>
      <v-card class="ma-2" >      {{ sel }} </v-card>
      <v-card class="ma-2" >      {{ head }} </v-card>
      <hr>


<v-dialog v-model="showAdd">
<v-card>
    <v-card-text>
    selselsel = {{ sel }}
    <br>
  <v-row>
  <v-col cols="12" md="6" v-for="i in head" :key="i.id">
    <v-text-field      class="mx-2" solo dense
      v-model="sel[i.text]"
      :label="i.text"
      :readonly="!i.edit"
    />
    {{ i.text }} {{ i.edit}}
  </v-col>
  </v-row>
  </v-card-text>
  <v-card-actions>
  <v-btn @click="showAdd = !showAdd"> close </v-btn>
  <v-spacer />
  <v-btn @click="selListEntryEdited"> save </v-btn>
  </v-card-actions>
 </v-card>
</v-dialog>

 </v-container>
</template>

<script>
import { getters } from "@/api/store";
import { ws } from "./WernerTest.js";
export default {
    name:"WernerTest",
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        tab:[],
        head:[],
        sel:{},             // saved list entry in here for editing
        uniqKeyFld:'id',  // used to find in tab list what was clicked
        selectedKeyIndex:null, // used to store index of what was clicked
        showAdd:false,
        cemis: [
        ['LOG OFF', 'WEBPUB6.cm_gen_http_session.logout?row_id=15361267'],
        ['Learner Base', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                               ['New Registration ', 'WEBPUB6.cm_learner_TAB2007.home?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['UPDATE Learner', 'WEBPUB6.CM_LEARNER_BASE_UPDATE.SCHOOL_GRADES?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Upload', 'WEBPUB6.cm_Upload_Js.js_file_exist?row_id=15361267'],

                                ['New Registration ', 'webpub6.cm_learner_registration.register_new_learner?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['UPDATE Learner', 'webpub6.cm_learner_registration.select_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
        ],
        ['Transfers', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Transfer In ', 'WEBPUB6.CM_TRANSFER_IN.route_learnerfind?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Print Transfered-In', 'webpub6.CM_TRANSIT_PRINT.GET_TRANSLEARNER?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Transfer Out / Exit', 'webpub6.CM_TRANSFER_OUT.GRADE_TRANS?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Bulk Transfer-Out/Exit', 'webpub6.CM_TRANSFER_OUT.GRADE?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Cancel Transfer-Out/Exit', 'webpub6.CM_TRANSFER_OUT.GRADE_TRANS_undo?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Print Forms', 'webpub6.CM_TRANSFER_FORMS.SELECT_LETTER?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Bulk Print Forms', 'webpub6.CM_TRANSFER_OUT.select_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
        ],

        ['Classes Update', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Class Groups/LOLT', 'webpub6.cm_classes_new.class_count?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Class Summary', 'webpub6.cm_classes_new.class_summary_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Class Groups', 'WEBPUB6.cm_classes.CLASS_COUNT?row_id=15361267'],
                                ['Class LOLT', 'WEBPUB6.cm_class_LOLT.learner_grade?row_id=15361267'],
        ],


        ['Subjects/GET', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
            ['Bulk Subj Allocation', 'WEBPUB6.Subject_allocation.selgade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
            ['Learners Per Subject Gr10-12', 'webpub6.cm_subject_report.Subject_info?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['GET Bulk Update', 'WEBPUB6.cm_get_update.bulk_learner_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GET Learner Update', 'WEBPUB6.cm_get_update.learner_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Language Bulk Update', 'WEBPUB6.cm_language_update.bulk_learner_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Language Learner Update', 'WEBPUB6.cm_language_update.learner_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],

        ['School Dashboard', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Learner Information', 'webpub6.cm_cemis_menu.routing_wced_dashboard_learner?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Educator Information', 'webpub6.cm_cemis_menu.routing_wced_dashboard_educ?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Review Questionnaire', 'webpub6.cm_cemis_menu.routing_of_review_questions?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],

        ['Reports', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Co-Morbidities and Other Indicators', 'WEBPUB6.cm_co_morbidities.co_morbidities_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learners', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Learner Control', 'WEBPUB6.CM_Learner_control.LEARNCONTROL?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learner Search', 'WEBPUB6.CM_LEARNER_REPORTS.select_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learner Status', 'WEBPUB6.CM_REPORTS.LEARNER_GETSTATUS?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learners Per Type', 'WEBPUB6.CM_LEARNER_REPORTS2.LEARNERTYPE_INFO?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Total Learners', 'WEBPUB6.cm_Leaners_per_School.load_learners?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['List Of Learners', 'WEBPUB6.CM_LEARNER_REPORTS.Learner_Grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learner Ages', 'WEBPUB6.CM_Learner_grade_ages_rpt.SCHOOL_GRADES?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Underage Learner Report', 'webpub6.cm_underage_learners_report.select_grade?row_id=15361267' ],
                                ['Learner ID Numbers', 'WEBPUB6.CM_IDLIST_REPORT.gradelearnerlist?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Extra Mural Activities', 'WEBPUB6.CM_LEARNER_REPORTS.ema_report_grade_sel?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Hostel Boarder Report', 'webpub6.CM_HOSTEL_BORDER_REPORT.hostel_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Learner Cellphone/Email Report', 'webpub6.cm_learner_cellphone_report.learners_grade_list?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learner Parent Details', 'webpub6.cm_parent_info.parent_details_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learner Citizenship Report', 'webpub6.cm_lnr_citizenship_report.sa_immigrant_summary?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
        ],
        ['Subjects', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Registration Verification ', 'WEBPUB6.cm_Students_report_class.select_grade?row_id=15361267 ' ],
                                ['Subjects Per Learner ', 'WEBPUB6.cm_Students_report_class.selector?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Learners Per Subject Gr10-12', 'webpub6.cm_subject_report.Subject_info?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Music Instrument Report', 'WEBPUB6.CM_MUSIC_REPORT.learndetails?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Subject change request status', 'webpub6.Cm_cemis_menu.routing_subject_change?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Gr10 to 12 Bachelors Report', 'webpub6.cm_gr12_bachelors_report.bach_select_class?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Gr12 Learners not Qualifying for Bachelors', 'webpub6.cm_gr12_bachelors_report.bach_select_class?row_id=15361267' ],
        ],
        ['Disabilities', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Detailed Disabilities', 'webpub6.CM_disabilities_report.LEARNERS?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Total Disabilities', 'webpub6.CM_LEARNER_REPORTS2.LEARNER_PRIMDIS_REPORT?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
        ],
        ['Languages', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Language Report', 'WEBPUB6.CM_LANGUAGE_REPORT.summary?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['GET Band Languages', 'WEBPUB6.CM_GETREPORT.learner_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['LOLT Report', 'WEBPUB6.CM_LANG_TEACH_REPORT.summary?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
        ],
        ['Recording Sheets Gr1-9','webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Whats new 2017 Ver. 2', 'webpub6.CM_CEMIS_MENU.routing_recording_instructions?row_id=15361267'],
                                ['2017 Special Maths Condonation', 'webpub6.CM_CEMIS_MENU.routing_rec_math_condonation?row_id=15361267'],
                                ['Windows Fix', 'webpub6.CM_GRD1to9DOWNLOAD.windows_help?row_id=15361267'],
                                ['Gr7-9 Help', 'webpub6.CM_Cemis_Menu.routing_gr7_9_help?row_id=15361267'],
                                ['Gr1-9 Download', 'LEARNPERF.lpd_utl.not_available_msg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Gr1-9 Download', 'webpub6.CM_GRD1to9DOWNLOAD.selectgrade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Gr1-9 Upload Help', 'webpub6.CM_GRD1to9DOWNLOAD.guideline?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Gr1-9 Upload', 'LEARNPERF.lpd_utl.selectgrade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Gr1-9 Upload Status', 'webpub6.cm_projects_status.gr1_9_upload_status?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Recording Sheets Gr10-12','webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                 ['Gr12 Moderation Process', 'webpub6.cm_grd10_11_12_dwnld.guideline?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Gr10-12 Download', 'LEARNPERF.lpd_utl.not_available_msg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Gr10-12 Download', 'webpub6.cm_grd10_11_12_dwnld.selectgrade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Gr10-12 Upload', 'LEARNPERF.fet_utl.selectgrade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Gr10-12 Upload Status', 'webpub6.cm_projects_status.gr10_12_upload_status?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Gr10-12 Subject Signoff', 'webpub6.cm_grd10_11_12_dwnld.sign_off_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Gr12 Moderation Marks View', 'webpub6.cm_term_performance_risk.sba_marks_view?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Error Reports', 'webpub6.CM_NEW_ERROR_REPORTS.MSG2?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],

        [ 'Promotions 2022', 'webpub6.CM_Learnertracking.startmsg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Promotion Summary', 'WEBPUB6.cm_promo_new.promo_summary_prev_year?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                                ['Promotion Report', 'webpub6.cm_promotion.grade_select_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ],
                            ],
        ['Broadband Connectivity', 'webpub6.CM_Learnertracking.startmsg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Learner Login credentials', 'webpub6.cm_learner_credential.learner_credentials?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Connection Introduction', 'webpub6.cm_learner_credential.connection_introduction?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Guide', 'webpub6.cm_learner_credential.guide?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Staff Request form', 'webpub6.cm_learner_credential.staff_request_form?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Briefing Document', 'webpub6.cm_learner_credential.briefing_document?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['I.T. Helpdesk SOP', 'webpub6.Cm_cemis_menu.helpdesk_sop?row_id=15361267 ' ],
                                ['Educator/Admin Staff Login credentials', 'webpub6.cm_learner_credential.educator_credentials?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
        ],
        ['LMS', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                                ['Step-by-Step guide', 'webpub6.cm_lms.lms_guide?row_id=15361267 ' ],
                                ['Learner Login Details', 'webpub6.cm_lms.lms_report?row_id=15361267 ' ],
        ],
        ['Assessment Accommodations', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Manual', 'webpub6.cm_cemis_menu.routing_concess_adapt_manual?row_id=15361267'],
                                ['Contact details', 'webpub6.cm_barr_concess_adapt_report.contact_details?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Apply for Accommodations', 'webpub6.cm_cemis_menu.routing_concession_adaptations?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Delete an Application', 'webpub6.cm_cemis_menu.routing_del_concession_adapt?row_id=15361267'],
                                ['Accommodations Report', 'webpub6.cm_barr_concess_adapt_report.barrier_acc_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Accommodations Letters','WEBPUB6.cm_cemis_menu.routing_accommodations_letters?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Grade 12 Concessions Letters','WEBPUB6.cm_cemis_menu.routing_concession_letters?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],

        ['Exam Center Audit Instrument', 'webpub6.exam_center_audit_instrument.exam_audit_instr_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',],
        ['Grade 3 Exemplars', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Language Exemplars', 'WEBPUB6.cm_exemplars.gr3_exemplars_literacy?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Mathematics Exemplars', 'WEBPUB6.cm_exemplars.gr3_exemplars_numeracy?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Grade 6 Exemplars', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Language Exemplars', 'WEBPUB6.cm_exemplars.gr6_exemplars_language?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Mathematics Exemplars', 'WEBPUB6.cm_exemplars.gr6_exemplars_mathematics?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Grade 9 Exemplars', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Language Exemplars', 'WEBPUB6.cm_exemplars.gr9_exemplars_language?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Mathematics Exemplars', 'WEBPUB6.cm_exemplars.gr9_exemplars_mathematics?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Life Orientation Absenteeism', 'WEBPUB6.cm_meo_progressed.life_orientation_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ['MEO/Progressed', 'WEBPUB6.cm_meo_progressed.meo_prog_start_page?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ['NSC Exam Results', 'WEBPUB6.Cm_Cemis_Menu.routing_nsc_exam_results?row_id=15361267'],
        ['SOS Baseline', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
            ['Capture Screens', 'WEBPUB6.cm_gr_sos_competency.sos_grade_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
            ['Summary', 'WEBPUB6.cm_gr_sos_competency.sos_grade_summary_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Systemic Test Results 2022', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267',
                                ['GR3 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR3 Maths Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR3 Lang Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR6 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR6 Maths Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR6 Lang Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR9 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR9 Maths Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['GR9 Lang Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
        ],
        ['Systemic Test Results 2021', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267',
                                ['GR3 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR3 Maths Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR3 Lang Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR6 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR6 Maths Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR6 Lang Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR9 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR9 Maths Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                                ['GR9 Lang Item Analysis Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
        ],
        ['Systemic Test Results 2019', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['GR3 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR3 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR3 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR6 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR6 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR6 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR9 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR9 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
                                ['GR9 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2019'],
        ],
        ['Systemic Test Results 2018', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['GR3 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR3 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR3 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR6 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR6 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR6 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR9 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR9 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
                                ['GR9 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2018'],
        ],
        ['Systemic Test Results 2017', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['GR3 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR3 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR3 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr3_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR6 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR6 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR6 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr6_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR9 Results', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR9 Maths Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dm?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
                                ['GR9 Lang Diagnostic Report', 'WEBPUB6.Cm_Cemis_Menu.routing_gr9_litnum_report_dl?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2017'],
        ],
        ['Systemic Tests 2023', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Notification Letter - Afr', 'WEBPUB6.cm_cemis_menu.routing_results_report_afr?row_id=15361267'],
                                ['Notification Letter - Eng', 'WEBPUB6.cm_cemis_menu.routing_results_report_eng?row_id=15361267'],
                                ['Learner Register 2023', 'WEBPUB6.cm_systemic_assessments.sys_select_grade_class?row_id=15361267'],
                                ['Learner Register Signoff', 'WEBPUB6.cm_systemic_assessments.sys_signoff?row_id=15361267'],
                                ['Principal Questionnaire', 'WEBPUB6.cm_systemic_assessments.sys_principal_questionnaire?row_id=15361267'],
        ],
        ['Systemic Test Results 2016', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Principal Letter', 'WEBPUB6.Cm_Cemis_Menu.systemic_principal_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Principal Letter - Afr', 'WEBPUB6.cm_cemis_menu.routing_results_report_afr?row_id=15361267'],
                                ['Principal Letter - Eng', 'WEBPUB6.cm_cemis_menu.routing_results_report_eng?row_id=15361267'],
                                ['GR3 Results 2016', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr3_litnum_2016?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR6 Results 2016 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6_litnum_2016?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR9 Results 2016 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr9_litnum_2016?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Systemic Tests 2022', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Notification Letter - Afr', 'WEBPUB6.cm_cemis_menu.routing_results_report_afr?row_id=15361267'],
                                ['Notification Letter - Eng', 'WEBPUB6.cm_cemis_menu.routing_results_report_eng?row_id=15361267'],
                                ['Learner Register 2023', 'WEBPUB6.cm_systemic_assessments.sys_select_grade_class?row_id=15361267'],
                                ['Learner Register Signoff', 'WEBPUB6.cm_systemic_assessments.sys_signoff?row_id=15361267'],
                                ['Principal Questionnaire', 'WEBPUB6.cm_systemic_assessments.sys_principal_questionnaire?row_id=15361267'],
        ],
        ['Concessions/Adaptations', 'webpub6.cm_cemis_menu.routing_concession_adaptations?row_id=15361267'],
                            ['Concessions/Adaptations', 'webpub6.cm_cemis_menu.available_MSG?row_id=15361267'],
        ],
        ['ANA 2023', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267',
                                ['HL Report', 'WEBPUB6.cm_home_lang_report.grade_class_summary?row_id=15361267 ' ],
                                ['FAL Report', 'WEBPUB6.cm_first_add_lang_report.grade_class_summary?row_id=15361267 ' ],
                                ['LOLT Report', 'WEBPUB6.cm_lolt_lang_report.grade_class_summary?row_id=15361267 ' ],
                                ['SNE ANA Learners', 'webpub6.cm_sne_ana_learners.sne_ana_start?row_id=15361267' ],
                                ['ANA Printing Statistics', 'webpub6.cm_ana_requirements.ana_summary?row_id=15361267'],
                                ['ANA Mark Sheets Print', 'webpub6.cm_ana_testing_print.ana_select_grade?row_id=15361267'],

                                ['ANA Results', 'webpub6.cm_annual_results.results_report?row_id=15361267'],
                                ['ANA Parent Report', 'webpub6.cm_ana_testing_reports.ana_report_start?row_id=15361267'],
                                ['Mark Sheets Capture', 'webpub6.cm_ana_testing.ana_start1?row_id=15361267'],
                                ['Mark Sheets Capture', 'webpub6.cm_cemis_menu.available_MSG?row_id=15361267'],
                                ['View Captured Learners', 'webpub6.cm_ana_testing.ana_view_captured_learners?row_id=15361267'],
                                ['M/S Capture Signoff', 'webpub6.cm_ana_testing.ana_signoff?row_id=15361267'],
                                ['Print Mark Sheets', 'webpub6.cm_ana_testing_print.ana_select_grade?row_id=15361267'],
                                ['ANA Signoff Final', 'WEBPUB6.cm_ana_learner_registers.ana_learner_signoff_final?row_id=15361267 ' ],
                                ['Learner Registers', 'WEBPUB6.cm_ana_learner_registers.select_grade_class?row_id=15361267'],
                                ['ANA Signoff', 'WEBPUB6.cm_ana_learner_registers.ana_learner_signoff?row_id=15361267 ' ],
        ],
        ['Systemic Test Results 2015', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Principal Letter', 'WEBPUB6.Cm_Cemis_Menu.systemic_principal_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR3 Results 2015', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr3_litnum_2015?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR6 Results 2015 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6_litnum_2015?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR9 Results 2015 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr9_litnum_2015?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Systemic Test Results 2014', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Principal Letter', 'WEBPUB6.Cm_Cemis_Menu.systemic_principal_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR3 Results 2014', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr3_litnum_2014?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR6 Results 2014 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6_litnum_2014?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['GR9 Results 2014 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr9_litnum_2014?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Systemic Test Results 2013', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['GR3 Results 2013 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr3_litnum_2013?row_id=15361267'],
                                ['GR6 Results 2013 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6_litnum_2013?row_id=15361267'],
                                ['GR9 Results 2013 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr9_litnum_2013?row_id=15361267'],
        ],
        ['Systemic Test Results 2012', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['GR3 Results 2012 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr3_litnum_2012?row_id=15361267'],
                                ['GR6 Results 2012 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6_litnum_2012?row_id=15361267'],
                                ['GR9 Results 2012 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr9_litnum_2012?row_id=15361267'],
        ],
        ['Systemic Test Results 2011', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['GR3 Results 2011 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr3_litnum?row_id=15361267'],
                                ['GR6 Results 2011 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6_litnum?row_id=15361267'],
                                ['GR9 Results 2011 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr9_litnum?row_id=15361267'],
        ],
        ['Systemic Test Results 2010', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['GR3 Results 2010 ', 'WEBPUB6.Cm_Cemis_Menu.routing_resultsGR3_report?row_id=15361267'],
                                ['GR6 Results 2010 ', 'WEBPUB6.Cm_Cemis_Menu.routing_resultsGR6_report?row_id=15361267'],
                                ['GR9 Results 2010 ', 'WEBPUB6.Cm_Cemis_Menu.routing_resultsGR9_report?row_id=15361267'],
        ],
        ['Term Performance', 'webpub6.cm_term_performance_1_9.tp_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A' ,
                           ['LitNum Results 2009', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',['GR6 LitNum Result 2009 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report_gr6?row_id=15361267'],],
                           ['LitNum Results 2008', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                           ['GR3 LitNum Result 2008 ', 'WEBPUB6.Cm_Cemis_Menu.routing_Assessment_report?row_id=15361267'], ],
                           ['LitNum Results 2007', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',['GR6 LitNum Result 2007 ', 'WEBPUB6.Cm_Cemis_Menu.routing_report?row_id=15361267'],],
                           ['GR3 LitNum Test 2011 ', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                                ['Learner Registers 2011', 'WEBPUB6.CM_GRADE3_RESULTS.SCHOOL_CLASSES?row_id=15361267'],
                                ['Principal Questionnaires 2011', 'webpub6.CM_GRADE3_RESULTS.principal_questionaire?row_id=15361267'],
                                ['Notification Letter 2011', 'webpub6.CM_GRADE3_QUESTIONAIRE.cm_gr3_eval?row_id=15361267'],
                                ['Gr3 Sign-Off', 'WEBPUB6.CM_ASSESSMENT_SIGNOFF2010.grade_signoff3?row_id=15361267 ' ],
                           ],
                           ['GR6 LitNum Test 2011 ', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                                ['Learner Registers 2011', 'WEBPUB6.CM_GRADE6_RESULTS.SCHOOL_CLASSES?row_id=15361267'],
                                ['Principal Questionnaires', 'webpub6.CM_GRADE3_RESULTS.principal_questionaire?row_id=15361267'],
                                ['Notification Letter 2011', 'webpub6.CM_GRADE6_QUESTIONAIRE.cm_gr6_eval?row_id=15361267'],
                                ['Gr6 Sign-Off', 'WEBPUB6.CM_ASSESSMENT_SIGNOFF2010.grade_signoff6?row_id=15361267 ' ],
                           ],
                           ['GR9 LitNum Test 2011 ', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                                ['Learner Registers 2011', 'WEBPUB6.CM_GRADE9_RESULTS.SCHOOL_CLASSES?row_id=15361267'],
                                ['Principal Questionnaires', 'webpub6.CM_GRADE3_RESULTS.principal_questionaire?row_id=15361267'],
                                ['Notification Letter 2011', 'webpub6.CM_GRADE9_QUESTIONAIRE.cm_gr3_eval?row_id=15361267'],
                                ['Gr9 Sign-Off', 'WEBPUB6.CM_ASSESSMENT_SIGNOFF2010.grade_signoff9?row_id=15361267 ' ],
                           ],
                           ['Grade 1-6 Sign-Off', 'WEBPUB6.CM_ana_SIGNOFF.signoff?row_id=15361267' ],
                           ['Gr12 Data Signoff', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                                ['English document', 'webpub6.Cm_cemis_menu.Grade12_signoffENG?row_id=15361267'],
                                ['Afrikaans document', 'webpub6.Cm_cemis_menu.Grade12_signoffAFR?row_id=15361267'],
                           ],
        ],
        ['Surveys', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                            ['Snap Survey 2023', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                    ['Survey Guideline', 'SNAP2007.cm_snap_ord_capture.survey_guideline?row_id=15361267 '],
                                    ['Progress Report', 'SNAP2007.snap_progress_report.progress_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                    ['Capture Screens', 'SNAP2007.cm_snap_ord_capture.MSG8?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                    ['Error Reports', 'SNAP2007.cm_snap_error_reports.snap_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                    ['Display Reports', 'snap2007.cm_snap_ord_display.ord_msg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                    ['Survey Signoff', 'SNAP2007.cm_snap_ord_sign_off.sign_off_new?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                    ['List of Educators', 'ass2007.cm_educator_information.snap_report_of_educators?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                    ['Educator Display Reports', 'ass2007.cm_educator_display_reports.educ_display_report_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ],
                            ['Annual 2023', 'ass2007.cm_ass_capture.survey_closed?row_id=15361267 ' ],
                            ['Annual 2023', 'webpub6.Cm_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Survey Message', 'ass2007.cm_ass_capture.survey_msg?row_id=15361267 ' ],
                                ['Progress Report', 'ass2007.cm_ord_progress.ass_progress_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Capture Screens', 'ass2007.cm_ass_capture.msg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A '],
                                ['Error Reports', 'ass2007.cm_ord_ass_error_reports.msg2?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Display Reports', 'ass2007.cm_ord_ass_display_reports.ord_msg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Educator Survey Form', 'webpub6.cm_cemis_menu.routing_of_educator_form?row_id=15361267 ' ],
                                ['Add/Capture Educator', 'ass2007.cm_educator_information.educator_login?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['List of Educators', 'ass2007.cm_educator_information.ass_report_of_educators?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Educator Error Reports', 'ass2007.cm_educator_error_reports.educ_err_rep_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Educator Display Reports', 'ass2007.cm_educator_display_reports.educ_display_report_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Annual Signoff', 'ass2007.cm_ass_ord_sign_off.sign_off_new?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Educator Progress Report', 'ass2007.cm_educator_error_reports.educ_progress_report?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                                ['Educator Signoff', 'ass2007.cm_educator_signoff.educ_sign_off?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ],
        ],
        ['Educator Information', 'webpub6.Cm_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                            ['Educator Survey Form', 'webpub6.cm_cemis_menu.routing_of_educator_form?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ['List of Educators', 'ass2007.cm_educator_information.ass_report_of_educators?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ['Add/Capture Educator', 'ass2007.cm_educator_information.educator_login?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ['Educator Error Reports', 'ass2007.cm_educator_error_reports.educ_err_rep_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ['Educator Display Reports', 'ass2007.cm_educator_display_reports.educ_display_report_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ['Educator Sign-Off', 'ass2007.cm_educator_signoff.educ_sign_off?row_id=15361267 ' ],
        ],
        ['Administration', 'webpub6.Cm_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                        ['Annual Academic Performance Report','webpub6.cm_aapr.aapr_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                        ['BEEI', 'webpub6.CM_Learnertracking.STARTMSG?row_id=15361267 ',
                              ['BEEI 2021/2022', 'webpub6.cm_cemis_menu.routing_beei_letter?row_id=15361267&v_year=2021'],
                        ],
                        ['Educators Vaccination Roll out','webpub6.cm_educ_vaccination_rollout.vaccination_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                        ['Additional Posts', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Apply for Additional Post',     'webpub6.cm_cemis_menu.routing_additionalpost_apply?row_id=15361267'],
                                ['Delete the application', 'webpub6.cm_cemis_menu.routing_curriculum_delete?row_id=15361267'],
                                ['View status of application', 'webpub6.cm_cemis_menu.routing_curriculum_view?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Apply for Additional Post',     'WEBPUB6.Cm_cemis_menu.route_Aplication?row_id=15361267'],
                        ],
                        ['Caps Textbook Topup', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Welcome and Guidelines','webpub6.cm_caps_orders_topup.get_guidelines?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['How To guide','webpub6.cm_caps_orders_topup.get_howtoguide?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Addendum 1','webpub6.cm_caps_orders_topup.get_template?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['View Previous Textbooks Ordered','webpub6.cm_caps_orders_topup.view_catalogue?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens','webpub6.cm_caps_orders_topup.caps_topups_application?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Confirmation Letter','webpub6.cm_caps_orders_topup.confirmation_letter?row_id=15361267'],
                        ],
                        ['COVID-19 Monitoring Tool','webpub6.cm_covid19_sim_tool.sim_select_grade?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                           ['Cust Satisfaction Survey','WEBPUB6.cm_customer_survey.cust_select_educ_type?row_id=15361267'],
                           ['EMIS Officer', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['EMIS Letter', 'WEBPUB6.cm_emis_officer.emis_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['EMIS Officer Role', 'webpub6.cm_emis_officer.emis_officer_role?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['EMIS Signoff', 'webpub6.cm_emis_officer.emis_signoff?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                           ],
                          ['Establishments', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Establishment 2023', 'webpub6.cm_cemis_menu.routing_staff_estab_letter_e?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2022'],
                                ['Establishment 2022', 'webpub6.cm_cemis_menu.routing_staff_estab_letter_e?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                          ],
                          ['Establisments - Public Service', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                            ['Establishment 2022', 'webpub6.cm_cemis_menu.routing_staff_estab_letter_ps?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2021'],
                            ['Establishment 2021', 'webpub6.cm_cemis_menu.routing_staff_estab_letter_ps?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A&v_year=2020'],
                          ],
                          ['Equipment Allocation', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Guidelines',     'WEBPUB6.Cm_cemis_menu.routing_guidelines?row_id=15361267'],
                                ['Letter',     'WEBPUB6.cm_equipment_letters.letter?row_id=15361267'],
                                ['Letter - English',  'WEBPUB6.cm_telecom_letters.admin_refresh_letter_eng?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Letter - Afrikaans',  'WEBPUB6.cm_telecom_letters.admin_refresh_letter_afr?row_id=15361267'],
                                ['Letter - isiXhosa',  'WEBPUB6.cm_telecom_letters.admin_refresh_letter_xho?row_id=15361267'],
                                ['Excel Template',     'WEBPUB6.Cm_cemis_menu.routing_excel_equip?row_id=15361267'],
                          ],
                          ['General Information', 'webpub6.cm_cemis_geninfo_tab.home?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Grade changes', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['School Correction',     'WEBPUB6.Cm_Learner_Grade_Change.Get_id?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Grade Change Manual', 'WEBPUB6.cm_cemis_menu.routingExams?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Request', 'WEBPUB6.cm_cemis_menu.routingemdc?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Cancel Request', 'WEBPUB6.cm_cemis_menu.routingExams1?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Grade R Subsidy', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                               ['Manual', 'webpub6.cm_GrR_subsidy.grade_R_subsidy_manual?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                               ['Submit Application', 'webpub6.cm_GrR_subsidy.grade_R_available?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                               ['Submit Application', 'webpub6.cm_GrR_subsidy.application_yn?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                               ['Claim Status', 'webpub6.cm_GrR_subsidy.subsidy_claim_status1?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                               ['Subsidy Payment Letter', 'webpub6.cm_GrR_subsidy.subsidy_claim_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Learner Transport', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['IRS Minute 0010/2014', 'webpub6.cm_cemis_menu.routing_of_lts_irs_minute?row_id=15361267'],
                                ['LTS Guide', 'webpub6.cm_cemis_menu.routing_of_lts_guide?row_id=15361267'],
                                ['LTS Guide', 'webpub6.cm_cemis_menu.routing_of_lts_guide?row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_lts.lts_select_grade?row_id=15361267'],
                                ['Capture Screens', 'webpub6.cm_lts.lts_select_grade?row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Norms and Standards Allocation', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['N & S 2023/24 Final', 'webpub6.CM_norms_standards2022.letter_revised_start?row_id=15361267'],
                                ['N & S 2023/24', 'webpub6.CM_norms_standards2022.letter_start?row_id=15361267'],
                                ['N & S 2022/23 Final', 'webpub6.CM_norms_standards2021.letter_revised_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['School Emergency Maintenance', 'webpub6.cm_learnertracking.startmsg?row_id=15361267',
                                ['Manual', 'webpub6.cm_sefmis.sefmis_manual?row_id=15361267'],
                                ['Manual', 'webpub6.cm_sefmis.sefmis_manual?row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Submit Request', 'webpub6.cm_sefmis.sefmis_start?row_id=15361267'],
                                ['Submit Request', 'webpub6.cm_sefmis.sefmis_start?row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['School Enrichment Programmes', 'webpub6.cm_learnertracking.startmsg?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Manual', 'webpub6.cm_seps.seps_manual?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_seps.seps_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Register Coach/Facilitator', 'webpub6.cm_seps.register_coach?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['School Fee Exemption', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Guidelines', 'webpub6.cm_fee_exemption.fee_exemption_guidelines?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_fee_exemption.fee_application?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Fee Exemption Signoff', 'webpub6.cm_fee_exemption.fee_signoff?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Fee Exemption Letter', 'WEBPUB6.cm_fee_exemption_letter.letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['School Governing Body (SGB)', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Manual', 'webpub6.cm_sgb_new.routing_of_sgb_voters_roll_man?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Rating Descriptors', 'webpub6.cm_sgb_new.view_rating_descriptors?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_sgb_new.sgb_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['School Improvement Monitoring', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                 ['Document', 'webpub6.cm_SIM_new.sim_documents?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Term 1 - Executive Summary', 'webpub6.cm_SIM_new.routing_of_sim_summary?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                 ['Capture Screen', 'webpub6.cm_SIM_new.sim_home?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['School Self-Evaluation', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Template', 'webpub6.cm_school_self_evaluation.routing_of_sse_template?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_school_self_evaluation.sse_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Stationery/Cleaning Order', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Welcome and Guideline', 'webpub6.cm_stat_clean_ordering.routing_of_stat_clean_welcome?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Manual', 'webpub6.cm_stat_clean_ordering.routing_of_stat_clean_manual?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Order', 'webpub6.cm_stat_clean_ordering.stat_and_clean_application?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Confirmation Letter', 'webpub6.cm_stat_clean_ordering.stat_clean_letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Subjects Principal Signoff', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Gr12 Subjects', 'webpub6.cm_cemis_subjects_signoff.gr12_signoff?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Gr11 Subjects', 'webpub6.cm_cemis_subjects_signoff.gr11_signoff?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Gr10 Subjects', 'webpub6.cm_cemis_subjects_signoff.gr10_signoff?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Telecommunications Allocation', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Guideline',  'WEBPUB6.Cm_cemis_menu.routing_guide_tele?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Telecommunications Allocation',  'WEBPUB6.cm_telecom_letters.letter?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Excel Template',     'WEBPUB6.cm_telecom_letters.excel_tele?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Textbook Issued/Retrievals', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Capture 2023','webpub6.cm_textbook_retrieval.select_textbook_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture 2022','webpub6.cm_textbook_retrieval.select_textbook_buttons1?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['Transfer Payments', 'WEBPUB6.cm_transfer_payments.view_transfer_payments?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Workbooks', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Welcome', 'webpub6.cm_workbooks.wb_welcome?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['How To Guide', 'webpub6.cm_workbooks.wb_how_to_guide?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_workbooks.wb_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture Screens', 'webpub6.cm_workbooks.wb_not_available?row_id=15361267'],
                                ['Workbook Orders', 'WEBPUB6.cm_workbook_orders.select_workbook_phase?row_id=15361267'],
                                ['Workbook Shortages', 'WEBPUB6.cm_workbook_orders.select_workbook_ph_shortages?row_id=15361267'],
                            ],
        ],
        ['Absenteeism/Screening', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                            ['Capture Learner Screening', 'webpub6.cm_cemis_menu.capture_lnr_screening?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Learners Not Screened', 'webpub6.cm_learners_not_screened.not_screened_buttons?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ' ],
                            ['Capture absenteeism', 'webpub6.cm_cemis_menu.capture_absenteeism?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Capture absenteeism', 'webpub6.cm_cemis_menu.available_MSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['View Capture Status', 'webpub6.cm_cemis_menu.view_status_absenteeism?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Reset password', 'webpub6.cm_admin_support.reset_absenteeism_password?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Register LACs', 'webpub6.cm_admin_support.admin_support_start_page?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Capture school holidays', 'webpub6.cm_school_holidays.cm_school_holidays_capture?row_id=15361267'],
                            ['Capture school holidays extended', 'webpub6.cm_school_holidays.cm_school_holidays_capture_ext?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Capture school days (COVID19)', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                                ['Capture 2023', 'webpub6.cm_school_holidays.covid19_school_days_capture?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Capture 2022', 'webpub6.cm_school_holidays.covid19_school_days_capture1?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
                            ['View Print Register', 'webpub6.cm_cemis_menu.view_print_reg_absenteeism?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['View Summary Register', 'webpub6.cm_cemis_menu.view_summary_reg_absenteeism?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Monthly Absenteeism', 'WEBPUB6.plpdf_helloworld?row_id=15361267'],
                            ['QLAR differences', 'webpub6.cm_learners_not_screened.lnr_screen_totals?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Quarterly Learner Absenteeism', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                ['Quarterly absenteeism 2023', 'webpub6.cm_quartley_attendance_tab2023.home?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                ['Quarterly absenteeism 2022', 'webpub6.cm_quartley_attendance_tab2022.home?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ],
        ],
        ['Learner Admin Search', 'webpub6.cm_learner_search.learner_cemis_search?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ['CEMIS Support', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A ',
                            ['District Contact details', 'webpub6.cm_modules_contact.district_contact_details?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Capture Screens Contact details', 'webpub6.cm_modules_contact.contact_details?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Web Settings - IE9', 'webpub6.Cm_cemis_menu.routing_cemis_settings?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Web Settings - IE10', 'webpub6.Cm_cemis_menu.routing_cemis_settings_v10?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                            ['Web Settings - IE11', 'webpub6.Cm_cemis_menu.routing_cemis_settings_v11?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
        ['Admissions', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                        ['Capture Online Admissions', 'webpub6.Cm_cemis_menu.routing_online_admissions?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                               ['Planned Enrolment Status', 'webpub6.CM_Learnertracking.STARTMSG?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A',
                                  ['Planned Template','WEBPUB6.cm_sami.sami_template?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                  ['Reports','WEBPUB6.cm_sami.sami_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
                                  ['Multiple Acceptances', 'WEBPUB6.cm_sami.sami_multiple_app?row_id=15361267'],
                                  ['Confirmation of Learner Enrolment', 'WEBPUB6.cm_sami.sami_success_learners?row_id=15361267'],
                               ],
                               ['View Online Applications','WEBPUB6.cm_sami.sami_start?v_row_id=C1C2AC44649445EF4DCD52D7BB921AE90D40F4E187977C5DDC157479FB50B72A'],
        ],
]


    }),
    computed: {
        tcem() {
            let all = []
            this.cemis.forEach(e => {
                let a = {}
                a.menu = e[0]
                a.type = typeof(e[2]) || ''
                console.log(e, typeof(e[2]))
                a.level = []
                 for (let i=2; i<12; i++) {
                    if (e[i]) {
                        console.log('we have e' + i)
                        this.getit(a.level,e[i])
                    } else  {
                        console.log('missing' + i)
                    }
                 }

/*
                if (typeof(e[2]) == 'object') {
                    let o = e[2]
                    console.log('2ndlevel', o)
                    o.forEach(f => {
                        a.level1 = f
                        a.type1 = typeof(f[2])

                        if (typeof(f[2]) == 'object') {
                           let p = f[2]
                           p.forEach(g => {
                                a.level2 = g[0]
                                a.type2 = typeof(g[2])
                           })
                        }
                    })
                }
*/
                all.push(a)
                console.log(all)
            })
            return all
        }
    },
    methods: {
        getit(arr, obj) {
            let l = {}
            l.level = obj[0]
            l.type = typeof(obj[2])
            arr.push(l)
        },
        selListEntryEdited() {
            let index = this.selectedKeyIndex
            let change = false
            if (this.tab[index] == this.sel) {
                ws.localUpdate(this.head, this.sel)
                change = true
            } else {
                alert('we must hae  the wrong entry!!')
            }
            this.showAdd = false
            if (change == true) {
               // we need to force an re-render sometimes...
                 this.tab[index].comment = ''
            }
            this.tableHasChanged()
        },
        rowDblClick(e,{item}) {
          //console.log(e, item, headers)
          this.sel = item
          this.selectedKeyIndex = this.tab.findIndex(e => e[this.uniqKeyFld] == item[this.uniqKeyFld])
          if (this.selectedKeyIndex == -1) {
              alert('we did not find that entry!')
              return
          }
          console.log('selectedKeyindex = ',this.selectedKeyIndex, 'for item id', item[this.uniqKeyFld])
          this.showAdd = true
        },
        addEntry() {
            if (this.tab.length == 0) {
            this.tab = [
                     {id:1,name:'werner',surname:'smit'
                     ,jdocstructure:[{name:'mark1', value:11, type:'text'}
                                    ,{name:'comment', value:'a comment', type:'text'}]},
                     {id:2,name:'anton',surname:'smith'
                     ,jdocstructure:[{name:'mark1', value:12, type:'text'}]}
                       ]
            } else {
                let obj1 = {name:'mark1', value:this.tab.length, type:'number'}
                let obj2 = {name:'comment', value:'sdfrsdsdf', type:'text'}
                let playStruct = [obj1,obj2]
             this.tab.push(
                 {id:this.tab.length+1,
                 name:'add'+this.tab.length,
                 surname:'surname',
                 jdocstructure: playStruct
             })
             // console.log('after adding json', this.tab)
            }
        },
        tableHasChanged() {
            this.tab.forEach(row => {
               ws.addStructure(row)
            })
            // console.log('call fixheader')
            //ws.fixHeader(this.head)
        }
    },
    mounted() {
      this.head = [{text:'id', value:'id', edit:false},
                   {text:'name', value:'name', edit:false},
                   {text:'surname', value:'surname', edit:false}
                  ]
      let obj1 = {name:'mark1', value:'', type:'number', edit:true}
      let obj2 = {name:'comment', value:0, type:'text', edit:true}
      let objArr = [obj1, obj2]
      ws.assignStruct(objArr)
      ws.fixHeader(this.head)
    },
    watch: {
        tab: {
            deep:true,
            handler() {
               console.log('tabwatch : deep is true');
               this.tableHasChanged();
            }
        },
        sel: {
            deep:true,
            handler() {
               console.log('sel was changed : deep is true');
            }

        }

    }
}
</script>