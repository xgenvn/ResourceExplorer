<?php
/**
 * Build the setup options form.
 *
 * @package resource_explorer
 * @subpackage build
 */
/* set some default values */

/* get values based on mode */
switch ($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_INSTALL:
        $output = '<h2>Resource Explorer Installer</h2>
        <p>You\'re going to install Resource Explorer. It will take a while, don\'t be panic. </p><br />';
        break;
    case xPDOTransport::ACTION_UPGRADE:
    case xPDOTransport::ACTION_UNINSTALL:
        break;
}

return $output;