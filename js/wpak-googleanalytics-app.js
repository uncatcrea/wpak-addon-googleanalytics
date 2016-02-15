define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics', 'core/lib/hooks' ], function( App, WpakGoogleAnalytics, Hooks ) {
    var track = WpakGoogleAnalytics.init();

    if( track ) {
        /**
         * Track page views
         */
        App.on( 'screen:showed', function( current_screen, current_view ) {
            var screen_object = App.getCurrentScreenObject();
            var url = '(undefined)';

            switch( screen_object.screen_type ) {
                case 'list':
                    // "/archive/last-posts"
                    url = '/archive/' + screen_object.component_id;
                    break;
                case 'single':
                    // "/single/8/this-is-a-post"
                    url = '/single/' + screen_object.id + '/' + screen_object.slug;
                    break;
                case 'comments':
                    // "/single/8/this-is-a-post/comments"
                    url = '/single/' + screen_object.post.id + '/' + screen_object.post.slug + '/comments';
                    break;
                case 'page':
                    // "/page/component-slug-for-this-page/7/about-us"
                    // TODO: replace :component_id
                    url = '/page/:component_id/' + screen_object.id + '/' + screen_object.slug;
                    break;
                case 'custom-page':
                    // "/custom-page/login-page"
                    url = '/custom-page/' + screen_object.id;
                    break;
                case 'custom-component':
                    // TODO: complete this case
                    break;
            }

            WpakGoogleAnalytics.tracker.trackView( url );
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

            WpakGoogleAnalytics.tracker.trackEvent( category, action, label, value, context );
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
            else if( info.event == 'open-window' ) {
                label = info.data[0];
            }
            // Do nothing for 'no-content' info event, as an error should have been fired first and this one is unrelevant for Google Analytics
            else if( info.event == 'no-content' ) {
                return;
            }

            WpakGoogleAnalytics.tracker.trackEvent( category, action, label, value, context );
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

            WpakGoogleAnalytics.tracker.trackEvent( category, action, label, value, context );
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
                WpakGoogleAnalytics.tracker.trackEvent( category, action, label, value, context );
            }
        });
    }
});