export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  type: "local" | "cj";
  description?: string;
  category: string;
}

export const products: Product[] = [
  // PHONES CATEGORY
  {
    "id": 1,
    "name": "iPhone 13 Pro Max",
    "price": "$899.00",
    "image": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
    "type": "local",
    "category": "phones"
  },
  {
    "id": 2,
    "name": "Samsung Galaxy S23",
    "price": "$799.00",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    "type": "local",
    "category": "phones"
  },
  {
    "id": 3,
    "name": "Google Pixel 7 Pro",
    "price": "$699.00",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    "type": "cj",
    "description": "Latest Google flagship",
    "category": "phones"
  },
  {
    "id": 4,
    "name": "OnePlus 11",
    "price": "$649.00",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    "type": "cj",
    "description": "Flagship killer phone",
    "category": "phones"
  },
  {
    "id": 5,
    "name": "Xiaomi 13 Pro",
    "price": "$599.00",
    "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
    "type": "local",
    "category": "phones"
  },
  
  // POWER BANKS CATEGORY
  {
    "id": 6,
    "name": "Anker PowerCore 20000mAh",
    "price": "$45.00",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    "type": "local",
    "category": "powerbanks"
  },
  {
    "id": 7,
    "name": "RAVPower 26800mAh",
    "price": "$55.00",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    "type": "local",
    "category": "powerbanks"
  },
  {
    "id": 8,
    "name": "Xiaomi 10000mAh Power Bank",
    "price": "$25.00",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    "type": "local",
    "category": "powerbanks"
  },
  {
    "id": 9,
    "name": "Baseus 30000mAh Fast Charge",
    "price": "$65.00",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    "type": "cj",
    "description": "65W fast charging power bank",
    "category": "powerbanks"
  },
  {
    "id": 10,
    "name": "Aukey 20000mAh Slim",
    "price": "$35.00",
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    "type": "local",
    "category": "powerbanks"
  },
  
  // AUDIO CATEGORY (Airbuds + Headsets)
  {
    "id": 11,
    "name": "AirPods Pro 2nd Gen",
    "price": "$249.00",
    "image": "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
    "type": "local",
    "category": "audio"
  },
  {
    "id": 12,
    "name": "Sony WH-1000XM5",
    "price": "$399.00",
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    "type": "cj",
    "description": "Premium noise cancelling headphones",
    "category": "audio"
  },
  {
    "id": 13,
    "name": "Samsung Galaxy Buds Pro",
    "price": "$199.00",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    "type": "local",
    "category": "audio"
  },
  {
    "id": 14,
    "name": "Bose QuietComfort Earbuds",
    "price": "$279.00",
    "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    "type": "cj",
    "description": "World-class noise cancellation",
    "category": "audio"
  },
  {
    "id": 15,
    "name": "JBL Tune 760NC",
    "price": "$129.00",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "type": "local",
    "category": "audio"
  },
  {
    "id": 16,
    "name": "Beats Studio Buds",
    "price": "$149.00",
    "image": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400",
    "type": "local",
    "category": "audio"
  },
  {
    "id": 17,
    "name": "Sennheiser Momentum 4",
    "price": "$379.00",
    "image": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
    "type": "cj",
    "description": "Audiophile-grade wireless headphones",
    "category": "audio"
  },
  {
    "id": 18,
    "name": "Anker Soundcore Life Q30",
    "price": "$79.00",
    "image": "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400",
    "type": "local",
    "category": "audio"
  },
  
  // TABLETS CATEGORY
  {
    "id": 19,
    "name": "iPad Pro 12.9 inch",
    "price": "$1099.00",
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    "type": "cj",
    "description": "M2 chip powerhouse",
    "category": "tablets"
  },
  {
    "id": 20,
    "name": "Samsung Galaxy Tab S8",
    "price": "$699.00",
    "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    "type": "local",
    "category": "tablets"
  },
  {
    "id": 21,
    "name": "iPad Air 5th Gen",
    "price": "$599.00",
    "image": "https://images.unsplash.com/photo-1585790050230-5dd28404f905?w=400",
    "type": "local",
    "category": "tablets"
  },
  {
    "id": 22,
    "name": "Microsoft Surface Pro 9",
    "price": "$999.00",
    "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    "type": "cj",
    "description": "2-in-1 laptop tablet",
    "category": "tablets"
  },
  {
    "id": 23,
    "name": "Lenovo Tab P11 Pro",
    "price": "$499.00",
    "image": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
    "type": "local",
    "category": "tablets"
  },
  
  // LAPTOPS CATEGORY
  {
    "id": 24,
    "name": "MacBook Pro 16 inch",
    "price": "$2499.00",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    "type": "cj",
    "description": "M2 Max chip",
    "category": "laptops"
  },
  {
    "id": 25,
    "name": "Dell XPS 15",
    "price": "$1799.00",
    "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
    "type": "local",
    "category": "laptops"
  },
  {
    "id": 26,
    "name": "HP Spectre x360",
    "price": "$1499.00",
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "type": "local",
    "category": "laptops"
  },
  {
    "id": 27,
    "name": "Lenovo ThinkPad X1 Carbon",
    "price": "$1899.00",
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    "type": "cj",
    "description": "Business ultrabook",
    "category": "laptops"
  },
  {
    "id": 28,
    "name": "ASUS ROG Zephyrus G14",
    "price": "$1699.00",
    "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    "type": "local",
    "category": "laptops"
  },
  {
    "id": 29,
    "name": "MacBook Air M2",
    "price": "$1199.00",
    "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
    "type": "local",
    "category": "laptops"
  },
  {
    "id": 30,
    "name": "Microsoft Surface Laptop 5",
    "price": "$999.00",
    "image": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    "type": "cj",
    "description": "Sleek Windows laptop",
    "category": "laptops"
  },
  
  // SPEAKERS CATEGORY
  {
    "id": 31,
    "name": "JBL Flip 6",
    "price": "$129.00",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    "type": "local",
    "category": "speakers"
  },
  {
    "id": 32,
    "name": "Bose SoundLink Revolve+",
    "price": "$329.00",
    "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
    "type": "cj",
    "description": "360-degree sound",
    "category": "speakers"
  },
  {
    "id": 33,
    "name": "Sony SRS-XB43",
    "price": "$249.00",
    "image": "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400",
    "type": "local",
    "category": "speakers"
  },
  {
    "id": 34,
    "name": "UE BOOM 3",
    "price": "$149.00",
    "image": "https://images.unsplash.com/photo-1531104985437-603d6490e6d4?w=400",
    "type": "local",
    "category": "speakers"
  },
  {
    "id": 35,
    "name": "Anker Soundcore Motion+",
    "price": "$99.00",
    "image": "https://images.unsplash.com/photo-1507646871304-c8eb7c93e994?w=400",
    "type": "local",
    "category": "speakers"
  },
  {
    "id": 36,
    "name": "Marshall Emberton",
    "price": "$169.00",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    "type": "cj",
    "description": "Iconic Marshall sound",
    "category": "speakers"
  },
  
  // CHARGERS CATEGORY
  {
    "id": 37,
    "name": "Anker 65W GaN Charger",
    "price": "$45.00",
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
    "type": "local",
    "category": "chargers"
  },
  {
    "id": 38,
    "name": "Apple 20W USB-C Adapter",
    "price": "$19.00",
    "image": "https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=400",
    "type": "local",
    "category": "chargers"
  },
  {
    "id": 39,
    "name": "Belkin 3-in-1 Wireless Charger",
    "price": "$149.00",
    "image": "https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=400",
    "type": "cj",
    "description": "Charge phone, watch, and earbuds",
    "category": "chargers"
  },
  {
    "id": 40,
    "name": "Samsung 45W Super Fast Charger",
    "price": "$49.00",
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
    "type": "local",
    "category": "chargers"
  },
  {
    "id": 41,
    "name": "Anker PowerPort III 4-Port",
    "price": "$39.00",
    "image": "https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=400",
    "type": "local",
    "category": "chargers"
  },
  {
    "id": 42,
    "name": "RAVPower 90W Laptop Charger",
    "price": "$59.00",
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
    "type": "cj",
    "description": "Universal laptop charging",
    "category": "chargers"
  },
  
  // OTHERS CATEGORY (Phone cases, tripod stands, accessories)
  {
    "id": 43,
    "name": "Spigen Tough Armor Case",
    "price": "$29.00",
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 44,
    "name": "OtterBox Defender Series",
    "price": "$49.00",
    "image": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 45,
    "name": "Phone Tripod Stand",
    "price": "$19.00",
    "image": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 46,
    "name": "PopSocket Phone Grip",
    "price": "$9.99",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 47,
    "name": "Laptop Sleeve 15-inch",
    "price": "$24.00",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 48,
    "name": "Screen Protector Pack",
    "price": "$12.00",
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 49,
    "name": "Car Phone Mount",
    "price": "$15.00",
    "image": "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 50,
    "name": "USB-C to Lightning Cable",
    "price": "$19.00",
    "image": "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 51,
    "name": "Wireless Mouse",
    "price": "$29.00",
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 52,
    "name": "Mechanical Keyboard",
    "price": "$89.00",
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    "type": "cj",
    "description": "RGB backlit gaming keyboard",
    "category": "others"
  },
  {
    "id": 53,
    "name": "Webcam 1080P HD",
    "price": "$49.00",
    "image": "https://images.unsplash.com/photo-1589739900243-c842c7e0e8b1?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 54,
    "name": "Ring Light with Stand",
    "price": "$39.00",
    "image": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 55,
    "name": "Laptop Stand Aluminum",
    "price": "$34.00",
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 56,
    "name": "Cable Organizer Set",
    "price": "$14.00",
    "image": "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 57,
    "name": "Desk Organizer",
    "price": "$22.00",
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 58,
    "name": "Anti-Theft Backpack",
    "price": "$45.00",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    "type": "local",
    "category": "others"
  },
  {
    "id": 59,
    "name": "Portable SSD 1TB",
    "price": "$129.00",
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
    "type": "cj",
    "description": "Fast external storage",
    "category": "others"
  },
  {
    "id": 60,
    "name": "USB Hub 7-in-1",
    "price": "$35.00",
    "image": "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    "type": "local",
    "category": "others"
  }
];
