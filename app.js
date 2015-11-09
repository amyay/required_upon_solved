(function() {

  var CustomFieldIDs = [];
  var CFPresentListID = [];
  var CFPresentListLabel = [];

  return {
    events: {
      'app.created'                                    : 'init',
      'ticket.form.id.changed'                         : 'reinit',
      'ticket.save'                                    : 'checkFields',
      '*.changed'                                      : 'reinit'
    },

    init: function() {
      // console.log ('hello world, i am in init()');
      CFPresentListID = [];
      CFPresentListLabel = [];
      CustomFieldIDs = this.setting('Custom field IDs to be required upon solving tickets').replace(/\s/g, '').split(',');
      // console.log ('CustomFieldIDs:', CustomFieldIDs);
      this.showReminder();
    },

    reinit: function() {
      // console.log ('reinit()');
      CFPresentListID = [];
      CFPresentListLabel = [];
      _.defer(this.showReminder.bind(this));
    },

    // check to see if required fields are filled in
    checkFields: function() {
      // check all fields in CustomFieldIDs
      for (var i = 0; i < CustomFieldIDs.length; i++) {
        // first check to see if ticket field is present or not
        // console.log("in checkFields(): i = "+i, "CustomFieldIDs = "+CustomFieldIDs[i]);
        if (this.customFieldPresent(CustomFieldIDs[i]))
          // ticket field  is present
          // now check to see if ticket is attempt to set to solved
          if (this.ticket().status() == "solved") {
            // now check if there are value selected
            if ((this.ticket().customField("custom_field_"+CustomFieldIDs[i]) == null) || (this.ticket().customField("custom_field_"+CustomFieldIDs[i]) === '')) {
              // value not selected, do something
              // console.log ('oopsie daisy!');
              services.notify('Failed to update ticket', 'error');
              services.notify("Custom field \""+this.ticketFields("custom_field_"+CustomFieldIDs[i]).label()+"\" ("+CustomFieldIDs[i]+") is required to be selected upon solved.\nPlease try again", 'error');
              return false;
            }
          }
      }
    },

    // display required fields on "reminder" template
    showReminder: function() {
      // console.log ("in showReminder()");
      // check all fields in CustomFieldIDs
      for (var i = 0; i < CustomFieldIDs.length; i++) {
        // console.log("in showReminder(): i = "+i, "CustomFieldIDs = "+CustomFieldIDs[i]);
        // check to see if ticket field is present or not
        if (this.customFieldPresent(CustomFieldIDs[i])) {
          // ticket field is present
          // now build a list of labels if it isn't already in it
          if (CFPresentListID.indexOf(CustomFieldIDs[i]) < 0) {
            CFPresentListID.push(CustomFieldIDs[i]);
            CFPresentListLabel.push(this.ticketFields("custom_field_"+CustomFieldIDs[i]).label());
          }
        }
        // console.log ("in showReminder(), CFPresentListLabel = ", CFPresentListLabel);
        // console.log ("in showReminder(), CFPresentListID = ", CFPresentListID);

        // display
        this.switchTo ('reminder', {
          customFieldList: CFPresentListLabel
        });
      }
    },


    // helper function: check to see if a particular custom field is present
    // i.e. defined and visible
    customFieldPresent: function (field_id) {
      // first check to see if the ticket field is defined / present or not
      if (this.ticketFields("custom_field_"+field_id) !== undefined) {
        // console.log("in customFieldPresent(): custom_field"+field_id+" is defined");
        // next check to see if custom field is visible or not (CFA hides fields)
        if (this.ticketFields("custom_field_"+field_id).isVisible()) {
          // console.log("in customFieldPresent(): custom_field_"+field_id+" is visible");
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
  };

}());
