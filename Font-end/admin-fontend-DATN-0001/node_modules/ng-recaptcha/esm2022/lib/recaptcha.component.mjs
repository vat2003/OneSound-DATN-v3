import { Component, EventEmitter, HostBinding, Inject, Input, Optional, Output, } from "@angular/core";
import { RECAPTCHA_SETTINGS } from "./tokens";
import * as i0 from "@angular/core";
import * as i1 from "./recaptcha-loader.service";
let nextId = 0;
export class RecaptchaComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaComponent, deps: [{ token: i0.ElementRef }, { token: i1.RecaptchaLoaderService }, { token: i0.NgZone }, { token: RECAPTCHA_SETTINGS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.1", type: RecaptchaComponent, selector: "re-captcha", inputs: { id: "id", siteKey: "siteKey", theme: "theme", type: "type", size: "size", tabIndex: "tabIndex", badge: "badge", errorMode: "errorMode" }, outputs: { resolved: "resolved", error: "error", errored: "errored" }, host: { properties: { "attr.id": "this.id" } }, exportAs: ["reCaptcha"], ngImport: i0, template: ``, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaComponent, decorators: [{
            type: Component,
            args: [{
                    exportAs: "reCaptcha",
                    selector: "re-captcha",
                    template: ``,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.RecaptchaLoaderService }, { type: i0.NgZone }, { type: undefined, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXJlY2FwdGNoYS9zcmMvbGliL3JlY2FwdGNoYS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osV0FBVyxFQUNYLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUt2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxVQUFVLENBQUM7OztBQUU5QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFXZixNQUFNLE9BQU8sa0JBQWtCO0lBOEI3QixZQUNVLFVBQW1DLEVBQ25DLE1BQThCLEVBQzlCLElBQVksRUFDb0IsUUFBNEI7UUFINUQsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDbkMsV0FBTSxHQUFOLE1BQU0sQ0FBd0I7UUFDOUIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQTlCZixPQUFFLEdBQUcsZUFBZSxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBUXRCLGNBQVMsR0FBMEIsU0FBUyxDQUFDO1FBRTVDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUM5RDs7V0FFRztRQUNILDREQUE0RDtRQUMzQyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQTRCLENBQUM7UUFDckQsWUFBTyxHQUFHLElBQUksWUFBWSxFQUE0QixDQUFDO1FBaUJ0RSxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FB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a0Isc1ZBRm5CLEVBQUU7OzJGQUVELGtCQUFrQjtrQkFMOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSxFQUFFO2lCQUNiOzswQkFtQ0ksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxrQkFBa0I7eUNBL0JqQyxFQUFFO3NCQUZSLEtBQUs7O3NCQUNMLFdBQVc7dUJBQUMsU0FBUztnQkFHTixPQUFPO3NCQUF0QixLQUFLO2dCQUNVLEtBQUs7c0JBQXBCLEtBQUs7Z0JBQ1UsSUFBSTtzQkFBbkIsS0FBSztnQkFDVSxJQUFJO3NCQUFuQixLQUFLO2dCQUNVLFFBQVE7c0JBQXZCLEtBQUs7Z0JBQ1UsS0FBSztzQkFBcEIsS0FBSztnQkFDVSxTQUFTO3NCQUF4QixLQUFLO2dCQUVXLFFBQVE7c0JBQXhCLE1BQU07Z0JBS1UsS0FBSztzQkFBckIsTUFBTTtnQkFDVSxPQUFPO3NCQUF2QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJyeGpzXCI7XG5cbmltcG9ydCB7IFJlY2FwdGNoYUxvYWRlclNlcnZpY2UgfSBmcm9tIFwiLi9yZWNhcHRjaGEtbG9hZGVyLnNlcnZpY2VcIjtcbmltcG9ydCB7IFJlY2FwdGNoYVNldHRpbmdzIH0gZnJvbSBcIi4vcmVjYXB0Y2hhLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBSRUNBUFRDSEFfU0VUVElOR1MgfSBmcm9tIFwiLi90b2tlbnNcIjtcblxubGV0IG5leHRJZCA9IDA7XG5cbmV4cG9ydCB0eXBlIE5ldmVyVW5kZWZpbmVkPFQ+ID0gVCBleHRlbmRzIHVuZGVmaW5lZCA/IG5ldmVyIDogVDtcblxuZXhwb3J0IHR5cGUgUmVjYXB0Y2hhRXJyb3JQYXJhbWV0ZXJzID0gUGFyYW1ldGVyczxOZXZlclVuZGVmaW5lZDxSZUNhcHRjaGFWMi5QYXJhbWV0ZXJzW1wiZXJyb3ItY2FsbGJhY2tcIl0+PjtcblxuQENvbXBvbmVudCh7XG4gIGV4cG9ydEFzOiBcInJlQ2FwdGNoYVwiLFxuICBzZWxlY3RvcjogXCJyZS1jYXB0Y2hhXCIsXG4gIHRlbXBsYXRlOiBgYCxcbn0pXG5leHBvcnQgY2xhc3MgUmVjYXB0Y2hhQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgQEhvc3RCaW5kaW5nKFwiYXR0ci5pZFwiKVxuICBwdWJsaWMgaWQgPSBgbmdyZWNhcHRjaGEtJHtuZXh0SWQrK31gO1xuXG4gIEBJbnB1dCgpIHB1YmxpYyBzaXRlS2V5Pzogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgdGhlbWU/OiBSZUNhcHRjaGFWMi5UaGVtZTtcbiAgQElucHV0KCkgcHVibGljIHR5cGU/OiBSZUNhcHRjaGFWMi5UeXBlO1xuICBASW5wdXQoKSBwdWJsaWMgc2l6ZT86IFJlQ2FwdGNoYVYyLlNpemU7XG4gIEBJbnB1dCgpIHB1YmxpYyB0YWJJbmRleD86IG51bWJlcjtcbiAgQElucHV0KCkgcHVibGljIGJhZGdlPzogUmVDYXB0Y2hhVjIuQmFkZ2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBlcnJvck1vZGU6IFwiaGFuZGxlZFwiIHwgXCJkZWZhdWx0XCIgPSBcImRlZmF1bHRcIjtcblxuICBAT3V0cHV0KCkgcHVibGljIHJlc29sdmVkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmcgfCBudWxsPigpO1xuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgYChlcnJvcikgb3V0cHV0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uLiBVc2UgKGVycm9yZWQpIGluc3RlYWRcbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LW5hdGl2ZVxuICBAT3V0cHV0KCkgcHVibGljIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxSZWNhcHRjaGFFcnJvclBhcmFtZXRlcnM+KCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgZXJyb3JlZCA9IG5ldyBFdmVudEVtaXR0ZXI8UmVjYXB0Y2hhRXJyb3JQYXJhbWV0ZXJzPigpO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHdpZGdldDogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZ3JlY2FwdGNoYTogUmVDYXB0Y2hhVjIuUmVDYXB0Y2hhO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgZXhlY3V0ZVJlcXVlc3RlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgbG9hZGVyOiBSZWNhcHRjaGFMb2FkZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUkVDQVBUQ0hBX1NFVFRJTkdTKSBzZXR0aW5ncz86IFJlY2FwdGNoYVNldHRpbmdzLFxuICApIHtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgIHRoaXMuc2l0ZUtleSA9IHNldHRpbmdzLnNpdGVLZXk7XG4gICAgICB0aGlzLnRoZW1lID0gc2V0dGluZ3MudGhlbWU7XG4gICAgICB0aGlzLnR5cGUgPSBzZXR0aW5ncy50eXBlO1xuICAgICAgdGhpcy5zaXplID0gc2V0dGluZ3Muc2l6ZTtcbiAgICAgIHRoaXMuYmFkZ2UgPSBzZXR0aW5ncy5iYWRnZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkZXIucmVhZHkuc3Vic2NyaWJlKChncmVjYXB0Y2hhOiBSZUNhcHRjaGFWMi5SZUNhcHRjaGEpID0+IHtcbiAgICAgIGlmIChncmVjYXB0Y2hhICE9IG51bGwgJiYgZ3JlY2FwdGNoYS5yZW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICB0aGlzLmdyZWNhcHRjaGEgPSBncmVjYXB0Y2hhO1xuICAgICAgICB0aGlzLnJlbmRlclJlY2FwdGNoYSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIC8vIHJlc2V0IHRoZSBjYXB0Y2hhIHRvIGVuc3VyZSBpdCBkb2VzIG5vdCBsZWF2ZSBhbnl0aGluZyBiZWhpbmRcbiAgICAvLyBhZnRlciB0aGUgY29tcG9uZW50IGlzIG5vIGxvbmdlciBuZWVkZWRcbiAgICB0aGlzLmdyZWNhcHRjaGFSZXNldCgpO1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIGludmlzaWJsZSByZWNhcHRjaGEuXG4gICAqIERvZXMgbm90aGluZyBpZiBjb21wb25lbnQncyBzaXplIGlzIG5vdCBzZXQgdG8gXCJpbnZpc2libGVcIi5cbiAgICovXG4gIHB1YmxpYyBleGVjdXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNpemUgIT09IFwiaW52aXNpYmxlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy53aWRnZXQgIT0gbnVsbCkge1xuICAgICAgdm9pZCB0aGlzLmdyZWNhcHRjaGEuZXhlY3V0ZSh0aGlzLndpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlbGF5IGV4ZWN1dGlvbiBvZiByZWNhcHRjaGEgdW50aWwgaXQgYWN0dWFsbHkgcmVuZGVyc1xuICAgICAgdGhpcy5leGVjdXRlUmVxdWVzdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMud2lkZ2V0ICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmdyZWNhcHRjaGEuZ2V0UmVzcG9uc2UodGhpcy53aWRnZXQpKSB7XG4gICAgICAgIC8vIE9ubHkgZW1pdCBhbiBldmVudCBpbiBjYXNlIGlmIHNvbWV0aGluZyB3b3VsZCBhY3R1YWxseSBjaGFuZ2UuXG4gICAgICAgIC8vIFRoYXQgd2F5IHdlIGRvIG5vdCB0cmlnZ2VyIFwidG91Y2hpbmdcIiBvZiB0aGUgY29udHJvbCBpZiBzb21lb25lIGRvZXMgYSBcInJlc2V0XCJcbiAgICAgICAgLy8gb24gYSBub24tcmVzb2x2ZWQgY2FwdGNoYS5cbiAgICAgICAgdGhpcy5yZXNvbHZlZC5lbWl0KG51bGwpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdyZWNhcHRjaGFSZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDimqDvuI8gV2FybmluZyEgVXNlIHRoaXMgcHJvcGVydHkgYXQgeW91ciBvd24gcmlzayFcbiAgICpcbiAgICogV2hpbGUgdGhpcyBtZW1iZXIgaXMgYHB1YmxpY2AsIGl0IGlzIG5vdCBhIHBhcnQgb2YgdGhlIGNvbXBvbmVudCdzIHB1YmxpYyBBUEkuXG4gICAqIFRoZSBzZW1hbnRpYyB2ZXJzaW9uaW5nIGd1YXJhbnRlZXMgX3dpbGwgbm90IGJlIGhvbm9yZWRfISBUaHVzLCB5b3UgbWlnaHQgZmluZCB0aGF0IHRoaXMgcHJvcGVydHkgYmVoYXZpb3IgY2hhbmdlcyBpbiBpbmNvbXBhdGlibGUgd2F5cyBpbiBtaW5vciBvciBldmVuIHBhdGNoIHJlbGVhc2VzLlxuICAgKiBZb3UgYXJlICoqc3Ryb25nbHkgYWR2aXNlZCoqIGFnYWluc3QgdXNpbmcgdGhpcyBwcm9wZXJ0eS5cbiAgICogSW5zdGVhZCwgdXNlIG1vcmUgaWRpb21hdGljIHdheXMgdG8gZ2V0IHJlQ0FQVENIQSB2YWx1ZSwgc3VjaCBhcyBgcmVzb2x2ZWRgIEV2ZW50RW1pdHRlciwgb3IgZm9ybS1ib3VuZCBtZXRob2RzIChuZ01vZGVsLCBmb3JtQ29udHJvbCwgYW5kIHRoZSBsaWtlcykuw6VcbiAgICovXG4gIHB1YmxpYyBnZXQgX191bnNhZmVfd2lkZ2V0VmFsdWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMud2lkZ2V0ICE9IG51bGwgPyB0aGlzLmdyZWNhcHRjaGEuZ2V0UmVzcG9uc2UodGhpcy53aWRnZXQpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBleHBpcmVkKCkge1xuICAgIHRoaXMucmVzb2x2ZWQuZW1pdChudWxsKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkVycm9yKGFyZ3M6IFJlY2FwdGNoYUVycm9yUGFyYW1ldGVycykge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvblxuICAgIHRoaXMuZXJyb3IuZW1pdChhcmdzKTtcbiAgICB0aGlzLmVycm9yZWQuZW1pdChhcmdzKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBjYXB0Y2hhUmVzcG9uc2VDYWxsYmFjayhyZXNwb25zZTogc3RyaW5nKSB7XG4gICAgdGhpcy5yZXNvbHZlZC5lbWl0KHJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBncmVjYXB0Y2hhUmVzZXQoKSB7XG4gICAgaWYgKHRoaXMud2lkZ2V0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLmdyZWNhcHRjaGEucmVzZXQodGhpcy53aWRnZXQpKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgcmVuZGVyUmVjYXB0Y2hhKCkge1xuICAgIC8vIFRoaXMgYGFueWAgY2FuIGJlIHJlbW92ZWQgYWZ0ZXIgQHR5cGVzL2dyZWNhcHRjaGEgZ2V0IHVwZGF0ZWRcbiAgICBjb25zdCByZW5kZXJPcHRpb25zOiBSZUNhcHRjaGFWMi5QYXJhbWV0ZXJzID0ge1xuICAgICAgYmFkZ2U6IHRoaXMuYmFkZ2UsXG4gICAgICBjYWxsYmFjazogKHJlc3BvbnNlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmNhcHRjaGFSZXNwb25zZUNhbGxiYWNrKHJlc3BvbnNlKSk7XG4gICAgICB9LFxuICAgICAgXCJleHBpcmVkLWNhbGxiYWNrXCI6ICgpID0+IHtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmV4cGlyZWQoKSk7XG4gICAgICB9LFxuICAgICAgc2l0ZWtleTogdGhpcy5zaXRlS2V5LFxuICAgICAgc2l6ZTogdGhpcy5zaXplLFxuICAgICAgdGFiaW5kZXg6IHRoaXMudGFiSW5kZXgsXG4gICAgICB0aGVtZTogdGhpcy50aGVtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuZXJyb3JNb2RlID09PSBcImhhbmRsZWRcIikge1xuICAgICAgcmVuZGVyT3B0aW9uc1tcImVycm9yLWNhbGxiYWNrXCJdID0gKC4uLmFyZ3M6IFJlY2FwdGNoYUVycm9yUGFyYW1ldGVycykgPT4ge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMub25FcnJvcihhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMud2lkZ2V0ID0gdGhpcy5ncmVjYXB0Y2hhLnJlbmRlcih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgcmVuZGVyT3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy5leGVjdXRlUmVxdWVzdGVkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmV4ZWN1dGVSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZXhlY3V0ZSgpO1xuICAgIH1cbiAgfVxufVxuIl19