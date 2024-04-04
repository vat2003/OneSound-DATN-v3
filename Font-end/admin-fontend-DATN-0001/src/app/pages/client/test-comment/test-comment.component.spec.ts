import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCommentComponent } from './test-comment.component';

describe('TestCommentComponent', () => {
  let component: TestCommentComponent;
  let fixture: ComponentFixture<TestCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
