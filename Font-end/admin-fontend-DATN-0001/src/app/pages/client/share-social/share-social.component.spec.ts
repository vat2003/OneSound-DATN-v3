import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSocialComponent } from './share-social.component';

describe('ShareSocialComponent', () => {
  let component: ShareSocialComponent;
  let fixture: ComponentFixture<ShareSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareSocialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
