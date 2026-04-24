import type { QRISData } from '@/lib/qris';
import { IconBuildingStore } from '@tabler/icons-react';

interface MerchantInfoProps {
  data: QRISData;
  showAmount?: boolean;
}

const MCC_CATEGORIES: Record<string, string> = {
  '0742': 'Veterinarian Services',
  '0763': 'Agricultural Co-ops',
  '0780': 'Horticultural Services',
  '1520': 'General Contractors',
  '1711': 'HVAC',
  '1731': 'Electrical Contractors',
  '1740': 'Masonry & Stone',
  '1750': 'Carpentry Contractors',
  '1761': 'Roofing & Siding',
  '1771': 'Concrete Contractors',
  '2842': 'Cleaning & Maintenance',
  '3000-3299': 'Airlines',
  '3351-3441': 'Car Rental',
  '3501-3799': 'Hotels & Motels',
  '4111': 'Transportation',
  '4112': 'Passenger Railways',
  '4121': 'Taxicabs',
  '4215': 'Courier Services',
  '4411': 'Cruise Lines',
  '4812': 'Telecom Equipment',
  '4814': 'Telecom Services',
  '4821': 'Money Orders',
  '4829': 'Wire Transfer',
  '4899': 'Cable & Streaming',
  '4900': 'Utilities',
  '5013': 'Auto Supplies',
  '5021': 'Office Furniture',
  '5039': 'Construction Materials',
  '5044': 'Office Equipment',
  '5045': 'Computer Systems',
  '5046': 'Undertakers',
  '5047': 'Medical Equipment',
  '5051': 'Metal Service Centers',
  '5065': 'Electrical Parts',
  '5072': 'Hardware Equipment',
  '5074': 'Plumbing Supplies',
  '5085': 'Industrial Supplies',
  '5094': 'Jewelry & Watches',
  '5099': 'Durable Goods',
  '5111': 'Stationery',
  '5122': 'Pharmaceuticals',
  '5131': 'Piece Goods',
  '5137': 'Mens & Boys Clothing',
  '5139': 'Womens Clothing',
  '5169': 'Chemicals',
  '5172': 'Petroleum Products',
  '5192': 'Books & Periodicals',
  '5193': 'Florists',
  '5198': 'Paints',
  '5199': 'Non-Durable Goods',
  '5200': 'Home Improvement',
  '5211': 'Building Materials',
  '5231': 'Paint & Glass',
  '5251': 'Hardware Stores',
  '5261': 'Nurseries',
  '5271': 'Mobile Homes',
  '5300': 'Wholesale Clubs',
  '5309': 'Duty Free',
  '5310': 'Discount Stores',
  '5311': 'Department Stores',
  '5331': 'Variety Stores',
  '5399': 'Misc General Merchandise',
  '5411': 'Grocery Stores',
  '5422': 'Meat & Fish',
  '5441': 'Candy & Nuts',
  '5451': 'Dairy Products',
  '5462': 'Bakeries',
  '5499': 'Food & Beverage',
  '5511': 'Cars & Trucks',
  '5521': 'Used Cars',
  '5531': 'Auto Parts',
  '5532': 'Tire Shops',
  '5533': 'Automotive',
  '5541': 'Gas Stations',
  '5542': 'Automated Fuel',
  '5551': 'Boat Dealers',
  '5561': 'Motorcycle Dealers',
  '5571': 'Motorcycle Shops',
  '5592': 'Motor Homes',
  '5598': 'Snowmobile Dealers',
  '5599': 'Auto Dealers',
  '5611': 'Mens Clothing',
  '5621': 'Womens Clothing',
  '5631': 'Womens Accessories',
  '5641': 'Childrens Clothing',
  '5651': 'Family Clothing',
  '5655': 'Sports Apparel',
  '5661': 'Shoe Stores',
  '5681': 'Fur & Leather',
  '5691': 'Clothing Accessories',
  '5697': 'Tailors & Seamstresses',
  '5698': 'Wig Shops',
  '5699': 'Misc Clothing',
  '5712': 'Furniture Stores',
  '5713': 'Floor Covering',
  '5714': 'Drapery & Linens',
  '5718': 'Fireplace Stores',
  '5719': 'Misc Home Furnishing',
  '5722': 'Household Appliances',
  '5732': 'Electronics Stores',
  '5733': 'Music & Video',
  '5734': 'Computer Stores',
  '5735': 'Audio Books',
  '5772': 'Glass & Crystal',
  '5812': 'Restaurants',
  '5813': 'Bars & Clubs',
  '5814': 'Fast Food',
  '5815': 'Digital Goods',
  '5816': 'Digital Gaming',
  '5817': 'Software',
  '5818': 'Streaming Services',
  '5912': 'Drug Stores',
  '5921': 'Liquor Stores',
  '5931': 'Second Hand Stores',
  '5932': 'Antique Shops',
  '5933': 'Pawn Shops',
  '5935': 'Salvage Yards',
  '5937': 'Coin Dealers',
  '5940': 'Bicycle Shops',
  '5941': 'Sporting Goods',
  '5942': 'Book Stores',
  '5943': 'Paper & Stationery',
  '5944': 'Jewelry Stores',
  '5945': 'Hobby Shops',
  '5946': 'Camera Shops',
  '5947': 'Gift Shops',
  '5948': 'Luggage & Leather',
  '5949': 'Sewing & Fabric',
  '5950': 'China & Glass',
  '5960': 'Telemarketing',
  '5961': 'Mail Order',
  '5962': 'Self-Service Phone',
  '5963': 'Door-to-Door',
  '5964': 'Catalog Orders',
  '5965': 'Subscription Services',
  '5966': 'Lottery Tickets',
  '5967': 'Direct Marketing',
  '5968': 'Clothing Catalogs',
  '5969': 'Other Direct Marketing',
  '5970': 'Art Dealers',
  '5971': 'Art Galleries',
  '5972': 'Stamps & Coins',
  '5973': 'Religious Goods',
  '5975': 'Hearing Aids',
  '5976': 'Orthotics',
  '5977': 'Cosmetics',
  '5978': 'Typewriters',
  '5983': 'Fuel Oil',
  '5992': 'Florists',
  '5993': 'Tobacco Shops',
  '5994': 'Newsstands',
  '5995': 'Pet Shops',
  '5996': 'Swimming Pools',
  '5997': 'Electric Razor',
  '5998': 'Tent & Awning',
  '5999': 'Misc Specialty Retail',
  '6010': 'Banks',
  '6011': 'ATMs',
  '6012': 'Financial Institutions',
  '6050': 'Payment Service',
  '6051': 'Non-Financial Institutions',
  '6211': 'Security Brokers',
  '6381': 'Insurance',
  '6399': 'Other Insurance',
  '6513': 'Real Estate Agents',
  '7011': 'Lodging & Hotels',
  '7012': 'Timeshares',
  '7021': 'Room Rentals',
  '7032': 'Camps & Parks',
  '7033': 'Trailer Parks',
  '7210': 'Laundry Services',
  '7211': 'Laundry & Dry Cleaning',
  '7216': 'Dry Cleaning',
  '7217': 'Carpet Cleaning',
  '7221': 'Photo Studios',
  '7230': 'Barber Shops',
  '7251': 'Shoe Repair',
  '7261': 'Funeral Services',
  '7273': 'Dating Services',
  '7276': 'Tax Preparation',
  '7277': 'Counseling Services',
  '7278': 'Employment Agencies',
  '7296': 'Clothing Rental',
  '7297': 'Massage Parlors',
  '7298': 'Health Studios',
  '7299': 'Misc Personal Services',
  '7311': 'Advertising',
  '7321': 'Credit Reporting',
  '7332': 'Blueprint Services',
  '7333': 'Commercial Photography',
  '7338': 'Quick Copy & Printing',
  '7339': 'Stenography',
  '7342': 'Exterminator',
  '7349': 'Cleaning Services',
  '7361': 'Employment Agencies',
  '7372': 'Software Development',
  '7375': 'Data Processing',
  '7379': 'Computer Maintenance',
  '7392': 'Management Consulting',
  '7393': 'Detective Agencies',
  '7394': 'Equipment Rental',
  '7395': 'Photo Developing',
  '7399': 'Business Services',
  '7511': 'Truck Stops',
  '7512': 'Car Rental',
  '7513': 'Truck Rental',
  '7519': 'Motor Home Rental',
  '7523': 'Parking Lots',
  '7531': 'Auto Body Shops',
  '7534': 'Tire Retreading',
  '7535': 'Auto Paint Shops',
  '7538': 'Auto Service',
  '7542': 'Car Washes',
  '7549': 'Towing Services',
  '7622': 'Electronics Repair',
  '7623': 'AC Repair',
  '7629': 'Appliance Repair',
  '7631': 'Watch Repair',
  '7641': 'Furniture Repair',
  '7692': 'Welding Repair',
  '7699': 'Repair Shops',
  '7801': 'Lottery',
  '7802': 'Government Lottery',
  '7829': 'Movies & Streaming',
  '7832': 'Theaters',
  '7841': 'Video Rentals',
  '7911': 'Dance Halls',
  '7922': 'Theaters',
  '7929': 'Bands & Orchestras',
  '7932': 'Billiard Pools',
  '7933': 'Bowling Alleys',
  '7941': 'Sports Clubs',
  '7991': 'Tourist Attractions',
  '7992': 'Golf Courses',
  '7993': 'Video Gaming',
  '7994': 'Arcades',
  '7995': 'Betting',
  '7996': 'Amusement Parks',
  '7997': 'Memberships',
  '7998': 'Aquariums',
  '7999': 'Recreation Services',
  '8011': 'Doctors',
  '8021': 'Dentists',
  '8031': 'Osteopaths',
  '8041': 'Chiropractors',
  '8042': 'Optometrists',
  '8043': 'Opticians',
  '8044': 'Podiatrists',
  '8049': 'Health Practitioners',
  '8050': 'Nursing Facilities',
  '8062': 'Hospitals',
  '8071': 'Dental Labs',
  '8099': 'Medical Services',
  '8111': 'Legal Services',
  '8211': 'Elementary Schools',
  '8220': 'Colleges & Universities',
  '8234': 'Trade Schools',
  '8241': 'Correspondence Schools',
  '8244': 'Business Schools',
  '8249': 'Vocational Schools',
  '8299': 'Educational Services',
  '8351': 'Child Care',
  '8398': 'Charitable Organizations',
  '8400': 'Forestry & Logging',
  '8641': 'Civic Organizations',
  '8651': 'Political Organizations',
  '8661': 'Religious Organizations',
  '8675': 'Automobile Clubs',
  '8699': 'Membership Organizations',
  '8734': 'Testing Labs',
  '8911': 'Architectural Services',
  '8931': 'Accountants',
  '8991': 'Landscaping',
  '8992': 'Gardening',
  '8999': 'Professional Services',
  '9211': 'Court Costs',
  '9222': 'Fines',
  '9223': 'Bail & Bond',
  '9311': 'Tax Payments',
  '9399': 'Government Services',
  '9402': 'Postal Services',
  '9405': 'Government Insurance',
  '9700': 'Auto Authentication',
  '9701': 'Art Authentication',
  '9702': 'Jewelry Authentication',
};

const CURRENCY_NAMES: Record<string, string> = {
  '360': 'Indonesian Rupiah (IDR)',
  '840': 'US Dollar (USD)',
  '978': 'Euro (EUR)',
  '826': 'British Pound (GBP)',
  '392': 'Japanese Yen (JPY)',
  '36': 'Australian Dollar (AUD)',
  '156': 'Chinese Yuan (CNY)',
  '702': 'Singapore Dollar (SGD)',
};

function getMCCCategory(mcc: string): string {
  const code = mcc.padStart(4, '0');

  for (const [range, name] of Object.entries(MCC_CATEGORIES)) {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      const mccNum = Number(code);
      if (!isNaN(start) && !isNaN(end) && mccNum >= start && mccNum <= end) {
        return name;
      }
    } else if (code === range.padStart(4, '0')) {
      return name;
    }
  }

  return 'General Merchandise';
}

function getCurrencyName(code: string): string {
  return CURRENCY_NAMES[code] || `Currency (${code})`;
}

export function MerchantInfo({ data, showAmount = true }: MerchantInfoProps) {
  return (
    <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="bg-kasirpintar-teal-100 flex h-8 w-8 items-center justify-center rounded-lg">
          <IconBuildingStore className="text-kasirpintar-teal-600 h-4 w-4" />
        </div>
        <h3 className="font-bold text-gray-900">Merchant Information</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Merchant Name</span>
          <span className="font-semibold text-gray-900">
            {data.merchantName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">City</span>
          <span className="font-semibold text-gray-900">
            {data.merchantCity}
          </span>
        </div>
        {data.postalCode && (
          <div className="flex justify-between">
            <span className="text-gray-500">Postal Code</span>
            <span className="font-semibold text-gray-900">
              {data.postalCode}
            </span>
          </div>
        )}
        {data.merchantAccountInfo.length > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Issuer</span>
            <span className="font-semibold text-gray-900">
              {data.merchantAccountInfo[0]?.globallyUniqueId ||
                data.merchantAccountInfo[0]?.merchantId}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Method</span>
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
              data.method === 'static'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {data.method === 'static' ? 'Static' : 'Dynamic'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Category</span>
          <span className="font-semibold text-gray-900">
            {getMCCCategory(data.merchantCategoryCode)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Currency</span>
          <span className="font-semibold text-gray-900">
            {getCurrencyName(data.currency)}
          </span>
        </div>
        {showAmount && data.amount && (
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-gray-500">Amount</span>
            <span className="text-kasirpintar-teal-600 font-bold">
              {data.currency === '360'
                ? `Rp ${Number(data.amount).toLocaleString('id-ID')}`
                : data.amount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
