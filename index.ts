import bent from 'bent'
import cheerio from 'cheerio'

const urlGirls = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Stulkur=on&Samthykkt=yes'
const urlBoys = 'https://vefur.island.is/mannanofn/leit-ad-nafni/?Stafrof=&Nafn=&Drengir=on&Samthykkt=yes'

interface NameItem {
  name: string,
  gender: number,
  approvalDate: string
}

async function main() {
  const [boys, girls] = await Promise.all([
    getNames(urlBoys, 0),
    getNames(urlGirls, 1)
  ])
  const names = [...boys, ...girls]
  console.log(names)
}

async function getNames(url: string, gender: number): Promise<NameItem[]> {
  const request = bent('string')
  const content = await request(url)
  const $ = cheerio.load(content)

  return $('.nametype > ul > li').toArray().map(li => {
    const line = $(li).text().trim()
    const items = line.split(' ')
    const name = items[0]
    const approvalDate = items.length > 1 ? items[items.length - 1] : null
    return { name, gender, approvalDate } as NameItem
  })
}

main()
