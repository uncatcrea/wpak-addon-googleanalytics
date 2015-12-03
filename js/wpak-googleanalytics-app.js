define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics' ], function( App, WpakGoogleAnalytics ) {
    WpakGoogleAnalytics.init();

    App.on( 'screen:showed', function( current_screen, current_view ) {
        // WpakGoogleAnalytics.tracker.trackView( 'Screen Title' )
        // WpakGoogleAnalytics.tracker.trackEvent( 'Category', 'Action', 'Label', Value )
    });
});