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
            var event_id = info.event;
            var category = 'app';

            // If app version changed, include both old and new version into the event label
            if( info.event == 'app-version-changed' ) {
                event_id = 'launch-after-update';
                message = info.data.stats.version_diff.current_version;
            }
            // app-ready event should be sent as 'launch' event, more explicit
            else if( info.event == 'app-ready' ) {
                event_id = 'launch';
            }
            else if( info.event == 'auth:user-login' ) {
                event_id = 'user-login';
            }
            // Send the type of logout with the event: normal, user-connection-expired, user-not-authenticated or unknown
            else if( info.event == 'auth:user-logout' ) {
                event_id = 'user-logout';
                message = info.data.logout_type;
            }
            else if( info.event == 'comment:posted' ) {
                category = 'comments';
                event_id = 'comment-posted';
            }
            // Do nothing for 'no-content' info event, as an error should have been fired first and this one is unrelevant for Google Analytics
            else if( info.event == 'no-content' ) {
                return;
            }

            WpakGoogleAnalytics.tracker.trackEvent( category, event_id, message );
        });

        /**
         * Track content refresh
         */
        App.on( 'refresh:start', function() {
            WpakGoogleAnalytics.tracker.trackEvent( 'app', 'user-refresh' );
        });

        /**
         * Track clicks to go to some specific screens: single, page or comments
         */
        App.on( 'screen:leave', function( current_screen, queried_screen, current_view ) {
            if( queried_screen.screen_type == 'comments' || queried_screen.screen_type == 'single' || queried_screen.screen_type == 'page' ) {
                WpakGoogleAnalytics.tracker.trackEvent( queried_screen.screen_type, 'display', queried_screen.item_id );
            }
        });
    }
});