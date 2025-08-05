import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Client
  const clientNames = [
    "事務システム部",
    "業務推進部",
    "人事総務部",
    "財務経理部",
    "営業企画部",
  ]

  // upsertで作成 or 更新
  const clientsArray = await Promise.all(
    clientNames.map((name) =>
      prisma.client.upsert({
        where: { name },
        update: {}, // 何も更新しない場合は空オブジェクトでOK
        create: { name },
      })
    )
  )

  const clients: Record<string, (typeof clientsArray)[0]> = {}
  clientNames.forEach((name, i) => {
    clients[name] = clientsArray[i]
  })

  console.log("最初のクライアント")
  console.log(clients["事務システム部"])

  // Vendor
  const vendorNames = [
    "ホームズ",
    "Zoom Communications, Inc.",
    "日本電気",
    "サイボウズ",
    "Box Japan",
    "トヨクモ",
    "シヤチハタ",
    "コラボスタイル",
    "Amazon Web Services, Inc.",
    "neoAI",
    "三井住友カード",
    "トランス・コスモス",
    "ベネフィット・ワン",
    "綜合警備保障",
    "Cornerstone OnDemand, Inc.",
    "ウェルリンク",
    "SBIビジネス・ソリューションズ",
    "ソフトブレーン",
    "リクルートマネジメントソリューションズ",
  ]

  const vendorsArray = await Promise.all(
    vendorNames.map((name) =>
      prisma.vendor.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )

  const vendors: Record<string, (typeof vendorsArray)[0]> = {}
  vendorNames.forEach((name, i) => {
    vendors[name] = vendorsArray[i]
  })

  console.log("最初のベンダー")
  console.log(vendors["ホームズ"])

  // Csp
  const cspNames = [
    "TOKAIコミュニケーションズ",
    "アマゾンウエブサービスジャパン",
    "IDCフロンティア",
    "オービック",
    "ソフトバンク",
  ]

  const cspArray = await Promise.all(
    cspNames.map((name) =>
      prisma.csp.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )

  const csps: Record<string, (typeof cspArray)[0]> = {}
  cspNames.forEach((name, i) => {
    csps[name] = cspArray[i]
  })

  console.log("最初のCSP")
  console.log(csps["TOKAIコミュニケーションズ"])

  // OutsourcingPartner
  const outsourcingPartnerNames = ["TIS", "エイチアールワン"]

  const outsourcingPartnerArray = await Promise.all(
    outsourcingPartnerNames.map((name) =>
      prisma.outsourcingPartner.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )

  const outsourcingPartners: Record<
    string,
    (typeof outsourcingPartnerArray)[0]
  > = {}
  outsourcingPartnerNames.forEach((name, i) => {
    outsourcingPartners[name] = outsourcingPartnerArray[i]
  })

  console.log("最初のアウトソーシングパートナー")
  console.log(outsourcingPartners["TIS"])

  // VendorService
  const vendorServiceToVendorMap: Record<string, string> = {
    オンライン登記情報システム: "ホームズ",
    Zoom: "Zoom Communications, Inc.",
    "UNIVERGE どこでもアクセスDirectサービス": "日本電気",
    Kintone: "サイボウズ",
    Box: "Box Japan",
    フォームブリッジ: "トヨクモ",
    "K Viewer": "トヨクモ",
    "Shachihata Cloud": "シヤチハタ",
    コラボフロー: "コラボスタイル",
    AWS: "Amazon Web Services, Inc.",
    "neoAI Chat": "neoAI",
    "Web Bridge": "三井住友カード",
    "ClickM@iler": "トランス・コスモス",
    ベネワンプラットフォーム: "ベネフィット・ワン",
    安否確認サービス: "綜合警備保障",
    "Cornerstone （University＋）": "Cornerstone OnDemand, Inc.",
    "こころ元気生活、こころリンク": "ウェルリンク",
    経費BANK: "SBIビジネス・ソリューションズ",
    eセールスマネージャー: "ソフトブレーン",
    "SPI3 for Employees": "リクルートマネジメントソリューションズ",
  }

  const vendorServiceArray = await Promise.all(
    Object.entries(vendorServiceToVendorMap).map(([name, vendorName]) =>
      prisma.vendorService.upsert({
        where: { name },
        update: {},
        create: {
          name,
          vendor: {
            connect: { name: vendorName },
          },
        },
      })
    )
  )

  const vendorServices: Record<string, (typeof vendorServiceArray)[0]> = {}
  Object.keys(vendorServiceToVendorMap).forEach((name, i) => {
    vendorServices[name] = vendorServiceArray[i]
  })

  console.log("最初のベンダーサービス")
  console.log(vendorServices["オンライン登記情報システム"])

  const cspServiceToCspMap: Record<string, string> = {
    TOKAIクラウド: "TOKAIコミュニケーションズ",
    AWS: "アマゾンウェブサービスジャパン",
    IDCフロンティアクラウド: "IDCフロンティア",
    オービッククラウド: "オービック",
    ソフトバンククラウド: "ソフトバンク",
  }

  const cspServiceArray = await Promise.all(
    Object.entries(cspServiceToCspMap).map(([serviceName, cspName]) =>
      prisma.cspService.upsert({
        where: { name: serviceName },
        update: {},
        create: {
          name: serviceName,
          csp: {
            connect: { name: cspName },
          },
        },
      })
    )
  )

  const cspServices: Record<string, (typeof cspServiceArray)[0]> = {}
  Object.keys(cspServiceToCspMap).forEach((serviceName, i) => {
    cspServices[serviceName] = cspServiceArray[i]
  })

  console.log("最初のCSPサービス")
  console.log(cspServices["TOKAIクラウド"])

  // OutsourcingService
  const outsourcingServiceToOutsourcingPartnerMap: Record<string, string> = {
    開発の委託: "TIS",
    人事業務の委託: "エイチアールワン",
  }

  const outsourcingServiceArray = await Promise.all(
    Object.entries(outsourcingServiceToOutsourcingPartnerMap).map(
      ([serviceName, outsourcingPartnerName]) =>
        prisma.outsourcingService.upsert({
          where: { name: serviceName },
          update: {},
          create: {
            name: serviceName,
            outsourcingPartner: {
              connect: { name: outsourcingPartnerName },
            },
          },
        })
    )
  )

  const outsourcingServices: Record<
    string,
    (typeof outsourcingServiceArray)[0]
  > = {}
  Object.keys(outsourcingServiceToOutsourcingPartnerMap).forEach(
    (serviceName, i) => {
      outsourcingServices[serviceName] = outsourcingServiceArray[i]
    }
  )

  console.log("最初のアウトソーシングサービス")
  console.log(outsourcingServices["開発の委託"])

  // Cycle
  const cycleName = [
    {
      name: "2025年 上期",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-09-30"),
      isActive: true,
    },
  ]

  const cycleArray = await Promise.all(
    cycleName.map((cycle) =>
      prisma.cycle.upsert({
        where: { name: cycle.name },
        update: {},
        create: cycle,
      })
    )
  )

  console.log("最初のサイクル")
  console.log(cycleArray[0])

  // SummaryVendorService
  type ClientVendorVendorService = {
    client: string
    vendor: string
    vendorService: string
  }

  const clientVendorVendorServicePairs: ClientVendorVendorService[] = [
    {
      client: "事務システム部",
      vendor: "Zoom Communications, Inc.",
      vendorService: "Zoom",
    },
    {
      client: "事務システム部",
      vendor: "日本電気",
      vendorService: "UNIVERGE どこでもアクセスDirectサービス",
    },
    {
      client: "事務システム部",
      vendor: "サイボウズ",
      vendorService: "Kintone",
    },
    { client: "事務システム部", vendor: "Box Japan", vendorService: "Box" },
    {
      client: "事務システム部",
      vendor: "トヨクモ",
      vendorService: "フォームブリッジ",
    },
    { client: "事務システム部", vendor: "トヨクモ", vendorService: "K Viewer" },
    {
      client: "事務システム部",
      vendor: "シヤチハタ",
      vendorService: "Shachihata Cloud",
    },
    {
      client: "事務システム部",
      vendor: "コラボスタイル",
      vendorService: "コラボフロー",
    },
    {
      client: "事務システム部",
      vendor: "Amazon Web Services, Inc.",
      vendorService: "AWS",
    },
    { client: "事務システム部", vendor: "neoAI", vendorService: "neoAI Chat" },
    {
      client: "事務システム部",
      vendor: "三井住友カード",
      vendorService: "Web Bridge",
    },
    {
      client: "人事総務部",
      vendor: "綜合警備保障",
      vendorService: "安否確認サービス",
    },
    {
      client: "人事総務部",
      vendor: "リクルートマネジメントソリューションズ",
      vendorService: "SPI3 for Employees",
    },
  ]

  const summaryVendorServiceArray = await Promise.all(
    clientVendorVendorServicePairs.map(({ client, vendor, vendorService }) => {
      console.log(
        clients[client].name,
        vendors[vendor].name,
        vendorServices[vendorService].name
      )
      return prisma.summaryVendorService.upsert({
        where: {
          clientId_vendorServiceId: {
            clientId: clients[client].id,
            vendorServiceId: vendorServices[vendorService].id,
          },
        },
        update: {},
        create: {
          cycleId: cycleArray[0].id,
          clientId: clients[client].id,
          vendorId: vendors[vendor].id,
          vendorServiceId: vendorServices[vendorService].id,
        },
      })
    })
  )

  console.log("最初のSummaryVendorService")
  console.log(summaryVendorServiceArray[0])

  // SummaryVendorServiceCspService
  type VendorServiceCspServicePair = {
    client: string
    vendor: string
    vendorService: string
    csp: string
    cspService: string
  }

  const vendorServiceCspServicePairs: VendorServiceCspServicePair[] = [
    {
      client: "事務システム部",
      vendor: "ホームズ",
      vendorService: "オンライン登記情報システム",
      csp: "TOKAIコミュニケーションズ",
      cspService: "TOKAIクラウド",
    },
    {
      client: "人事総務部",
      vendor: "Cornerstone OnDemand, Inc.",
      vendorService: "Cornerstone （University＋）",
      csp: "アマゾンウエブサービスジャパン",
      cspService: "AWS",
    },
    {
      client: "人事総務部",
      vendor: "ウェルリンク",
      vendorService: "こころ元気生活、こころリンク",
      csp: "アマゾンウエブサービスジャパン",
      cspService: "AWS",
    },
    {
      client: "人事総務部",
      vendor: "ベネフィット・ワン",
      vendorService: "ベネワンプラットフォーム",
      csp: "アマゾンウエブサービスジャパン",
      cspService: "AWS",
    },
    {
      client: "営業企画部",
      vendor: "ソフトブレーン",
      vendorService: "eセールスマネージャー",
      csp: "アマゾンウエブサービスジャパン",
      cspService: "AWS",
    },
    {
      client: "業務推進部",
      vendor: "トランス・コスモス",
      vendorService: "ClickM@iler",
      csp: "IDCフロンティア",
      cspService: "IDCフロンティアクラウド",
    },
    {
      client: "財務経理部",
      vendor: "SBIビジネス・ソリューションズ",
      vendorService: "経費BANK",
      csp: "アマゾンウエブサービスジャパン",
      cspService: "AWS",
    },
  ]

  const summaryVendorServiceCspServiceArray = await Promise.all(
    vendorServiceCspServicePairs.map(
      ({ client, vendor, vendorService, csp, cspService }) => {
        console.log(
          clients[client].name,
          vendors[vendor].name,
          vendorServices[vendorService].name,
          csps[csp].name,
          cspServices[cspService].name
        )
        return prisma.summaryVendorServiceCspService.upsert({
          where: {
            clientId_vendorServiceId_cspServiceId: {
              clientId: clients[client].id,
              vendorServiceId: vendorServices[vendorService].id,
              cspServiceId: cspServices[cspService].id,
            },
          },
          update: {},
          create: {
            cycleId: cycleArray[0].id,
            clientId: clients[client].id,
            vendorId: vendors[vendor].id,
            vendorServiceId: vendorServices[vendorService].id,
            cspId: csps[csp].id,
            cspServiceId: cspServices[cspService].id,
          },
        })
      }
    )
  )

  console.log("最初のSummaryVendorServiceCspService")
  console.log(summaryVendorServiceCspServiceArray[0])

  // SummaryOutsourcingServiceCspService
  type OutsourcingServiceCspServicePair = {
    client: string
    outsourcingPartner: string
    outsourcingService: string
    csp: string
    cspService: string
  }

  const outsourcingServiceCspServicePairs: OutsourcingServiceCspServicePair[] =
    [
      {
        client: "事務システム部",
        outsourcingPartner: "TIS",
        outsourcingService: "開発の委託",
        csp: "アマゾンウエブサービスジャパン",
        cspService: "AWS",
      },
      {
        client: "人事総務部",
        outsourcingPartner: "エイチアールワン",
        outsourcingService: "人事業務の委託",
        csp: "オービック",
        cspService: "オービッククラウド",
      },
      {
        client: "人事総務部",
        outsourcingPartner: "エイチアールワン",
        outsourcingService: "人事業務の委託",
        csp: "ソフトバンク",
        cspService: "ソフトバンククラウド",
      },
    ]

  const outsourcingServiceCspServiceArray = await Promise.all(
    outsourcingServiceCspServicePairs.map(
      ({ client, outsourcingPartner, outsourcingService, csp, cspService }) => {
        console.log(
          clients[client].name,
          outsourcingPartners[outsourcingPartner].name,
          outsourcingServices[outsourcingService].name,
          csps[csp].name,
          cspServices[cspService].name
        )
        return prisma.summaryOutsourcingServiceCspService.upsert({
          where: {
            clientId_outsourcingServiceId_cspServiceId: {
              clientId: clients[client].id,
              outsourcingServiceId: outsourcingServices[outsourcingService].id,
              cspServiceId: cspServices[cspService].id,
            },
          },
          update: {},
          create: {
            cycleId: cycleArray[0].id,
            clientId: clients[client].id,
            outsourcingPartnerId: outsourcingPartners[outsourcingPartner].id,
            outsourcingServiceId: outsourcingServices[outsourcingService].id,
            cspId: csps[csp].id,
            cspServiceId: cspServices[cspService].id,
          },
        })
      }
    )
  )

  console.log("最初のSummaryOutsourcingServiceCspService")
  console.log(outsourcingServiceCspServiceArray[0])

  // // VendorServiceCspAssignment
  // const vendorServiceCspServicePairs = [
  //   {
  //     client: "事務システム部",
  //     vendor: "ホームズ",
  //     vendorService: "オンライン登記情報システム",
  //     csp: "TOKAIコミュニケーションズ",
  //     cspService: "TOKAIクラウド",
  //   },
  //   {
  //     client: "人事総務部",
  //     vendor: "Cornerstone OnDemand, Inc.",
  //     vendorService: "Cornerstone （University＋）",
  //     csp: "アマゾンウエブサービスジャパン",
  //     cspService: "AWS",
  //   },
  //   {
  //     client: "人事総務部",
  //     vendor: "ウェルリンク",
  //     vendorService: "こころ元気生活、こころリンク",
  //     csp: "アマゾンウエブサービスジャパン",
  //     cspService: "AWS",
  //   },
  //   {
  //     client: "人事総務部",
  //     vendor: "ベネフィット・ワン",
  //     vendorService: "ベネワンプラットフォーム",
  //     csp: "アマゾンウエブサービスジャパン",
  //     cspService: "AWS",
  //   },
  //   {
  //     client: "営業企画部",
  //     vendor: "ソフトブレーン",
  //     vendorService: "eセールスマネージャー",
  //     csp: "アマゾンウエブサービスジャパン",
  //     cspService: "AWS",
  //   },
  //   {
  //     client: "業務推進部",
  //     vendor: "トランス・コスモス",
  //     vendorService: "ClickM@iler",
  //     csp: "IDCフロンティア",
  //     cspService: "IDCフロンティアクラウド",
  //   },
  //   {
  //     client: "財務経理部",
  //     vendor: "SBIビジネス・ソリューションズ",
  //     vendorService: "経費BANK",
  //     csp: "アマゾンウエブサービスジャパン",
  //     cspService: "AWS",
  //   },
  // ]

  // const vendorServiceCspAssignmentArray = await Promise.all(
  //   vendorServiceCspAssignmentPairs.map(
  //     ({ client, vendor, vendorService, csp, cspService }) =>
  //       prisma.vendorServiceCspAssignment.upsert({
  //         where: {
  //           clientId_vendorServiceId_cspId_cspServiceId: {
  //             clientId: clients[client].id,
  //             vendorServiceId: vendorServices[vendorService].id,
  //             cspId: csps[csp].id,
  //             cspServiceId: cspServices[cspService].id,
  //           },
  //         },
  //         update: {},
  //         create: {
  //           clientId: clients[client].id,
  //           vendorId: vendors[vendor].id,
  //           vendorServiceId: vendorServices[vendorService].id,
  //           cspId: csps[csp].id,
  //           cspServiceId: cspServices[cspService].id,
  //         },
  //       })
  //   )
  // )

  // console.log("最初のVendorServiceCspAssignment")
  // console.log(vendorServiceCspAssignmentArray[0])

  // // OutsourcingServiceCspAssignment
  // const outsourcingServiceCspAssignmentPairs = [
  //   {
  //     client: "事務システム部",
  //     outsourcingPartner: "TIS",
  //     outsourcingService: "開発の委託",
  //     csp: "アマゾンウエブサービスジャパン",
  //     cspService: "AWS",
  //   },
  //   {
  //     client: "人事総務部",
  //     outsourcingPartner: "エイチアールワン",
  //     outsourcingService: "人事業務の委託",
  //     csp: "オービック",
  //     cspService: "オービッククラウド",
  //   },
  //   {
  //     client: "人事総務部",
  //     outsourcingPartner: "エイチアールワン",
  //     outsourcingService: "人事業務の委託",
  //     csp: "ソフトバンク",
  //     cspService: "ソフトバンククラウド",
  //   },
  // ]

  // const outsourcingServiceCspAssignmentArray = await Promise.all(
  //   outsourcingServiceCspAssignmentPairs.map(
  //     ({ client, outsourcingPartner, outsourcingService, csp, cspService }) =>
  //       prisma.outsourcingServiceCspAssignment.upsert({
  //         where: {
  //           clientId_outsourcingServiceId_cspId_cspServiceId: {
  //             clientId: clients[client].id,
  //             outsourcingServiceId: outsourcingServices[outsourcingService].id,
  //             cspId: csps[csp].id,
  //             cspServiceId: cspServices[cspService].id,
  //           },
  //         },
  //         update: {},
  //         create: {
  //           clientId: clients[client].id,
  //           outsourcingServiceId: outsourcingServices[outsourcingService].id,
  //           outsourcingPartnerId: outsourcingPartners[outsourcingPartner].id,
  //           cspId: csps[csp].id,
  //           cspServiceId: cspServices[cspService].id,
  //         },
  //       })
  //   )
  // )

  // console.log("最初のOutsourcingServiceCspAssignment")
  // console.log(outsourcingServiceCspAssignmentArray[0])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
