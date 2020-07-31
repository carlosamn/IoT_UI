/**
     *
     *Function : streamingArrToObj()
     *
     * "Convert data from Streaming Text String to an usable Object"
     *
     * @param   msg String using format as 8,QSO902,09,04,13,28,07,4,909.63,2318.63,938.46,1393.27,0,074
     * @throws
     * @return  Object using format {
                                    uid :  device,
                                    timestamp : timestamp,
                                    analogInput1 : analogInput1,
                                    analogInput2 : analogInput2,
                                    analogInput3 : analogInput3,
                                    analogInput4 : analogInput4
                                  }
     */
export function streamingArrToObj(msg, alarms?, trends?) {



  const arr = msg.split(',');

  const arrLength = arr.length;

  const packetType = arr[0];
  const device = arr[1];
  const month = parseInt(arr[2]) - 1 ;
  const day = arr[3];
  const hour = arr[4];
  const min = arr[5];
  const sec = arr[6];
  const nChannels = arr[7];

  let analogInput1 = 0;
  let analogInput2 = 0;
  let analogInput3 = 0;
  let analogInput4 = 0;
  let analogInput5 = 0;
  let analogInput6 = 0;
  let analogInput7 = 0;
  let analogInput8 = 0;
  let retransmitBit = 0;
  let checksum = 0;

  switch ( parseInt(nChannels) ) {
    case 1: {
      analogInput1 = arr[8];
      break;
   }
   case 2: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
      break;
   }
   case 3: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
      break;
   }
   case 4: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
      break;
   }
  case 5: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
    analogInput5 = arr[12];
      break;
   }
   case 6: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
    analogInput5 = arr[12];
    analogInput6 = arr[13];
      break;
   }
   case 7: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
    analogInput5 = arr[12];
    analogInput6 = arr[13];
    analogInput7 = arr[14];
    analogInput8 = arr[15];
      break;
   }
   default: {

      break;
   }
  }

  // tslint:disable-next-line:radix
  retransmitBit = parseInt(arr[arrLength - 2]);
  checksum = parseInt(arr[arrLength - 1]);



  const timestamp = new Date( (new Date()).getFullYear() , month, day, hour, min, sec, 0);

   const sensor = {
    retransmitBit: retransmitBit,
    uid: device,
    timestamp: timestamp.toString().split('GMT')[0],
    analogInput1: analogInput1,
    analogInput2: analogInput2,
    analogInput3: analogInput3,
    analogInput4: analogInput4
  };

  return sensor;
}






export function sensorEventToSensorObj(msg) {
  const arr = msg.split(',');

  const arrLength = arr.length;

  const packetType = arr[0];
  const device = arr[1];
  const month = arr[2];
  const day = arr[3];
  const hour = arr[4];
  const min = arr[5];
  const sec = arr[6];
  const nChannels = arr[7];

  let analogInput1 = 0;
  let analogInput2 = 0;
  let analogInput3 = 0;
  let analogInput4 = 0;
  let analogInput5 = 0;
  let analogInput6 = 0;
  let analogInput7 = 0;
  let analogInput8 = 0;
  let retransmitBit = 0;
  let checksum = 0;

  switch (parseInt(nChannels)) {
    case 1: {
      analogInput1 = arr[8];
      break;
   }
   case 2: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
      break;
   }
   case 3: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
      break;
   }
   case 4: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
      break;
   }
  case 5: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
    analogInput5 = arr[12];
      break;
   }
   case 6: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
    analogInput5 = arr[12];
    analogInput6 = arr[13];
      break;
   }
   case 7: {
    analogInput1 = arr[8];
    analogInput2 = arr[9];
    analogInput3 = arr[10];
    analogInput4 = arr[11];
    analogInput5 = arr[12];
    analogInput6 = arr[13];
    analogInput7 = arr[14];
    analogInput8 = arr[15];
      break;
   }
   default: {

      break;
   }
  }

  retransmitBit = parseInt(arr[arrLength - 2]);
  checksum = parseInt(arr[arrLength - 1]);

  const timestamp = new Date(2018, month, day, hour, min, sec, 0);

  const sensor = {
    retransmitBit: retransmitBit,
    uid: device,
    timestamp: timestamp.toString().split('GMT')[0],
    analogInput1: analogInput1,
    analogInput2: analogInput2,
    analogInput3: analogInput3,
    analogInput4: analogInput4
  };

  return sensor;
}


export function checkRecordStatus(item, list) {

    const uid = item.uid.split('QSO')[1];
    const itemOnListWithUID = list.filter( listItem => listItem.uid === uid);

  if (itemOnListWithUID.length > 0) {
    return {state: 'UPDATE', item : itemOnListWithUID};
  } else {
    return {state: 'ERROR'};
  }

}



export function updateSensorRecord(sensor_data, recordStatus, sensor_alarms, sensor_trends) {

  let trend_channel1, trend_channel2, trend_channel3;

  if (sensor_trends) {
    trend_channel1 = sensor_trends['1'];
  } else {
    trend_channel1 = 0;
  }

  if (sensor_trends) {
    trend_channel2 = sensor_trends['2'];
  } else {
    trend_channel2 = 0;
  }

  if (sensor_trends) {
    trend_channel3 = sensor_trends['3'];
  } else {
    trend_channel3 = 0;
  }




  const new_sensor_record = {
      client: recordStatus.item[0].client,
      company: recordStatus.item[0].company,
      layout: recordStatus.item[0].layout,
      isRetransmit : recordStatus.item[0].isRetransmit,
      location: recordStatus.item[0].location,
      project: recordStatus.item[0].project,
      timestamp: sensor_data.timestamp,
      uid: recordStatus.item[0].uid,
      channels: [
        {
            id: 0,
            alarms:  recordStatus.item[0].channels[0].alarms,
            name: recordStatus.item[0].channels[0].name,
            trend: trend_channel1,
            units: recordStatus.item[0].channels[0].units,
            value: sensor_data.analogInput1,
        },
        {
          id: 1,
          alarms:  recordStatus.item[0].channels[1].alarms,
          name: recordStatus.item[0].channels[1].name,
          trend: trend_channel2,
          units: recordStatus.item[0].channels[1].units,
          value: sensor_data.analogInput2,
      },
      {
        id: 2,
        alarms:  recordStatus.item[0].channels[2].alarms,
        name: recordStatus.item[0].channels[2].name,
        trend: trend_channel3,
        units: recordStatus.item[0].channels[2].units,
        value: sensor_data.analogInput3,
      }
      ]
  };




  return new_sensor_record;
}



export function filterQueryUIDs(params) {
  const paramField = params.field;
  const paramValues = params.values;
  let filterString = '?';
  for (let k = 0; k < paramValues.length; k++) {
    filterString += `filter[where][or][${k}][${paramField}]=${paramValues[k]}&`;
  }
  return filterString;
}





export function getSensorPositionInContainer(id, containers) {

  let posContainer = 0;
  let posIndex = 0;
  let posUID = 0;

  containers.forEach( (container, kContainer) => {
    container.items.forEach( (item, kItem) => {
      if (item['location']) {
        if (item['location'] == id) {

          posContainer = kContainer;
          posIndex = kItem;
          posUID = item['device'].uid;

        }
      }
    });
  });

  return{
    id : id,
    uid : posUID,
    container: posContainer,
    index: posIndex
  };
}
