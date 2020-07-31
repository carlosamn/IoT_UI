import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppSharedService } from '../../../app.shared-service';
import * as routeDashboard from '../../routing-dashboards';


@Component({
  selector: 'app-private-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortCutComponent implements OnInit, OnDestroy {
  public currentComponent;
  public subcomponent;
  public shortcutMenu;
  public url;
  private SUBS: any;
  constructor(private router: Router, private sharedService: AppSharedService) {
    this.shortcutMenu = [];
    this.SUBS = {};
  }

    ngOnInit() {
        const paths = this.router.url.split('/');
        let route = '';
        let slash = '';
        var i = 2;
        while (i < paths.length) {
            route = `${route}${paths[i]}${i === paths.length-1 ? '': '/'}`;
            i++;
        }

        this.setActiveRoute(route);
    }

    shortCutPagesConfiguration() {
        return new Promise((resolve: Function, reject: Function) => {
            //  Trae los dashboardpages, previamente consumidos del user (backend)
            this.SUBS.currentPages = this.sharedService.currentShortcutPages.subscribe(pages => {

              //  routeDashboard es el archivo de rutas que ya vimos
              let dashboards = routeDashboard.dashboards;

              //  Definimos una variable route vacia
              let route;
              //  Damos vuelta en cada dashboardpage, y buscamos su routedashboard del archivo, asi generamos su ruta
              pages.map(res => {

                route = dashboards.find(x => x.page == res['page']);
                //  Asignamos su ruta
                res['route'] = route.url;
                res['isActive'] = route.isActive;
              });

              //  Pusheamos y ya tenemos el array con "pagina, icono y ruta dinamicamente"
              this.shortcutMenu = pages;
            });

            let arrayRoutes = this.router.url.split('/');
            this.currentComponent = arrayRoutes[2];
            this.subcomponent = arrayRoutes[3] || '';
        });
    }

    navigate(route) {
        let currentProject = this.router.url.split('/')[1];
        let fullRoute = [currentProject];
        let parsedRoute = route.split('/');
        this.setActiveRoute(route);

        parsedRoute.map(route => {
          fullRoute.push(route);
        });

        this.router.navigate(fullRoute);
    }

    async setActiveRoute(route) {
         routeDashboard.dashboards.forEach(routeDashboard => {
            if (routeDashboard.url === route) {
                routeDashboard.isActive = true;
            } else {
                routeDashboard.isActive = false;
            }
        });
        await this.shortCutPagesConfiguration();
    }

    ngOnDestroy() {
        
    }

}
