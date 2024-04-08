import { Inject, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RECAPTCHA_V3_SITE_KEY } from "./tokens";
import * as i0 from "@angular/core";
import * as i1 from "./recaptcha-loader.service";
/**
 * The main service for working with reCAPTCHA v3 APIs.
 *
 * Use the `execute` method for executing a single action, and
 * `onExecute` observable for listening to all actions at once.
 */
export class ReCaptchaV3Service {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: ReCaptchaV3Service, deps: [{ token: i0.NgZone }, { token: i1.RecaptchaLoaderService }, { token: RECAPTCHA_V3_SITE_KEY }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: ReCaptchaV3Service }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: ReCaptchaV3Service, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i1.RecaptchaLoaderService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [RECAPTCHA_V3_SITE_KEY]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLXYzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1yZWNhcHRjaGEvc3JjL2xpYi9yZWNhcHRjaGEtdjMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7O0FBNEJqRDs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFtQjdCLFlBQ0UsSUFBWSxFQUNMLGVBQXVDLEVBQ2YsT0FBZTtRQUR2QyxvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFHOUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELElBQVcsU0FBUztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQztZQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ2pFO1FBRUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQVcsY0FBYztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQy9CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLE9BQU8sRUFBc0IsQ0FBQztZQUMvRCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFlBQVksRUFBRSxDQUFD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a0I7a0JBRDlCLFVBQVU7OzBCQXVCTixNQUFNOzJCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xuXG5pbXBvcnQgeyBSRUNBUFRDSEFfVjNfU0lURV9LRVkgfSBmcm9tIFwiLi90b2tlbnNcIjtcbmltcG9ydCB7IFJlY2FwdGNoYUxvYWRlclNlcnZpY2UgfSBmcm9tIFwiLi9yZWNhcHRjaGEtbG9hZGVyLnNlcnZpY2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBPbkV4ZWN1dGVEYXRhIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gdGhhdCBoYXMgYmVlbiBleGVjdXRlZC5cbiAgICovXG4gIGFjdGlvbjogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHRva2VuIHRoYXQgcmVDQVBUQ0hBIHYzIHByb3ZpZGVkIHdoZW4gZXhlY3V0aW5nIHRoZSBhY3Rpb24uXG4gICAqL1xuICB0b2tlbjogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9uRXhlY3V0ZUVycm9yRGF0YSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYWN0aW9uIHRoYXQgaGFzIGJlZW4gZXhlY3V0ZWQuXG4gICAqL1xuICBhY3Rpb246IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBlcnJvciB3aGljaCB3YXMgZW5jb3VudGVyZWRcbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGVycm9yOiBhbnk7XG59XG5cbnR5cGUgQWN0aW9uQmFja2xvZ0VudHJ5ID0gW3N0cmluZywgU3ViamVjdDxzdHJpbmc+XTtcblxuLyoqXG4gKiBUaGUgbWFpbiBzZXJ2aWNlIGZvciB3b3JraW5nIHdpdGggcmVDQVBUQ0hBIHYzIEFQSXMuXG4gKlxuICogVXNlIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGZvciBleGVjdXRpbmcgYSBzaW5nbGUgYWN0aW9uLCBhbmRcbiAqIGBvbkV4ZWN1dGVgIG9ic2VydmFibGUgZm9yIGxpc3RlbmluZyB0byBhbGwgYWN0aW9ucyBhdCBvbmNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVDYXB0Y2hhVjNTZXJ2aWNlIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHNpdGVLZXk6IHN0cmluZztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHpvbmU6IE5nWm9uZTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIGFjdGlvbkJhY2tsb2c6IEFjdGlvbkJhY2tsb2dFbnRyeVtdIHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZ3JlY2FwdGNoYTogUmVDYXB0Y2hhVjIuUmVDYXB0Y2hhO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkV4ZWN1dGVTdWJqZWN0OiBTdWJqZWN0PE9uRXhlY3V0ZURhdGE+O1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgb25FeGVjdXRlRXJyb3JTdWJqZWN0OiBTdWJqZWN0PE9uRXhlY3V0ZUVycm9yRGF0YT47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkV4ZWN1dGVPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPE9uRXhlY3V0ZURhdGE+O1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgb25FeGVjdXRlRXJyb3JPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPE9uRXhlY3V0ZUVycm9yRGF0YT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgem9uZTogTmdab25lLFxuICAgIHB1YmxpYyByZWNhcHRjaGFMb2FkZXI6IFJlY2FwdGNoYUxvYWRlclNlcnZpY2UsXG4gICAgQEluamVjdChSRUNBUFRDSEFfVjNfU0lURV9LRVkpIHNpdGVLZXk6IHN0cmluZyxcbiAgKSB7XG4gICAgdGhpcy56b25lID0gem9uZTtcbiAgICB0aGlzLnNpdGVLZXkgPSBzaXRlS2V5O1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IG9uRXhlY3V0ZSgpOiBPYnNlcnZhYmxlPE9uRXhlY3V0ZURhdGE+IHtcbiAgICBpZiAoIXRoaXMub25FeGVjdXRlU3ViamVjdCkge1xuICAgICAgdGhpcy5vbkV4ZWN1dGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8T25FeGVjdXRlRGF0YT4oKTtcbiAgICAgIHRoaXMub25FeGVjdXRlT2JzZXJ2YWJsZSA9IHRoaXMub25FeGVjdXRlU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vbkV4ZWN1dGVPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHVibGljIGdldCBvbkV4ZWN1dGVFcnJvcigpOiBPYnNlcnZhYmxlPE9uRXhlY3V0ZUVycm9yRGF0YT4ge1xuICAgIGlmICghdGhpcy5vbkV4ZWN1dGVFcnJvclN1YmplY3QpIHtcbiAgICAgIHRoaXMub25FeGVjdXRlRXJyb3JTdWJqZWN0ID0gbmV3IFN1YmplY3Q8T25FeGVjdXRlRXJyb3JEYXRhPigpO1xuICAgICAgdGhpcy5vbkV4ZWN1dGVFcnJvck9ic2VydmFibGUgPSB0aGlzLm9uRXhlY3V0ZUVycm9yU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vbkV4ZWN1dGVFcnJvck9ic2VydmFibGU7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGBhY3Rpb25gIHdpdGggcmVDQVBUQ0hBIHYzIEFQSS5cbiAgICogVXNlIHRoZSBlbWl0dGVkIHRva2VuIHZhbHVlIGZvciB2ZXJpZmljYXRpb24gcHVycG9zZXMgb24gdGhlIGJhY2tlbmQuXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHJlQ0FQVENIQSB2MyBhY3Rpb25zIGFuZCB0b2tlbnMgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24gYXRcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vcmVjYXB0Y2hhL2RvY3MvdjMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb24gdGhlIGFjdGlvbiB0byBleGVjdXRlXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPHN0cmluZz59IGFuIGBPYnNlcnZhYmxlYCB0aGF0IHdpbGwgZW1pdCB0aGUgcmVDQVBUQ0hBIHYzIHN0cmluZyBgdG9rZW5gIHZhbHVlIHdoZW5ldmVyIHJlYWR5LlxuICAgKiBUaGUgcmV0dXJuZWQgYE9ic2VydmFibGVgIGNvbXBsZXRlcyBpbW1lZGlhdGVseSBhZnRlciBlbWl0dGluZyBhIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIGV4ZWN1dGUoYWN0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgaWYgKCF0aGlzLmdyZWNhcHRjaGEpIHtcbiAgICAgIGlmICghdGhpcy5hY3Rpb25CYWNrbG9nKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uQmFja2xvZyA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFjdGlvbkJhY2tsb2cucHVzaChbYWN0aW9uLCBzdWJqZWN0XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXhlY3V0ZUFjdGlvbldpdGhTdWJqZWN0KGFjdGlvbiwgc3ViamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZXhlY3V0ZUFjdGlvbldpdGhTdWJqZWN0KGFjdGlvbjogc3RyaW5nLCBzdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4pOiB2b2lkIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHN1YmplY3QuZXJyb3IoZXJyb3IpO1xuICAgICAgICBpZiAodGhpcy5vbkV4ZWN1dGVFcnJvclN1YmplY3QpIHtcbiAgICAgICAgICAvLyBXZSBkb24ndCBrbm93IGFueSBiZXR0ZXIgYXQgdGhpcyBwb2ludCwgdW5mb3J0dW5hdGVseSwgc28gaGF2ZSB0byByZXNvcnQgdG8gYGFueWBcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50XG4gICAgICAgICAgdGhpcy5vbkV4ZWN1dGVFcnJvclN1YmplY3QubmV4dCh7IGFjdGlvbiwgZXJyb3IgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5ncmVjYXB0Y2hhLmV4ZWN1dGUodGhpcy5zaXRlS2V5LCB7IGFjdGlvbiB9KS50aGVuKCh0b2tlbjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBzdWJqZWN0Lm5leHQodG9rZW4pO1xuICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMub25FeGVjdXRlU3ViamVjdCkge1xuICAgICAgICAgICAgICB0aGlzLm9uRXhlY3V0ZVN1YmplY3QubmV4dCh7IGFjdGlvbiwgdG9rZW4gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIG9uRXJyb3IpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBvbkVycm9yKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIGluaXQoKSB7XG4gICAgdGhpcy5yZWNhcHRjaGFMb2FkZXIucmVhZHkuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5ncmVjYXB0Y2hhID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5hY3Rpb25CYWNrbG9nICYmIHRoaXMuYWN0aW9uQmFja2xvZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uQmFja2xvZy5mb3JFYWNoKChbYWN0aW9uLCBzdWJqZWN0XSkgPT4gdGhpcy5leGVjdXRlQWN0aW9uV2l0aFN1YmplY3QoYWN0aW9uLCBzdWJqZWN0KSk7XG4gICAgICAgIHRoaXMuYWN0aW9uQmFja2xvZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19