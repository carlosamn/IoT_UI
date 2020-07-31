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
    export function streamingArrToObj(msg) {


      let arr = msg.split(",");
      let packetType = arr[0];
      let device = arr[1];
      let month = arr[2];
      let day = arr[3];
      let hour = arr[4];
      let min = arr[5];
      let sec = arr[6];
      let nChannels = arr[7];
      let analogInput1 = arr[8];
      let analogInput2 = arr[9];
      let analogInput3 = arr[10];
      let analogInput4 = arr[11];
      let retransmitBit = arr[12];
      let checksum = arr[13];

      let timestamp = new Date(2018, month, day, hour, min, sec, 0);

      let sensor = {
        retransmitBit: retransmitBit,
        uid: device,
        name : " **SENSOR NAME",
        units : " **UNITS ",
        enable : true,
        timestamp: timestamp.toString().split("GMT")[0],
        analogInput1: analogInput1,
        analogInput2: analogInput2,
        analogInput3: analogInput3,
        analogInput4: analogInput4
      };

      return sensor;
    }
