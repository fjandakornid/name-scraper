import bent from 'bent'
import cheerio from 'cheerio'

const urlGirls = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Stulkur=on&Samthykkt=yes'
const urlBoys = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Drengir=on&Samthykkt=yes'

interface nameItem {
  name: string,
  gender: number,
  approved: string
}

async function main() {
  let [boys, girls] = await Promise.all([
    getNames(urlBoys, 0),
    getNames(urlGirls, 1)
  ])
  const names = [...boys, ...girls]
  console.log(names)
}

async function getNames(url: string, gender: number): Promise<nameItem[]> {
  console.log('begin ' + gender)
  const request = bent('string')
  const content = await request(url)
  const $ = cheerio.load(content)
  
  return $('.nametype > ul > li').toArray().map((li) => {
    const line = $(li).text().trim()
    const items = line.split(' ')
    const name = items[0]
    const approved = items.length > 1 ? items[items.length - 1] : null
    return { name, gender, approved } as nameItem
  })
}

main()
