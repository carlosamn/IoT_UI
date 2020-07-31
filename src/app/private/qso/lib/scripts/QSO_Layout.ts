


/**
 **
 * @param
 * @throws
 * @return
 * *
*/
    export function get_devices_with_qso_layout(devices) {

      const devices_with_qso_layout_no_repeat = [];
      const devices_with_qso_layout_repeated = [];

      const layouts = [{
        containerIndex : -1,
        itemIndex : -1
      }];

      const devices_with_qso_layout = devices.filter( device => {
        if (device.layout.containerIndex !== -1 && device.layout.itemIndex !== -1) {
          return device;
        }
      });

      devices_with_qso_layout.map( (device, k_device) => {

        const device_layout = device.layout;
        const devices_same_layout = layouts.filter( layout => {
          const isSameContainer = layout.containerIndex === device_layout.containerIndex;
          const isSameIndex = layout.itemIndex === device_layout.itemIndex;
          return (isSameContainer) && (isSameIndex);
        });
        const devices_same_layout_count = devices_same_layout.map( same_device => same_device).length;

        if ( devices_same_layout_count > 0) {
          devices_with_qso_layout_repeated.push(device);
        } else {
          layouts.push(device_layout);
          devices_with_qso_layout_no_repeat.push(device);
        }

      });

      devices_with_qso_layout_repeated.map( device => {
        device.layout.containerIndex = -1;
        device.layout.itemIndex = -1;
      });

      return {
        repeated : devices_with_qso_layout_repeated,
        no_repeated: devices_with_qso_layout_no_repeat
      };
    }




/**
 **
 * @param
 * @throws
 * @return
 * *
*/
export function get_devices_without_qso_layout(devices) {
  return devices.filter( device => {
    if (device.layout.containerIndex === -1 || device.layout.itemIndex === -1) {
      return device;
    }
  });
}




export function  getAvailablePostion(UI, device, index) {

  const _columns = UI.COLUMNS;
  const _rows = UI.ROWS;

  let _column, _row, _break;

  _column = 0;
  _row = 0;
  _break = false;

  for (let kColumn = 0; kColumn < _columns; kColumn++) {
    for (let kRow = 0; kRow < _rows; kRow++) {

      if (!UI.CONTAINERS[kColumn].items[kRow]['location']) {

        if (!_break) {
          _column = kColumn;
          _row = kRow;
          _break = true;
        }

      }
    }
  }


  return {
    column: _column,
    row: _row
  };

}




export function getSensorLayout(containers_layout, locationId_layout) {

  let outContainer = -1;
  let outItem = -1;

  containers_layout.map( (container, kContainer) => {
    const isInThisContainer = container.items.some( item => item.location === locationId_layout);
    if (isInThisContainer) {
      outContainer = kContainer;
      outItem = container.items.findIndex( item => item.location === locationId_layout );
    }
  });

  return {
    container : outContainer,
    item : outItem
  }
}
