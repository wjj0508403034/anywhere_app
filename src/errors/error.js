'use strict';

const I18n = require("./../localization/i18n.json");

function InternalError() {

}

const ErrorCodes = {
  Params_Invalid: "E00001",
  SAP_Verify_Signature_Failed: "E00002"
};

module.exports = {
  ErrorCodes: ErrorCodes,
  new: function(error_code) {
    var error = new InternalError();
    error.code = error_code;
    error.msg = I18n.errors[error_code];
    return error;
  }
};