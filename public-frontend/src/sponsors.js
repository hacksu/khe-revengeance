
let ids = 0;
class Sponsor {
  constructor(cfg) {
    Object.assign(this, {
      logo: false,
      name: false,
      link: false,
      style: {},
      scale: 1,
      id: ids++,
    });
    Object.assign(this, cfg);
    this.style = Object.assign(this.style || {}, {
      'background': 'center / contain no-repeat url(' + this.logo + ')',
      'display': 'inline-block',
      'transform': 'scale(' + this.scale + ')',
    })
  }
}

import HacksuLogo from '@/assets/sponsors/Hacksu.svg'
let Hacksu = new Sponsor({
  //logo: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/816158/hacksu-logo.svg',
  logo: HacksuLogo,
  name: 'Hacksu',
  link: 'https://hacksu.com',
  scale: 0.65,
});

// import StickerMuleLogo from '@/assets/sponsors/StickerMule-Wide.svg'
// let StickerMule = new Sponsor({
//   logo: StickerMuleLogo,
//   name: 'Sticker Mule',
//   link: 'http://hackp.ac/mlh-stickermule-hackathons', //'https://www.stickermule.com/',
//   style: {
//     'border-radius': '2vh',
//     'background-color': '#FFFFFF',
//   },
// });

import GreenworksLabLogo from '@/assets/sponsors/greenworks_lab_logo.png'
let GreenworksLab = new Sponsor({
  logo: GreenworksLabLogo,
  name: 'GreenWorks Lab',
  link: 'https://ascic.aurora-schools.org/',
  style: {
    'border-radius': '2vh',
    'background-color': '#FFFFFF',
  },
});

import GoogleCloudLogo from '@/assets/sponsors/GoogleCloud-Wide.png'
let GoogleCloud = new Sponsor({
  logo: GoogleCloudLogo,
  name: 'Google Cloud',
  link: 'https://cloud.google.com/',
});

import IHCILogo from '@/assets/sponsors/ihci_logo_original.png'
let IHCI = new Sponsor({
  logo: IHCILogo,
  name: '13th International Conference on Intelligent Human Computer Interaction',
  link: 'https://www.ihci.cs.kent.edu/',
  scale: 0.6
});

// import EchoArLogo from '@/assets/sponsors/echoAR.png'
// let EchoAr = new Sponsor({
//   logo: EchoArLogo,
//   name: 'EchoAr',
//   link: 'https://www.echoar.xyz/',
//   scale: 0.7,
// })

import CSLogo from '@/assets/sponsors/CSDepartment.svg'
let CSDepartment= new Sponsor({
  logo: CSLogo,
  name: 'Kent State Computer Science',
  link: 'https://www.kent.edu/cs',
  scale: 1.25
});

import RSMLogo from '@/assets/sponsors/RSMLogo_transparent.png'
let RSM = new Sponsor({
  logo: RSMLogo,
  name: 'RSM Consulting',
  link: 'https://rsmus.com/',
  scale: 0.85,
});

import MLHLogo from '@/assets/sponsors/MLHLogo.svg'
let MLH = new Sponsor({
  logo: MLHLogo,
  name: 'Major Leaugue Hacking',
  link: 'https://mlh.io/',
  scale: 0.5,
});

import NationwideLogo from '@/assets/sponsors/Nationwide.png'
let Nationwide = new Sponsor({
  logo: NationwideLogo,
  name: 'Nationwide',
  link: 'https://www.nationwide.com/',
  scale: 0.75,
});

import ProgressiveLogo from '@/assets/sponsors/Progressive.png'
let Progressive = new Sponsor({
  logo: ProgressiveLogo,
  name: 'Progressive',
  link: 'https://www.progressive.com/',
  scale: 0.75,
});


import Echo3DLogo from '@/assets/sponsors/echo3D.png'
let Echo3D = new Sponsor({
  logo: Echo3DLogo,
  name: 'Echo3D',
  link: 'https://www.echo3d.co/',
  scale: 1.0,
});

import BawlsLogo from '@/assets/sponsors/Bawls.png'
let Bawls = new Sponsor({
  logo: BawlsLogo,
  name: 'Bawls',
  link: 'https://www.bawls.com/',
  scale: 0.75,
});

import StandOutStickersLogo from '@/assets/sponsors/StandOutStickers.png'
let StandOutStickers = new Sponsor({
  logo: StandOutStickersLogo,
  name: 'StandOutStickers',
  link: 'http://hackp.ac/mlh-StandOutStickers-hackathons',
  scale: 0.75,
});

import USGLogo from '@/assets/sponsors/USG.png'
let USG = new Sponsor({
  logo: USGLogo,
  name: "Undergraduate Student Government",
  link: "http://www.kentstateusg.com/",
  scale: 1,
});


export default [
  /*[
    RSM,
    Nationwide,
    Progressive,
  ],
  [
    GoogleCloud,
    MLH,
    Echo3D,
  ],
  [
    CSDepartment,
    Hacksu,
    USG,
  ],
  [
    Bawls,
    StandOutStickers,
  ]*/

]
