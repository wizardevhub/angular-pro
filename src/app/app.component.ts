import 'rxjs/add/operator/let';

import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './app.state';
import { AppConfig } from './app.config';
import { TitleService, PrimaryRouteComponent, DrawerRouteComponent, getRouterPath } from './core';

// App-wide Styles
import '../public/assets/css/main.css';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public title: string;
  public drawer: DrawerRouteComponent;

  @ViewChild('layout') private layout: ElementRef;
  @ViewChild('drawerButton') private drawerButton: ElementRef;

  constructor (
    private store$: Store<AppState>,
    private titleService: TitleService,
    private renderer: Renderer) { }

  ngOnInit() {
    // Run MDL after each navigation to update any new elements added
    this.store$
      .let(getRouterPath())
      .subscribe(() => {
        if ('componentHandler' in window) {
          window.componentHandler.upgradeAllRegistered();
        }
      });

    this.setHeaderTitle(AppConfig.NAME);
  }

  /**
   * Toggles current drawer state.
   *
   * It does this by triggering the click event of the MDL drawer button
   *  which we hide it in the markup.
   */
  toggleDrawer() {
    if (!this.drawer) {
      return false;
    }

    const layout: Element = this.layout.nativeElement;
    const drawerButton: Element = this.drawerButton.nativeElement;

    if (-1 === layout.className.indexOf('is-small-screen')) {
      return false;
    }

    this.renderer.invokeElementMethod(drawerButton, 'click');
  }

  /**
   * Updates header title.
   *
   *  @param title string The component title
   */
  setHeaderTitle(title: string) {
    this.title = title;
  }

  /**
   * Updates the page title after appending the site name to the
   *  component title.
   *
   *  @param title string The component title
   */
  setPageTitle(title: string) {
    let pageTitle = AppConfig.NAME;
    if (title) {
      pageTitle = title + ' - ' + pageTitle;
    }

    this.titleService.setTitle(pageTitle);
  }

  /**
   * Triggered when the main outlet is activated
   *
   * @param component PrimaryRouteComponent
   */
  onActivation(component: PrimaryRouteComponent) {
    this.setPageTitle(component.title);
  }

  /**
   * Triggered when the main outlet is deactivated
   *
   * @param component PageComponent
   */
  onDeactivation(component: PrimaryRouteComponent) { }

  /**
   * Triggered when the drawer outlet is activated
   *
   * @param component DrawerRouteComponent
   */
  onDrawerActivation(component: DrawerRouteComponent) {
    this.drawer = component;
  }

  /**
   * Triggered when the drawer outlet is deactivated
   *
   * @param component DrawerRouteComponent
   */
  onDrawerDeactivation(component: DrawerRouteComponent) {
    this.drawer = null;
  }
}
