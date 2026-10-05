import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlobalFilterFab } from "./global-filter-fab";

describe("GlobalFilterFab", () => {
  let component: GlobalFilterFab;
  let fixture: ComponentFixture<GlobalFilterFab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalFilterFab]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalFilterFab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
