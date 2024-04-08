/// <reference types="grecaptcha" />
import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnDestroy } from "@angular/core";
import { RecaptchaLoaderService } from "./recaptcha-loader.service";
import { RecaptchaSettings } from "./recaptcha-settings";
import * as i0 from "@angular/core";
export type NeverUndefined<T> = T extends undefined ? never : T;
export type RecaptchaErrorParameters = Parameters<NeverUndefined<ReCaptchaV2.Parameters["error-callback"]>>;
export declare class RecaptchaComponent implements AfterViewInit, OnDestroy {
    private elementRef;
    private loader;
    private zone;
    id: string;
    siteKey?: string;
    theme?: ReCaptchaV2.Theme;
    type?: ReCaptchaV2.Type;
    size?: ReCaptchaV2.Size;
    tabIndex?: number;
    badge?: ReCaptchaV2.Badge;
    errorMode: "handled" | "default";
    resolved: EventEmitter<string | null>;
    /**
     * @deprecated `(error) output will be removed in the next major version. Use (errored) instead
     */
    error: EventEmitter<[]>;
    errored: EventEmitter<[]>;
    /** @internal */
    private subscription;
    /** @internal */
    private widget;
    /** @internal */
    private grecaptcha;
    /** @internal */
    private executeRequested;
    constructor(elementRef: ElementRef<HTMLElement>, loader: RecaptchaLoaderService, zone: NgZone, settings?: RecaptchaSettings);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Executes the invisible recaptcha.
     * Does nothing if component's size is not set to "invisible".
     */
    execute(): void;
    reset(): void;
    /**
     * ⚠️ Warning! Use this property at your own risk!
     *
     * While this member is `public`, it is not a part of the component's public API.
     * The semantic versioning guarantees _will not be honored_! Thus, you might find that this property behavior changes in incompatible ways in minor or even patch releases.
     * You are **strongly advised** against using this property.
     * Instead, use more idiomatic ways to get reCAPTCHA value, such as `resolved` EventEmitter, or form-bound methods (ngModel, formControl, and the likes).å
     */
    get __unsafe_widgetValue(): string | null;
    /** @internal */
    private expired;
    /** @internal */
    private onError;
    /** @internal */
    private captchaResponseCallback;
    /** @internal */
    private grecaptchaReset;
    /** @internal */
    private renderRecaptcha;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecaptchaComponent, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecaptchaComponent, "re-captcha", ["reCaptcha"], { "id": { "alias": "id"; "required": false; }; "siteKey": { "alias": "siteKey"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "type": { "alias": "type"; "required": false; }; "size": { "alias": "size"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "badge": { "alias": "badge"; "required": false; }; "errorMode": { "alias": "errorMode"; "required": false; }; }, { "resolved": "resolved"; "error": "error"; "errored": "errored"; }, never, never, false, never>;
}
