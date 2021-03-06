// Check RCPT TO domain is in host list

exports.hook_rcpt = function(next, connection, params) {
    var rcpt = params[0];
    // Check for RCPT TO without an @ first - ignore those here
    if (!rcpt.host) {
        return next();
    }
    
    this.loginfo("Checking if " + rcpt + " host is in host_lists");
    
    var domain          = rcpt.host.toLowerCase();
    var host_list       = this.config.get('host_list', 'list');
    var host_list_regex = this.config.get('host_list_regex', 'list');

    var i = 0;
    for (i in host_list) {
        this.logdebug("checking " + domain + " against " + host_list[i]);

        // normal matches
        if (host_list[i].toLowerCase() === domain) {
            this.logdebug("Allowing " + domain);
            return next(OK);
        }
    }

    for (i in host_list_regex) {
        this.logdebug("checking " + domain + " against regexp " +
            host_list_regex[i]);

        var regex = new RegExp ('^' + host_list_regex[i] + '$', 'i');

        // regex matches
        if (domain.match(regex)) {
            this.logdebug("Allowing " + domain);
            return next(OK);
        }
    }
    
    next();
}
