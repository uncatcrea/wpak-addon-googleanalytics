define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics' ], function( App, WpakGoogleAnalytics ) {
    var track = WpakGoogleAnalytics.init();

    if( track ) {
        /**
         * Track page views
         */
        App.on( 'screen:showed', function( current_screen, current_view ) {
            // WpakGoogleAnalytics.tracker.trackView( 'Screen Title' )
        });

        /**
         * Track error events
         */
        App.on( 'error', function( error ) {
            var message = '';

            // Include the error message as event label if it's available
            if( typeof error.data != "undefined" && typeof error.data.message != "undefined" ) {
                message = error.data.message;
            }

            WpakGoogleAnalytics.tracker.trackEvent( 'app', error.event, message );
        });

        /**
         * Track info events
         */
        App.on( 'info', function( info ) {
            var message = '';

            // If app version changed, include both old and new version into the event label
            if( info.event == 'app-version-changed' ) {
                message = info.data.stats.version_diff.last_version + ' => ' + info.data.stats.version_diff.current_version;
            }

            // Do nothing for 'no-content' info event, as an error should have been fired first and this one is unrelevant for Google Analytics
            if( info.event == 'no-content' ) {
                return;
            }

            WpakGoogleAnalytics.tracker.trackEvent( 'app', info.event, message );
        });

        /**
         * Track content refresh
         */
        App.on( 'refresh:start', function() {
            WpakGoogleAnalytics.tracker.trackEvent( 'app', 'refresh' );
        });
    }
});