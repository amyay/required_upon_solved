(function() {

  var CustomFieldIDs = [];

  return {
    events: {
      'app.activated'                                  : 'init',
      'ticket.form.id.changed'                         : 'init',
      'ticket.save'                                    : 'checkFields',
      '*.changed'                                      : 'init'
      // 'ticket.custom_field_28638228.changed': 'init2'
      // 'ticket.custom_field_25639528.changed': 'customField25639528Changed'
    },

    init: function() {
      console.log ('hello world, i am in init()');
      this.CFPresentList = [];
      CustomFieldIDs = this.setting('CFID').replace(/\s/g, '').split(',');
      console.log ('CustomFieldIDs:', CustomFieldIDs);
      this.showReminder();
    },

//     checkFields: function() {
//       // check all fields in CustomFieldIDs
//       for (var i = 0; i < CustomFieldIDs.length; i++) {
//         // first check to see if ticket field  is present or not
// console.log("i = "+i, "CustomFieldIDs = "+CustomFieldIDs[i]);
//         if (this.ticketFields("custom_field_"+CustomFieldIDs[i]) !== undefined) {
// console.log("custom_field"+CustomFieldIDs[i]+"is defined");
//           if (this.ticketFields("custom_field_"+CustomFieldIDs[i]).isVisible()) {
// console.log("custom_field_"+CustomFieldIDs[i]+"is visible");
//             // ticket field  is present
//             // now check to see if ticket is attempt to set to solved
//             if (this.ticket().status() == "solved") {
//               // now check if there are value selected
//               if ((this.ticket().customField("custom_field_"+CustomFieldIDs[i]) == null) || (this.ticket().customField("custom_field_"+CustomFieldIDs[i]) === '')) {
//                 // value not selected, do something
// console.log ('oopsie daisy!');
// services.notify('Failed to update ticket', 'error');
// services.notify("Custom field "+CustomFieldIDs[i]+" is required to be selected upon solved.\nPlease try again", 'error');
//                 return false;
//               }
//               // else {
//               //   this.enableSave();
//               // }
//             }
//           }
//         }
//       }
//     },

    checkFields: function() {
      // check all fields in CustomFieldIDs
      for (var i = 0; i < CustomFieldIDs.length; i++) {
        // first check to see if ticket field is present or not
        console.log("in checkFields(): i = "+i, "CustomFieldIDs = "+CustomFieldIDs[i]);
        if (this.customFieldPresent(CustomFieldIDs[i]))
          // ticket field  is present
          // now check to see if ticket is attempt to set to solved
          if (this.ticket().status() == "solved") {
            // now check if there are value selected
            if ((this.ticket().customField("custom_field_"+CustomFieldIDs[i]) == null) || (this.ticket().customField("custom_field_"+CustomFieldIDs[i]) === '')) {
              // value not selected, do something
              console.log ('oopsie daisy!');
              services.notify('Failed to update ticket', 'error');
              services.notify("Custom field \""+this.ticketFields("custom_field_"+CustomFieldIDs[i]).label()+"\" ("+CustomFieldIDs[i]+") is required to be selected upon solved.\nPlease try again", 'error');
              return false;
            }
            // else {
            //   this.enableSave();
            // }
          }


      }
    },

    showReminder: function() {
      console.log ("in showReminder()");
      // check all fields in CustomFieldIDs
      for (var i = 0; i < CustomFieldIDs.length; i++) {
        console.log("in showReminder(): i = "+i, "CustomFieldIDs = "+CustomFieldIDs[i]);
        // check to see if ticket field is present or not
        if (this.customFieldPresent(CustomFieldIDs[i])) {
          // ticket field is present
          // now build a list of labels
          this.CFPresentList.push(this.ticketFields("custom_field_"+CustomFieldIDs[i]).label());
        }
      }
      console.log ("in showReminder(), CFPresentList = ", this.CFPresentList);
      this.switchTo ('reminder', {
        customFieldList: this.CFPresentList
      });
    },


    // helper function: check to see if a particular custom field is present
    // i.e. defined and visible
    customFieldPresent: function (field_id) {
      // first check to see if the ticket field is defined / present or not
      if (this.ticketFields("custom_field_"+field_id) !== undefined) {
        console.log("in customFieldPresent(): custom_field"+field_id+"is defined");
        // next check to see if custom field is visible or not (CFA hides fields)
        if (this.ticketFields("custom_field_"+field_id).isVisible()) {
          console.log("in customFieldPresent(): custom_field_"+field_id+"is visible");
          return true;
        }
        else{
          // custom field is not visible
          return false;
        }
      }
      else {
        // custom field is not defined
        return false;
      }
    }

    // init2: function() {
    //   // check current ticket form ID
    //   console.log ('current ticket form ID = ', this.ticket().form().id());
    //   console.log ('current value in 28638228 = ', this.ticket().customField("custom_field_28638228"));

    //   if (this.ticket().form().id() == "129448") {
    //     // check current value of ticket field 28638228
    //     if ((this.ticket().customField("custom_field_28638228") == null) || (this.ticket().customField("custom_field_28638228") === '')) {
    //         // value not selected, do something
    //       console.log ('invalid selection in custom field 28638228');
    //       this.disableSave();
    //     }
    //     else {
    //      this.enableSave();
    //     }
    //   }
    //   else {
    //     this.enableSave();
    //   }
    // },

    // checkFieldsold: function() {
    //   // field of interest: 28638228

    //   // first check to see if ticket field 28638228 is present or not
    //   if (this.ticketFields("custom_field_28638228") !== undefined) {
    //     console.log("custom_field_28638228 is defined");
    //     if (this.ticketFields("custom_field_28638228").isVisible()) {
    //       console.log("custom_field_28638228 is visible");
    //       // ticket field 28638228 is present
    //       // now check to see if ticket is attempt to set to solved
    //       if (this.ticket().status() == "solved") {
    //         // now check if there are value selected
    //         if ((this.ticket().customField("custom_field_28638228") == null) || (this.ticket().customField("custom_field_28638228") === '')) {
    //           // value not selected, do something
    //           console.log ('oopsie daisy!');
    //           services.notify('oppsie daisy', 'error');
    //           return false;
    //         }
    //         // else {
    //         //   this.enableSave();
    //         // }
    //       }
    //     }
    //   }
    // },

    // customField28638228Changed: function() {

    //   if (this.ticket().status() == "solved") {
    //     // now check if there are value selected
    //     if ((this.ticket().customField("custom_field_28638228") == null) || (this.ticket().customField("custom_field_28638228") === '')) {
    //       // value not selected, do something
    //       console.log ('oopsie daisy!');
    //       services.notify('oppsie daisy', 'error');
    //       this.disableSave();
    //     }
    //     else {
    //       this.enableSave();
    //     }
    //   }
    // }

    // customField25639528Changed: function() {
    //   // first hide all options in 25652907
    //   for (var i = 1; i < this.ticketFields("custom_field_25652907").options().length; i++)
    //   {
    //     this.ticketFields("custom_field_25652907").options()[i].hide();
    //   }

    //   // check current value selected in custom field 25639528
    //   var SSS1_current = this.ticket().customField("custom_field_25639528");

    //   // then display items in 25652907 accordingly
    //   switch (SSS1_current)
    //   {
    //     case "sss_a":
    //       this.ticketFields("custom_field_25652907").options("sss_a_1").show();
    //       this.ticketFields("custom_field_25652907").options("sss_a_2").show();
    //       break;
    //     case "sss_b":
    //       this.ticketFields("custom_field_25652907").options("sss_b_1").show();
    //       this.ticketFields("custom_field_25652907").options("sss_b_2").show();
    //       break;
    //     case "sss_c":
    //       this.ticketFields("custom_field_25652907").options("sss_c_1").show();
    //       this.ticketFields("custom_field_25652907").options("sss_c_2").show();
    //       break;

    //     default:
    //       // hide all
    //       for (var j = 1; j < this.ticketFields("custom_field_25652907").options().length; j++)
    //       {
    //         this.ticketFields("custom_field_25652907").options()[j].hide();
    //       }
    //   }
    // }
  };

}());
