# wpak-addon-googleanalytics
Addon to track WP-AppKit application user statistics through Google Analytics
This addon currently supports and is tested with iOS and Android only

## Usage to track custom data
You first need to require the addon script within your own script. Then, call `init` method and check its return: if it's false, you shouldn't call any of the tracker's methods because there probably has been an error (PhoneGap isn't loaded, config isn't complete or Google Analytics Cordova plugin isn't loaded). If it's true, you can use the tracker API to send your data to Google Analytics.