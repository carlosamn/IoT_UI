import {trigger, state, animate, style, transition} from '@angular/core';

export const routerTransitionSubComponent =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('routerTransitionSubComponent', [
    state('void', style({position:'fixed', width:'calc(100% - 262px)', height: '100%', overflow: 'scroll'}) ),
    state('*', style({position:'fixed', width:'calc(100% - 262px)',  height: '100%' , overflow: 'scroll'}) ),
    transition(':enter', [  // before 2.1: transition('void => *', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [  // before 2.1: transition('* => void', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);