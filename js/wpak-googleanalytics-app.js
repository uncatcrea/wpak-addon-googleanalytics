define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics', 'core/lib/hooks' ], function( App, WpakGoogleAnalytics, Hooks ) {
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
            var category = 'app';
            var action = error.event;
            var label = '';
            var value = null;
            var context = {
                event: 'error',
                args: [ error ]
            };

            // Include the error message as event label if it's available
            if( typeof error.data != "undefined" && typeof error.data.message != "undefined" ) {
                event_args.label = error.data.message;
            }

            WpakGoogleAnalytics.trackEvent( category, action, label, value, context );
        });

        /**
         * Track info events
         */
        App.on( 'info', function( info ) {
            var category = 'app';
            var action = info.event;
            var label = '';
            var value = null;
            var context = {
                event: 'info',
                args: [ info ]
            };

            // If app version changed, include both old and new version into the event label
            if( info.event == 'app-version-changed' ) {
                action = 'launch-after-update';
                label = info.data.stats.version_diff.current_version;
            }
            // app-ready event should be sent as 'launch' event, more explicit
            else if( info.event == 'app-ready' ) {
                action = 'launch';
            }
            else if( info.event == 'auth:user-login' ) {
                action = 'user-login';
            }
            // Send the type of logout with the event: normal, user-connection-expired, user-not-authenticated or unknown
            else if( info.event == 'auth:user-logout' ) {
                action = 'user-logout';
                label = info.data.logout_type;
            }
            else if( info.event == 'comment:posted' ) {
                category = 'comments';
                action = 'comment-posted';
            }
            else if( info.event == 'component:get-more' ) {
                category = 'archive';
                action = 'more-button';
            }
            // Do nothing for 'no-content' info event, as an error should have been fired first and this one is unrelevant for Google Analytics
            else if( info.event == 'no-content' ) {
                return;
            }

            WpakGoogleAnalytics.trackEvent( category, action, label, value, context );
        });

        /**
         * Track content refresh
         */
        App.on( 'refresh:start', function() {
            var category = 'app';
            var action = 'user-refresh';
            var label = '';
            var value = null;
            var context = {
                event: 'refresh:start',
                args: []
            };

            WpakGoogleAnalytics.trackEvent( category, action, label, value, context );
        });

        /**
         * Track clicks to go to some specific screens: single, page or comments
         */
        App.on( 'screen:leave', function( current_screen, queried_screen, current_view ) {
            var category = queried_screen.screen_type;
            var action = 'display';
            var label = queried_screen.item_id;
            var value = null;
            var context = {
                event: 'screen:leave',
                args: [ current_screen, queried_screen, current_view ]
            };

            if( queried_screen.screen_type == 'comments' || queried_screen.screen_type == 'single' || queried_screen.screen_type == 'page' ) {
                WpakGoogleAnalytics.trackEvent( category, action, label, value, context );
            }
        });
    }
});