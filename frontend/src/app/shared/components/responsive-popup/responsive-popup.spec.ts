import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ResponsivePopup } from "./responsive-popup";

describe("ResponsivePopup", () => {
  let component: ResponsivePopup;
  let fixture: ComponentFixture<ResponsivePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsivePopup]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsivePopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
