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
            var event_args = {
                category: 'app',
                action: error.event,
                label: ''
            };
            var context = {
                event: 'error',
                args: [ error ]
            };

            // Include the error message as event label if it's available
            if( typeof error.data != "undefined" && typeof error.data.message != "undefined" ) {
                event_args.label = error.data.message;
            }

            WpakGoogleAnalytics.trackEvent( event_args, context );
        });

        /**
         * Track info events
         */
        App.on( 'info', function( info ) {
            var event_args = {
                category: 'app',
                action: info.event,
                label: ''
            };
            var context = {
                event: 'info',
                args: [ info ]
            };

            // If app version changed, include both old and new version into the event label
            if( info.event == 'app-version-changed' ) {
                event_args.action = 'launch-after-update';
                event_args.label = info.data.stats.version_diff.current_version;
            }
            // app-ready event should be sent as 'launch' event, more explicit
            else if( info.event == 'app-ready' ) {
                event_args.action = 'launch';
            }
            else if( info.event == 'auth:user-login' ) {
                event_args.action = 'user-login';
            }
            // Send the type of logout with the event: normal, user-connection-expired, user-not-authenticated or unknown
            else if( info.event == 'auth:user-logout' ) {
                event_args.action = 'user-logout';
                event_args.label = info.data.logout_type;
            }
            else if( info.event == 'comment:posted' ) {
                event_args.category = 'comments';
                event_args.action = 'comment-posted';
            }
            else if( info.event == 'component:get-more' ) {
                event_args.category = 'archive';
                event_args.action = 'more-button';
            }
            // Do nothing for 'no-content' info event, as an error should have been fired first and this one is unrelevant for Google Analytics
            else if( info.event == 'no-content' ) {
                return;
            }

            WpakGoogleAnalytics.trackEvent( event_args, context );
        });

        /**
         * Track content refresh
         */
        App.on( 'refresh:start', function() {
            var event_args = {
                category: 'app',
                action: 'user-refresh',
                label: ''
            };
            var context = {
                event: 'refresh:start',
                args: []
            };

            WpakGoogleAnalytics.trackEvent( event_args, context );
        });

        /**
         * Track clicks to go to some specific screens: single, page or comments
         */
        App.on( 'screen:leave', function( current_screen, queried_screen, current_view ) {
            var event_args = {
                category: queried_screen.screen_type,
                action: 'display',
                label: queried_screen.item_id
            };
            var context = {
                event: 'screen:leave',
                args: [ current_screen, queried_screen, current_view ]
            };

            if( queried_screen.screen_type == 'comments' || queried_screen.screen_type == 'single' || queried_screen.screen_type == 'page' ) {
                WpakGoogleAnalytics.trackEvent( event_args, context );
            }
        });
    }
});