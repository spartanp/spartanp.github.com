$(document).ready(function() {

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
            this.siteOwnerId = con.attr("data-soid");
            this.contactListId = con.attr("data-clid");

            // nodes of interest.
            this.join = con.find(".join");
            this.emailInput = con.find(".email");
            this.promptText = this.emailInput[0].defaultValue; // I hate this.
            this.subscribeCon = con.find(".subscribe-con");
            this.successMsg = con.find(".success-msg-con");
            this.emailErrorMsg = con.find(".email-error");

            // initialize event listeners.
            this.initEventListeners();

            console.log("initialized widget for site owner: " + this.siteOwnerId, "info");
        },

        /**
         * Initialize event listeners.
         */
        initEventListeners: function() {
            var ei = this.emailInput,
                join = this.join,
                t = this;

            // I hate the way in which I have to plugin a context. YUI has bind
            // and a context param too! hail Jquery!!
            ei.focus(function(e) {
                t.handleInputFocus.apply(t, e);
            });
            ei.blur(function(e) {
                t.handleInputBlur.apply(t, e);
            });
            join.click(function(e) {
                t.handleSubscribeClick.apply(t, e);
            });
        },

        /**
         * Handles a subscription click.
         *
         * @param {e} is the normalized event object.
         */
        handleSubscribeClick: function(e) {
            var ei = this.emailInput,
                email = $.trim(ei.val());

            // validate the email address.
            if (JMMLWidget.emailPattern.test(email)) {
                // do a jsonp call and process the response.
                console.log("subscribing " + email + " to " + this.siteOwnerId + "'s list " + this.contactListId, "warn");
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
                value = $.trim(ei.val());

            if (value === this.promptText) {
                ei.val("");
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
                value = $.trim(ei.val());

            if (value === "") {
                ei.val(this.promptText);
                ei.addClass("prompt");
            }
        }
    };

    //***************//
    // Initialize all the widgets on the page.
    var jmmlNodes = $(".jmml-widget-con");
    jmmlNodes.each(function(i) {
        var node = $(this);
        new JMMLWidget(node);
    });
});
