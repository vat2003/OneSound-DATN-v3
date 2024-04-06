import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentYoutubeComponent } from './comment-youtube.component';

describe('CommentYoutubeComponent', () => {
  let component: CommentYoutubeComponent;
  let fixture: ComponentFixture<CommentYoutubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentYoutubeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
