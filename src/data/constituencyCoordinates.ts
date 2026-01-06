// Approximate coordinates for AP Assembly Constituencies
// These are representative locations within each constituency area
export const constituencyCoordinates: Record<number, [number, number]> = {
  1: [84.2996, 18.8901], // Ichchapuram
  2: [84.0574, 18.6802], // Palasa
  3: [83.8931, 18.5385], // Tekkali
  4: [83.7263, 18.3553], // Pathapatnam
  5: [83.6078, 18.7103], // Srikakulam
  6: [83.5414, 18.4516], // Amadalavalasa
  7: [83.4167, 18.4667], // Etcherla
  8: [83.3011, 18.5533], // Narasannapeta
  9: [83.6744, 19.0969], // Rajam
  10: [83.1667, 18.3333], // Palakonda
  11: [83.4189, 18.1131], // Kurupam
  12: [83.2667, 18.5500], // Parvathipuram
  13: [83.1500, 18.7833], // Salur
  14: [82.9667, 18.5500], // Bobbili
  15: [83.3956, 17.9917], // Cheepurupalli
  16: [83.4056, 18.2667], // Gajapathinagaram
  17: [83.5167, 17.9167], // Nellimarla
  18: [83.3956, 17.6811], // Vizianagaram
  19: [83.2833, 17.7833], // Srungavarapukota
  20: [83.2189, 17.9667], // Bhimili
  21: [83.2950, 17.6868], // Visakhapatnam East
  22: [83.2833, 17.6833], // Visakhapatnam South
  23: [83.2333, 17.7167], // Visakhapatnam North
  24: [83.1500, 17.7333], // Visakhapatnam West
  25: [83.1833, 17.6333], // Gajuwaka
  26: [83.0333, 17.6167], // Chodavaram
  27: [82.9833, 17.7000], // Madugula
  28: [82.8833, 17.5167], // Araku Valley
  29: [82.6333, 17.4833], // Paderu
  30: [82.4667, 17.2333], // Anakapalle
  31: [82.3000, 17.3500], // Pendurthi
  32: [82.4667, 17.2000], // Yelamanchili
  33: [82.2333, 17.0833], // Payakaraopet
  34: [82.2333, 16.9167], // Narsipatnam
  35: [82.0500, 17.0500], // Tuni
  36: [82.1333, 17.2500], // Prathipadu
  37: [82.0167, 17.0167], // Pithapuram
  38: [81.8833, 16.9667], // Kakinada Rural
  39: [82.2167, 16.9500], // Peddapuram
  40: [81.8667, 17.0000], // Kakinada City
  41: [82.0167, 16.7500], // Jaggampeta
  42: [81.7833, 16.9167], // Ramachandrapuram
  43: [81.9000, 16.7333], // Mummidivaram
  44: [81.7500, 16.8000], // Amalapuram
  45: [81.6167, 16.7333], // Razole
  46: [81.5333, 16.5833], // Gannavaram
  47: [81.5000, 16.5500], // Kothapeta
  48: [81.6333, 16.5500], // Mandapeta
  49: [81.3667, 16.5667], // Rajanagaram
  50: [81.1000, 17.0000], // Rajahmundry City
  51: [81.7833, 17.0000], // Rajahmundry Rural
  52: [81.4833, 17.0500], // Kovvur
  53: [81.4667, 17.1000], // Nidadavole
  54: [81.6333, 17.1167], // Achanta
  55: [81.5667, 17.2833], // Palakollu
  56: [81.5000, 17.1000], // Narasapuram
  57: [81.4500, 17.0167], // Bhimavaram
  58: [81.3500, 17.2000], // Undi
  59: [81.2333, 17.0167], // Tanuku
  60: [81.1500, 16.9333], // Tadepalligudem
  61: [81.1833, 16.8667], // Unguturu
  62: [81.0500, 16.8667], // Denduluru
  63: [80.9667, 16.7333], // Eluru
  64: [81.0833, 16.6333], // Gopalapuram
  65: [80.9667, 16.5500], // Polavaram
  66: [80.8333, 16.7833], // Chintalapudi
  67: [80.6500, 16.6667], // Nuzvid
  68: [80.4333, 16.5333], // Gannavaram
  69: [80.6333, 16.5000], // Vijayawada West
  70: [80.6500, 16.5167], // Vijayawada Central
  71: [80.6667, 16.5333], // Vijayawada East
  72: [80.5333, 16.4667], // Mylavaram
  73: [80.4167, 16.3833], // Nandigama
  74: [80.1500, 16.2333], // Jaggayyapeta
  75: [80.3000, 16.0833], // Tiruvuru
  76: [80.5333, 16.0667], // Agiripalli (Nuzvid area)
  77: [80.5167, 16.2500], // Machilipatnam
  78: [80.6500, 16.1833], // Pedana
  79: [80.7167, 16.0500], // Gudivada
  80: [80.6167, 15.9833], // Kaikalur
  81: [80.5000, 15.9333], // Bantumilli
  82: [80.4333, 15.9000], // Avanigadda
  83: [80.5167, 15.8500], // Pamarru
  84: [80.4833, 15.7833], // Penamaluru
  85: [80.4000, 15.7000], // Repalle
  86: [80.4333, 15.5000], // Tenali
  87: [80.3833, 15.4333], // Bapatla
  88: [80.2833, 15.4333], // Parchur
  89: [80.2833, 15.5000], // Addanki
  90: [80.1667, 15.5500], // Chirala
  91: [80.1500, 15.7833], // Santhanuthalapadu
  92: [79.9833, 15.6333], // Ongole
  93: [79.8500, 15.5500], // Kandukur
  94: [79.8167, 15.4167], // Kondapi
  95: [79.6833, 15.4500], // Markapuram
  96: [79.6167, 15.5333], // Giddalur
  97: [79.4500, 15.6000], // Kanigiri
  98: [79.3333, 15.4167], // Darsi
  99: [79.4167, 15.2833], // Podili
  100: [78.9833, 15.0833], // Kavali
  101: [79.0000, 14.9000], // Atmakur
  102: [79.2000, 14.7500], // Kovur
  103: [79.4667, 14.4333], // Nellore City
  104: [79.5000, 14.4833], // Nellore Rural
  105: [79.7333, 14.4500], // Sarvepalli
  106: [79.9000, 14.2833], // Gudur
  107: [79.8500, 14.2333], // Sullurpeta
  108: [79.6167, 14.0000], // Venkatagiri
  109: [79.4167, 13.8000], // Udayagiri
  110: [79.5500, 13.6333], // Badvel
  111: [79.3333, 13.6000], // Rajampet
  112: [79.0500, 13.6333], // Kadapa
  113: [78.8167, 14.0167], // Koduru
  114: [78.6500, 14.2667], // Rayachoti
  115: [78.5333, 14.1500], // Pulivendla
  116: [78.0667, 14.4167], // Kamalapuram
  117: [78.2167, 14.5000], // Jammalamadugu
  118: [78.0500, 14.6833], // Proddatur
  119: [77.8667, 14.4667], // Mydukur
  120: [78.4833, 15.0667], // Nandikotkur
  121: [78.4333, 14.9333], // Panyam
  122: [78.2667, 15.1667], // Banaganapalle
  123: [78.0333, 15.2833], // Dhone
  124: [78.1667, 15.4000], // Pattikonda
  125: [77.7500, 15.3500], // Kurnool
  126: [77.9333, 15.4833], // Yemmiganur
  127: [77.5833, 15.5833], // Mantralayam
  128: [77.4500, 15.7000], // Adoni
  129: [77.3333, 15.6333], // Alur
  130: [77.0833, 15.9167], // Rayadurg
  131: [77.2333, 15.4333], // Kodumur
  132: [77.5833, 15.9167], // Uravakonda
  133: [77.3833, 15.3833], // Guntakal
  134: [77.3500, 15.0833], // Tadipatri
  135: [77.5500, 14.7667], // Singanamala
  136: [77.4333, 14.8833], // Anantapur Urban
  137: [77.4667, 14.6000], // Anantapur Rural
  138: [77.6167, 14.6833], // Kalyandurg
  139: [77.7000, 14.5667], // Raptadu
  140: [77.7667, 14.5167], // Kadiri
  141: [77.8667, 14.3667], // Thamballapalle
  142: [78.0333, 14.2333], // Pileru
  143: [78.2167, 14.0000], // Madanapalle
  144: [78.3333, 13.9000], // Punganur
  145: [78.5000, 13.9333], // Chandragiri
  146: [79.4167, 13.6333], // Tirupati
  147: [79.0833, 13.4333], // Srikalahasti
  148: [80.0333, 13.6167], // Satyavedu
  149: [78.2833, 13.6333], // Nagari
  150: [78.3333, 13.5167], // Gangadhara Nellore
  151: [78.4667, 13.3000], // Chittoor
  152: [78.7333, 13.1667], // Puthalapattu
  153: [78.3000, 13.3833], // Palamaner
  154: [77.7500, 13.7833], // Kuppam
  155: [77.5500, 14.0000], // Piler (Pileru)
  156: [77.0000, 14.3500], // Penukonda
  157: [77.2333, 14.4167], // Dharmavaram
  158: [77.4000, 14.3167], // Hindupur
  159: [77.6667, 14.1333], // Gorantla (Lepakshi area)
  160: [77.8000, 13.9500], // Madakasira
  161: [78.5333, 16.5667], // Puttaparthi
  162: [78.5667, 16.8167], // Amarapuram (Dhone area)
  163: [79.0333, 16.6500], // Nandikotkur
  164: [80.3000, 15.6333], // Guntur West
  165: [80.4333, 16.3000], // Guntur East
  166: [80.2500, 16.2000], // Tadikonda
  167: [80.2000, 16.1167], // Mangalagiri
  168: [80.1500, 16.0833], // Ponnur
  169: [80.1000, 15.9500], // Vemuru
  170: [80.0500, 15.8667], // Prathipadu
  171: [79.9833, 15.7833], // Narasaraopet
  172: [79.9000, 15.6833], // Sattenapalle
  173: [79.7833, 15.6000], // Chilakaluripet
  174: [79.7000, 15.5167], // Gurazala
  175: [79.5500, 15.4333], // Macherla
};
