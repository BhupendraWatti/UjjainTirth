export interface Service{
    id:number;
    title:{
        rendered:string;
    }
    featured_media?:number;
    _embedded?:{
        'wp:featuremedia'?:{
            source_url:string;
        }[];
    }
    acf?:{
        service_name:string;
        service_short_dis:string;
        service_icon:string;
        service_list_images:string;
        service_detail_img: string;
    }
}