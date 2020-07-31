import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QsoMainDashboardComponent } from './qso-maindashboard.component';
import { DragulaService } from 'ng2-dragula';
import { QSOService } from '../qso.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AppSharedService } from '../../../app.shared-service';
import { AppHTTPService } from '../../../app.http-service';


fdescribe('QsoMaindashboardComponent', () => {

    let component: QsoMainDashboardComponent;
    let fixture: ComponentFixture<QsoMainDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule],
            declarations: [QsoMainDashboardComponent],
            providers: [DragulaService, QSOService, HttpClient, HttpClientModule, AppSharedService, AppHTTPService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QsoMainDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show loading gif at first', () => {
      expect(component).toBeTruthy();
  });




});
