import bent from 'bent'
import cheerio from 'cheerio'

const urlGirls = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Stulkur=on&Samthykkt=yes'
const urlBoys = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Drengir=on&Samthykkt=yes'
const urlMiddleNames = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Millinofn=on&Samthykkt=yes'

interface NameItem {
  name: string,
  gender: number | null,
  approvalDate: string,
  isMiddleName: boolean
}

async function main() {
  const [boys, girls, middle] = await Promise.all([
    getNames(urlBoys, 0, false),
    getNames(urlGirls, 1, false),
    getNames(urlMiddleNames, null, true)
  ])
  const names = [...boys, ...girls, ...middle]
  console.log(names)
}

async function getNames(url: string, gender: number | null, isMiddleName: boolean): Promise<NameItem[]> {
  const request = bent('string')
  const content = await request(url)
  const $ = cheerio.load(content)

  return $('.nametype > ul > li').toArray().map(li => {
    const line = $(li).text().trim()
    const items = line.split(' ')
    const name = items[0]
    const approvalDate = items.length > 1 ? items[items.length - 1] : null
    return { name, gender, approvalDate, isMiddleName } as NameItem
  })
}

main()
