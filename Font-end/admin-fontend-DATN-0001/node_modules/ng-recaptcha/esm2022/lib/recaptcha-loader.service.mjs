import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, Optional, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { filter } from "rxjs/operators";
import { loader } from "./load-script";
import { RECAPTCHA_LOADER_OPTIONS, RECAPTCHA_BASE_URL, RECAPTCHA_LANGUAGE, RECAPTCHA_NONCE, RECAPTCHA_V3_SITE_KEY, } from "./tokens";
import * as i0 from "@angular/core";
function toNonNullObservable(subject) {
    return subject.asObservable().pipe(filter((value) => value !== null));
}
export class RecaptchaLoaderService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctcmVjYXB0Y2hhL3NyYy9saWIvcmVjYXB0Y2hhLWxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXhDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUNMLHdCQUF3QixFQUN4QixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBQ2xCLGVBQWUsRUFDZixxQkFBcUIsR0FFdEIsTUFBTSxVQUFVLENBQUM7O0FBRWxCLFNBQVMsbUJBQW1CLENBQUksT0FBa0M7SUFDaEUsT0FBTyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUdELE1BQU0sT0FBTyxzQkFBc0I7SUFDakM7OztPQUdHO2FBQ1ksVUFBSyxHQUF5RCxJQUFJLEFBQTdELENBQThEO0lBZWxGO0lBQ0Usd0RBQXdEO0lBQ2xCLFVBQWtCO0lBQ3hELG1EQUFtRDtJQUNYLFFBQWlCO0lBQ3pELG1EQUFtRDtJQUNYLE9BQWdCO0lBQ3hELG1EQUFtRDtJQUNkLEtBQWMsRUFDUixTQUFrQixFQUNmLE9BQWdDO1FBUnhDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFVeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUVELGdCQUFnQjtJQUNSLElBQUk7UUFDVixJQUFJLHNCQUFzQixDQUFDLEtBQUssRUFBRTtZQUNoQyxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdkMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FBK0IsSUFBSSxDQUFDLENBQUM7UUFDeEUsc0JBQXNCLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUV2QyxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRTtvQkFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdkM7Z0JBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFFNUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUM5QztnQkFFRCxPQUFPO29CQUNMLEdBQUcsRUFBRSxNQUFNO29CQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztpQkFDbEIsQ0FBQztZQUNKLENBQUM7WUFDRCxRQUFRLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDO2dCQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO29CQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzFDO2dCQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsQ0FBQztTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7OEdBbkZVLHNCQUFzQixrQkFzQnZCLFdBQVcsYUFFQyxrQkFBa0IsNkJBRWxCLGtCQUFrQiw2QkFFbEIsZUFBZSw2QkFDZixxQkFBcUIsNkJBQ3JCLHdCQUF3QjtrSEE5Qm5DLHNCQUFzQjs7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVTs7MEJBdUJOLE1BQU07MkJBQUMsV0FBVzs7MEJBRWxCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsa0JBQWtCOzswQkFFckMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxrQkFBa0I7OzBCQUVyQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLGVBQWU7OzBCQUNsQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs7MEJBQ3hDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsLCBQTEFURk9STV9JRCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5pbXBvcnQgeyBsb2FkZXIgfSBmcm9tIFwiLi9sb2FkLXNjcmlwdFwiO1xuaW1wb3J0IHtcbiAgUkVDQVBUQ0hBX0xPQURFUl9PUFRJT05TLFxuICBSRUNBUFRDSEFfQkFTRV9VUkwsXG4gIFJFQ0FQVENIQV9MQU5HVUFHRSxcbiAgUkVDQVBUQ0hBX05PTkNFLFxuICBSRUNBUFRDSEFfVjNfU0lURV9LRVksXG4gIFJlY2FwdGNoYUxvYWRlck9wdGlvbnMsXG59IGZyb20gXCIuL3Rva2Vuc1wiO1xuXG5mdW5jdGlvbiB0b05vbk51bGxPYnNlcnZhYmxlPFQ+KHN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxUIHwgbnVsbD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIHN1YmplY3QuYXNPYnNlcnZhYmxlKCkucGlwZShmaWx0ZXI8VD4oKHZhbHVlKSA9PiB2YWx1ZSAhPT0gbnVsbCkpO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVjYXB0Y2hhTG9hZGVyU2VydmljZSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHJlYWR5OiBCZWhhdmlvclN1YmplY3Q8UmVDYXB0Y2hhVjIuUmVDYXB0Y2hhIHwgbnVsbD4gfCBudWxsID0gbnVsbDtcblxuICBwdWJsaWMgcmVhZHk6IE9ic2VydmFibGU8UmVDYXB0Y2hhVjIuUmVDYXB0Y2hhPjtcblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgbGFuZ3VhZ2U/OiBzdHJpbmc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBiYXNlVXJsPzogc3RyaW5nO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgbm9uY2U/OiBzdHJpbmc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSB2M1NpdGVLZXk/OiBzdHJpbmc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvcHRpb25zPzogUmVjYXB0Y2hhTG9hZGVyT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcmVhZG9ubHkgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvblxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUkVDQVBUQ0hBX0xBTkdVQUdFKSBsYW5ndWFnZT86IHN0cmluZyxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb25cbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFJFQ0FQVENIQV9CQVNFX1VSTCkgYmFzZVVybD86IHN0cmluZyxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb25cbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFJFQ0FQVENIQV9OT05DRSkgbm9uY2U/OiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChSRUNBUFRDSEFfVjNfU0lURV9LRVkpIHYzU2l0ZUtleT86IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFJFQ0FQVENIQV9MT0FERVJfT1BUSU9OUykgb3B0aW9ucz86IFJlY2FwdGNoYUxvYWRlck9wdGlvbnMsXG4gICkge1xuICAgIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xuICAgIHRoaXMubm9uY2UgPSBub25jZTtcbiAgICB0aGlzLnYzU2l0ZUtleSA9IHYzU2l0ZUtleTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLmluaXQoKTtcbiAgICB0aGlzLnJlYWR5ID0gc3ViamVjdCA/IHRvTm9uTnVsbE9ic2VydmFibGUoc3ViamVjdCkgOiBvZigpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIGluaXQoKTogQmVoYXZpb3JTdWJqZWN0PFJlQ2FwdGNoYVYyLlJlQ2FwdGNoYSB8IG51bGw+IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoUmVjYXB0Y2hhTG9hZGVyU2VydmljZS5yZWFkeSkge1xuICAgICAgcmV0dXJuIFJlY2FwdGNoYUxvYWRlclNlcnZpY2UucmVhZHk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFJlQ2FwdGNoYVYyLlJlQ2FwdGNoYSB8IG51bGw+KG51bGwpO1xuICAgIFJlY2FwdGNoYUxvYWRlclNlcnZpY2UucmVhZHkgPSBzdWJqZWN0O1xuXG4gICAgbG9hZGVyLm5ld0xvYWRTY3JpcHQoe1xuICAgICAgdjNTaXRlS2V5OiB0aGlzLnYzU2l0ZUtleSxcbiAgICAgIG9uQmVmb3JlTG9hZDogKHVybCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zPy5vbkJlZm9yZUxvYWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm9uQmVmb3JlTG9hZCh1cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3VXJsID0gbmV3IFVSTCh0aGlzLmJhc2VVcmwgPz8gdXJsKTtcblxuICAgICAgICBpZiAodGhpcy5sYW5ndWFnZSkge1xuICAgICAgICAgIG5ld1VybC5zZWFyY2hQYXJhbXMuc2V0KFwiaGxcIiwgdGhpcy5sYW5ndWFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVybDogbmV3VXJsLFxuICAgICAgICAgIG5vbmNlOiB0aGlzLm5vbmNlLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIG9uTG9hZGVkOiAocmVjYXB0Y2hhKSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHJlY2FwdGNoYTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucz8ub25Mb2FkZWQpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMub3B0aW9ucy5vbkxvYWRlZChyZWNhcHRjaGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ViamVjdC5uZXh0KHZhbHVlKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3ViamVjdDtcbiAgfVxufVxuIl19