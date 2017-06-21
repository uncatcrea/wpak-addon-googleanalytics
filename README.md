# Google Analytics Addon for WP-AppKit
Addon to track WP-AppKit application user statistics through Google Analytics.  
This addon currently supports and is tested with iOS and Android only.

## HOW TO SETUP
First things first, this addon only works with Google Analytics: https://analytics.google.com  
You can see its documentation here for more details and features about mobile app configuration within Google Analytics: https://support.google.com/analytics/answer/2587086?hl=en

To be able to start tracking your WP-AppKit users, you only need a tracking ID associated with your Analytics app.

## WHAT'S TRACKED BY DEFAULT?
Google Analytics Addon for WP-AppKit is shipped with a default behaviour and will directly track the most common usage of a WP-AppKit app.

### Page views
* Single Page:
    * URL = `/page/:component_id/:page_id/:page_slug`
    * Example: `/page/my-pages/15/about-us`
* Archive post list:
    * URL = `/archive/:component_id`
    * Example: `/archive/last-posts`
* Single Post:
    * URL = `/single/:id/:slug`
    * Example: `/single/8/new-application`
* Comments:
    * URL = `/single/:post_id/:slug/comments`
    * Example: `/single/8/new-application/comments`
* Custom screen:
    * URL = `/custom/:component_id`
    * Example: `/custom/my-super-google-map`
* Custom page:
    * URL = `/custom-page/:component_id`
    * Example: `/custom-page/login-page`

### Events
* App Launch: triggered each time an user launches the app
    * Category = app
    * Action = launch
* App Launch After Update: triggered each time an user launches the app after having upgraded
    * Category = app
    * Action = launch-after-update
    * Label = _new version_ (ex: 3.9)
* App First Launch: triggered only the first time an user launches the app after install
    * Category = app
    * Action = app-first-launch
* User Refresh: triggered each time an user manually asks for a content refresh
    * Category = app
    * Action = user-refresh
* Comments Display: triggered each time an user clicks on a "Comments" link to go to the corresponding screen
    * Category = comments
    * Action = display
    * Label = _post ID_ (ex: 42)
* Single Display: triggered each time an user clicks on a "Post" link to go to the corresponding screen
    * Category = single
    * Action = display
    * Label = _post ID_ (ex: 42)
* Page Display: triggered each time an user clicks on a "Page" link to go to the corresponding screen
    * Category = page
    * Action = display
    * Label = _post ID_ (ex: 42)
* More Articles Display: triggered each time an user clicks on a "Get more" button within a post list component
    * Category = archive
    * Action = more-button
* Navigate to Previous Screen: triggered each time an user clicks on "back" button, or when `ThemeApp.navigateToPreviousScreen()` is called directly
    * Category = app
    * Action = navigate-to-previous-screen
* User Login: triggered each time an user correctly logs in
    * Category = app
    * Action = user-login
* User logout: triggered each time an user logs out, manually or not
    * Category = app
    * Action = user-logout
    * Label = _logout type_ (can be one of the following: normal, user-connection-expired, user-not-authenticated, unknown)
* Comment Posted: triggered each time a comment is correctly posted from an app
    * Category = comments
    * Action = comment-posted
    * Label = _post ID_ (ex: 42)
* Custom Info: triggered for each 'info' WP-AppKit event
    * Category = feedback
    * Action = info/_event name_ (ex: info/my-event)
    * Label = _event message_ (ex: This is a WP-AppKit info event message)
* Error: triggered for each 'error' WP-AppKit event
    * Category = feedback
    * Action = error/_error name_ (ex: auth:wrong-user)
    * Label = _error message_ (ex: Wrong user provided for authentication)

## USAGE TO TRACK CUSTOM DATA
You first need to require the addon script within your own script. Then, call `init` method and check its return: if it's false, you shouldn't call any of the tracker's methods because there probably has been an error (PhoneGap isn't loaded, config isn't complete or Google Analytics Cordova plugin isn't loaded). If it's true, you can use the tracker API to send your data to Google Analytics.

Example:

    define( [ 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics' ], function( WpakGoogleAnalytics ) {
        var track = WpakGoogleAnalytics.init();

        if( track ) {
            // You can now use WpakGoogleAnalytics object, especially WpakGoogleAnalytics.tracker.* API methods
        }
    });

## API
This addon provides you an API allowing you to interact with Google Analytics in your own way. As it's bound to cordova plugin named "google-analytics-plugin" (https://github.com/danwilson/google-analytics-plugin), some methods are exactly the same. Only the specific ones, or the ones that have been overwritten are described here.

Each of these methods are available through the `tracker` attribute within this addon's module object.

### trackView( url, context )
* Track a page view
* _url_: Should contain url variable to be sent to Google Analytics
* _context_: Should contain current_screen and current_view objects in corresponding attributes

Usage example:

    define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics' ], function( App, WpakGoogleAnalytics ) {
        var track = WpakGoogleAnalytics.init();

        if( track ) {
            App.on( 'screen:showed', function( current_screen, current_view ) {
                var context = {
                    'current_screen': current_screen,
                    'current_view': current_view
                };

                // The URL you want to see in Google Analytics console
                var url = 'My URL';

                WpakGoogleAnalytics.tracker.trackView( url, context );
            });
        }
    });

### trackEvent( category, action, label, value, context )
* Track an event
* _category_: Should contain category variable to be sent to Google Analytics
* _action_: Should contain action variable to be sent to Google Analytics
* _label_: Should contain label variable to be sent to Google Analytics
* _value_: Should contain value variable to be sent to Google Analytics
* _context_: Should contain event (String describing triggered event) and args (Array containing all context data, could be empty)

Usage example:

    define( [ 'core/theme-app', 'addons/wpak-addon-googleanalytics/js/wpak-googleanalytics' ], function( App, WpakGoogleAnalytics ) {
        var track = WpakGoogleAnalytics.init();

        if( track ) {
            App.on( 'dummy-event', function( event ) {
                var context = {
                    'event': 'dummy-event',
                    'args': [ 1, 2, 'third-arg' ]
                };

                // Data related to this event you want to see in Google Analytics console
                var category = 'Event category'; // Mandatory for the event to be stored
                var action = 'Event action'; // Mandatory for the event to be stored
                var label = 'Event label'; // Optional
                var value = 7; // Optional, should be numeric

                WpakGoogleAnalytics.tracker.trackEvent( category, action, label, value, context );
            });
        }
    });

## FILTERS
This addon is using 2 filters, thanks to WP-AppKit hook API (see http://uncategorized-creations.com/wp-appkit/doc/#2068-javascript-hooks).

### wpak-addon-googleanalytics-page-view-url
* Allow to modify the URL sent to Google Analytics in case of a Page View tracking
* _url_: Initial URL to be sent to Google Analytics
* _context_: Should contain current_screen and current_view objects in corresponding attributes

Usage example:

    define( [ 'core/theme-app' ], function( App ) {
        App.filter( 'wpak-addon-googleanalytics-page-view-url', function( url, context ) {
            return 'My new URL';
        });
    });

### wpak-addon-googleanalytics-event-args
* Allow to modify values sent to Google Analytics in case of an Event tracking
* _event_args_: Initial event values to be sent to Google Analytics: category, action, label, value
* _context_: Should contain event (String describing triggered event) and args (Array containing all context data, could be empty)

Usage example:

    define( [ 'core/theme-app' ], function( App ) {
        App.filter( 'wpak-addon-googleanalytics-event-args', function( event_args, context ) {
            return {
                category: 'New Category',
                action: 'New Action',
                label: 'New Label',
                value: 42,
            };
        });
    });