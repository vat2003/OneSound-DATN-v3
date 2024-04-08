import { NgModule } from "@angular/core";
import { RecaptchaCommonModule } from "./recaptcha-common.module";
import { RecaptchaLoaderService } from "./recaptcha-loader.service";
import { RecaptchaComponent } from "./recaptcha.component";
import * as i0 from "@angular/core";
export class RecaptchaModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXJlY2FwdGNoYS9zcmMvbGliL3JlY2FwdGNoYS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7QUFPM0QsTUFBTSxPQUFPLGVBQWU7OEdBQWYsZUFBZTsrR0FBZixlQUFlLFlBSGhCLHFCQUFxQixhQURyQixrQkFBa0I7K0dBSWpCLGVBQWUsYUFGZixDQUFDLHNCQUFzQixDQUFDLFlBRHpCLHFCQUFxQjs7MkZBR3BCLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQzdCLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNoQyxTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IFJlY2FwdGNoYUNvbW1vbk1vZHVsZSB9IGZyb20gXCIuL3JlY2FwdGNoYS1jb21tb24ubW9kdWxlXCI7XG5pbXBvcnQgeyBSZWNhcHRjaGFMb2FkZXJTZXJ2aWNlIH0gZnJvbSBcIi4vcmVjYXB0Y2hhLWxvYWRlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZWNhcHRjaGFDb21wb25lbnQgfSBmcm9tIFwiLi9yZWNhcHRjaGEuY29tcG9uZW50XCI7XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtSZWNhcHRjaGFDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbUmVjYXB0Y2hhQ29tbW9uTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbUmVjYXB0Y2hhTG9hZGVyU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIFJlY2FwdGNoYU1vZHVsZSB7fVxuIl19