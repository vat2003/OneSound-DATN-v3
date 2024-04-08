import { NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { RecaptchaLoaderService } from "./recaptcha-loader.service";
import * as i0 from "@angular/core";
export interface OnExecuteData {
    /**
     * The name of the action that has been executed.
     */
    action: string;
    /**
     * The token that reCAPTCHA v3 provided when executing the action.
     */
    token: string;
}
export interface OnExecuteErrorData {
    /**
     * The name of the action that has been executed.
     */
    action: string;
    /**
     * The error which was encountered
     */
    error: any;
}
/**
 * The main service for working with reCAPTCHA v3 APIs.
 *
 * Use the `execute` method for executing a single action, and
 * `onExecute` observable for listening to all actions at once.
 */
export declare class ReCaptchaV3Service {
    recaptchaLoader: RecaptchaLoaderService;
    /** @internal */
    private readonly siteKey;
    /** @internal */
    private readonly zone;
    /** @internal */
    private actionBacklog;
    /** @internal */
    private grecaptcha;
    /** @internal */
    private onExecuteSubject;
    /** @internal */
    private onExecuteErrorSubject;
    /** @internal */
    private onExecuteObservable;
    /** @internal */
    private onExecuteErrorObservable;
    constructor(zone: NgZone, recaptchaLoader: RecaptchaLoaderService, siteKey: string);
    get onExecute(): Observable<OnExecuteData>;
    get onExecuteError(): Observable<OnExecuteErrorData>;
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
    execute(action: string): Observable<string>;
    /** @internal */
    private executeActionWithSubject;
    /** @internal */
    private init;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReCaptchaV3Service, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ReCaptchaV3Service>;
}
