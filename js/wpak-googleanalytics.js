define( function( require ) {
    "use strict";

    var Phonegap    = require( 'core/phonegap/utils' );
    var Config      = require( 'root/config' );
    var Hooks       = require( 'core/lib/hooks' );

    var googleanalytics = {
        tracker: {},
        trackErrors: true
    };

    var initialized = false;

    /**
     * Initialize Google Analytics plugin:
     *  - Expose tracker object to be used within plugins and themes
     *  - Activate tracking thanks to the given tracking ID
     *
     * @returns {Boolean} True when everything went fine, false otherwise
     */
    googleanalytics.init = function() {
        if( initialized ) {
            return true;
        }

        if( !Phonegap.isLoaded() || "undefined" == typeof Config.options.googleanalytics || "undefined" == typeof window.ga ) {
            return false;
        }

        initialized = true;

        // Expose Google Analytics plugin object for themes and plugins to use its methods, especially trackView and trackEvent
        for ( var property in window.ga ) {
            // Don't expose this object directly, wrap some methods first
            if ( !googleanalytics.tracker.hasOwnProperty( property ) ) {
                googleanalytics.tracker[property] = window.ga[property];
            }
        }

        // Activate debug mode
        if( Config.debug_mode == 'on' ) {
            googleanalytics.tracker.debugMode();
        }

        // Update trackErrors value according to app config
        if( !Config.options.googleanalytics.hasOwnProperty( 'track_errors' ) || Config.options.googleanalytics.track_errors != 1 ) {
            googleanalytics.trackErrors = false;
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
     * @param {String} category     Should contain category variable to be sent to Google Analytics
     * @param {String} action       Should contain action variable to be sent to Google Analytics
     * @param {String} label        Should contain label variable to be sent to Google Analytics
     * @param {Integer} value       Should contain value variable to be sent to Google Analytics
     * @param {Object} context      Should contain event (String describing triggered event) and args (Array containing all context data, could be empty)
     */
    googleanalytics.tracker.trackEvent = function( category, action, label, value, context ) {
        var event_args = {
            category: category,
            action: action,
            label: label,
            value: value,
        };

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
        // Check if value is a real number or not
        if( isNaN( value ) ) {
            value = null;
        }

        window.ga.trackEvent( category, action, label, value );
    };

    /**
     * Track a page view
     *
     * @param {String} url          Should contain url variable to be sent to Google Analytics
     * @param {Object} context      Should contain current_screen and current_view objects in corresponding attributes
     */
    googleanalytics.tracker.trackView = function( url, context ) {
        // Filter url before sending it to Analytics
        url = Hooks.applyFilters( 'wpak-addon-googleanalytics-page-view-url', url, [ context ] );

        window.ga.trackView( url );
    };

    return googleanalytics;
});