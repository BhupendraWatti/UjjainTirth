# Ujjain Tirth — Mobile App API & Component Specification (`MOBILE_APP_API_SPEC.md`)

This document serves as the **master technical specification** for the React Native mobile app integration. All backend APIs, CPT structures, exact JSON payloads, TypeScript interfaces, and Stitch UI component guidelines are documented below.

---

## 1. Live Backend Configuration

- **Live Base REST API URL**: `https://ujjaintirth.com/wp-json/custom/v1/`
- **WordPress Theme File**: `/wp-content/themes/maintheme/functions.php`
- **Authentication**: None required for GET endpoints (Publicly Readable).
- **Format**: `application/json; charset=UTF-8`

---

## 2. API Endpoint 1: Transport Services (`/custom/v1/transport_service`)

### Endpoint Details
- **HTTP Method**: `GET`
- **Full URL**: `https://ujjaintirth.com/wp-json/custom/v1/transport_service`
- **WordPress CPT**: `transport_service`
- **Ordering**: Menu Order / Post ID ascending (`ASC`)

### Exact JSON Response Format
```json
[
  {
    "id": 5653,
    "title": "Kripa Innova Crysta",
    "image": "https://ujjaintirth.com/wp-content/uploads/2026/09/innova-crysta.jpg",
    "vehicle_type": "Premium MPV",
    "passenger_capacity": 6,
    "short_description": "Spacious and comfortable premium MPV perfect for family pilgrimage and outstation tours.",
    "service_category": "group",
    "highlights": [
      {
        "icon": "accessibility",
        "label": "Elder Step Available"
      },
      {
        "icon": "seats",
        "label": "6 Air-conditioned Seats"
      },
      {
        "icon": "luggage",
        "label": "Spacious Luggage Boot"
      }
    ],
    "is_featured": true,
    "is_recommended": true
  },
  {
    "id": 5657,
    "title": "Swift Dzire / Etios Comfort Sedan",
    "image": "",
    "vehicle_type": "Sedan",
    "passenger_capacity": 4,
    "short_description": "Economical and smooth sedan for local Ujjain darshan and railway station transfers.",
    "service_category": "local",
    "highlights": [
      {
        "icon": "seats",
        "label": "4 Passenger Seats"
      },
      {
        "icon": "ac",
        "label": "Climate Control AC"
      },
      {
        "icon": "driver",
        "label": "Experienced Local Driver"
      }
    ],
    "is_featured": true,
    "is_recommended": false
  },
  {
    "id": 5658,
    "title": "Mahindra Urbania / Tempo Traveller",
    "image": "",
    "vehicle_type": "Tempo Traveller",
    "passenger_capacity": 17,
    "short_description": "Luxury pushback seating mini-bus ideal for large family yatras & group parikrama.",
    "service_category": "group",
    "highlights": [
      {
        "icon": "seats",
        "label": "17 Pushback Seats"
      },
      {
        "icon": "tv",
        "label": "Music & Video System"
      },
      {
        "icon": "charging",
        "label": "USB Charging Points"
      }
    ],
    "is_featured": false,
    "is_recommended": true
  }
]
```

### TypeScript Data Models
```typescript
export interface TransportHighlight {
  icon: string; // e.g. 'accessibility', 'seats', 'luggage', 'ac', 'driver'
  label: string; // e.g. 'Elder Step Available'
}

export interface TransportServiceItem {
  id: number;
  title: string;
  image: string;
  vehicle_type: 'Sedan' | 'SUV' | 'Premium MPV' | 'Tempo Traveller' | 'Mini Coach' | 'Bus';
  passenger_capacity: number;
  short_description: string;
  service_category: 'local' | 'airport / station' | 'full day' | 'outstation' | 'group';
  highlights: TransportHighlight[];
  is_featured: boolean;
  is_recommended: boolean;
}
```

---

## 3. API Endpoint 2: Sacred Pooja & Rituals (`/custom/v1/pooja`)

### Endpoint Details
- **HTTP Method**: `GET`
- **Full URL**: `https://ujjaintirth.com/wp-json/custom/v1/pooja`
- **WordPress CPT**: `pooja`
- **Ordering**: Menu Order / Post ID ascending (`ASC`)

### Exact JSON Response Format
```json
[
  {
    "id": 5654,
    "title": "Maha Rudrabhishek",
    "image": "https://ujjaintirth.com/wp-content/uploads/2026/09/rudrabhishek.jpg",
    "temple": "Mahakaleshwar Temple",
    "category": "shiva",
    "duration": "60–90 min",
    "short_purpose": "A traditional Vedic Shiva abhishek ritual invoking health, peace, and divine blessings.",
    "starting_price": 2100,
    "is_featured": true
  },
  {
    "id": 5659,
    "title": "Mangalnath Bhat Pooja (Dosh Nivarana)",
    "image": "",
    "temple": "Mangalnath Temple",
    "category": "special",
    "duration": "45–60 min",
    "short_purpose": "Sacred Mangal Dosh Shanti & Bhat Pooja performed at the birthplace of Mars.",
    "starting_price": 3100,
    "is_featured": true
  },
  {
    "id": 5660,
    "title": "Kaal Sarp Dosh Shanti Pooja",
    "image": "",
    "temple": "Ram Ghat & Trimbakeshwar Samarth",
    "category": "protection",
    "duration": "120 min",
    "short_purpose": "Complete Vedic ritual to alleviate Rahu-Ketu obstacles and bring harmony.",
    "starting_price": 4500,
    "is_featured": false
  },
  {
    "id": 5661,
    "title": "Bhairav Sahasranama Archana",
    "image": "",
    "temple": "Kaal Bhairav Temple",
    "category": "protection",
    "duration": "30–45 min",
    "short_purpose": "Powerful Archana offering for protection and obstacle removal at Kaal Bhairav.",
    "starting_price": 1100,
    "is_featured": false
  }
]
```

### TypeScript Data Models
```typescript
export interface PoojaItem {
  id: number;
  title: string;
  image: string;
  temple: string;
  category: 'shiva' | 'devi' | 'protection' | 'prosperity' | 'special' | 'other';
  duration: string;
  short_purpose: string;
  starting_price: number | null;
  is_featured: boolean;
}
```

---

## 4. API Endpoint 3: Narmada Location (`/custom/v1/narmada_location`)

### Endpoint Details
- **HTTP Method**: `GET`
- **Full URL**: `https://ujjaintirth.com/wp-json/custom/v1/narmada_location`
- **WordPress CPT**: `narmada_location`
- **Ordering**: Sorted by `route_order` ascending (`ASC`)

### Exact JSON Response Format
```json
[
  {
    "id": 5655,
    "title": "Amarkantak",
    "image": "https://ujjaintirth.com/wp-content/uploads/2026/09/amarkantak.jpg",
    "location_type": "origin",
    "region": "Madhya Pradesh",
    "short_description": "Origin of the sacred river Narmada in the Vindhya-Satpura ranges.",
    "route_order": 1,
    "is_featured": true,
    "is_active": true
  },
  {
    "id": 5662,
    "title": "Omkareshwar & Mamleshwar",
    "image": "",
    "location_type": "important destination",
    "region": "Madhya Pradesh",
    "short_description": "Holy island shaped like OM featuring one of the 12 sacred Jyotirlingas.",
    "route_order": 2,
    "is_featured": true,
    "is_active": true
  },
  {
    "id": 5663,
    "title": "Maheshwar Ghats",
    "image": "",
    "location_type": "sacred ghat",
    "region": "Madhya Pradesh",
    "short_description": "Historical capital of Ahilyabai Holkar famous for majestic Narmada river ghats.",
    "route_order": 3,
    "is_featured": true,
    "is_active": true
  },
  {
    "id": 5664,
    "title": "Nemawar (Narmada Nabhi Sthan)",
    "image": "",
    "location_type": "route point",
    "region": "Madhya Pradesh",
    "short_description": "Geographical center (Nabhi Sthan) of Holy River Narmada.",
    "route_order": 4,
    "is_featured": false,
    "is_active": true
  },
  {
    "id": 5665,
    "title": "Bharuch (Narmada Sagar Sangam)",
    "image": "",
    "location_type": "important destination",
    "region": "Gujarat",
    "short_description": "Where holy Narmada meets the Arabian Sea completing the parikrama route.",
    "route_order": 5,
    "is_featured": true,
    "is_active": true
  }
]
```

### TypeScript Data Models
```typescript
export interface NarmadaLocationItem {
  id: number;
  title: string;
  image: string;
  location_type: 'origin' | 'major stop' | 'sacred ghat' | 'important destination' | 'route point';
  region: string;
  short_description: string;
  route_order: number;
  is_featured: boolean;
  is_active: boolean;
}
```

---

## 5. API Endpoint 4: Parikrama Mode (`/custom/v1/parikrama_mode`)

### Endpoint Details
- **HTTP Method**: `GET`
- **Full URL**: `https://ujjaintirth.com/wp-json/custom/v1/parikrama_mode`
- **WordPress CPT**: `parikrama_mode`
- **Ordering**: Menu Order / Post ID ascending (`ASC`)

### Exact JSON Response Format
```json
[
  {
    "id": 5656,
    "title": "Khand Parikrama",
    "image": "https://ujjaintirth.com/wp-content/uploads/2026/09/khand-parikrama.jpg",
    "mode_type": "segmented",
    "duration": "Flexible (7–14 Days)",
    "distance": "Selected sections",
    "short_description": "Perform sacred segments of Narmada Parikrama comfortably by vehicle and walking."
  },
  {
    "id": 5666,
    "title": "Sampoorna Narmada Parikrama",
    "image": "",
    "mode_type": "full parikrama",
    "duration": "21–25 Days",
    "distance": "3,300 KM complete circuit",
    "short_description": "Complete holy circuit covering all ghats from Amarkantak to Bharuch and back."
  },
  {
    "id": 5667,
    "title": "Ghat to Ghat Spiritual Yatra",
    "image": "",
    "mode_type": "ghat to ghat",
    "duration": "5–7 Days",
    "distance": "Major sacred ghats circuit",
    "short_description": "Focus exclusively on holy snan, aarti, and meditation at key river ghats."
  }
]
```

### TypeScript Data Models
```typescript
export interface ParikramaModeItem {
  id: number;
  title: string;
  image: string;
  mode_type: 'segmented' | 'ghat to ghat' | 'full parikrama' | 'custom';
  duration: string;
  distance: string;
  short_description: string;
}
```

---

## 6. Stitch Component & UI Layout Guidelines for Next Session

### Screen 1: Transport Services
- **Header**: Category pills (`All`, `Local`, `Group`, `Outstation`).
- **Card Design**: Clean glassmorphism container, vehicle photo on top, `vehicle_type` badge on top-right, title in bold.
- **Highlights List**: Horizontal pill badges with icons (`accessibility`, `seats`, `luggage`).
- **Footer Action**: CTA button ("Enquire Now" / "Book Ride") triggering bottom sheet modal.

### Screen 2: Sacred Pooja & Rituals
- **Header**: Filter bar by temple or category (`Shiva`, `Protection`, `Special`).
- **Card Design**: Sacred saffron/maroon gradient accent, temple name badge, ritual duration indicator, dakshina starting price tag.
- **CTA Action**: "Request Pooja" button with direct WhatsApp / Form trigger.

### Screen 3: Narmada Parikrama Experience
- **Top Section**: Parikrama Mode Carousel displaying `Khand Parikrama`, `Sampoorna Parikrama`, and `Ghat to Ghat` cards.
- **Middle Section (River Spine Path)**: Vertical connected timeline nodes driven by `/custom/v1/narmada_location` sorted by `route_order` (1 to 5).
- **Node Design**:
  - `origin` -> Gold glowing pin (Amarkantak)
  - `sacred ghat` -> Water droplet pin (Maheshwar)
  - `important destination` -> Temple pin (Omkareshwar & Bharuch)

---

## 7. Complete WordPress Code Reference

File: `/wp-content/themes/maintheme/functions.php`

```php
/**
 * Ujjain Tirth — CPT & ACF Pro Integration Module (work.md)
 */

// 1. Register Custom Post Types
add_action('init', 'ujjaintirth_register_custom_post_types');
function ujjaintirth_register_custom_post_types() {

    register_post_type('transport_service', array(
        'labels'       => array('name' => __('Transport Services', 'multilab'), 'singular_name' => __('Transport Service', 'multilab')),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'rest_base'    => 'transport_service',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'),
        'menu_icon'    => 'dashicons-car',
        'rewrite'      => array('slug' => 'transport-service'),
    ));

    register_post_type('pooja', array(
        'labels'       => array('name' => __('Poojas', 'multilab'), 'singular_name' => __('Pooja', 'multilab')),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'rest_base'    => 'pooja',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'),
        'menu_icon'    => 'dashicons-welcome-widgets-menus',
        'rewrite'      => array('slug' => 'pooja'),
    ));

    register_post_type('narmada_location', array(
        'labels'       => array('name' => __('Narmada Locations', 'multilab'), 'singular_name' => __('Narmada Location', 'multilab')),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'rest_base'    => 'narmada_location',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'),
        'menu_icon'    => 'dashicons-location-alt',
        'rewrite'      => array('slug' => 'narmada-location'),
    ));

    register_post_type('parikrama_mode', array(
        'labels'       => array('name' => __('Parikrama Modes', 'multilab'), 'singular_name' => __('Parikrama Mode', 'multilab')),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'rest_base'    => 'parikrama_mode',
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'),
        'menu_icon'    => 'dashicons-location',
        'rewrite'      => array('slug' => 'parikrama-mode'),
    ));
}

// 2. Helpers & Formatters
function ujjaintirth_get_acf_image_url($img_val) {
    if (empty($img_val)) return '';
    if (is_string($img_val)) return $img_val;
    if (is_array($img_val) && isset($img_val['url'])) return $img_val['url'];
    if (is_numeric($img_val)) return wp_get_attachment_url($img_val) ?: '';
    return '';
}

function ujjaintirth_get_field_val($post_id, $name, $default = '') {
    $val = function_exists('get_field') ? get_field($name, $post_id) : '';
    if ($val === '' || $val === null || $val === false) {
        $val = get_post_meta($post_id, $name, true);
    }
    return ($val !== '' && $val !== null && $val !== false) ? $val : $default;
}

function ujjaintirth_format_narmada_location($post_id) {
    $featured_image = get_the_post_thumbnail_url($post_id, 'full') ?: ujjaintirth_get_acf_image_url(ujjaintirth_get_field_val($post_id, 'location_icon'));
    return array(
        'id'                => intval($post_id),
        'title'             => html_entity_decode(get_the_title($post_id), ENT_QUOTES, 'UTF-8'),
        'image'             => $featured_image,
        'location_type'     => strtolower(ujjaintirth_get_field_val($post_id, 'location_type', 'origin')),
        'region'            => ujjaintirth_get_field_val($post_id, 'region', 'Madhya Pradesh'),
        'short_description' => ujjaintirth_get_field_val($post_id, 'short_description', ''),
        'route_order'       => intval(ujjaintirth_get_field_val($post_id, 'route_order', 1)),
        'is_featured'       => (bool) ujjaintirth_get_field_val($post_id, 'is_featured', 1),
        'is_active'         => (bool) ujjaintirth_get_field_val($post_id, 'is_active', 1),
    );
}

function ujjaintirth_format_parikrama_mode($post_id) {
    $featured_image = get_the_post_thumbnail_url($post_id, 'full') ?: '';
    return array(
        'id'                => intval($post_id),
        'title'             => html_entity_decode(get_the_title($post_id), ENT_QUOTES, 'UTF-8'),
        'image'             => $featured_image,
        'mode_type'         => strtolower(ujjaintirth_get_field_val($post_id, 'mode_type', 'segmented')),
        'duration'          => ujjaintirth_get_field_val($post_id, 'duration', 'Flexible'),
        'distance'          => ujjaintirth_get_field_val($post_id, 'distance', 'Selected sections'),
        'short_description' => ujjaintirth_get_field_val($post_id, 'short_description', ''),
    );
}

function ujjaintirth_format_pooja($post_id) {
    $featured_image = get_the_post_thumbnail_url($post_id, 'full') ?: ujjaintirth_get_acf_image_url(ujjaintirth_get_field_val($post_id, 'pooja_icon'));
    $starting_price = ujjaintirth_get_field_val($post_id, 'starting_price');
    return array(
        'id'             => intval($post_id),
        'title'          => html_entity_decode(get_the_title($post_id), ENT_QUOTES, 'UTF-8'),
        'image'          => $featured_image,
        'temple'         => ujjaintirth_get_field_val($post_id, 'temple', 'Mahakaleshwar'),
        'category'       => strtolower(ujjaintirth_get_field_val($post_id, 'category', 'shiva')),
        'duration'       => ujjaintirth_get_field_val($post_id, 'duration', '60–90 min'),
        'short_purpose'  => ujjaintirth_get_field_val($post_id, 'short_purpose', ''),
        'starting_price' => !empty($starting_price) ? floatval($starting_price) : null,
        'is_featured'    => (bool) ujjaintirth_get_field_val($post_id, 'is_featured', 1),
    );
}

function ujjaintirth_format_transport_service($post_id) {
    $featured_image = get_the_post_thumbnail_url($post_id, 'full') ?: '';
    $highlights_raw = ujjaintirth_get_field_val($post_id, 'highlights', array());
    $highlights = array();

    if (is_array($highlights_raw)) {
        foreach ($highlights_raw as $item) {
            $icon_key = $item['icon_key'] ?? '';
            $icon_img = ujjaintirth_get_acf_image_url($item['icon'] ?? '');
            $highlights[] = array(
                'icon'  => !empty($icon_key) ? $icon_key : ($icon_img ?: 'accessibility'),
                'label' => $item['label'] ?? '',
            );
        }
    }

    return array(
        'id'                 => intval($post_id),
        'title'              => html_entity_decode(get_the_title($post_id), ENT_QUOTES, 'UTF-8'),
        'image'              => $featured_image,
        'vehicle_type'       => ujjaintirth_get_field_val($post_id, 'vehicle_type', 'Premium MPV'),
        'passenger_capacity' => intval(ujjaintirth_get_field_val($post_id, 'passenger_capacity', 6)),
        'short_description'  => ujjaintirth_get_field_val($post_id, 'short_description', ''),
        'service_category'   => strtolower(ujjaintirth_get_field_val($post_id, 'service_category', 'group')),
        'highlights'         => $highlights,
        'is_featured'        => (bool) ujjaintirth_get_field_val($post_id, 'is_featured', 1),
        'is_recommended'     => (bool) ujjaintirth_get_field_val($post_id, 'is_recommended', 1),
    );
}

// 3. Register Custom REST Routes under /custom/v1/
add_action('rest_api_init', function() {

    register_rest_route('custom/v1', '/narmada_location', array(
        'methods'  => 'GET',
        'callback' => function() {
            $posts = get_posts(array('post_type' => 'narmada_location', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'meta_value_num menu_order ID', 'meta_key' => 'route_order', 'order' => 'ASC'));
            $out = array();
            foreach ($posts as $post) { $out[] = ujjaintirth_format_narmada_location($post->ID); }
            return $out;
        },
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/parikrama_mode', array(
        'methods'  => 'GET',
        'callback' => function() {
            $posts = get_posts(array('post_type' => 'parikrama_mode', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order ID', 'order' => 'ASC'));
            $out = array();
            foreach ($posts as $post) { $out[] = ujjaintirth_format_parikrama_mode($post->ID); }
            return $out;
        },
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/pooja', array(
        'methods'  => 'GET',
        'callback' => function() {
            $posts = get_posts(array('post_type' => 'pooja', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order ID', 'order' => 'ASC'));
            $out = array();
            foreach ($posts as $post) { $out[] = ujjaintirth_format_pooja($post->ID); }
            return $out;
        },
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/transport_service', array(
        'methods'  => 'GET',
        'callback' => function() {
            $posts = get_posts(array('post_type' => 'transport_service', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order ID', 'order' => 'ASC'));
            $out = array();
            foreach ($posts as $post) { $out[] = ujjaintirth_format_transport_service($post->ID); }
            return $out;
        },
        'permission_callback' => '__return_true',
    ));
});
```
