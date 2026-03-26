export interface Service {
  id: number;
  title: string;
  content: string;
  featured_image: string;

  acf: {
    service_name: string;
    service_short_dis: string;
    service_icon: string;
    service_list_image: string;
    service_detail_img: string;
  };
}
