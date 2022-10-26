// export class SliderMiniDTO {
//     constructor(
//         public id: number,
//         public imageName: string,
//         public title: string,
//         public description: string,
//         public link: string,
//         // public isDelete: boolean,
//         // public createDate: Date,
//         // public lastUpdateDate: Date
//     ) { }
// }

export class SliderMiniDTO{
    id: number;
    // currentImageName: string;
    title: string;
    description: string;
    // activeFrom: Date;
    // activeUntil?: Date;
    link: string;
    base64Image: string;
}