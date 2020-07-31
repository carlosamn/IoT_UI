export interface SettingsData{
    isSolenoid2On:string,
    isSolenoid2Af:string,
    isSolenoid2Off:string,
    tubingType:string,
    afTimeAdjRatio:string,
    earlyArrivalCounter:string,
    pressureUnit:string,
    noOfConsecutiveNoArrivals:string,
    e3m3Point:string,
    wellDepth:string,
    enableOptimizationMode:Boolean,
    enableRecModeSettings:Boolean,
    enableFlowOptMode:Boolean,
    enablePressureOnSettings:Boolean,
    enableAfTimeSettings:Boolean,
    enablestablePressMode:Boolean,
    
  }
  
  export interface SettingsTime{
    onTime:string,
    stablePressureTime:string,
    recTime2:string,
    maxAfterFlow:string,
    minAfTime:string,
    maxOffTime:string,
    minOffTime:string,
    fastTimeAdjAft:string,
    slowTime:string,
    fastTime:string,
    earlyArrivalTime:string,
    recTime:string,
    afTime:string,
    offTime:string,
    fastTimeAdjOff:string,
    slowTimeAdjAft:string,
    slowTimeAdjOff:string
  }