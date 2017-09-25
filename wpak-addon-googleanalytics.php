<?php
/*
  Plugin Name: WP-AppKit Google Analytics Addon
  Description: Track WP-AppKit application user statistics through Google Analytics
  Version: 1.1.0
 */

if ( !class_exists( 'WpAppKitGoogleAnalytics' ) ) {

    /**
     * Google Analytics addon main manager class.
     */
    class WpAppKitGoogleAnalytics {

        const slug = 'wpak-addon-googleanalytics';
        const i18n_domain = 'wpak-addon-googleanalytics';

        /**
         * Main entry point.
         *
         * Adds needed callbacks to some hooks.
         */
        public static function hooks() {
            add_filter( 'wpak_addons', array( __CLASS__, 'wpak_addons' ) );
            add_filter( 'wpak_default_phonegap_build_plugins', array( __CLASS__, 'wpak_default_phonegap_build_plugins' ), 10, 3 );
            add_action( 'plugins_loaded', array( __CLASS__, 'plugins_loaded' ) );
			add_filter( 'wpak_licenses', array( __CLASS__, 'add_license' ) );
        }

        /**
         * Attached to 'wpak_addons' hook.
         *
         * Filter available addons and register this one for all WP-AppKit applications.
         *
         * @param array             $addons            Available addons.
         *
         * @return array            $addons            Addons with Google Analytics (this one).
         */
        public static function wpak_addons( $addons ) {
            $addon = new WpakAddon( 'WP AppKit Google Analytics', self::slug );

            $addon->set_location( __FILE__ );

            $addon->add_js( 'js/wpak-googleanalytics.js', 'module' );
            $addon->add_js( 'js/wpak-googleanalytics-app.js', 'init', 'before' );

            $addon->require_php( dirname(__FILE__) .'/wpak-googleanalytics-bo-settings.php' );

            $addons[] = $addon;

            return $addons;
        }

        /**
         * Attached to 'wpak_default_phonegap_build_plugins' hook.
         *
         * Filter default plugins included into the PhoneGap Build config.xml file.
         *
         * @param array             $default_plugins            The default plugins.
         * @param string            $export_type                Export type : 'phonegap-build' or 'phonegap-cli'
         * @param int               $app_id                     The App ID.
         *
         * @return array            $default_plugins            Plugins with Google Analytics one in addition.
         */
        public static function wpak_default_phonegap_build_plugins( $default_plugins, $export_type, $app_id ) {
            if( WpakAddons::addon_activated_for_app( self::slug, $app_id ) ) {
                $default_plugins['cordova-plugin-google-analytics'] = array( 'spec' => '1.8.3', 'source' => 'npm' );
            }

            return $default_plugins;
        }

        /**
         * Attached to 'plugins_loaded' hook.
         *
         * Register the addon textdomain for string translations.
         */
        public static function plugins_loaded() {
            load_plugin_textdomain( self::i18n_domain, false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' );
        }

        /**
         * Register license management for this addon.
         *
         * @param array $licenses Licenses array given by WP-AppKit's core.
         * @return array
         */
        public static function add_license( $licenses ) {
            $licenses[] = array(
                'file' => __FILE__,
                'item_name' => 'WP-AppKit Google Analytics Addon',
                'version' => '1.0.1',
                'author' => 'Uncategorized Creations',
            );
            return $licenses;
        }
    }

    WpAppKitGoogleAnalytics::hooks();
}