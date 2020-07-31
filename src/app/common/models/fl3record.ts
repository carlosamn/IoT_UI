export interface IFl3Record {
    recordId: string;
    uid: string;
    captureStatus: string;
    captureTimestamp: string;
    baseline: {
        fluidLevel: number;
        peaktime: string;
        samplerate: number;
        zerotime: string;
    };
    acousticVelocity: {
        autoMode: number;
        autoVelocity: number;
        manualMode: number;
        manualVelocity: number;
    };
    filterApplied: string;
    selected?: boolean;
    baselineImageURL?: string;
    collarImageURL?: string;
    casingPressure: number;
    collarParams: {
        calipers: number;
        avgJoint: number;
        jointToLiquid: number;
        acousticFactor: number;
    };
    measurementUnit: number;
}