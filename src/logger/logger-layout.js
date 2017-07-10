'use strict';


const Layout = {
  "type": "pattern",
  "pattern": "%d\t%p\tSessionId[%x{sessionId}]\tUserId[%x{userId}]\tComponent[%h]\t\t\t\tHandler[%c]\t%n%m",
  "tokens": {
    sessionId: function(logEvent) {
      return "";
    },
    userId: function(logEvent) {
      return "";
    }
  }
};

module.exports = Layout;