// Run once to generate data/dishes.xlsx
// Usage: node scripts/generate-dishes.cjs
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')

const dishes = [
  { id: '1',  name: 'Spaghetti Carbonara',    imageUrl: 'https://picsum.photos/seed/carbonara/400/500',    category: 'Pasta',       area: 'Italian'       },
  { id: '2',  name: 'Chicken Tikka Masala',   imageUrl: 'https://picsum.photos/seed/tikka/400/500',        category: 'Curry',       area: 'Indian'        },
  { id: '3',  name: 'Beef Tacos',             imageUrl: 'https://picsum.photos/seed/tacos/400/500',        category: 'Street Food', area: 'Mexican'       },
  { id: '4',  name: 'Sushi Platter',          imageUrl: 'https://picsum.photos/seed/sushi/400/500',        category: 'Seafood',     area: 'Japanese'      },
  { id: '5',  name: 'Greek Salad',            imageUrl: 'https://picsum.photos/seed/greeksalad/400/500',   category: 'Salad',       area: 'Greek'         },
  { id: '6',  name: 'Pad Thai',               imageUrl: 'https://picsum.photos/seed/padthai/400/500',      category: 'Noodles',     area: 'Thai'          },
  { id: '7',  name: 'Fish and Chips',         imageUrl: 'https://picsum.photos/seed/fishchips/400/500',    category: 'Seafood',     area: 'British'       },
  { id: '8',  name: 'Beef Burger',            imageUrl: 'https://picsum.photos/seed/burger/400/500',       category: 'Fast Food',   area: 'American'      },
  { id: '9',  name: 'Croissant au Beurre',    imageUrl: 'https://picsum.photos/seed/croissant/400/500',    category: 'Pastry',      area: 'French'        },
  { id: '10', name: 'Peking Duck',            imageUrl: 'https://picsum.photos/seed/pekingduck/400/500',   category: 'Poultry',     area: 'Chinese'       },
  { id: '11', name: 'Falafel Wrap',           imageUrl: 'https://picsum.photos/seed/falafel/400/500',      category: 'Vegetarian',  area: 'Middle Eastern'},
  { id: '12', name: 'Paella Valenciana',      imageUrl: 'https://picsum.photos/seed/paella/400/500',       category: 'Seafood',     area: 'Spanish'       },
  { id: '13', name: 'Tom Yum Soup',           imageUrl: 'https://picsum.photos/seed/tomyum/400/500',       category: 'Soup',        area: 'Thai'          },
  { id: '14', name: 'Moussaka',               imageUrl: 'https://picsum.photos/seed/moussaka/400/500',     category: 'Lamb',        area: 'Greek'         },
  { id: '15', name: 'Tonkotsu Ramen',         imageUrl: 'https://picsum.photos/seed/ramen/400/500',        category: 'Noodles',     area: 'Japanese'      },
  { id: '16', name: 'BBQ Pork Ribs',          imageUrl: 'https://picsum.photos/seed/bbqribs/400/500',      category: 'Pork',        area: 'American'      },
  { id: '17', name: 'Vegetable Stir Fry',     imageUrl: 'https://picsum.photos/seed/stirfry/400/500',      category: 'Vegetarian',  area: 'Chinese'       },
  { id: '18', name: 'Margherita Pizza',       imageUrl: 'https://picsum.photos/seed/pizza/400/500',        category: 'Pizza',       area: 'Italian'       },
  { id: '19', name: 'Butter Chicken',         imageUrl: 'https://picsum.photos/seed/butterchicken/400/500',category: 'Curry',       area: 'Indian'        },
  { id: '20', name: 'Beef Stroganoff',        imageUrl: 'https://picsum.photos/seed/stroganoff/400/500',   category: 'Beef',        area: 'Russian'       },
  { id: '21', name: 'Shakshuka',              imageUrl: 'https://picsum.photos/seed/shakshuka/400/500',    category: 'Eggs',        area: 'Middle Eastern'},
  { id: '22', name: 'Chow Mein',              imageUrl: 'https://picsum.photos/seed/chowmein/400/500',     category: 'Noodles',     area: 'Chinese'       },
  { id: '23', name: 'Jerk Chicken',           imageUrl: 'https://picsum.photos/seed/jerkchicken/400/500',  category: 'Poultry',     area: 'Jamaican'      },
  { id: '24', name: 'Lobster Bisque',         imageUrl: 'https://picsum.photos/seed/lobster/400/500',      category: 'Seafood',     area: 'French'        },
  { id: '25', name: 'Kimchi Fried Rice',      imageUrl: 'https://picsum.photos/seed/kimchirice/400/500',   category: 'Rice',        area: 'Korean'        },
]

const ws = XLSX.utils.json_to_sheet(dishes)

// Set column widths for readability
ws['!cols'] = [
  { wch: 4 },   // id
  { wch: 28 },  // name
  { wch: 55 },  // imageUrl
  { wch: 16 },  // category
  { wch: 16 },  // area
]

const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Dishes')

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

XLSX.writeFile(wb, path.join(dataDir, 'dishes.xlsx'))
console.log('Created data/dishes.xlsx with', dishes.length, 'dishes')
