/*******************************************************************************
 * Copyright (C) 2013-2014 Martin Gill
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

/// <reference path="jquery.d.ts" />

interface JGrowlOptions
{
    /** Limit the number of messages appearing at a given time to the number in the pool. */
    pool?: number;

    /** Optional header to prefix the message, this is often helpful for associating messages to each other. */
    header?: string;

    /** A css class to be applied to notifications when they are created, useful for 'grouping' notifications by a css selector. */
    group?: string;

    /** When set to true a message will stick to the screen until it is intentionally closed by the user. */
    sticky?: boolean;

    /**
     * Designates a class which is applied to the jGrowl container and controls it's position on the screen.
     *  By Default there are five options available, top-left, top-right, bottom-left, bottom-right, center.
     *  This must be changed in the defaults before the startup method is called.
     */
    position?: string;

    /**
     * Designates whether a jGrowl notification should be appended to the container after all notifications,
     * or whether it should be prepended to the container before all notifications. Options are after or before.
     */
    glue?: string;

    /** A CSS class designating custom styling for this particular message, intended for use with jQuery UI. */
    theme?: string;

    /** A CSS class designating custom styling for this particular message and it's state, intended for use with jQuery UI. */
    themeState?: string;

    /** If the corners jQuery plugin is include this option specifies the curvature radius to be used for the notifications as they are created. */
    corners?: string;

    /**
      * The frequency that jGrowl should check for messages to be scrubbed from the screen.
      * This must be changed in the defaults before the startup method is called.
      */
    check?: number;

    /** The lifespan of a non-sticky message on the screen. */
    life?: number;

    /** The animation speed used to close a notification. */
    closeDuration?: string;

    /** The animation speed used to open a notification. */
    openDuration?: string;

    /** The easing method to be used with the animation for opening and closing a notification. */
    easing?: string;

    /**
     * Whether or not the close-all button should be used when more then one notification appears on the screen.
     * Optionally this property can be set to a function which will be used as a callback when the close all button
     * is clicked. This must be changed in the defaults before the startup method is called.
     */
    closer?: boolean;

    /**
     * This content is used for the individual notification close links that are added to the corner of a notification.
     * This must be changed in the defaults before the startup method is called.
     */
    closeTemplate?: string;

    /**
     * This content is used for the close-all link that is added to the bottom of a jGrowl container when it contains
     * more than one notification. This must be changed in the defaults before the startup method is called.
     */
    closerTemplate?: string;

    /**
     * Callback to be used before anything is done with the notification. This is intended to be used if the user
     * would like to have some type of logging mechanism for all notifications passed to jGrowl. This callback receives
     * the notification's DOM context, the notifications message and it's option object.
     */
    log?: (dom: any, message: string, options: JGrowlOptions) => void;

    /**
     * Callback to be used before a new notification is opened. This callback receives the notification's DOM context,
     * the notifications message and it's option object.
     */
    beforeOpen?: (dom: any, message: string, options: JGrowlOptions) => void;

    /**
     * Callback to be used after a new notification is opened. This callback receives the notification's DOM context,
     * the notifications message and it's option object.
     */
    afterOpen?: (dom: any, message: string, options: JGrowlOptions) => void;

    /**
     * Callback to be used when a new notification is opened. This callback receives the notification's DOM context,
     * the notifications message and it's option object.
     */
    open?: (dom: any, message: string, options: JGrowlOptions) => void;

    /**
     * Callback to be used before a new notification is closed. This callback receives the notification's DOM context,
     * the notifications message and it's option object.
     */
    beforeClose?: (dom: any, message: string, options: JGrowlOptions) => void;

    /**
     * Callback to be used when a new notification is closed. This callback receives the notification's DOM context,
     * the notifications message and it's option object.
     */
    close?: (dom: any, message: string, options: JGrowlOptions) => void;

    /**
     * The animation properties to use when opening a new notification (default to fadeOut).
     */
    animateOpen?: { opacity: string; };

    /**
     * The animation properties to use when closing a new notification (defaults to fadeIn).
     */
    animateClose?: { opacity: string; };
}

interface JGrowlStatic
{
    (message: string, options?: JGrowlOptions): void;
    defaults: JGrowlOptions;
}

interface JQueryStatic
{
    jGrowl: JGrowlStatic;
}
