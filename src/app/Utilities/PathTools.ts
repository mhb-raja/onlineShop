import { environment } from '../../environments/environment'

export const DomainName = environment.production ? 'https://mhbraja.com' : 'https://localhost:44300';

export const SliderImagePath = DomainName + '/images/sliders/';

export const ImagePath = DomainName + '/images/products/';

export const ImageGalleryPath = DomainName + '/images/product-gallery/';
