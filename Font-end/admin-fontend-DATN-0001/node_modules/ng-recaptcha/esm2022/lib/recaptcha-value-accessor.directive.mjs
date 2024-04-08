import { Directive, forwardRef, HostListener } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as i0 from "@angular/core";
import * as i1 from "./recaptcha.component";
export class RecaptchaValueAccessorDirective {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: RecaptchaValueAccessorDirective, deps: [{ token: i1.RecaptchaComponent }], target: i0.ɵɵFactoryTarget.Directive }); }
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
        }], ctorParameters: () => [{ type: i1.RecaptchaComponent }], propDecorators: { onResolve: [{
                type: HostListener,
                args: ["resolved", ["$event"]]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLXZhbHVlLWFjY2Vzc29yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXJlY2FwdGNoYS9zcmMvbGliL3JlY2FwdGNoYS12YWx1ZS1hY2Nlc3Nvci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBY3pFLE1BQU0sT0FBTywrQkFBK0I7SUFTMUMsWUFBb0IsSUFBd0I7UUFBeEIsU0FBSSxHQUFKLElBQUksQ0FBb0I7UUFGcEMsNEJBQXVCLEdBQUcsS0FBSyxDQUFDO0lBRU8sQ0FBQztJQUV6QyxVQUFVLENBQUMsS0FBYTtRQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNuQjthQUFNO1lBQ0wscUhBQXFIO1lBQ3JILG1HQUFtRztZQUNuRyx1SEFBdUg7WUFDdkgsK0dBQStHO1lBQy9HLHFFQUFxRTtZQUNyRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEtBQUssS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssS0FBSyxFQUFFO2dCQUNqRyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2FBQ3JDO1NBQ0Y7SUFDSCxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsRUFBMkI7UUFDakQsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUNNLGlCQUFpQixDQUFDLEVBQWM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUU0QyxTQUFTLENBQUMsTUFBYztRQUNuRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QjtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDOzhHQTVDVSwrQkFBK0I7a0dBQS9CLCtCQUErQiw0SkFUL0I7WUFDVDtnQkFDRSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLCtCQUErQixDQUFDO2FBQy9EO1NBQ0Y7OzJGQUdVLCtCQUErQjtrQkFWM0MsU0FBUzttQkFBQztvQkFDVCxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsS0FBSyxFQUFFLElBQUk7NEJBQ1gsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUM7eUJBQy9EO3FCQUNGO29CQUNELFFBQVEsRUFBRSx5RUFBeUU7aUJBQ3BGO3VGQXNDOEMsU0FBUztzQkFBckQsWUFBWTt1QkFBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIGZvcndhcmRSZWYsIEhvc3RMaXN0ZW5lciB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcblxuaW1wb3J0IHsgUmVjYXB0Y2hhQ29tcG9uZW50IH0gZnJvbSBcIi4vcmVjYXB0Y2hhLmNvbXBvbmVudFwiO1xuXG5ARGlyZWN0aXZlKHtcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJlY2FwdGNoYVZhbHVlQWNjZXNzb3JEaXJlY3RpdmUpLFxuICAgIH0sXG4gIF0sXG4gIHNlbGVjdG9yOiBcInJlLWNhcHRjaGFbZm9ybUNvbnRyb2xOYW1lXSxyZS1jYXB0Y2hhW2Zvcm1Db250cm9sXSxyZS1jYXB0Y2hhW25nTW9kZWxdXCIsXG59KVxuZXhwb3J0IGNsYXNzIFJlY2FwdGNoYVZhbHVlQWNjZXNzb3JEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBvblRvdWNoZWQ6ICgpID0+IHZvaWQ7XG5cbiAgcHJpdmF0ZSByZXF1aXJlc0NvbnRyb2xsZXJSZXNldCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogUmVjYXB0Y2hhQ29tcG9uZW50KSB7fVxuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICB0aGlzLmhvc3QucmVzZXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gdGhpcyBjYXNlLCBpdCBpcyBtb3N0IGxpa2VseSB0aGF0IGEgZm9ybSBjb250cm9sbGVyIGhhcyByZXF1ZXN0ZWQgdG8gd3JpdGUgYSBzcGVjaWZpYyB2YWx1ZSBpbnRvIHRoZSBjb21wb25lbnQuXG4gICAgICAvLyBUaGlzIGlzbid0IHJlYWxseSBhIHN1cHBvcnRlZCBjYXNlIC0gcmVDQVBUQ0hBIHZhbHVlcyBhcmUgc2luZ2xlLXVzZSwgYW5kLCBpbiBhIHNlbnNlLCByZWFkb25seS5cbiAgICAgIC8vIFdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHRoZSBmb3JtIGNvbnRyb2xsZXIgaGFzIHJlY2FwdGNoYSBjb250cm9sIHN0YXRlIG9mIFgsIHdoaWxlIHJlQ0FQVENIQSBpdHNlbGYgY2FuJ3QgXCJyZXN0b3JlXCJcbiAgICAgIC8vIHRvIHRoYXQgc3RhdGUuIEluIG9yZGVyIHRvIG1ha2UgZm9ybSBjb250cm9sbGVyIGF3YXJlIG9mIHRoaXMgZGlzY3JlcGFuY3ksIGFuZCB0byBmaXggdGhlIHNhaWQgbWlzYWxpZ25tZW50LFxuICAgICAgLy8gd2UnbGwgYmUgdGVsbGluZyB0aGUgY29udHJvbGxlciB0byBcInJlc2V0XCIgdGhlIHZhbHVlIGJhY2sgdG8gbnVsbC5cbiAgICAgIGlmICh0aGlzLmhvc3QuX191bnNhZmVfd2lkZ2V0VmFsdWUgIT09IHZhbHVlICYmIEJvb2xlYW4odGhpcy5ob3N0Ll9fdW5zYWZlX3dpZGdldFZhbHVlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5yZXF1aXJlc0NvbnRyb2xsZXJSZXNldCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICAgIGlmICh0aGlzLnJlcXVpcmVzQ29udHJvbGxlclJlc2V0KSB7XG4gICAgICB0aGlzLnJlcXVpcmVzQ29udHJvbGxlclJlc2V0ID0gZmFsc2U7XG4gICAgICB0aGlzLm9uQ2hhbmdlKG51bGwpO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcihcInJlc29sdmVkXCIsIFtcIiRldmVudFwiXSkgcHVibGljIG9uUmVzb2x2ZSgkZXZlbnQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKCRldmVudCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uVG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==