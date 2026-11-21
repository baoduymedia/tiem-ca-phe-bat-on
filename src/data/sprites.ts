/**
 * Danh mục đường dẫn các Sprite 2D vẽ tay (Cozy Illustration) chuẩn hóa.
 * Dùng để preload vào BootScene / CafeScene và render trong game.
 */
export const SPRITES = {
  // Đồ uống & Dụng cụ pha chế
  drinks: {
    phin_ca_phe: '/assets/sprites/phin_ca_phe.png',
    cf_sua_da: '/assets/sprites/cf_sua_da.png',
    cf_den_da: '/assets/sprites/cf_den_da.png',
    tra_da: '/assets/sprites/tra_da.png',
    bac_xiu: '/assets/sprites/bac_xiu.png',
  },
  // Bàn ghế & Đạo cụ vỉa hè
  furniture: {
    ghe_nhua_do: '/assets/sprites/ghe_nhua_do.png',
    ghe_nhua_xanh: '/assets/sprites/ghe_nhua_xanh.png',
    ban_nhua_do: '/assets/sprites/ban_nhua_do.png',
    bat_che_mua: '/assets/sprites/bat_che_mua.png',
    am_nuoc_soi: '/assets/sprites/am_nuoc_soi.png',
    thung_da: '/assets/sprites/thung_da.png',
  },
  // Khách hàng
  customers: {
    khach_xe_om: '/assets/sprites/khach_xe_om.png',
    khach_hang_xom: '/assets/sprites/khach_hang_xom.png',
    khach_shipper: '/assets/sprites/khach_shipper.png',
    khach_sinh_vien: '/assets/sprites/khach_sinh_vien.png',
    khach_kol: '/assets/sprites/khach_kol.png',
  },
  // Thú cưng
  pets: {
    pet_meo_muop: '/assets/sprites/pet_meo_muop.png',
    pet_cun_vang: '/assets/sprites/pet_cun_vang.png',
  },
  // Nhân vật chủ quán (Nam / Nữ)
  owner: {
    chu_quan_nam: '/assets/sprites/chu_quan_nam.png',
    chu_quan_nu: '/assets/sprites/chu_quan_nu.png',
  },
} as const;
