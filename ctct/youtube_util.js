/**
* Youtube Utilities
*/
var YoutubeUtil = {

    /**
    * validates a youtube url. Makes a call to youtube to validate the id.
    */
    validateUrl: function(url, callback) {
        console.log("validating url");
        var t = this,
            videoId = t.getParameterFromUrl(url, "v");
        
        if (videoId) {
            console.log("video id is: " + videoId);
            
            // Validate with youtube gdata api.
            var jsonpConfig = {
                type: "GET",
                url: "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q=" + videoId,
                dataType: "jsonp",
                context: t,
                success: function(res) {
                    console.log(res);
                    if (typeof(res) === "object" &&
                    res.data &&
                    res.data.totalItems === 1) {
                        callback(true, res.data.items[0]);
                    } else {
                        callback(false);
                    }
                },
                error: function() {
                    callback(false);
                }
            };
            $.ajax(jsonpConfig);
        } else {
            callback(false);
        }
    },
    
    /**
    * Extracts a parameter from the url.
    */
    getParameterFromUrl: function(url, name) {
        var match = RegExp('[?&]' + name + '=([^&]*)')
                        .exec(url);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },
    
    /**
    * Creates HTML for the youtube embed object.
    */
    getEmbedObject: function(videoId, options) {
        var embedHtml =
        '<object width="560" height="315">' + 
        '<param name="movie" value="https://www.youtube.com/v/' + videoId + '?version=3&amp;hl=en_US&amp;rel=0"></param>'+ 
        '<param name="allowFullScreen" value="true"></param>' + 
        '<param name="allowscriptaccess" value="always"></param>' + 
        '<embed src="https://www.youtube.com/v/' + videoId + '?version=3&amp;hl=en_US&amp;rel=0" type="application/x-shockwave-flash" width="560" height="315" allowscriptaccess="always" allowfullscreen="true"></embed>' +
        '</object>';
        return embedHtml;
    }
};