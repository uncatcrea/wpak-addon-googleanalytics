<?php

if ( !class_exists( 'WpakGoogleAnalyticsAdmin' ) ) {
    /**
     * Google Analytics backoffice forms manager class.
     */
    class WpakGoogleAnalyticsAdmin {
        /**
         * Main entry point.
         *
         * Adds needed callbacks to some hooks.
         */
        public static function hooks() {
            if( is_admin() ) {
                add_action( 'add_meta_boxes', array( __CLASS__, 'add_meta_boxes' ) );
                add_filter( 'wpak_default_options', array( __CLASS__, 'wpak_default_options' ) );
            }
        }

        /**
         * Attached to 'add_meta_boxes' hook.
         *
         * Register Google Analytics configuration meta box for WP-AppKit applications forms.
         */
        public static function add_meta_boxes() {
            add_meta_box(
                'wpak_googleanalytics_config',
                __( 'Google Analytics Configuration', WpAppKitGoogleAnalytics::i18n_domain ),
                array( __CLASS__, 'inner_config_box' ),
                'wpak_apps',
                'normal',
                'default'
            );
        }

        /**
         * Displays Google Analytics configuration meta box on backoffice form.
         *
         * @param WP_Post               $post           The app object.
         * @param array                 $current_box    The box settings.
         */
        public static function inner_config_box( $post, $current_box ) {
            $options = WpakOptions::get_app_options( $post->ID );
            ?>
            <!-- <a href="#" class="hide-if-no-js wpak_help"><?php _e( 'Help me', WpAppKitGoogleAnalytics::i18n_domain ); ?></a> -->
            <div class="wpak_settings field-group">
                <div class="field-group">
                    <label for="wpak_googleanalytics_trackingid"><?php _e( 'Tracking ID', WpAppKitGoogleAnalytics::i18n_domain ) ?></label>
                    <input id="wpak_googleanalytics_trackingid" type="text" name="wpak_app_options[googleanalytics][trackingid]" value="<?php echo $options['googleanalytics']['trackingid'] ?>" />
                    <span class="description"><?php // TODO: add a description here? _e( '', WpAppKitGoogleAnalytics::i18n_domain ) ?></span>
                </div>
                <div class="field-group fix-align">
                    <label for="wpak_googleanalytics_track_errors"><?php _e( 'Track errors', WpAppKitGoogleAnalytics::i18n_domain ) ?></label>
                    <input id="wpak_googleanalytics_track_errors" type="checkbox" name="wpak_app_options[googleanalytics][track_errors]" <?php echo !empty( $options['googleanalytics']['track_errors'] ) ? 'checked="checked"' : '' ?> value="1" />
                    <span class="description"><?php // TODO: add a description here? _e( '', WpAppKitGoogleAnalytics::i18n_domain ) ?></span>
                </div>
            </div>
            <?php
        }

        /**
         * Attached to 'wpak_default_options' hook.
         *
         * Filter default options available for an app in WP-AppKit.
         *
         * @param array             $default            The default options.
         *
         * @return array            $default            Options with Google Analytics keys.
         */
        public static function wpak_default_options( $default ) {
            $default['googleanalytics'] = array(
                'trackingid' => '',
                'track_errors' => true,
            );

            return $default;
        }

    }

    WpakGoogleAnalyticsAdmin::hooks();
}
