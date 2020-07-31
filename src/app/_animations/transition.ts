import {trigger, state, animate, style, transition} from '@angular/core';

export const routerTransition =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%', height: '100%'}) ),
    state('*', style({position:'fixed', width:'100%',  height: '100%'}) ),
    transition(':enter', [  // before 2.1: transition('void => *', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [  // before 2.1: transition('* => void', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);