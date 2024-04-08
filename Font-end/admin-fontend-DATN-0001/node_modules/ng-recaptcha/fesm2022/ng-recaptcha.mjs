import * as i0 from '@angular/core';
import { InjectionToken, PLATFORM_ID, Injectable, Inject, Optional, EventEmitter, Component, Input, HostBinding, Output, NgModule, forwardRef, Directive, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

/** @deprecated Use `LOADER_OPTIONS` instead. See `RecaptchaLoaderOptions.onBeforeLoad` */
const RECAPTCHA_LANGUAGE = new InjectionToken("recaptcha-language");
/** @deprecated Use `LOADER_OPTIONS` instead. See `RecaptchaLoaderOptions.onBeforeLoad` */
const RECAPTCHA_BASE_URL = new InjectionToken("recaptcha-base-url");
/** @deprecated Use `LOADER_OPTIONS` instead. See `RecaptchaLoaderOptions.onBeforeLoad` */
const RECAPTCHA_NONCE = new InjectionToken("recaptcha-nonce-tag");
const RECAPTCHA_SETTINGS = new InjectionToken("recaptcha-settings");
const RECAPTCHA_V3_SITE_KEY = new InjectionToken("recaptcha-v3-site-key");
/**
 * See the documentation for `RecaptchaLoaderOptions`.
 */
const RECAPTCHA_LOADER_OPTIONS = new InjectionToken("recaptcha-loader-options");

function loadScript(renderMode, onBeforeLoad, onLoaded, { url, lang, nonce } = {}) {
    window.ng2recaptchaloaded = () => {
        onLoaded(grecaptcha);
    };
    const script = document.createElement("script");
    script.innerHTML = "";
    const { url: baseUrl, nonce: onBeforeLoadNonce } = onBeforeLoad(new URL(url || "https://www.google.com/recaptcha/api.js"));
    baseUrl.searchParams.set("render", renderMode === "explicit" ? renderMode : renderMode.key);
    baseUrl.searchParams.set("onload", "ng2recaptchaloaded");
    baseUrl.searchParams.set("trustedtypes", "true");
    if (lang) {
        baseUrl.searchParams.set("hl", lang);
    }
    script.src = baseUrl.href;
    const nonceValue = onBeforeLoadNonce || nonce;
    if (nonceValue) {
        script.setAttribute("nonce", nonceValue);
    }
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}
function newLoadScript({ v3SiteKey, onBeforeLoad, onLoaded, }) {
    const renderMode = v3SiteKey ? { key: v3SiteKey } : "explicit";
    loader.loadScript(renderMode, onBeforeLoad, onLoaded);
}
const loader = { loadScript, newLoadScript };

function toNonNullObservable(subject) {
    return subject.asObservable().pipe(filter((value) => value !== null));
}
class RecaptchaLoaderService {
    /**
     * @internal
     * @nocollapse
     */
    static { this.ready = null; }
    constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    platformId, 
    // eslint-disable-next-line deprecation/deprecation
    language, 
    // eslint-disable-next-line deprecation/deprecation
    baseUrl, 
    // eslint-disable-next-line deprecation/deprecation
    nonce, v3SiteKey, options) {
        this.platformId = platformId;
        this.language = language;
        this.baseUrl = baseUrl;
        this.nonce = nonce;
        this.v3SiteKey = v3SiteKey;
        this.options = options;
        const subject = this.init();
        this.ready = subject ? toNonNullObservable(subject) : of();
    }
    /** @internal */
    init() {
        if (RecaptchaLoaderService.ready) {
            return RecaptchaLoaderService.ready;
        }
        if (!isPlatformBrowser(this.platformId)) {
            return undefined;
        }
        const subject = new BehaviorSubject(null);
        RecaptchaLoaderService.ready = subject;
        loader.newLoadScript({
            v3SiteKey: this.v3SiteKey,
            onBeforeLoad: (url) => {
                if (this.options?.onBeforeLoad) {
                    return this.options.onBeforeLoad(url);
                }
                const newUrl = new URL(this.baseUrl ?? url);
                if (this.language) {
                    newUrl.searchParams.set("hl", this.language);
                }
                return {
                    url: newUrl,
                    nonce: this.nonce,
                };
            },
            onLoaded: (recaptcha) => {
                let value = recaptcha;
                if (this.options?.onLoaded) {
                    value = this.options.onLoaded(recaptcha);
                }
                subject.next(value);
            },
        });
        return subject;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaLoaderService, deps: [{ token: PLATFORM_ID }, { token: RECAPTCHA_LANGUAGE, optional: true }, { token: RECAPTCHA_BASE_URL, optional: true }, { token: RECAPTCHA_NONCE, optional: true }, { token: RECAPTCHA_V3_SITE_KEY, optional: true }, { token: RECAPTCHA_LOADER_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaLoaderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaLoaderService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [RECAPTCHA_LANGUAGE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [RECAPTCHA_BASE_URL]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [RECAPTCHA_NONCE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [RECAPTCHA_V3_SITE_KEY]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [RECAPTCHA_LOADER_OPTIONS]
                }] }] });

let nextId = 0;
class RecaptchaComponent {
    constructor(elementRef, loader, zone, settings) {
        this.elementRef = elementRef;
        this.loader = loader;
        this.zone = zone;
        this.id = `ngrecaptcha-${nextId++}`;
        this.errorMode = "default";
        this.resolved = new EventEmitter();
        /**
         * @deprecated `(error) output will be removed in the next major version. Use (errored) instead
         */
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.error = new EventEmitter();
        this.errored = new EventEmitter();
        if (settings) {
            this.siteKey = settings.siteKey;
            this.theme = settings.theme;
            this.type = settings.type;
            this.size = settings.size;
            this.badge = settings.badge;
        }
    }
    ngAfterViewInit() {
        this.subscription = this.loader.ready.subscribe((grecaptcha) => {
            if (grecaptcha != null && grecaptcha.render instanceof Function) {
                this.grecaptcha = grecaptcha;
                this.renderRecaptcha();
            }
        });
    }
    ngOnDestroy() {
        // reset the captcha to ensure it does not leave anything behind
        // after the component is no longer needed
        this.grecaptchaReset();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * Executes the invisible recaptcha.
     * Does nothing if component's size is not set to "invisible".
     */
    execute() {
        if (this.size !== "invisible") {
            return;
        }
        if (this.widget != null) {
            void this.grecaptcha.execute(this.widget);
        }
        else {
            // delay execution of recaptcha until it actually renders
            this.executeRequested = true;
        }
    }
    reset() {
        if (this.widget != null) {
            if (this.grecaptcha.getResponse(this.widget)) {
                // Only emit an event in case if something would actually change.
                // That way we do not trigger "touching" of the control if someone does a "reset"
                // on a non-resolved captcha.
                this.resolved.emit(null);
            }
            this.grecaptchaReset();
        }
    }
    /**
     * ⚠️ Warning! Use this property at your own risk!
     *
     * While this member is `public`, it is not a part of the component's public API.
     * The semantic versioning guarantees _will not be honored_! Thus, you might find that this property behavior changes in incompatible ways in minor or even patch releases.
     * You are **strongly advised** against using this property.
     * Instead, use more idiomatic ways to get reCAPTCHA value, such as `resolved` EventEmitter, or form-bound methods (ngModel, formControl, and the likes).å
     */
    get __unsafe_widgetValue() {
        return this.widget != null ? this.grecaptcha.getResponse(this.widget) : null;
    }
    /** @internal */
    expired() {
        this.resolved.emit(null);
    }
    /** @internal */
    onError(args) {
        // eslint-disable-next-line deprecation/deprecation
        this.error.emit(args);
        this.errored.emit(args);
    }
    /** @internal */
    captchaResponseCallback(response) {
        this.resolved.emit(response);
    }
    /** @internal */
    grecaptchaReset() {
        if (this.widget != null) {
            this.zone.runOutsideAngular(() => this.grecaptcha.reset(this.widget));
        }
    }
    /** @internal */
    renderRecaptcha() {
        // This `any` can be removed after @types/grecaptcha get updated
        const renderOptions = {
            badge: this.badge,
            callback: (response) => {
                this.zone.run(() => this.captchaResponseCallback(response));
            },
            "expired-callback": () => {
                this.zone.run(() => this.expired());
            },
            sitekey: this.siteKey,
            size: this.size,
            tabindex: this.tabIndex,
            theme: this.theme,
            type: this.type,
        };
        if (this.errorMode === "handled") {
            renderOptions["error-callback"] = (...args) => {
                this.zone.run(() => this.onError(args));
            };
        }
        this.widget = this.grecaptcha.render(this.elementRef.nativeElement, renderOptions);
        if (this.executeRequested === true) {
            this.executeRequested = false;
            this.execute();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaComponent, deps: [{ token: i0.ElementRef }, { token: RecaptchaLoaderService }, { token: i0.NgZone }, { token: RECAPTCHA_SETTINGS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.1", type: RecaptchaComponent, selector: "re-captcha", inputs: { id: "id", siteKey: "siteKey", theme: "theme", type: "type", size: "size", tabIndex: "tabIndex", badge: "badge", errorMode: "errorMode" }, outputs: { resolved: "resolved", error: "error", errored: "errored" }, host: { properties: { "attr.id": "this.id" } }, exportAs: ["reCaptcha"], ngImport: i0, template: ``, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaComponent, decorators: [{
            type: Component,
            args: [{
                    exportAs: "reCaptcha",
                    selector: "re-captcha",
                    template: ``,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: RecaptchaLoaderService }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [RECAPTCHA_SETTINGS]
                }] }], propDecorators: { id: [{
                type: Input
            }, {
                type: HostBinding,
                args: ["attr.id"]
            }], siteKey: [{
                type: Input
            }], theme: [{
                type: Input
            }], type: [{
                type: Input
            }], size: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], badge: [{
                type: Input
            }], errorMode: [{
                type: Input
            }], resolved: [{
                type: Output
            }], error: [{
                type: Output
            }], errored: [{
                type: Output
            }] } });

class RecaptchaCommonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaCommonModule, declarations: [RecaptchaComponent], exports: [RecaptchaComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaCommonModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RecaptchaComponent],
                    exports: [RecaptchaComponent],
                }]
        }] });

class RecaptchaModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaModule, imports: [RecaptchaCommonModule], exports: [RecaptchaComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaModule, providers: [RecaptchaLoaderService], imports: [RecaptchaCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [RecaptchaComponent],
                    imports: [RecaptchaCommonModule],
                    providers: [RecaptchaLoaderService],
                }]
        }] });

/**
 * The main service for working with reCAPTCHA v3 APIs.
 *
 * Use the `execute` method for executing a single action, and
 * `onExecute` observable for listening to all actions at once.
 */
class ReCaptchaV3Service {
    constructor(zone, recaptchaLoader, siteKey) {
        this.recaptchaLoader = recaptchaLoader;
        this.zone = zone;
        this.siteKey = siteKey;
        this.init();
    }
    get onExecute() {
        if (!this.onExecuteSubject) {
            this.onExecuteSubject = new Subject();
            this.onExecuteObservable = this.onExecuteSubject.asObservable();
        }
        return this.onExecuteObservable;
    }
    get onExecuteError() {
        if (!this.onExecuteErrorSubject) {
            this.onExecuteErrorSubject = new Subject();
            this.onExecuteErrorObservable = this.onExecuteErrorSubject.asObservable();
        }
        return this.onExecuteErrorObservable;
    }
    /**
     * Executes the provided `action` with reCAPTCHA v3 API.
     * Use the emitted token value for verification purposes on the backend.
     *
     * For more information about reCAPTCHA v3 actions and tokens refer to the official documentation at
     * https://developers.google.com/recaptcha/docs/v3.
     *
     * @param {string} action the action to execute
     * @returns {Observable<string>} an `Observable` that will emit the reCAPTCHA v3 string `token` value whenever ready.
     * The returned `Observable` completes immediately after emitting a value.
     */
    execute(action) {
        const subject = new Subject();
        if (!this.grecaptcha) {
            if (!this.actionBacklog) {
                this.actionBacklog = [];
            }
            this.actionBacklog.push([action, subject]);
        }
        else {
            this.executeActionWithSubject(action, subject);
        }
        return subject.asObservable();
    }
    /** @internal */
    executeActionWithSubject(action, subject) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onError = (error) => {
            this.zone.run(() => {
                subject.error(error);
                if (this.onExecuteErrorSubject) {
                    // We don't know any better at this point, unfortunately, so have to resort to `any`
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    this.onExecuteErrorSubject.next({ action, error });
                }
            });
        };
        this.zone.runOutsideAngular(() => {
            try {
                this.grecaptcha.execute(this.siteKey, { action }).then((token) => {
                    this.zone.run(() => {
                        subject.next(token);
                        subject.complete();
                        if (this.onExecuteSubject) {
                            this.onExecuteSubject.next({ action, token });
                        }
                    });
                }, onError);
            }
            catch (e) {
                onError(e);
            }
        });
    }
    /** @internal */
    init() {
        this.recaptchaLoader.ready.subscribe((value) => {
            this.grecaptcha = value;
            if (this.actionBacklog && this.actionBacklog.length > 0) {
                this.actionBacklog.forEach(([action, subject]) => this.executeActionWithSubject(action, subject));
                this.actionBacklog = undefined;
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: ReCaptchaV3Service, deps: [{ token: i0.NgZone }, { token: RecaptchaLoaderService }, { token: RECAPTCHA_V3_SITE_KEY }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: ReCaptchaV3Service }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: ReCaptchaV3Service, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: RecaptchaLoaderService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [RECAPTCHA_V3_SITE_KEY]
                }] }] });

class RecaptchaV3Module {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaV3Module, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaV3Module }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaV3Module, providers: [ReCaptchaV3Service, RecaptchaLoaderService] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaV3Module, decorators: [{
            type: NgModule,
            args: [{
                    providers: [ReCaptchaV3Service, RecaptchaLoaderService],
                }]
        }] });

class RecaptchaValueAccessorDirective {
    constructor(host) {
        this.host = host;
        this.requiresControllerReset = false;
    }
    writeValue(value) {
        if (!value) {
            this.host.reset();
        }
        else {
            // In this case, it is most likely that a form controller has requested to write a specific value into the component.
            // This isn't really a supported case - reCAPTCHA values are single-use, and, in a sense, readonly.
            // What this means is that the form controller has recaptcha control state of X, while reCAPTCHA itself can't "restore"
            // to that state. In order to make form controller aware of this discrepancy, and to fix the said misalignment,
            // we'll be telling the controller to "reset" the value back to null.
            if (this.host.__unsafe_widgetValue !== value && Boolean(this.host.__unsafe_widgetValue) === false) {
                this.requiresControllerReset = true;
            }
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
        if (this.requiresControllerReset) {
            this.requiresControllerReset = false;
            this.onChange(null);
        }
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    onResolve($event) {
        if (this.onChange) {
            this.onChange($event);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaValueAccessorDirective, deps: [{ token: RecaptchaComponent }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.1", type: RecaptchaValueAccessorDirective, selector: "re-captcha[formControlName],re-captcha[formControl],re-captcha[ngModel]", host: { listeners: { "resolved": "onResolve($event)" } }, providers: [
            {
                multi: true,
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RecaptchaValueAccessorDirective),
            },
        ], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaValueAccessorDirective, decorators: [{
            type: Directive,
            args: [{
                    providers: [
                        {
                            multi: true,
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => RecaptchaValueAccessorDirective),
                        },
                    ],
                    selector: "re-captcha[formControlName],re-captcha[formControl],re-captcha[ngModel]",
                }]
        }], ctorParameters: () => [{ type: RecaptchaComponent }], propDecorators: { onResolve: [{
                type: HostListener,
                args: ["resolved", ["$event"]]
            }] } });

class RecaptchaFormsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaFormsModule, declarations: [RecaptchaValueAccessorDirective], imports: [FormsModule, RecaptchaCommonModule], exports: [RecaptchaValueAccessorDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaFormsModule, imports: [FormsModule, RecaptchaCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RecaptchaValueAccessorDirective],
                    exports: [RecaptchaValueAccessorDirective],
                    imports: [FormsModule, RecaptchaCommonModule],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { RECAPTCHA_BASE_URL, RECAPTCHA_LANGUAGE, RECAPTCHA_LOADER_OPTIONS, RECAPTCHA_NONCE, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaComponent, RecaptchaFormsModule, RecaptchaLoaderService, RecaptchaModule, RecaptchaV3Module, RecaptchaValueAccessorDirective };
//# sourceMappingURL=ng-recaptcha.mjs.map
