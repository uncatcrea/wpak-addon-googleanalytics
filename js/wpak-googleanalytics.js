define( function( require ) {
    "use strict";

    var Phonegap    = require( 'core/phonegap/utils' );
    var Config      = require( 'root/config' );
    var Hooks       = require( 'core/lib/hooks' );

    var googleanalytics = {
        tracker: null
    };

    googleanalytics.init = function() {
        if( !Phonegap.isLoaded() || "undefined" == typeof Config.options.googleanalytics || "undefined" == window.analytics ) {
            return;
        }

        googleanalytics.tracker = window.analytics;

        // Activate debug mode
        if( Config.debug_mode == 'on' ) {
            googleanalytics.tracker.debugMode();
        }

        // Register this app with the given tracking ID
        document.addEventListener( 'deviceready', function() {
            googleanalytics.tracker.startTrackerWithId( Config.options.googleanalytics.trackingid );
        }, false );
    };

    return googleanalytics;
});