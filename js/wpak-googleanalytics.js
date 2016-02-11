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
        // TODO: don't expose this object directly, wrap some methods first
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

    /**
     * Track an event
     *
     * @param {Object} event_args   Should contain category, action, label, value variables to be sent to Google Analytics
     * @param {Object} context      Should contain event (String describing triggered event) and args (Array containing all context data, could be empty)
     *
     * @TODO Put this method into googleanalytics.tracker object
     */
    googleanalytics.trackEvent = function( event_args, context ) {
        var category = 'app';
        var action = '';
        var label = '';
        var value = null;

        // Filter event args before sending them to Analytics
        event_args = Hooks.applyFilters( 'wpak-addon-googleanalytics-event-args', event_args, [ context ] );

        if( event_args.hasOwnProperty( 'category' ) ) {
            category = event_args.category;
        }
        if( event_args.hasOwnProperty( 'action' ) ) {
            action = event_args.action;
        }
        if( event_args.hasOwnProperty( 'label' ) ) {
            label = event_args.label;
        }
        if( event_args.hasOwnProperty( 'value' ) ) {
            // Google Analytics only allows integer values, otherwise the event isn't stored
            value = parseInt( event_args.value );
        }

        googleanalytics.tracker.trackEvent( category, action, label, value );
    }

    return googleanalytics;
});