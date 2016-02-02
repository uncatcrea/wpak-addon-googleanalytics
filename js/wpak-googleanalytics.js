define( function( require ) {
    "use strict";

    var Phonegap    = require( 'core/phonegap/utils' );
    var Config      = require( 'root/config' );
    var Hooks       = require( 'core/lib/hooks' );

    var googleanalytics = {
        tracker: null
    };

    /**
     * Initialize Google Analytics plugin:
     *  - Expose tracker object to be used within plugins and themes
     *  - Activate tracking thanks to the given tracking ID
     *
     * @returns {Boolean} True when everything went fine, false otherwise
     */
    googleanalytics.init = function() {
        if( !Phonegap.isLoaded() || "undefined" == typeof Config.options.googleanalytics || "undefined" == typeof window.analytics ) {
            return false;
        }

        // Expose Google Analytics plugin object for themes and plugins to use its methods, especially trackView and trackEvent
        googleanalytics.tracker = window.analytics;

        // Activate debug mode
        if( Config.debug_mode == 'on' ) {
            googleanalytics.tracker.debugMode();
        }

        // Register this app with the given tracking ID
        document.addEventListener( 'deviceready', function() {
            googleanalytics.tracker.startTrackerWithId( Config.options.googleanalytics.trackingid );
        }, false );

        return true;
    };

    return googleanalytics;
});