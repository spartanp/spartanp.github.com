YUI().use("node", "event", "oop", "console", function(Y) {

    new Y.Console().render();
    
    /**
     * JMMLWidget Constructor.
     *
     * @param {Y.Node} node is a reference to the widget container.
     */
    function JMMLWidget(node) {
        this.container = node;
        this.initialize();
    }

    // static definitions.
    JMMLWidget.emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
    // method definitions for JMMLWidget
    JMMLWidget.prototype = {
        
        /**
         * Initialize the widget.
         */
        initialize: function() {
            var con = this.container;

            // required data for subscription.
            this.siteOwnerId = con.getAttribute("data-soid");
            this.contactListId = con.getAttribute("data-clid");

            // nodes of interest.
            this.join = con.one(".join");
            this.emailInput = con.one(".email");
            this.promptText = this.emailInput.get("defaultValue");
            this.subscribeCon = con.one(".subscribe-con");
            this.successMsg = con.one(".success-msg-con");
            this.emailErrorMsg = con.one(".email-error");

            // initialize event listeners.
            this.initEventListeners();

            Y.log("initialized widget for site owner: " + this.siteOwnerId, "info");
        },

        /**
         * Initialize event listeners.
         */
        initEventListeners: function() {
            var ei = this.emailInput,
                join = this.join;

            ei.on("focus", this.handleInputFocus, this);
            ei.on("blur", this.handleInputBlur, this);
            join.on("click", this.handleSubscribeClick, this);
        },

        /**
         * Handles a subscription click.
         *
         * @param {e} is the normalized event object.
         */
        handleSubscribeClick: function(e) {
            var ei = this.emailInput,
                email = Y.Lang.trim(ei.get("value"));

            // validate the email address.
            if (JMMLWidget.emailPattern.test(email)) {
                // do a jsonp call and process the response.
                Y.log("subscribing " + email + " to " + this.siteOwnerId + "'s list " + this.contactListId, "warn");
                this.subscribeCon.addClass("hide");
                this.successMsg.removeClass("hide");
            } else {
                this.emailErrorMsg.removeClass("hide");
            }
        },

        /**
         * Clear default prompt value on focus.
         *
         * @param {Event} e is the normalized event object.
         */
        handleInputFocus: function(e) {
            var ei = this.emailInput,
                value = Y.Lang.trim(ei.get("value"));

            if (value === this.promptText) {
                ei.set("value", "");
            }
            
            // just in case the user has started typing in before the widget initializes.
            ei.removeClass("prompt");
        },

        /**
         * Bring back prompt text in, if the user hasn't entered anything.
         *
         * @param {Event} e is the normalized event object.
         */
        handleInputBlur: function(e) {
            var ei = this.emailInput,
                value = Y.Lang.trim(ei.get("value"));

            if (value === "") {
                ei.set("value", this.promptText);
                ei.addClass("prompt");
            }
        }
    };

    //***************//
    // Initialize all the widgets on the page.
    var jmmlNodes = Y.all(".jmml-widget-con");
    jmmlNodes.each(function(n) {
        new JMMLWidget(n);
    });
});
