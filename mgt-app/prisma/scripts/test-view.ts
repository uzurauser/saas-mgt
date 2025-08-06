import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.v_summary_vendor_service.findMany({
    take: 5, // 例: 5件だけ取得
  })
  console.log(result)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
