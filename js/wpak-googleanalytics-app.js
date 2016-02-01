define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics' ], function( App, WpakGoogleAnalytics ) {
    WpakGoogleAnalytics.init();

    App.on( 'screen:showed', function( current_screen, current_view ) {
        // WpakGoogleAnalytics.tracker.trackView( 'Screen Title' )
    });

    App.on( 'error', function( error ) {
        var message = '';

        if( typeof error.data != "undefined" && typeof error.data.message != "undefined" ) {
            message = error.data.message;
        }

        WpakGoogleAnalytics.tracker.trackEvent( 'app', error.event, message );
    });

    App.on( 'info', function( info ) {
        var message = '';

        if( info.event == 'app-version-changed' ) {
            message = info.data.stats.version_diff.last_version + ' => ' + info.data.stats.version_diff.current_version;
        }

        WpakGoogleAnalytics.tracker.trackEvent( 'app', info.event, message );
    });

    App.on( 'refresh:start', function() {
        WpakGoogleAnalytics.tracker.trackEvent( 'app', 'refresh' );
    });
});