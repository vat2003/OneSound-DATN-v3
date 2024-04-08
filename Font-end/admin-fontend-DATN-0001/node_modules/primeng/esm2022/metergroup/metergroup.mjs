import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, NgModule, ViewEncapsulation, effect, forwardRef, inject, viewChild } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class MeterGroupLabel {
    value = null;
    labelPosition = 'end';
    labelOrientation = 'horizontal';
    min;
    max;
    iconTemplate;
    templates;
    get labelClass() {
        return {
            'p-metergroup-labels p-component': true,
            'p-metergroup-labels-vertical': this.labelOrientation === 'vertical',
            'p-metergroup-labels-horizontal': this.labelOrientation === 'horizontal'
        };
    }
    parentInstance = inject(forwardRef(() => MeterGroup));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroupLabel, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.2", type: MeterGroupLabel, selector: "p-meterGroupLabel", inputs: { value: "value", labelPosition: "labelPosition", labelOrientation: "labelOrientation", min: "min", max: "max", iconTemplate: "iconTemplate" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <ol [ngClass]="labelClass">
            <li *ngFor="let labelItem of value; let index = index; trackBy: parentInstance.trackByFn" class="p-metergroup-label">
                <ng-container *ngIf="!iconTemplate">
                    <i *ngIf="labelItem.icon" [class]="labelItem.icon" [ngClass]="{ 'p-metergroup-label-icon': true }" [ngStyle]="{ color: labelItem.color }"></i>
                    <span *ngIf="!labelItem.icon" class="p-metergroup-label-marker" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                </ng-container>
                <ng-container *ngTemplateOutlet="iconTemplate; context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                <span class="p-metergroup-label-text">{{ labelItem.label }} ({{ parentInstance?.percentValue(labelItem.value) }})</span>
            </li>
        </ol>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroupLabel, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-meterGroupLabel',
                    template: `
        <ol [ngClass]="labelClass">
            <li *ngFor="let labelItem of value; let index = index; trackBy: parentInstance.trackByFn" class="p-metergroup-label">
                <ng-container *ngIf="!iconTemplate">
                    <i *ngIf="labelItem.icon" [class]="labelItem.icon" [ngClass]="{ 'p-metergroup-label-icon': true }" [ngStyle]="{ color: labelItem.color }"></i>
                    <span *ngIf="!labelItem.icon" class="p-metergroup-label-marker" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                </ng-container>
                <ng-container *ngTemplateOutlet="iconTemplate; context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                <span class="p-metergroup-label-text">{{ labelItem.label }} ({{ parentInstance?.percentValue(labelItem.value) }})</span>
            </li>
        </ol>
    `
                }]
        }], propDecorators: { value: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], labelOrientation: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], iconTemplate: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
/**
 * MeterGroup displays scalar measurements within a known range.
 * @group Components
 */
export class MeterGroup {
    /**
     * Current value of the metergroup.
     * @group Props
     */
    value;
    /**
     * Mininum boundary value.
     * @group Props
     */
    min = 0;
    /**
     * Maximum boundary value.
     * @group Props
     */
    max = 100;
    /**
     * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    orientation = 'horizontal';
    /**
     * Specifies the label position of the component, valid values are 'start' and 'end'.
     * @group Props
     */
    labelPosition = 'end';
    /**
     * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    labelOrientation = 'horizontal';
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Style class of the element.
     * @group Props
     */
    styleClass;
    templates;
    get vertical() {
        return this.orientation === 'vertical';
    }
    get containerClass() {
        return {
            'p-metergroup p-component': true,
            'p-metergroup-horizontal': this.orientation === 'horizontal',
            'p-metergroup-vertical': this.orientation === 'vertical'
        };
    }
    labelTemplate;
    meterTemplate;
    endTemplate;
    startTemplate;
    iconTemplate;
    container = viewChild('container', { read: ElementRef });
    containerEffect = effect(() => {
        const _container = this.container();
        const height = DomHandler.getOuterHeight(_container.nativeElement);
        this.vertical && (this.container().nativeElement.style.height = height + 'px');
    });
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'label':
                    this.labelTemplate = item.template;
                    break;
                case 'meter':
                    this.meterTemplate = item.template;
                    break;
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
                default:
                    break;
            }
        });
    }
    percent(meter = 0) {
        const percentOfItem = ((meter - this.min) / (this.max - this.min)) * 100;
        return Math.round(Math.max(0, Math.min(100, percentOfItem)));
    }
    percentValue(meter) {
        return this.percent(meter) + '%';
    }
    meterStyle(val) {
        return {
            backgroundColor: val.color,
            width: this.orientation === 'horizontal' && this.percentValue(val.value),
            height: this.orientation === 'vertical' && this.percentValue(val.value)
        };
    }
    totalPercent() {
        return this.percent(this.value.reduce((total, val) => total + val.value, 0));
    }
    percentages() {
        let sum = 0;
        const sumsArray = [];
        this.value.forEach((item) => {
            sum += item.value;
            sumsArray.push(sum);
        });
        return sumsArray;
    }
    trackByFn(index) {
        return index;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.2", type: MeterGroup, selector: "p-meterGroup", inputs: { value: "value", min: "min", max: "max", orientation: "orientation", labelPosition: "labelPosition", labelOrientation: "labelOrientation", style: "style", styleClass: "styleClass" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true, read: ElementRef, isSignal: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass" role="meter" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="totalPercent()" [ngStyle]="style" [class]="styleClass">
            @if(labelPosition ==='start') {
            <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
            <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
            <ng-container *ngTemplateOutlet="startTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            <div class="p-metergroup-meters">
                <ng-container *ngFor="let meterItem of value; let index = index; trackBy: trackByFn">
                    <ng-container *ngTemplateOutlet="meterTemplate; context: { $implicit: meterItem, index: index, orientation: this.orientation, class: 'p-metergroup-meter', size: percentValue(meterItem.value), totalPercent: totalPercent() }">
                    </ng-container>
                    <ng-container *ngIf="!meterTemplate">
                        <span class="p-metergroup-meter" [ngStyle]="meterStyle(meterItem)"></span>
                    </ng-container>
                </ng-container>
            </div>
            <ng-container *ngTemplateOutlet="endTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            @if(labelPosition === 'end') {
            <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
            <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: MeterGroupLabel, selector: "p-meterGroupLabel", inputs: ["value", "labelPosition", "labelOrientation", "min", "max", "iconTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroup, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-meterGroup',
                    template: `
        <div #container [ngClass]="containerClass" role="meter" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="totalPercent()" [ngStyle]="style" [class]="styleClass">
            @if(labelPosition ==='start') {
            <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
            <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
            <ng-container *ngTemplateOutlet="startTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            <div class="p-metergroup-meters">
                <ng-container *ngFor="let meterItem of value; let index = index; trackBy: trackByFn">
                    <ng-container *ngTemplateOutlet="meterTemplate; context: { $implicit: meterItem, index: index, orientation: this.orientation, class: 'p-metergroup-meter', size: percentValue(meterItem.value), totalPercent: totalPercent() }">
                    </ng-container>
                    <ng-container *ngIf="!meterTemplate">
                        <span class="p-metergroup-meter" [ngStyle]="meterStyle(meterItem)"></span>
                    </ng-container>
                </ng-container>
            </div>
            <ng-container *ngTemplateOutlet="endTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            @if(labelPosition === 'end') {
            <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
            <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }]
        }], propDecorators: { value: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], orientation: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], labelOrientation: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class MeterGroupModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.2.2", ngImport: i0, type: MeterGroupModule, declarations: [MeterGroup, MeterGroupLabel], imports: [CommonModule, SharedModule], exports: [MeterGroup, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroupModule, imports: [CommonModule, SharedModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.2", ngImport: i0, type: MeterGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [MeterGroup, SharedModule],
                    declarations: [MeterGroup, MeterGroupLabel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0ZXJncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9tZXRlcmdyb3VwL21ldGVyZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBcUMsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hPLE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQWtCekMsTUFBTSxPQUFPLGVBQWU7SUFDZixLQUFLLEdBQVUsSUFBSSxDQUFDO0lBRXBCLGFBQWEsR0FBb0IsS0FBSyxDQUFDO0lBRXZDLGdCQUFnQixHQUE4QixZQUFZLENBQUM7SUFFM0QsR0FBRyxDQUFTO0lBRVosR0FBRyxDQUFTO0lBRVosWUFBWSxDQUErQjtJQUVwQixTQUFTLENBQXVDO0lBRWhGLElBQUksVUFBVTtRQUNWLE9BQU87WUFDSCxpQ0FBaUMsRUFBRSxJQUFJO1lBQ3ZDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxVQUFVO1lBQ3BFLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxZQUFZO1NBQzNFLENBQUM7SUFDTixDQUFDO0lBRUQsY0FBYyxHQUFlLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt1R0F2QnpELGVBQWU7MkZBQWYsZUFBZSwyT0FhUCxhQUFhLDZCQTFCcEI7Ozs7Ozs7Ozs7O0tBV1Q7OzJGQUVRLGVBQWU7a0JBZjNCLFNB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QUFVLEVBQUUsWUFBWSxDQUFDO29CQUNuQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDO2lCQUM5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYsIElucHV0LCBOZ01vZHVsZSwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbiwgZWZmZWN0LCBmb3J3YXJkUmVmLCBpbmplY3QsIHZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IE1ldGVySXRlbSB9IGZyb20gJy4vbWV0ZXJncm91cC5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtbWV0ZXJHcm91cExhYmVsJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8b2wgW25nQ2xhc3NdPVwibGFiZWxDbGFzc1wiPlxuICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBsYWJlbEl0ZW0gb2YgdmFsdWU7IGxldCBpbmRleCA9IGluZGV4OyB0cmFja0J5OiBwYXJlbnRJbnN0YW5jZS50cmFja0J5Rm5cIiBjbGFzcz1cInAtbWV0ZXJncm91cC1sYWJlbFwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhaWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpICpuZ0lmPVwibGFiZWxJdGVtLmljb25cIiBbY2xhc3NdPVwibGFiZWxJdGVtLmljb25cIiBbbmdDbGFzc109XCJ7ICdwLW1ldGVyZ3JvdXAtbGFiZWwtaWNvbic6IHRydWUgfVwiIFtuZ1N0eWxlXT1cInsgY29sb3I6IGxhYmVsSXRlbS5jb2xvciB9XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFsYWJlbEl0ZW0uaWNvblwiIGNsYXNzPVwicC1tZXRlcmdyb3VwLWxhYmVsLW1hcmtlclwiIFtuZ1N0eWxlXT1cInsgYmFja2dyb3VuZENvbG9yOiBsYWJlbEl0ZW0uY29sb3IgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaWNvblRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogbGFiZWxJdGVtLCBpY29uOiBsYWJlbEl0ZW0uaWNvbiB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1ldGVyZ3JvdXAtbGFiZWwtdGV4dFwiPnt7IGxhYmVsSXRlbS5sYWJlbCB9fSAoe3sgcGFyZW50SW5zdGFuY2U/LnBlcmNlbnRWYWx1ZShsYWJlbEl0ZW0udmFsdWUpIH19KTwvc3Bhbj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvb2w+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBNZXRlckdyb3VwTGFiZWwge1xuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnlbXSA9IG51bGw7XG5cbiAgICBASW5wdXQoKSBsYWJlbFBvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcgPSAnZW5kJztcblxuICAgIEBJbnB1dCgpIGxhYmVsT3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBASW5wdXQoKSBtaW46IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIG1heDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgaWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxQcmltZVRlbXBsYXRlPiB8IHVuZGVmaW5lZDtcblxuICAgIGdldCBsYWJlbENsYXNzKCk6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLW1ldGVyZ3JvdXAtbGFiZWxzIHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICdwLW1ldGVyZ3JvdXAtbGFiZWxzLXZlcnRpY2FsJzogdGhpcy5sYWJlbE9yaWVudGF0aW9uID09PSAndmVydGljYWwnLFxuICAgICAgICAgICAgJ3AtbWV0ZXJncm91cC1sYWJlbHMtaG9yaXpvbnRhbCc6IHRoaXMubGFiZWxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcGFyZW50SW5zdGFuY2U6IE1ldGVyR3JvdXAgPSBpbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNZXRlckdyb3VwKSk7XG59XG4vKipcbiAqIE1ldGVyR3JvdXAgZGlzcGxheXMgc2NhbGFyIG1lYXN1cmVtZW50cyB3aXRoaW4gYSBrbm93biByYW5nZS5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1tZXRlckdyb3VwJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICNjb250YWluZXIgW25nQ2xhc3NdPVwiY29udGFpbmVyQ2xhc3NcIiByb2xlPVwibWV0ZXJcIiBbYXR0ci5hcmlhLXZhbHVlbWluXT1cIm1pblwiIFthdHRyLmFyaWEtdmFsdWVtYXhdPVwibWF4XCIgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJ0b3RhbFBlcmNlbnQoKVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIEBpZihsYWJlbFBvc2l0aW9uID09PSdzdGFydCcpIHtcbiAgICAgICAgICAgIDxwLW1ldGVyR3JvdXBMYWJlbCAqbmdJZj1cIiFsYWJlbFRlbXBsYXRlXCIgW3ZhbHVlXT1cInZhbHVlXCIgW2xhYmVsUG9zaXRpb25dPVwibGFiZWxQb3NpdGlvblwiIFtsYWJlbE9yaWVudGF0aW9uXT1cImxhYmVsT3JpZW50YXRpb25cIiBbbWluXT1cIm1pblwiIFttYXhdPVwibWF4XCIgW2ljb25UZW1wbGF0ZV09XCJpY29uVGVtcGxhdGVcIiAvPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImxhYmVsVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2YWx1ZSwgdG90YWxQZXJjZW50OiB0b3RhbFBlcmNlbnQoKSwgcGVyY2VudGFnZXM6IHBlcmNlbnRhZ2VzKCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInN0YXJ0VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2YWx1ZSwgdG90YWxQZXJjZW50OiB0b3RhbFBlcmNlbnQoKSwgcGVyY2VudGFnZXM6IHBlcmNlbnRhZ2VzKCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWV0ZXJncm91cC1tZXRlcnNcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBtZXRlckl0ZW0gb2YgdmFsdWU7IGxldCBpbmRleCA9IGluZGV4OyB0cmFja0J5OiB0cmFja0J5Rm5cIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIm1ldGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBtZXRlckl0ZW0sIGluZGV4OiBpbmRleCwgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb24sIGNsYXNzOiAncC1tZXRlcmdyb3VwLW1ldGVyJywgc2l6ZTogcGVyY2VudFZhbHVlKG1ldGVySXRlbS52YWx1ZSksIHRvdGFsUGVyY2VudDogdG90YWxQZXJjZW50KCkgfVwiPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFtZXRlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWV0ZXJncm91cC1tZXRlclwiIFtuZ1N0eWxlXT1cIm1ldGVyU3R5bGUobWV0ZXJJdGVtKVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJlbmRUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHZhbHVlLCB0b3RhbFBlcmNlbnQ6IHRvdGFsUGVyY2VudCgpLCBwZXJjZW50YWdlczogcGVyY2VudGFnZXMoKSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICBAaWYobGFiZWxQb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIDxwLW1ldGVyR3JvdXBMYWJlbCAqbmdJZj1cIiFsYWJlbFRlbXBsYXRlXCIgW3ZhbHVlXT1cInZhbHVlXCIgW2xhYmVsUG9zaXRpb25dPVwibGFiZWxQb3NpdGlvblwiIFtsYWJlbE9yaWVudGF0aW9uXT1cImxhYmVsT3JpZW50YXRpb25cIiBbbWluXT1cIm1pblwiIFttYXhdPVwibWF4XCIgW2ljb25UZW1wbGF0ZV09XCJpY29uVGVtcGxhdGVcIiAvPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImxhYmVsVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2YWx1ZSwgdG90YWxQZXJjZW50OiB0b3RhbFBlcmNlbnQoKSwgcGVyY2VudGFnZXM6IHBlcmNlbnRhZ2VzKCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTWV0ZXJHcm91cCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIG1ldGVyZ3JvdXAuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdmFsdWU6IE1ldGVySXRlbVtdIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIE1pbmludW0gYm91bmRhcnkgdmFsdWUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwO1xuICAgIC8qKlxuICAgICAqIE1heGltdW0gYm91bmRhcnkgdmFsdWUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxMDA7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBsYXlvdXQgb2YgdGhlIGNvbXBvbmVudCwgdmFsaWQgdmFsdWVzIGFyZSAnaG9yaXpvbnRhbCcgYW5kICd2ZXJ0aWNhbCcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBsYWJlbCBwb3NpdGlvbiBvZiB0aGUgY29tcG9uZW50LCB2YWxpZCB2YWx1ZXMgYXJlICdzdGFydCcgYW5kICdlbmQnLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGxhYmVsUG9zaXRpb246ICdzdGFydCcgfCAnZW5kJyA9ICdlbmQnO1xuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyB0aGUgbGFiZWwgb3JpZW50YXRpb24gb2YgdGhlIGNvbXBvbmVudCwgdmFsaWQgdmFsdWVzIGFyZSAnaG9yaXpvbnRhbCcgYW5kICd2ZXJ0aWNhbCcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbGFiZWxPcmllbnRhdGlvbjogc3RyaW5nID0gJ2hvcml6b250YWwnO1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgZWxlbWVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgZWxlbWVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+IHwgdW5kZWZpbmVkO1xuXG4gICAgZ2V0IHZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICBnZXQgY29udGFpbmVyQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1tZXRlcmdyb3VwIHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICdwLW1ldGVyZ3JvdXAtaG9yaXpvbnRhbCc6IHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyxcbiAgICAgICAgICAgICdwLW1ldGVyZ3JvdXAtdmVydGljYWwnOiB0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbGFiZWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIG1ldGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBlbmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXJ0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBpY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBjb250YWluZXIgPSB2aWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiB9KTtcblxuICAgIGNvbnRhaW5lckVmZmVjdCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IF9jb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcigpO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KF9jb250YWluZXIubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMudmVydGljYWwgJiYgKHRoaXMuY29udGFpbmVyKCkubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnKTtcbiAgICB9KTtcblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXM/LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdsYWJlbCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFiZWxUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21ldGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlcmNlbnQobWV0ZXIgPSAwKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnRPZkl0ZW0gPSAoKG1ldGVyIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pKSAqIDEwMDtcblxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHBlcmNlbnRPZkl0ZW0pKSk7XG4gICAgfVxuICAgIHBlcmNlbnRWYWx1ZShtZXRlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5wZXJjZW50KG1ldGVyKSArICclJztcbiAgICB9XG4gICAgbWV0ZXJTdHlsZSh2YWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdmFsLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyAmJiB0aGlzLnBlcmNlbnRWYWx1ZSh2YWwudmFsdWUpLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnICYmIHRoaXMucGVyY2VudFZhbHVlKHZhbC52YWx1ZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB0b3RhbFBlcmNlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBlcmNlbnQodGhpcy52YWx1ZS5yZWR1Y2UoKHRvdGFsLCB2YWwpID0+IHRvdGFsICsgdmFsLnZhbHVlLCAwKSk7XG4gICAgfVxuXG4gICAgcGVyY2VudGFnZXMoKSB7XG4gICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICBjb25zdCBzdW1zQXJyYXkgPSBbXTtcblxuICAgICAgICB0aGlzLnZhbHVlLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN1bSArPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgc3Vtc0FycmF5LnB1c2goc3VtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1bXNBcnJheTtcbiAgICB9XG5cbiAgICB0cmFja0J5Rm4oaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbTWV0ZXJHcm91cCwgU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtNZXRlckdyb3VwLCBNZXRlckdyb3VwTGFiZWxdXG59KVxuZXhwb3J0IGNsYXNzIE1ldGVyR3JvdXBNb2R1bGUge31cbiJdfQ==