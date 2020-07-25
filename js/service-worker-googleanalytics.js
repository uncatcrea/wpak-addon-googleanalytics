/* Google Analytics for WP-AppKit */
if( 'function' === typeof importScripts ) {
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

    /* DEBUG */
    workbox.setConfig({
        debug:true
    });
    /* /DEBUG */

    workbox.googleAnalytics.initialize();
}
/* End of Google Analytics for WP-AppKit */