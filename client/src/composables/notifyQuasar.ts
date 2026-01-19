export const enum notifyTypes {
  succ = 'positive',
  warn = 'warning',
  err  = 'negative'
}

export type TResponseMsg = {
  message: string,
  type   : notifyTypes
}

export const enum TNotifyDirections {
  top    = 'top',
  left   = 'left',
  center = 'center',
  right  = 'right',
  bottom = 'bottom'
}

import { Notify } from 'quasar'

export function useNotify() {

  function run (
    message: string,
    type: notifyTypes,
    direction?: TNotifyDirections
  ) {
    if(!direction) direction = TNotifyDirections.top
    Notify.create({
      message : message,
      color   : type,
      position: direction,
      progress: true,
      timeout : 3000,
      closeBtn: 'x'
    })
  }
  return {
    run
  }
}
