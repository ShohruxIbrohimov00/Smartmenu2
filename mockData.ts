import { Cafe, Category, MenuItem, Waiter, TableCall, Order } from './types';
import { IMG } from './assets';

export const initialCafes: Cafe[] = [
  {
    id: 'cafe-1',
    name: 'Osh Markazi & Grill',
    slug: 'osh-markazi',
    logoUrl: IMG.logo,
    adminId: 'admin-1',
    adminLogin: 'admin',
    adminPassword: '123',
    themeColor: '#ea580c',
    phone: '+998 71 200 00 20',
    address: 'Toshkent shahri, Navoiy ko\'chasi, 14-uy',
    tablesCount: 15,
    wifiName: 'OshMarkazi_Guest',
    wifiPassword: 'oshmarkazi2026'
  },
  {
    id: 'cafe-2',
    name: 'Rayhon Milliy Taomlar',
    slug: 'rayhon',
    logoUrl: IMG.logo,
    adminId: 'admin-2',
    adminLogin: 'rayhonadmin',
    adminPassword: '123',
    themeColor: '#16a34a',
    phone: '+998 71 200 55 55',
    address: 'Toshkent shahri, Chilonzor tumani, 9-mavze',
    tablesCount: 20,
    wifiName: 'Rayhon_Free_WiFi',
    wifiPassword: 'rayhonwifi'
  }
];

export const initialCategories: Category[] = [
  { id: 'cat-1', cafeId: 'cafe-1', name: 'Milliy Taomlar', orderIndex: 1 },
  { id: 'cat-2', cafeId: 'cafe-1', name: 'Kabob va Grill', orderIndex: 2 },
  { id: 'cat-3', cafeId: 'cafe-1', name: 'Pishiriqlar & Tandir', orderIndex: 3 },
  { id: 'cat-4', cafeId: 'cafe-1', name: 'Salqin Ichimliklar & Suvlar', orderIndex: 4 },
  { id: 'cat-7', cafeId: 'cafe-1', name: 'Choylar & Issiq Damlamalar', orderIndex: 5 },
  
  { id: 'cat-5', cafeId: 'cafe-2', name: 'Bosh Taomlar', orderIndex: 1 },
  { id: 'cat-6', cafeId: 'cafe-2', name: 'Ichimliklar', orderIndex: 2 }
];

export const initialItems: MenuItem[] = [
  // --- Milliy Taomlar ---
  {
    id: 'item-1',
    categoryId: 'cat-1',
    name: 'Maxsus To\'y Oshi (Palov)',
    description: 'Devzira guruch, sara qo\'y go\'shti, sariq sabzi, bedana tuxumi, qazi va barra sarimsoq bilan an\'anaviy usulda damlangan muhtasham to\'y palovi.',
    price: 42000,
    media: [
      { url: IMG.palov, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '10 daqiqa',
    calories: 680,
    weight: '450 g',
    ingredients: ['Devzira guruch', 'Sara qo\'y go\'shti', 'Sariq sabzi', 'Zira va zarchava', 'Qazi', 'Bedana tuxumlari', 'Noxat va mayiz'],
    isChefSpecial: true
  },
  {
    id: 'item-5',
    categoryId: 'cat-1',
    name: 'Qozon Kabob (Qo\'y Go\'shtli)',
    description: 'Tillarang qovurilgan mayin qo\'y go\'shti, butun qovurilgan barra kartoshkalar, yangi piyoz va xushbo\'y zira bilan tortiladi.',
    price: 52000,
    media: [
      { url: IMG.shashlik, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '15 daqiqa',
    calories: 720,
    weight: '420 g',
    ingredients: ['Qo\'y go\'shti (lahm va qovurga)', 'Yangi kartoshka', 'Zira', 'Kashnich', 'Yupqa qizil piyoz'],
    isChefSpecial: true
  },
  {
    id: 'item-6',
    categoryId: 'cat-1',
    name: 'Toshkent To\'y Norini (Sho\'rva bilan)',
    description: 'Qo\'lda kesilgan mayin yupqa xamir, maydalangan ot va mol go\'shti, qazi bo\'laklari va alohida qaynoq xushbo\'y zira sho\'rvasi.',
    price: 38000,
    media: [
      { url: IMG.palov, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '5-10 daqiqa',
    calories: 490,
    weight: '350 g + 250 ml sho\'rva',
    ingredients: ['Qo\'lda kesilgan xamir', 'Sara ot go\'shti', 'Lahm mol go\'shti', 'Ot qazisi', 'Qora murch', 'Zira sho\'rva']
  },
  {
    id: 'item-7',
    categoryId: 'cat-1',
    name: 'Uyg\'urcha Qovurma Lag\'mon',
    description: 'Qo\'lda cho\'zilgan elastik xamir, barra go\'sht, sarxil bulg\'or qalampiri, selderey va pomidorli mazali qayla bilan tova olovida qovurilgan.',
    price: 36000,
    media: [
      { url: IMG.palov, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '15 daqiqa',
    calories: 580,
    weight: '400 g',
    ingredients: ['Qo\'lda cho\'zilgan cho\'zma xamir', 'Mol go\'shti', 'Rang-barang bulg\'or qalampiri', 'Pekin karami', 'Selderey', 'Sarimsoq']
  },

  // --- Kabob va Grill ---
  {
    id: 'item-2',
    categoryId: 'cat-2',
    name: 'Qo\'y Go\'shtli Qiyma va Kuskovoy Kabob',
    description: 'Ochiq olovda cho\'g\'da pishirilgan sersuv barra qo\'y go\'shti kabobi. Marinadlangan qizil piyoz, anor donalari va yangi tandir non bilan tortiladi.',
    price: 24000,
    media: [
      { url: IMG.shashlik, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '15-20 daqiqa',
    calories: 450,
    weight: '220 g (2 dona)',
    ingredients: ['Barra qo\'y go\'shti', 'Dumba', 'Kashnich urug\'i', 'Qizil murch', 'Anor donalari', 'Binafsharang piyoz'],
    isChefSpecial: true
  },
  {
    id: 'item-8',
    categoryId: 'cat-2',
    name: 'Tovuq Go\'shtli Shirin Kabob (File)',
    description: 'Maxsus qaymoqli sousda marinadlangan yumshoq tovuq filesi, ochiq cho\'g\'da oltin tusda qizargan barra kabob.',
    price: 18000,
    media: [
      { url: IMG.shashlik, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '12-15 daqiqa',
    calories: 320,
    weight: '180 g',
    ingredients: ['Tovuq filesi', 'Qaymoq va zaytun moyi', 'Ziravorlar', 'Limon sharbati', 'Pomidor va ko\'katlar']
  },
  {
    id: 'item-9',
    categoryId: 'cat-2',
    name: 'Dumba-Jigar Shashlik',
    description: 'Yumshoq sara jigar va mayin dumba qat-qat terilgan, cho\'g\'da tez pishirilgan shirali an\'anaviy kabob.',
    price: 20000,
    media: [
      { url: IMG.shashlik, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '10-12 daqiqa',
    calories: 380,
    weight: '190 g',
    ingredients: ['Sara mol jigari', 'Qo\'y dumbasi', 'Zira', 'Kashnich', 'Tuz va qora murch']
  },

  // --- Pishiriqlar & Tandir ---
  {
    id: 'item-3',
    categoryId: 'cat-3',
    name: 'Tandir Somsa (Go\'shtli)',
    description: 'Qat-qat qarsildoq xamir, mayin lahm go\'sht va sarxil piyoz aralashmasi bilan loy tandirda pishirilgan xushbo\'y milliy somsa.',
    price: 12000,
    media: [
      { url: IMG.somsa, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '5 daqiqa',
    calories: 320,
    weight: '160 g',
    ingredients: ['Oliy nav un', 'Lahm mol va qo\'y go\'shti', 'Shirin piyoz', 'Qora sedana', 'Zira']
  },
  {
    id: 'item-10',
    categoryId: 'cat-3',
    name: 'Tandir Gijda Non (Issiq)',
    description: 'Loy tandirdan uzilgan sedana va kunjutli, qarsildoq chetli, xushbo\'y an\'anaviy non.',
    price: 7000,
    media: [
      { url: IMG.somsa, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '5 daqiqa',
    calories: 280,
    weight: '300 g',
    ingredients: ['Oliy nav un', 'Xamirturush', 'Kunjut', 'Sedana']
  },
  {
    id: 'item-11',
    categoryId: 'cat-3',
    name: 'Asalli Yong\'oqli Pahlava',
    description: 'Yupqa qatlamli xamir, maydalangan tog\' yong\'og\'i va tabiiy asal qiyomi bilan tayyorlangan sharqona shirinlik.',
    price: 19000,
    media: [
      { url: IMG.somsa, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '3 daqiqa',
    calories: 410,
    weight: '150 g',
    ingredients: ['Qatlama xamir', 'Tog\' yong\'og\'i', 'Tabiiy gul asali', 'Dolchin']
  },

  // --- Salqin Ichimliklar & Suvlar ---
  {
    id: 'item-12',
    categoryId: 'cat-4',
    name: 'Chortoq Tabiiy Mineral Suvi (Gazli)',
    description: 'Namanganning mashhur Chortoq bulog\'idan olingan shifobaxsh tabiiy minerallarga boy gazli shisha mineral suv.',
    price: 9000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '1 daqiqa',
    calories: 0,
    weight: '0.5L (Shisha)',
    ingredients: ['Tabiiy gazlangan mineral suv', 'Tabiiy minerallar majmuasi']
  },
  {
    id: 'item-13',
    categoryId: 'cat-4',
    name: 'Hydrolife Gazsiz Tog\' Suvi',
    description: 'Chotqol tog\' tizmasi buloqlaridan qadoqlangan musaffo, yumshoq va toza tabiiy gazsiz ichimlik suvi.',
    price: 6000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '1 daqiqa',
    calories: 0,
    weight: '0.5L (Muzdek)',
    ingredients: ['Tabiiy tog\' ichimlik suvi']
  },
  {
    id: 'item-14',
    categoryId: 'cat-4',
    name: 'Borjomi Tabiiy Gazli Suvi',
    description: 'Kavkaz tog\'larining mashhur vulqon mineralli, tetiklantiruvchi premium gazli mineral suvi.',
    price: 16000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '1 daqiqa',
    calories: 0,
    weight: '0.5L (Shisha)',
    ingredients: ['Borjomi tabiiy mineral suvi']
  },
  {
    id: 'item-15',
    categoryId: 'cat-4',
    name: 'Yangi Siqilgan Anor Sharbati (Fresh)',
    description: '100% toza va tabiiy, sarxil anor donalaridan buyurtma berilgan zahoti press usulida siqib beriladigan vitaminli sharbat.',
    price: 26000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '5 daqiqa',
    calories: 140,
    weight: '300 ml',
    ingredients: ['100% yangi siqilgan tabiiy anor sharbati'],
    isChefSpecial: true
  },
  {
    id: 'item-16',
    categoryId: 'cat-4',
    name: 'Uy Qatiqli Salqin Ayron',
    description: 'Yalpiz yaproqlari, mayda to\'g\'ralgan barra bodring va tog\' rayhoni qo\'shilgan tetiklantiruvchi milliy ayron.',
    price: 6000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '2 daqiqa',
    calories: 75,
    weight: '400 ml',
    ingredients: ['Tabiiy uy qatig\'i', 'Tiniq buloq suvi', 'Yangi bodring', 'Yalpiz', 'Tuz']
  },
  {
    id: 'item-17',
    categoryId: 'cat-4',
    name: 'Muzdek Olchali Bog\' Kompoti',
    description: 'Yozgi sarxil qizil olcha va shirin o\'rik mevalaridan qaynatilgan, muz bo\'laklari bilan tortiladigan xushta\'m kompot.',
    price: 15000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '2 daqiqa',
    calories: 110,
    weight: '1 Litr (Grafin)',
    ingredients: ['Yangi olcha mevalari', 'O\'rik', 'Shakar', 'Toza suv']
  },
  {
    id: 'item-18',
    categoryId: 'cat-4',
    name: 'Coca-Cola Classic (Shisha idishda)',
    description: 'Muzdek shisha idishdagi jahonning klassik gazlangan ichimligi.',
    price: 11000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '1 daqiqa',
    calories: 140,
    weight: '0.5L (Muzdek)',
    ingredients: ['Coca-Cola Classic']
  },

  // --- Choylar & Issiq Damlamalar ---
  {
    id: 'item-4',
    categoryId: 'cat-7',
    name: 'Limonli Zarafshon Ko\'k Choyi',
    description: 'Oliy navli Samarqand ko\'k choyi, yangi limon bo\'laklari va xushbo\'y yalpiz yaproqlari solingan shisha choynakdagi tetiklantiruvchi damlama.',
    price: 9000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '5 daqiqa',
    calories: 25,
    weight: '800 ml (choynak)',
    ingredients: ['Zarafshon 95-ko\'k choyi', 'Yangi limon bo\'laklari', 'Bog\' yalpizi', 'Tog\' asali (alohida)']
  },
  {
    id: 'item-19',
    categoryId: 'cat-7',
    name: 'Toshkent Choyi (Zanjabil, asal va yalpiz)',
    description: 'Qaynoq shisha choynakda tog\' asali, barra zanjabil ildizi, limon va yalpiz barglari bilan damlangan xushbo\'y shifobaxsh choy.',
    price: 14000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '7 daqiqa',
    calories: 60,
    weight: '800 ml (choynak)',
    ingredients: ['Oliy nav qora choy', 'Tog\' gul asali', 'Yangi zanjabil ildizi', 'Limon', 'Yalpiz'],
    isChefSpecial: true
  },
  {
    id: 'item-20',
    categoryId: 'cat-7',
    name: 'Qora Choy (Binafsharang Rayhon bilan)',
    description: 'Bargli oliy nav qora choy va yangi uzilgan xushbo\'y rayhon shoxchalari solingan milliy choyxona choyi.',
    price: 8000,
    media: [
      { url: IMG.greenTea, type: 'image', orderIndex: 1 }
    ],
    isActive: true,
    preparationTime: '5 daqiqa',
    calories: 10,
    weight: '800 ml (choynak)',
    ingredients: ['Oliy nav qora choy', 'Binafsharang barra rayhon']
  }
];

export const initialWaiters: Waiter[] = [
  {
    id: 'waiter-1',
    cafeId: 'cafe-1',
    name: 'Farrux Olimov',
    login: 'waiter1',
    password: '1234',
    phone: '+998 90 123 45 67',
    assignedTables: ['1', '2', '3', '4', '5'],
    isActive: true
  },
  {
    id: 'waiter-2',
    cafeId: 'cafe-1',
    name: 'Dilshod Zokirov',
    login: 'waiter2',
    password: '1234',
    phone: '+998 90 987 65 43',
    assignedTables: ['6', '7', '8', 'VIP 1', 'VIP 2'],
    isActive: true
  },
  {
    id: 'waiter-3',
    cafeId: 'cafe-2',
    name: 'Jahongir Rustamov',
    login: 'waiter3',
    password: '1234',
    phone: '+998 93 555 11 22',
    assignedTables: ['1', '2', '3', '4'],
    isActive: true
  }
];

export const initialTableCalls: TableCall[] = [
  {
    id: 'call-1',
    cafeId: 'cafe-1',
    tableNumber: '3',
    type: 'call_waiter',
    createdAt: '11:42',
    status: 'pending'
  },
  {
    id: 'call-2',
    cafeId: 'cafe-1',
    tableNumber: '5',
    type: 'request_bill',
    createdAt: '11:45',
    status: 'pending'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    cafeId: 'cafe-1',
    tableNumber: '3',
    items: [
      { item: initialItems[0], quantity: 2 },
      { item: initialItems[2], quantity: 4 },
      { item: initialItems[3], quantity: 1 }
    ],
    totalAmount: 141000,
    status: 'preparing',
    createdAt: '11:35',
    waiterName: 'Farrux Olimov'
  },
  {
    id: 'ord-102',
    cafeId: 'cafe-1',
    tableNumber: '5',
    items: [
      { item: initialItems[1], quantity: 3 },
      { item: initialItems[3], quantity: 2 }
    ],
    totalAmount: 90000,
    status: 'served',
    createdAt: '11:20',
    waiterName: 'Farrux Olimov'
  }
];
