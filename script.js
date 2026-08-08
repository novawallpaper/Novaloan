/* =========================================================
   Mitti Manor — app logic
   Keys/config live in config.js
   ========================================================= */

const CATEGORIES = [
  { key: "Indoor", title: "Indoor Plants", img: "https://loremflickr.com/600/800/houseplant,indoor/all?lock=201" },
  { key: "Outdoor", title: "Outdoor Plants", img: "https://loremflickr.com/600/800/gardenplant,garden/all?lock=202" },
  { key: "Flowering", title: "Flowering Plants", img: "https://loremflickr.com/600/800/flowerplant,flower/all?lock=203" },
  { key: "Succulents", title: "Succulents & Cacti", img: "https://loremflickr.com/600/800/succulent,cactus/all?lock=204" },
  { key: "AirPurifying", title: "Air-Purifying Plants", img: "https://loremflickr.com/600/800/leafplant,plant/all?lock=205" },
  { key: "Medicinal", title: "Medicinal & Herbal", img: "https://loremflickr.com/600/800/herbplant,herb/all?lock=206" },
  { key: "Bonsai", title: "Bonsai", img: "https://loremflickr.com/600/800/bonsai,tree/all?lock=207" },
  { key: "Fruit", title: "Fruit Plants", img: "https://loremflickr.com/600/800/fruitplant,fruit/all?lock=208" },
];

const PLANTS = [
  { id: 'p1', name: 'Money Plant (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 799, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=1', desc: 'Healthy Money Plant — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p2', name: 'Snake Plant (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 05, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=2', desc: 'Healthy Snake Plant — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p3', name: 'Areca Palm (Large)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 299, size: 'Large', tag: 'new', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=3', desc: 'Healthy Areca Palm — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p4', name: 'Peace Lily (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 249, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=4', desc: 'Healthy Peace Lily — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p5', name: 'ZZ Plant (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 799, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=5', desc: 'Healthy ZZ Plant — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p6', name: 'Spider Plant (Large)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 199, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=6', desc: 'Healthy Spider Plant — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p7', name: 'Rubber Plant (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 449, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=7', desc: 'Healthy Rubber Plant — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p8', name: 'Fiddle Leaf Fig (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 149, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=8', desc: 'Healthy Fiddle Leaf Fig — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p9', name: 'Philodendron (Large)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 299, size: 'Large', tag: 'new', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=9', desc: 'Healthy Philodendron — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p10', name: 'Pothos Golden (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 599, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=10', desc: 'Healthy Pothos Golden — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p11', name: 'Dracaena (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 149, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=11', desc: 'Healthy Dracaena — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p12', name: 'Aglaonema (Large)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 299, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=12', desc: 'Healthy Aglaonema — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p13', name: 'Calathea (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 449, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=13', desc: 'Healthy Calathea — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p14', name: 'Croton (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 499, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=14', desc: 'Healthy Croton — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p15', name: 'Anthurium (Large)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 349, size: 'Large', tag: 'bestseller', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=15', desc: 'Healthy Anthurium — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p16', name: 'Monstera Deliciosa (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 999, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=16', desc: 'Healthy Monstera Deliciosa — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p17', name: 'Bamboo Palm (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 899, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=17', desc: 'Healthy Bamboo Palm — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p18', name: 'Boston Fern (Large)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 399, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=18', desc: 'Healthy Boston Fern — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p19', name: 'Parlor Palm (Small)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 249, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=19', desc: 'Healthy Parlor Palm — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p20', name: 'Chinese Evergreen (Medium)', category: 'Indoor', categoryLabel: 'Indoor Plants', price: 999, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/houseplant,plant/all?lock=20', desc: 'Healthy Chinese Evergreen — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p21', name: 'Hibiscus (Small)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 199, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=21', desc: 'Healthy Hibiscus — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p22', name: 'Bougainvillea (Medium)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 449, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=22', desc: 'Healthy Bougainvillea — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p23', name: 'Rose Plant (Large)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 399, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=23', desc: 'Healthy Rose Plant — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p24', name: 'Jasmine (Small)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 699, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=24', desc: 'Healthy Jasmine — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p25', name: 'Marigold (Medium)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 999, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=25', desc: 'Healthy Marigold — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p26', name: 'Ixora (Large)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 899, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=26', desc: 'Healthy Ixora — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p27', name: 'Adenium Desert Rose (Small)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 599, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=27', desc: 'Healthy Adenium Desert Rose — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p28', name: 'Curry Leaf Tree (Medium)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 1499, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=28', desc: 'Healthy Curry Leaf Tree — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p29', name: 'Ashoka Tree (Large)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 199, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=29', desc: 'Healthy Ashoka Tree — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p30', name: 'Champa Plumeria (Small)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 349, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=30', desc: 'Healthy Champa Plumeria — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p31', name: 'Ficus Hedge (Medium)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 1499, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=31', desc: 'Healthy Ficus Hedge — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p32', name: 'Duranta (Large)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 699, size: 'Large', tag: 'new', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=32', desc: 'Healthy Duranta — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p33', name: 'Croton Garden (Small)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 899, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=33', desc: 'Healthy Croton Garden — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p34', name: 'Palm Tree (Medium)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 149, size: 'Medium', tag: 'new', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=34', desc: 'Healthy Palm Tree — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p35', name: 'Neem Sapling (Large)', category: 'Outdoor', categoryLabel: 'Outdoor Plants', price: 999, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/gardenplant,plant/all?lock=35', desc: 'Healthy Neem Sapling — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p36', name: 'Petunia (Small)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 199, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=36', desc: 'Healthy Petunia — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p37', name: 'Dahlia (Medium)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 1299, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=37', desc: 'Healthy Dahlia — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p38', name: 'Chrysanthemum (Large)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 449, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=38', desc: 'Healthy Chrysanthemum — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p39', name: 'Portulaca (Small)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 499, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=39', desc: 'Healthy Portulaca — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p40', name: 'Vinca (Medium)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 249, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=40', desc: 'Healthy Vinca — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p41', name: 'Lantana (Large)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 399, size: 'Large', tag: 'new', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=41', desc: 'Healthy Lantana — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p42', name: 'Hydrangea (Small)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 799, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=42', desc: 'Healthy Hydrangea — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p43', name: 'Gerbera (Medium)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 899, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=43', desc: 'Healthy Gerbera — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p44', name: 'Cosmos (Large)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 699, size: 'Large', tag: 'new', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=44', desc: 'Healthy Cosmos — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p45', name: 'Zinnia (Small)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 599, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=45', desc: 'Healthy Zinnia — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p46', name: 'Balsam (Medium)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 249, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=46', desc: 'Healthy Balsam — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p47', name: 'Gaillardia (Large)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 449, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=47', desc: 'Healthy Gaillardia — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p48', name: 'Salvia (Small)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 1499, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=48', desc: 'Healthy Salvia — small size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p49', name: 'Torenia (Medium)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 299, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=49', desc: 'Healthy Torenia — medium size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p50', name: 'Celosia (Large)', category: 'Flowering', categoryLabel: 'Flowering Plants', price: 1299, size: 'Large', tag: 'bestseller', img: 'https://loremflickr.com/500/650/flowerplant,plant/all?lock=50', desc: 'Healthy Celosia — large size, perfect for garden & landscaping. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p51', name: 'Echeveria (Small)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 299, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=51', desc: 'Healthy Echeveria — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p52', name: 'Haworthia (Medium)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 999, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=52', desc: 'Healthy Haworthia — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p53', name: 'Jade Plant (Large)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 449, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=53', desc: 'Healthy Jade Plant — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p54', name: 'Aloe Vera (Small)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 199, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=54', desc: 'Healthy Aloe Vera — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p55', name: 'Sedum (Medium)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 1499, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=55', desc: 'Healthy Sedum — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p56', name: 'String of Pearls (Large)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 1499, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=56', desc: 'Healthy String of Pearls — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p57', name: 'Barrel Cactus (Small)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 299, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=57', desc: 'Healthy Barrel Cactus — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p58', name: 'Bunny Ear Cactus (Medium)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 449, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=58', desc: 'Healthy Bunny Ear Cactus — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p59', name: 'Crown of Thorns (Large)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 249, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=59', desc: 'Healthy Crown of Thorns — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p60', name: 'Kalanchoe (Small)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 249, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=60', desc: 'Healthy Kalanchoe — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p61', name: 'Sansevieria Mini (Medium)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 899, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=61', desc: 'Healthy Sansevieria Mini — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p62', name: 'Ghost Plant (Large)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 599, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=62', desc: 'Healthy Ghost Plant — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p63', name: 'Zebra Haworthia (Small)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 899, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=63', desc: 'Healthy Zebra Haworthia — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p64', name: 'Christmas Cactus (Medium)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 449, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=64', desc: 'Healthy Christmas Cactus — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p65', name: 'Moon Cactus (Large)', category: 'Succulents', categoryLabel: 'Succulents & Cacti', price: 449, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/succulent,plant/all?lock=65', desc: 'Healthy Moon Cactus — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p66', name: 'Areca Palm Air (Small)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 299, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=66', desc: 'Healthy Areca Palm Air — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p67', name: 'Snake Plant XL (Medium)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 599, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=67', desc: 'Healthy Snake Plant XL — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p68', name: 'Peace Lily Air (Large)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 199, size: 'Large', tag: 'bestseller', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=68', desc: 'Healthy Peace Lily Air — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p69', name: 'Spider Plant Air (Small)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 1299, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=69', desc: 'Healthy Spider Plant Air — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p70', name: 'Bamboo Palm Air (Medium)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 249, size: 'Medium', tag: 'new', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=70', desc: 'Healthy Bamboo Palm Air — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p71', name: 'English Ivy (Large)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 999, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=71', desc: 'Healthy English Ivy — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p72', name: 'Rubber Plant Air (Small)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 699, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=72', desc: 'Healthy Rubber Plant Air — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p73', name: 'Aloe Air (Medium)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 449, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=73', desc: 'Healthy Aloe Air — medium size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p74', name: 'ZZ Plant Air (Large)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 699, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=74', desc: 'Healthy ZZ Plant Air — large size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p75', name: 'Dracaena Air (Small)', category: 'AirPurifying', categoryLabel: 'Air-Purifying Plants', price: 599, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/leafplant,plant/all?lock=75', desc: 'Healthy Dracaena Air — small size, perfect for home & office decor. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p76', name: 'Tulsi Holy Basil (Small)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 599, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=76', desc: 'Healthy Tulsi Holy Basil — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p77', name: 'Aloe Vera Medicinal (Medium)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 799, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=77', desc: 'Healthy Aloe Vera Medicinal — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p78', name: 'Mint Pudina (Large)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 799, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=78', desc: 'Healthy Mint Pudina — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p79', name: 'Lemongrass (Small)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 999, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=79', desc: 'Healthy Lemongrass — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p80', name: 'Ajwain Plant (Medium)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 999, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=80', desc: 'Healthy Ajwain Plant — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p81', name: 'Stevia (Large)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 199, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=81', desc: 'Healthy Stevia — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p82', name: 'Ashwagandha (Small)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 449, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=82', desc: 'Healthy Ashwagandha — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p83', name: 'Giloy (Medium)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 499, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=83', desc: 'Healthy Giloy — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p84', name: 'Brahmi (Large)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 899, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=84', desc: 'Healthy Brahmi — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p85', name: 'Curry Leaf Herbal (Small)', category: 'Medicinal', categoryLabel: 'Medicinal & Herbal', price: 599, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/herbplant,plant/all?lock=85', desc: 'Healthy Curry Leaf Herbal — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p86', name: 'Ficus Bonsai (Small)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 599, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=86', desc: 'Healthy Ficus Bonsai — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p87', name: 'Banyan Bonsai (Medium)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 1299, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=87', desc: 'Healthy Banyan Bonsai — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p88', name: 'Jade Bonsai (Large)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 1299, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=88', desc: 'Healthy Jade Bonsai — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p89', name: 'Chinese Elm Bonsai (Small)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 699, size: 'Small', tag: 'new', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=89', desc: 'Healthy Chinese Elm Bonsai — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p90', name: 'Bougainvillea Bonsai (Medium)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 249, size: 'Medium', tag: 'none', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=90', desc: 'Healthy Bougainvillea Bonsai — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p91', name: 'Juniper Bonsai (Large)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 999, size: 'Large', tag: 'new', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=91', desc: 'Healthy Juniper Bonsai — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p92', name: 'Peepal Bonsai (Small)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 599, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=92', desc: 'Healthy Peepal Bonsai — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p93', name: 'Money Plant Bonsai (Medium)', category: 'Bonsai', categoryLabel: 'Bonsai', price: 1499, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/bonsai,plant/all?lock=93', desc: 'Healthy Money Plant Bonsai — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p94', name: 'Lemon Plant (Small)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 699, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=94', desc: 'Healthy Lemon Plant — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p95', name: 'Guava Plant (Medium)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 499, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=95', desc: 'Healthy Guava Plant — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p96', name: 'Pomegranate Plant (Large)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 199, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=96', desc: 'Healthy Pomegranate Plant — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p97', name: 'Papaya Plant (Small)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 1499, size: 'Small', tag: 'none', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=97', desc: 'Healthy Papaya Plant — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p98', name: 'Fig Anjeer Plant (Medium)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 299, size: 'Medium', tag: 'bestseller', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=98', desc: 'Healthy Fig Anjeer Plant — medium size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p99', name: 'Mango Sapling (Large)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 299, size: 'Large', tag: 'none', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=99', desc: 'Healthy Mango Sapling — large size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
  { id: 'p100', name: 'Chikoo Sapling (Small)', category: 'Fruit', categoryLabel: 'Fruit Plants', price: 199, size: 'Small', tag: 'bestseller', img: 'https://loremflickr.com/500/650/fruitplant,plant/all?lock=100', desc: 'Healthy Chikoo Sapling — small size, perfect for plant lovers. Nursery-grown, well-rooted, ready to plant.' },
];const SAMPLES = PLANTS.filter((p) => p.tag === "bestseller").slice(0, 4);

/* Give every plant a small multi-image gallery (Amazon-style), built from
   its base image url by varying the "lock" param so each photo is different
   but stays on-topic for that plant. */
PLANTS.forEach((p) => {
  const m = p.img.match(/lock=(\d+)/);
  const baseLock = m ? parseInt(m[1], 10) : 1;
  p.images = [0, 1000, 2000, 3000].map((offset) =>
    p.img.replace(/lock=\d+/, `lock=${baseLock + offset}`)
  );
});

/* ---------------- In-memory state ----------------
   NOTE: user auth + favorites are also mirrored into localStorage so
   they survive a page refresh once this is hosted for real (localStorage
   only works on an actual deployed URL, not inside a sandboxed preview).
------------------------------------------------------ */
const state = {
  activeTab: "explore",
  activeFilter: "grid",
  catDetailCategory: null,
  catDetailFilter: "all",
  searchQuery: "",
  favorites: new Set(),
  cart: [], // [{ id, qty }]
  isSignedIn: false,
  user: null, // { name, email, picture }
  currentPlant: null,
  pendingOrderPlant: null, // plant waiting for delivery-details step
  landPhotoDataUrl: null, // optional photo for landscaping enquiry
};

/* =========================================================
   Init
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadFavoritesFromStorage();
  loadCartFromStorage();
  loadUserFromStorage();
  initGoogleSignIn();
  renderCollections();
  renderPlants();
  wireSearch();
  updateProfileUI();
  updateCartBadge();
});

/* =========================================================
   Tabs / navigation
   ========================================================= */
function switchTab(tab, el) {
  state.activeTab = tab;

  document.querySelectorAll(".screen-content").forEach((s) => s.classList.remove("active"));
  document.getElementById(`screen-${tab}`).classList.add("active");

  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  if (el) el.classList.add("active");
}

/* ----- Collections (Categories tab) ----- */
function renderCollections() {
  const el = document.getElementById("collection-carousel");
  el.innerHTML = CATEGORIES.map((c) => {
    const count = PLANTS.filter((p) => p.category === c.key).length;
    return `
      <div class="carousel-card" style="background-image:url('${c.img}')" onclick="openCategory('${c.key}')">
        <div class="carousel-info">
          <h2>${c.title}</h2>
          <p>${count} plant${count === 1 ? "" : "s"}</p>
          <button class="explore-pill-btn" onclick="event.stopPropagation(); openCategory('${c.key}')">Explore</button>
        </div>
      </div>
    `;
  }).join("");
}

/* ----- Category detail screen ----- */
function openCategory(category) {
  state.catDetailCategory = category;
  state.catDetailFilter = "all";
  document.getElementById("cat-detail-title").textContent =
    CATEGORIES.find((c) => c.key === category)?.title || category;

  document.querySelectorAll(".cat-tab").forEach((t) => t.classList.remove("active"));
  document.querySelector('.cat-tab[data-cat-filter="all"]').classList.add("active");

  switchTab("category-detail", null);
  renderCategoryDetailGrid();
}

function switchCatTab(el) {
  document.querySelectorAll(".cat-tab").forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  state.catDetailFilter = el.dataset.catFilter;
  renderCategoryDetailGrid();
}

function renderCategoryDetailGrid() {
  let list = PLANTS.filter((p) => p.category === state.catDetailCategory);
  if (state.catDetailFilter === "bestseller") list = list.filter((p) => p.tag === "bestseller");
  if (state.catDetailFilter === "new") list = list.filter((p) => p.tag === "new");

  const container = document.getElementById("cat-detail-grid");
  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:30px 0;">No plants found.</p>`;
    return;
  }
  container.innerHTML = list.map(cardHtml).join("");
}

function switchSubCat(el) {
  document.querySelectorAll(".sub-cat-item").forEach((s) => s.classList.remove("active"));
  el.classList.add("active");
  state.activeFilter = el.dataset.filter;
  renderPlants();
}

/* =========================================================
   Search
   ========================================================= */
function wireSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    renderPlants();
  });
}

/* Improved search: matches partial words anywhere in the query against
   name, category, size and description — not just a full-word match. */
function plantMatchesSearch(p, query) {
  const haystack = [p.name, p.categoryLabel, p.category, p.size, p.desc]
    .join(" ")
    .toLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  // every typed word just needs to appear *somewhere* in the text (substring),
  // so "mon pla" still finds "Money Plant".
  return words.every((w) => haystack.includes(w));
}

/* =========================================================
   Rendering (Explore tab)
   ========================================================= */
function getFilteredPlants() {
  let list = PLANTS.slice();

  if (state.searchQuery) {
    list = list.filter((p) => plantMatchesSearch(p, state.searchQuery));
  }

  switch (state.activeFilter) {
    case "gift": // Budget
      list = list.filter((p) => p.price <= 300);
      break;
    case "indoor":
      list = list.filter((p) => p.category === "Indoor");
      break;
    case "outdoor":
      list = list.filter((p) => p.category === "Outdoor");
      break;
    case "fire":
      list = list.filter((p) => p.tag === "bestseller" || p.tag === "new");
      break;
    default:
      break;
  }

  return list;
}

function renderPlants() {
  const container = document.getElementById("wallpaper-grid-container");
  const list = getFilteredPlants();

  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:30px 0;">No plants found.</p>`;
    return;
  }

  container.innerHTML = list.map(cardHtml).join("");
}

function cardHtml(p) {
  return `
    <div class="wallpaper-card" style="background-image:url('${p.img}')" onclick="openPlant('${p.id}')">
      <div class="card-bottom">
        <div class="card-time">${p.categoryLabel}</div>
        <div class="card-clock">₹${p.price}</div>
        <div class="card-title">${p.name}</div>
      </div>
    </div>
  `;
}

function toggleFavorite(event, id) {
  if (event) event.stopPropagation();
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  saveFavoritesToStorage();
  renderPlants();
  renderCategoryDetailGrid();
  updateHeaderFavIcon();
}

function toggleFavoriteCurrent() {
  if (!state.currentPlant) return;
  toggleFavorite(null, state.currentPlant.id);
  updateEditorFavIcon();
}

function updateEditorFavIcon() {
  const btn = document.getElementById("editor-fav-btn");
  if (!btn || !state.currentPlant) return;
  const isFav = state.favorites.has(state.currentPlant.id);
  btn.classList.toggle("is-favorited", isFav);
}

function updateHeaderFavIcon() {
  const btn = document.getElementById("header-fav-btn");
  if (!btn) return;
  btn.classList.toggle("is-favorited", state.favorites.size > 0);
}

function openFavoritesScreen() {
  renderFavoritesGrid();
  switchTab("favorites", null);
}

function renderFavoritesGrid() {
  const container = document.getElementById("favorites-grid");
  const list = PLANTS.filter((p) => state.favorites.has(p.id));
  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:30px 0;">No favorites yet. Tap the heart on a product to save it here.</p>`;
    return;
  }
  container.innerHTML = list.map(cardHtml).join("");
}

function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem("mitti_favorites");
    if (raw) state.favorites = new Set(JSON.parse(raw));
  } catch (e) {}
}
function saveFavoritesToStorage() {
  try {
    localStorage.setItem("mitti_favorites", JSON.stringify([...state.favorites]));
  } catch (e) {}
}

/* =========================================================
   Cart
   ========================================================= */
function addToCart() {
  if (!state.currentPlant) return;
  const id = state.currentPlant.id;
  const existing = state.cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  saveCartToStorage();
  updateCartBadge();
  showToast(`${state.currentPlant.name} added to cart`);
}

function removeFromCart(id) {
  state.cart = state.cart.filter((c) => c.id !== id);
  saveCartToStorage();
  updateCartBadge();
  renderCartScreen();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;
  const count = state.cart.reduce((sum, c) => sum + c.qty, 0);
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function openCartScreen() {
  renderCartScreen();
  switchTab("cart", null);
}

function renderCartScreen() {
  const listEl = document.getElementById("cart-items-list");
  const emptyEl = document.getElementById("cart-empty-msg");
  if (state.cart.length === 0) {
    listEl.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  let total = 0;
  listEl.innerHTML = state.cart
    .map((c) => {
      const p = PLANTS.find((x) => x.id === c.id);
      if (!p) return "";
      total += p.price * c.qty;
      return `
        <div class="cart-item-row">
          <div class="cart-item-img" style="background-image:url('${p.img}')"></div>
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <p>${p.categoryLabel}</p>
            <div class="cart-item-price">₹${p.price} <span style="color:var(--text-muted); font-weight:500;">× ${c.qty}</span></div>
          </div>
          <div class="cart-item-remove" onclick="removeFromCart('${p.id}')"><i class="fa-solid fa-trash"></i></div>
        </div>
      `;
    })
    .join("");

  listEl.innerHTML += `
    <div class="cart-total-row">
      <span>Total</span>
      <span>₹${total}</span>
    </div>
    <button class="order-pay-btn" onclick="openWhatsApp('Hi, I want to order these items from my cart: ${state.cart.map((c) => { const p = PLANTS.find((x) => x.id === c.id); return p ? `${p.name} x${c.qty}` : ""; }).join(", ")}')">
      <i class="fa-brands fa-whatsapp"></i> Checkout on WhatsApp
    </button>
  `;
}

function saveCartToStorage() {
  try {
    localStorage.setItem("mitti_cart", JSON.stringify(state.cart));
  } catch (e) {}
}
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem("mitti_cart");
    if (raw) state.cart = JSON.parse(raw);
  } catch (e) {}
}

/* =========================================================
   Plant detail screen
   ========================================================= */
function openPlant(id) {
  const p = PLANTS.find((x) => x.id === id);
  if (!p) return;
  state.currentPlant = p;

  renderEditorGallery(p);
  document.getElementById("product-name").textContent = p.name;
  document.getElementById("product-category").textContent = p.categoryLabel;
  document.getElementById("product-price").textContent = `₹${p.price}`;
  document.getElementById("product-description").textContent = p.desc;

  updateEditorFavIcon();
  switchTab("editor", null);
}

function renderEditorGallery(p) {
  const track = document.getElementById("editor-gallery-track");
  const dots = document.getElementById("editor-gallery-dots");
  const images = p.images && p.images.length ? p.images : [p.img];

  track.innerHTML = images
    .map((src) => `<div class="gallery-slide" style="background-image:url('${src}')"></div>`)
    .join("");
  track.style.width = `${images.length * 100}%`;
  track.querySelectorAll(".gallery-slide").forEach((el) => {
    el.style.width = `${100 / images.length}%`;
  });

  dots.innerHTML = images
    .map((_, i) => `<span class="gallery-dot ${i === 0 ? "active" : ""}"></span>`)
    .join("");

  let current = 0;
  track.onscroll = () => {
    const w = track.clientWidth;
    const idx = Math.round(track.scrollLeft / w);
    if (idx !== current) {
      current = idx;
      dots.querySelectorAll(".gallery-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
    }
  };
}

function closeEditorScreen() {
  switchTab("explore", document.getElementById("nav-explore"));
}

/* =========================================================
   WhatsApp
   ========================================================= */
function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function openWhatsAppForCurrentPlant() {
  if (!state.currentPlant) {
    openWhatsApp("Hi, I want to know more about your plants.");
    return;
  }
  openWhatsApp(
    `Hi, I'm interested in "${state.currentPlant.name}" (₹${state.currentPlant.price}). Can you share more details?`
  );
}

/* =========================================================
   Google Sign-In
   ========================================================= */
function initGoogleSignIn() {
  if (!window.google || !google.accounts || !google.accounts.id) {
    // GIS script may still be loading; retry shortly.
    setTimeout(initGoogleSignIn, 300);
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
  });

  // Render an actual (invisible-ish) Google button we can trigger,
  // since Google requires its own button for the styled prompt to work
  // reliably across browsers.
  const wrapper = document.getElementById("g_id_signin_wrapper");
  if (wrapper) {
    google.accounts.id.renderButton(wrapper, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 260,
    });
  }
}

function triggerGoogleLogin() {
  // Clicking our custom button "forwards" the click to Google's real button.
  const realBtn = document.querySelector("#g_id_signin_wrapper div[role=button]");
  if (realBtn) {
    realBtn.click();
  } else if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.prompt();
  } else {
    showToast("Google Sign-In is still loading, try again in a second.");
  }
}

function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch (e) {
    return null;
  }
}

function handleGoogleCredential(response) {
  const payload = decodeJwt(response.credential);
  if (!payload) {
    showToast("Login failed, please try again.");
    return;
  }
  state.isSignedIn = true;
  state.user = {
    name: payload.name || "",
    email: payload.email || "",
    picture: payload.picture || "",
  };
  saveUserToStorage();
  updateProfileUI();
  showToast(`Welcome, ${state.user.name.split(" ")[0]}!`);

  // If the user was in the middle of ordering, continue automatically.
  if (state.pendingOrderPlant) {
    const plant = state.pendingOrderPlant;
    state.pendingOrderPlant = null;
    openDeliveryDetailsScreen(plant);
  }
}

function logoutUser() {
  state.isSignedIn = false;
  state.user = null;
  try {
    localStorage.removeItem("mitti_user");
  } catch (e) {}
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.disableAutoSelect();
  }
  updateProfileUI();
  showToast("Logged out");
}

function updateProfileUI() {
  const out = document.getElementById("profile-logged-out");
  const wrap = document.getElementById("account-logged-in-wrap");
  if (state.isSignedIn && state.user) {
    out.style.display = "none";
    wrap.style.display = "block";
    document.getElementById("profile-name").textContent = state.user.name;
    document.getElementById("profile-email").textContent = state.user.email;
    const avatar = document.getElementById("profile-avatar");
    if (state.user.picture) {
      avatar.style.backgroundImage = `url('${state.user.picture}')`;
      avatar.textContent = "";
    } else {
      avatar.style.backgroundImage = "";
      avatar.textContent = (state.user.name || "?").charAt(0).toUpperCase();
    }
  } else {
    out.style.display = "flex";
    wrap.style.display = "none";
  }
}

function saveUserToStorage() {
  try {
    localStorage.setItem("mitti_user", JSON.stringify(state.user));
  } catch (e) {}
}
function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem("mitti_user");
    if (raw) {
      state.user = JSON.parse(raw);
      state.isSignedIn = true;
    }
  } catch (e) {}
}

/* =========================================================
   Order flow: Order Now -> (login if needed) -> delivery details -> advance payment
   ========================================================= */
function startOrder() {
  if (!state.currentPlant) return;

  if (!state.isSignedIn) {
    state.pendingOrderPlant = state.currentPlant;
    showToast("Please login with Google to continue your order");
    switchTab("settings", document.getElementById("nav-settings"));
    setTimeout(() => triggerGoogleLogin(), 400);
    return;
  }

  openDeliveryDetailsScreen(state.currentPlant);
}

function openDeliveryDetailsScreen(plant) {
  state.currentPlant = plant;

  // Prefill from logged-in user where possible
  document.getElementById("ord-name").value = state.user?.name || "";
  document.getElementById("ord-phone").value = "";
  document.getElementById("ord-email").value = state.user?.email || "";
  document.getElementById("ord-address").value = "";
  document.getElementById("ord-pincode").value = "";
  document.getElementById("ord-area").value = "";
  document.getElementById("ord-landmark").value = "";

  const advance = Math.round(plant.price * ADVANCE_PERCENT);
  document.getElementById("ord-summary-plant").textContent = plant.name;
  document.getElementById("ord-summary-full").textContent = `₹${plant.price}`;
  document.getElementById("ord-summary-advance").textContent = `₹${advance}`;

  switchTab("premium", null);
}

function closeOrderFlow() {
  switchTab("editor", null);
}

function validateDeliveryForm() {
  const name = document.getElementById("ord-name").value.trim();
  const phone = document.getElementById("ord-phone").value.trim();
  const email = document.getElementById("ord-email").value.trim();
  const address = document.getElementById("ord-address").value.trim();
  const pincode = document.getElementById("ord-pincode").value.trim();
  const area = document.getElementById("ord-area").value.trim();

  if (!name || !phone || !email || !address || !pincode || !area) {
    showToast("Please fill all required delivery details");
    return null;
  }
  if (!/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10))) {
    showToast("Please enter a valid 10-digit phone number");
    return null;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showToast("Please enter a valid email");
    return null;
  }

  return {
    name,
    phone,
    email,
    address,
    pincode,
    area,
    landmark: document.getElementById("ord-landmark").value.trim(),
  };
}

function payAdvance() {
  const plant = state.currentPlant;
  if (!plant) return;

  const details = validateDeliveryForm();
  if (!details) return;

  const advanceAmount = Math.round(plant.price * ADVANCE_PERCENT);
  const btn = document.getElementById("ord-pay-advance-btn");
  btn.disabled = true;
  btn.textContent = "Opening payment...";

  const rzp = new Razorpay({
    key: RAZORPAY_KEY_ID,
    amount: advanceAmount * 100, // paise
    currency: "INR",
    name: "Mitti Manor",
    description: `Advance for ${plant.name}`,
    prefill: {
      name: details.name,
      email: details.email,
      contact: details.phone,
    },
    theme: { color: "#1a6cf0" },
    handler: function (response) {
      sendOrderEmail(plant, details, advanceAmount, response.razorpay_payment_id);
      showToast("Payment successful! Order confirmed.");
      switchTab("explore", document.getElementById("nav-explore"));
      btn.disabled = false;
      btn.textContent = "Pay Advance & Confirm Order";
    },
    modal: {
      ondismiss: function () {
        btn.disabled = false;
        btn.textContent = "Pay Advance & Confirm Order";
      },
    },
  });

  rzp.on("payment.failed", function () {
    showToast("Payment failed. Please try again.");
    btn.disabled = false;
    btn.textContent = "Pay Advance & Confirm Order";
  });

  rzp.open();
}

function sendOrderEmail(plant, details, advanceAmount, paymentId) {
  const remaining = plant.price - advanceAmount;
  const message = [
    `NEW PLANT ORDER`,
    ``,
    `Plant: ${plant.name}`,
    `Category: ${plant.categoryLabel}`,
    `Price: ₹${plant.price}`,
    `Advance Paid (25%): ₹${advanceAmount}`,
    `Remaining (on delivery): ₹${remaining}`,
    `Razorpay Payment ID: ${paymentId || "N/A"}`,
    ``,
    `Customer Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Address: ${details.address}`,
    `Pincode: ${details.pincode}`,
    `Area: ${details.area}`,
    `Landmark: ${details.landmark || "-"}`,
  ].join("\n");

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New Order: ${plant.name} — Advance Paid ₹${advanceAmount}`,
      from_name: "Mitti Manor Website",
      name: details.name,
      email: details.email,
      message: message,
    }),
  }).catch(() => {
    // Even if the email fails to send, the payment has gone through;
    // don't block the user, but let them know to follow up on WhatsApp.
    showToast("Order placed, but confirmation email failed. We'll reach out on WhatsApp.");
  });

  // Also open WhatsApp so the customer/owner has an instant channel too.
  openWhatsApp(
    `Hi, I just placed an order for "${plant.name}" and paid ₹${advanceAmount} advance (Payment ID: ${paymentId || "N/A"}). My delivery address: ${details.address}, ${details.area}, ${details.pincode}.`
  );
}

/* =========================================================
   Landscaping enquiry
   ========================================================= */
function openLandscapingScreen() {
  switchTab("order", null);
}

function handleLandPhotoChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.landPhotoDataUrl = reader.result;
    document.getElementById("land-photo-preview").src = reader.result;
    document.getElementById("land-photo-preview-wrap").style.display = "block";
    document.getElementById("land-upload-box").style.display = "none";
  };
  reader.readAsDataURL(file);
}

function removeLandPhoto() {
  state.landPhotoDataUrl = null;
  document.getElementById("land-photo-input").value = "";
  document.getElementById("land-photo-preview-wrap").style.display = "none";
  document.getElementById("land-upload-box").style.display = "block";
}

function submitLandscapingEnquiry() {
  const name = document.getElementById("land-name").value.trim();
  const phone = document.getElementById("land-phone").value.trim();
  const email = document.getElementById("land-email").value.trim();
  const propertyType = document.getElementById("land-property-type").value;
  const location = document.getElementById("land-location").value.trim();
  const requirement = document.getElementById("order-message").value.trim();
  const photoFile = document.getElementById("land-photo-input").files[0];

  if (!name || !phone || !email || !location || !requirement) {
    showToast("Please fill all details");
    return;
  }
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
    showToast("Please enter a valid 10-digit phone number");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
    showToast("Please enter a valid email address");
    return;
  }

  const btn = document.getElementById("order-pay-btn");
  btn.disabled = true;
  btn.textContent = "Sending...";

  const message = [
    `NEW LANDSCAPING ENQUIRY`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Property Type: ${propertyType}`,
    `Location: ${location}`,
    ``,
    `Requirement:`,
    requirement,
  ].join("\n");

  // Use FormData so an optional photo can be attached (Web3Forms supports files).
  const formData = new FormData();
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append("subject", `Landscaping Enquiry from ${name} (${propertyType})`);
  formData.append("from_name", "Mitti Manor Website");
  formData.append("name", name);
  formData.append("email", email);
  formData.append("message", message);
  if (photoFile) formData.append("attachment", photoFile);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      showToast("Enquiry sent! We'll contact you soon.");
      // Same details are also sent straight to our WhatsApp so nothing is missed.
      openWhatsApp(message);
      document.getElementById("land-name").value = "";
      document.getElementById("land-phone").value = "";
      document.getElementById("land-email").value = "";
      document.getElementById("land-location").value = "";
      document.getElementById("order-message").value = "";
      removeLandPhoto();
      switchTab("request", document.getElementById("nav-request"));
    })
    .catch(() => {
      showToast("Something went wrong. Please try WhatsApp instead.");
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "Send Enquiry";
    });
}

/* =========================================================
   Legal & Policies
   ========================================================= */
const LEGAL_POLICIES = [
  {
    key: "terms",
    title: "Terms and Conditions",
    body:
      "Welcome to Mitti Manor. By browsing this app and placing an order, you agree to purchase plants and landscaping services as described, at the prices listed at the time of order.\n\nAll orders are subject to availability. We reserve the right to refuse or cancel any order due to stock issues, pricing errors, or suspected fraud, in which case any advance paid will be refunded.\n\nProduct images are representative — natural variation in size, colour and shape is normal for live plants.",
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    body:
      "We collect only the information needed to process your order and enquiries: name, phone number, email, delivery address, and (optionally) a photo of your space for landscaping projects.\n\nThis information is used solely to fulfil your order, contact you on WhatsApp/email, and improve our service. We do not sell your data to third parties.\n\nPayment is processed securely via Razorpay; we do not store your card or bank details.",
  },
  {
    key: "returns",
    title: "Returns, Refunds and Replacement Policy",
    body:
      "If a plant arrives damaged, wilted, or significantly different from what was ordered, please contact us on WhatsApp within 24 hours of delivery with photos.\n\nWe will offer a free replacement or a refund of the amount paid, at our discretion, once the issue is verified.\n\nDue to the perishable nature of plants, returns are not accepted for change of mind after delivery.",
  },
  {
    key: "cancellation",
    title: "Cancellation Policy",
    body:
      "Orders can be cancelled free of charge before the advance payment is made.\n\nOnce the advance payment is completed, cancellations are subject to a review — since plants are prepared/reserved specifically for your order, the advance amount may not be refundable if cancellation is requested after preparation has begun.\n\nFor landscaping enquiries, cancellation before the consultation call is always free.",
  },
  {
    key: "ip",
    title: "Intellectual Property Policy",
    body:
      "All content on this app — including the Mitti Manor name, logo, photos, and written descriptions — is the property of Mitti Manor unless otherwise credited.\n\nYou may not copy, reproduce, or reuse this content for commercial purposes without our written permission.",
  },
  {
    key: "whistleblower",
    title: "Whistleblower Policy",
    body:
      "If you become aware of any unethical, fraudulent, or unsafe practice connected with Mitti Manor, please report it to us directly via email at mittimanor@gmail.com.\n\nAll reports will be treated confidentially and reviewed by our team.",
  },
];

function openLegalScreen() {
  renderLegalList();
  switchTab("legal", null);
}

function renderLegalList() {
  const container = document.getElementById("legal-list");
  container.innerHTML = LEGAL_POLICIES.map(
    (item) => `
      <div class="settings-row" onclick="openLegalDetail('${item.key}')">
        <div class="settings-row-icon"><i class="fa-solid fa-file-lines"></i></div>
        <div class="settings-row-text"><h4>${item.title}</h4></div>
        <div class="settings-row-arrow"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
    `
  ).join("");
}

function openLegalDetail(key) {
  const item = LEGAL_POLICIES.find((x) => x.key === key);
  if (!item) return;
  document.getElementById("legal-detail-title").textContent = item.title;
  document.getElementById("legal-detail-body").textContent = item.body;
  switchTab("legal-detail", null);
}

/* =========================================================
   Toast
   ========================================================= */
let toastTimeout;
function showToast(msg) {
  const el = document.getElementById("app-toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.classList.remove("show");
  }, 3000);
}
